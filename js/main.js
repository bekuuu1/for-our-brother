'use strict';
// Personalize photo paths and captions here; all letter and chapter copy lives in index.html.
const film = {
  music: '', // Optional: assets/music/your-licensed-track.mp3. Empty uses an original ambient score.
  photos: [
    ['assets/photos/memory-01.svg', 'The good old days.'],
    ['assets/photos/memory-02.svg', 'Another legendary moment.'],
    ['assets/photos/memory-03.svg', 'Ordinary days, extraordinary memories.'],
    ['assets/photos/memory-04.svg', 'The best moments are never planned.'],
    ['assets/photos/memory-05.svg', 'Life together is never boring.'],
    ['assets/photos/memory-06.svg', 'More memories to come.']
  ],
  notes: ['A normal conversation somehow becomes a comedy show.', 'The perfect combination of intelligence and humor.', 'Computer science brought the knowledge. Brotherhood brought the fun.', 'Living together: unlimited entertainment included.', 'Somehow, even doing absolutely nothing becomes a good memory.', 'The best roommate package includes a brother for life.']
};
const $ = (selector) => document.querySelector(selector);
film.photos.forEach(([src, caption], i) => {
  const button = document.createElement('button');
  button.className = 'photo'; button.style.setProperty('--rotation', `${[-4,3,-2,2,-3,4][i]}deg`);
  button.setAttribute('aria-label', `View photo: ${caption}`); button.dataset.photo = i;
  const img = document.createElement('img'); img.src = src; img.alt = `Photo placeholder: ${caption}`; img.loading = 'lazy'; img.width = 600; img.height = 520;
  const text = document.createElement('span'); text.className = 'handwritten'; text.textContent = caption;
  button.append(img, text); $('#gallery').append(button);
});
film.notes.forEach((text, i) => {
  const button = document.createElement('button'); button.className = 'note'; button.style.setProperty('--rotation', `${[-3,2,-2,3,-2,2][i]}deg`); button.setAttribute('aria-pressed', 'false');
  const quote = document.createElement('span'); quote.className = 'handwritten'; quote.textContent = `“${text}”`;
  const hint = document.createElement('small'); hint.textContent = 'A NOTE FROM YOUR BROTHERS';
  button.append(quote, hint); button.addEventListener('click', () => {const active = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(active)); hint.textContent = active ? 'ONE MORE REASON WE APPRECIATE YOU' : 'A NOTE FROM YOUR BROTHERS';}); $('#notes').append(button);
});
let audioContext, musicTimer, musicOn = false, track;
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
    $('#sound').innerHTML = `<span aria-hidden="true">♫</span> Sound ${musicOn ? 'on' : 'off'}`;
  } catch {musicOn = false; $('#sound').textContent = 'Audio unavailable';}
  $('#sound').setAttribute('aria-pressed', String(musicOn));
}
$('#sound').addEventListener('click', () => setMusic(!musicOn));
$('#begin').addEventListener('click', () => setMusic(true));
document.addEventListener('visibilitychange', () => {if (document.hidden && musicOn) setMusic(false);});
