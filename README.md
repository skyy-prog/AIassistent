# Aura Skincare Voice Agent

Aura Skincare - Talk to Aria is a browser-based customer support voice agent. Aria answers Aura Skincare policy questions, looks up mock orders, declines unrelated requests, and creates a structured summary after each call.

## Architecture

```text
Browser <-> WebSocket <-> Gemini Live API
Browser -> Express -> Gemini for session token and summary
Express -> mock orders
```

The React frontend uses Vite, the Google GenAI SDK, and browser Web Audio APIs. The Express server keeps `GEMINI_API_KEY` private, creates a short-lived Gemini Live token, serves the order tool, and requests the post-call summary.

## Setup

1. Install Node.js 20 or higher.
2. Create a free Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Copy `.env.example` to `.env`.
4. Set `GEMINI_API_KEY` in `.env`.
5. Install dependencies with `npm install`.

## Run locally

Run the Vite frontend and Express server together:

```text
npm run dev
```

Open `http://localhost:5173`, allow microphone access, and select Start Call.

Create a production build and serve it with Express:

```text
npm run build
npm start
```

## Deploy on Vercel

Import this repository into Vercel. The included `vercel.json` configures the Vite build and routes `/api/*` to the Express serverless function.

Add this environment variable in the Vercel project settings:

- `GEMINI_API_KEY`

Deploy with the Vercel dashboard or:

```text
npx vercel
```

The frontend is deployed as static assets and the Express API is exposed through `api/index.js`. `npm start` remains available for local production-style serving.

## Test scenarios

- Ask, “Where is my order ORD-101?”
- Ask, “Cancel ORD-103”
- Ask, “Can I return ORD-102?”
- Ask about returning an opened product after 20 days.
- Ask Aria to book a flight to Goa.
- Ask to track ORD-999.
- Deny microphone permission and confirm that a friendly error appears.
- End a call and confirm the transcript and summary JSON appear.

## How I Thought About It

### Why this architecture and stack

React and Vite keep the browser experience small and straightforward. Express keeps the Gemini API key private while issuing short-lived Live API tokens, and WebSockets provide low-latency bidirectional audio.

### The most difficult part and how I solved it

The difficult part was coordinating PCM microphone capture, streamed PCM playback, transcription events, and tool calls. The audio helpers keep those details separate while the voice hook manages the conversation state and latest transcript.

### What I would improve with one more week

I would add authentication, persistent call records, stronger automated tests, better interruption handling, and a real order service instead of the mock data.

### What would change at 1,000 conversations a day

I would add request authentication and rate limits, move summaries and analytics to a background queue, store transcripts in a managed database, and add monitoring for latency, failures, and Gemini usage.
