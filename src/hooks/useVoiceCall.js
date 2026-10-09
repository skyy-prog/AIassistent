import { GoogleGenAI } from "@google/genai";
import { useRef, useState } from "react";
import { startMicrophone } from "../audio/microphone.js";
import { createAudioPlayer } from "../audio/player.js";

const initialSummary = null;

function bytesToBase64(bytes) {
  let binary = "";
  const values = new Uint8Array(bytes);
  for (let index = 0; index < values.length; index += 1) {
    binary += String.fromCharCode(values[index]);
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function getStartError(error) {
  const message = error instanceof Error ? error.message : "";
  if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate")) {
    return "The Gemini free tier limit has been reached. Please try again later.";
  }
  if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("microphone")) {
    return "Microphone access was denied. Please allow microphone access and try again.";
  }
  return message || "Could not start the Gemini voice session.";
}

export function useVoiceCall() {
  const [state, setState] = useState("Idle");
  const [transcript, setTranscript] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionRef = useRef(null);
  const microphoneRef = useRef(null);
  const playerRef = useRef(null);
  const transcriptRef = useRef([]);

  function addTranscriptMessage(role, text) {
    if (!text?.trim()) return;
    const nextText = text.trim();
    const previous = transcriptRef.current.at(-1);
    const nextTranscript = [...transcriptRef.current];

    // Live transcription arrives in small fragments. Keep contiguous fragments
    // in one bubble so the transcript reads like a real conversation.
    if (previous?.role === role) {
      const separator = /^[,.!?;:]/.test(nextText) || /[\s-]$/.test(previous.text) ? "" : " ";
      nextTranscript[nextTranscript.length - 1] = {
        ...previous,
        text: `${previous.text}${separator}${nextText}`
      };
    } else {
      nextTranscript.push({ role, text: nextText });
    }

    transcriptRef.current = nextTranscript;
    setTranscript(nextTranscript);
  }

  async function handleToolCall(toolCall) {
    const functionCall = toolCall.functionCalls?.[0];
    if (!functionCall || functionCall.name !== "get_order_details") return;
    setState("Thinking");
    const orderResponse = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(functionCall.args || {})
    });
    if (!orderResponse.ok) throw new Error("Could not look up that order.");
    const result = await orderResponse.json();
    sessionRef.current?.sendToolResponse({
      functionResponses: [{
        id: functionCall.id,
        name: functionCall.name,
        response: result
      }]
    });
  }

  function handleMessage(message) {
    if (message.serverContent?.interrupted) {
      playerRef.current?.clear();
      setState("Listening");
      return;
    }
    if (message.serverContent?.inputTranscription?.text) {
      addTranscriptMessage("Customer", message.serverContent.inputTranscription.text);
    }
    if (message.serverContent?.outputTranscription?.text) {
      addTranscriptMessage("Aria", message.serverContent.outputTranscription.text);
    }
    if (message.serverContent?.modelTurn?.parts) {
      setState("Speaking");
      message.serverContent.modelTurn.parts.forEach((part) => {
        if (part.inlineData?.data) {
          playerRef.current?.play(base64ToBytes(part.inlineData.data).buffer);
        }
      });
    }
    if (message.serverContent?.turnComplete) {
      setState("Listening");
    }
    if (message.toolCall) {
      handleToolCall(message.toolCall).catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Could not complete the order lookup.");
      });
    }
  }

  async function startCall() {
    setErrorMessage("");
    setSummary(null);
    setTranscript([]);
    transcriptRef.current = [];
    setState("Connecting");

    try {
      const sessionResponse = await fetch("/api/session", { method: "POST" });
      if (!sessionResponse.ok) {
        const body = await sessionResponse.json().catch(() => ({}));
        throw new Error(body.error || "Could not get a Gemini session token.");
      }
      const session = await sessionResponse.json();
      const ai = new GoogleGenAI({
        apiKey: session.token,
        httpOptions: { apiVersion: "v1alpha" }
      });
      const liveSession = await ai.live.connect({
        model: session.model,
        config: session.config,
        callbacks: {
          onmessage: handleMessage,
          onerror: () => setErrorMessage("The Gemini voice session encountered an error."),
          onclose: () => setState("Idle")
        }
      });
      sessionRef.current = liveSession;
      playerRef.current = createAudioPlayer();
      microphoneRef.current = await startMicrophone((pcm) => {
        liveSession.sendRealtimeInput({
          audio: { data: bytesToBase64(pcm.buffer), mimeType: "audio/pcm;rate=16000" }
        });
      });
      liveSession.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "Please greet the customer now." }] }],
        turnComplete: true
      });
      setState("Listening");
    } catch (error) {
      setState("Idle");
      setErrorMessage(getStartError(error));
      microphoneRef.current?.stop();
      await playerRef.current?.close();
      sessionRef.current?.close();
    }
  }

  async function endCall() {
    microphoneRef.current?.stop();
    await playerRef.current?.close();
    sessionRef.current?.close();
    microphoneRef.current = null;
    playerRef.current = null;
    sessionRef.current = null;
    setState("Idle");

    try {
      const summaryResponse = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptRef.current })
      });
      if (!summaryResponse.ok) throw new Error("Could not create the call summary.");
      setSummary(await summaryResponse.json());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create the call summary.");
    }
  }

  return { state, transcript, summary, startCall, endCall, errorMessage };
}
