export const sfx = {
  click: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_8a2be4e9cb.mp3?filename=whoosh-6316.mp3"),
  correct: new Audio("https://cdn.pixabay.com/download/audio/2021/09/14/audio_3ef0a2996f.mp3?filename=correct-2-46134.mp3"),
  wrong: new Audio("https://cdn.pixabay.com/download/audio/2021/09/14/audio_2a281f45ef.mp3?filename=wrong-buzzer-6268.mp3"),
  success: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_6e192f50e7.mp3?filename=success-1-6297.mp3")
};
Object.values(sfx).forEach(a=>a.volume=0.25);
export function confettiBurst(node){
  const e = document.createElement('div');
  e.style.position = 'fixed';
  e.style.inset = '0';
  e.style.pointerEvents = 'none';
  document.body.appendChild(e);
  const bits = '✨⚡⭐💥🔆'.split('');
  for(let i=0;i<40;i++){
    const span = document.createElement('span');
    span.textContent = bits[Math.floor(Math.random()*bits.length)];
    span.style.position='absolute';
    span.style.left = Math.random()*100+'%';
    span.style.top = '-10px';
    span.style.fontSize = (12+Math.random()*18)+'px';
    span.style.transition='transform 1.2s ease-out, opacity 1.2s';
    e.appendChild(span);
    requestAnimationFrame(()=>{
      span.style.transform = `translateY(${80+Math.random()*90}vh) rotate(${Math.random()*540-270}deg)`;
      span.style.opacity = '0';
    });
  }
  setTimeout(()=>e.remove(),1300);
}
