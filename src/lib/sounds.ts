const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

export function playDrop() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
}

export function playSimulate() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
  osc.start();
  osc.stop(audioContext.currentTime + 0.3);
}

export function playScore() {
  if (!audioContext) return;
  [523, 659, 784].forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0.06, audioContext.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + i * 0.1 + 0.2);
    osc.start(audioContext.currentTime + i * 0.1);
    osc.stop(audioContext.currentTime + i * 0.1 + 0.2);
  });
}
