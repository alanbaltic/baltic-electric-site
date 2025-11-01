const pieces = document.querySelectorAll('.piece');
const drops = document.querySelectorAll('.drop');
const switchBtn = document.getElementById('switchBtn');
const status = document.getElementById('status');
let closed = false;

pieces.forEach(p=>{
  p.addEventListener('dragstart', ev=>{
    ev.dataTransfer.setData('text/plain', p.id);
  });
});

drops.forEach(d=>{
  d.addEventListener('dragover', e=>e.preventDefault());
  d.addEventListener('drop', e=>{
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const el = document.getElementById(id);
    if ((d.dataset.slot==='power' && id==='battery') ||
        (d.dataset.slot==='load'  && id==='bulb')){
      d.classList.add('filled');
      d.textContent = '';
      d.appendChild(el);
      checkReady();
    } else {
      status.textContent = "That doesn't fit there.";
    }
  });
});

switchBtn.onclick = ()=>{
  closed = !closed;
  switchBtn.textContent = closed ? "Switch ON" : "Switch OFF";
  checkReady();
}

function checkReady(){
  const ok = document.querySelector('[data-slot="power"] .piece#battery') &&
             document.querySelector('[data-slot="load"] .piece#bulb');
  if (ok && closed){
    status.textContent = "✅ The bulb lights! Circuit is closed.";
  } else if (ok) {
    status.textContent = "ℹ️ Place parts, then turn the switch ON.";
  } else {
    status.textContent = "Drag the battery and bulb into the slots.";
  }
}
checkReady();
