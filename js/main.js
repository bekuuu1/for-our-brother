'use strict';
// Personalize notes and music here; chapter and letter copy lives in index.html.
const film = {
  music: '', // Optional: assets/music/your-licensed-track.mp3. Empty uses an original ambient score.
  notes: ['A normal conversation somehow becomes a comedy show.', 'The perfect combination of intelligence and humor.', 'Computer science brought the knowledge. Brotherhood brought the fun.', 'Living together: unlimited entertainment included.', 'Somehow, even doing absolutely nothing becomes a good memory.', 'The best roommate package includes a brother for life.']
};
const $ = (selector) => document.querySelector(selector);
film.notes.forEach((text, i) => {
  const button = document.createElement('button'); button.className = 'note'; button.style.setProperty('--rotation', `${[-3,2,-2,3,-2,2][i]}deg`); button.setAttribute('aria-pressed', 'false');
  const quote = document.createElement('span'); quote.className = 'handwritten'; quote.textContent = `“${text}”`;
  const hint = document.createElement('small'); hint.textContent = 'A NOTE FROM YOUR BROTHERS';
  button.append(quote, hint); button.addEventListener('click', () => {const active = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(active)); hint.textContent = active ? 'ONE MORE REASON WE APPRECIATE YOU' : 'A NOTE FROM YOUR BROTHERS';}); $('#notes').append(button);
});
let audioContext, musicTimer, musicOn = false, track;
let soundEnabled = true;
function note(frequency, at, length = 2, volume = .035) {
  const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
  oscillator.type = 'sine'; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(volume, at + .03); gain.gain.exponentialRampToValueAtTime(.0001, at + length);
  oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(at); oscillator.stop(at + length + .05);
}
function ambient() {
  if (!musicOn || !audioContext) return;
  // Original sparse melody, not a recording or a quotation of a copyrighted composition.
  [261.63,329.63,392,293.66,349.23,440,392,329.63].forEach((f,i) => note(f, audioContext.currentTime + i * 1.2, 3));
}
async function setMusic(enabled) {
  try {
    if (enabled) {
      if (film.music) {track ||= new Audio(film.music); track.loop = true; track.volume = .3; await track.play();}
      else {audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); await audioContext.resume();}
      musicOn = true; if (!film.music && !musicTimer) {ambient(); musicTimer = setInterval(ambient, 9600);}
    } else {musicOn = false; clearInterval(musicTimer); musicTimer = null; if (track) track.pause(); if (audioContext) await audioContext.suspend();}
    renderSound();
  } catch {musicOn = false; soundEnabled = false; renderSound(); $('#sound').textContent = 'Retry sound';}
}
function renderSound() {
  $('#sound').innerHTML = `<span aria-hidden="true">♫</span> Sound ${soundEnabled ? 'on' : 'off'}`;
  $('#sound').setAttribute('aria-pressed', String(soundEnabled));
}
$('#sound').addEventListener('click', () => {soundEnabled = !soundEnabled; setMusic(soundEnabled); renderSound();});
function startDefaultSound(event) {
  if (event.target.closest('#sound') || !soundEnabled || musicOn) return;
  setMusic(true);
}
document.addEventListener('click', startDefaultSound);
document.addEventListener('keydown', event => {if (event.key === 'Enter' || event.key === ' ') startDefaultSound(event);});
document.addEventListener('visibilitychange', () => {setMusic(!document.hidden && soundEnabled && !!(audioContext || track));});
