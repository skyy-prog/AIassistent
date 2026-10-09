export async function startMicrophone(onChunk) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const context = new AudioContext({ sampleRate: 16000 });
  await context.audioWorklet.addModule("/pcm-processor.js");
  const source = context.createMediaStreamSource(stream);
  const processor = new AudioWorkletNode(context, "pcm-processor");
  processor.port.onmessage = ({ data }) => onChunk(new Int16Array(data));
  source.connect(processor);
  processor.connect(context.destination);
  return {
    stream,
    context,
    stop() {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}
