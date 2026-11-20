'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
function updateMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  document.documentElement.classList.toggle('js-motion', !motionPaused);
  $('#motion').textContent = motionPaused ? 'Play motion' : 'Pause motion';
  $('#motion').setAttribute('aria-pressed', String(motionPaused));
  if (motionPaused && window.confetti) window.confetti.reset();
}
$('#motion').addEventListener('click', () => {motionPaused = !motionPaused; updateMotion();});
reducedMotion.addEventListener('change', e => {motionPaused = e.matches; updateMotion();});
updateMotion();
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('visible'); revealObserver.unobserve(entry.target);}}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
const chapterObserver = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) document.querySelectorAll('.chapter-nav a').forEach(a => {if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current','step'); else a.removeAttribute('aria-current');});}), {rootMargin:'-20% 0px -65% 0px'});
document.querySelectorAll('.chapter').forEach(section => chapterObserver.observe(section));
for (let i = 0; i < 25; i++) {const particle = document.createElement('i'); particle.style.cssText = `--x:${(i * 37) % 100}%;--y:${(i * 23) % 100}%;--delay:-${i % 7}s`; $('#particles').append(particle);}
function celebrate() {
  if (musicOn && audioContext) [523.25,659.25,783.99,1046.5].forEach((f,i) => note(f,audioContext.currentTime+i*.15,1,.045));
  if (motionPaused || reducedMotion.matches) return;
  if (window.confetti) window.confetti({particleCount:180,spread:100,origin:{y:.65},colors:['#d4af77','#f5efe6','#638064','#a57454'],disableForReducedMotion:true});
  $('#balloons').replaceChildren();
  for (let i=0;i<9;i++) {const balloon=document.createElement('i');balloon.style.cssText=`--x:${i*12}%;--delay:${i*.15}s;--color:${['#d4af77','#638064','#f5efe6'][i%3]}`;balloon.addEventListener('animationend',()=>balloon.remove());$('#balloons').append(balloon);}
}

$('#begin').addEventListener('click', () => {
  if (!motionPaused && !reducedMotion.matches && window.confetti) window.confetti({particleCount:100,spread:85,origin:{y:.35},colors:['#d4af77','#f5efe6','#b87864','#83a58d'],disableForReducedMotion:true});
});
