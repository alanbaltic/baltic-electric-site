const tiles = document.querySelectorAll('.tile');
const status = document.getElementById('status');
let found = 0, needed = 3;
tiles.forEach(t=>{
  t.onclick = ()=>{
    const safe = +t.dataset.safe;
    if (safe === 0 && !t.classList.contains('bad')){
      t.classList.add('bad'); found++;
    } else if (safe === 1){
      t.classList.add('good');
    }
    status.textContent = found>=needed ? "✅ You found all hazards!" : `Find ${needed-found} more hazard(s)…`;
  };
});
status.textContent = `Find ${needed} hazards.`;
