export function createAudioPlayer() {
  const context = new AudioContext({ sampleRate: 24000 });
  let nextStartTime = 0;

  function play(buffer) {
    const samples = new Int16Array(buffer);
    const audioBuffer = context.createBuffer(1, samples.length, 24000);
    const channel = audioBuffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      channel[index] = samples[index] / 32768;
    }
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    nextStartTime = Math.max(nextStartTime, context.currentTime);
    source.start(nextStartTime);
    nextStartTime += audioBuffer.duration;
  }

  return {
    play,
    clear() {
      nextStartTime = context.currentTime;
    },
    async close() {
      await context.close();
    }
  };
}
