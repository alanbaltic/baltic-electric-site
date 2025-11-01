const symbols = ['🔌','⚡','🔋','💡','🔧','📏'];
let deck = [...symbols, ...symbols].sort(()=>Math.random()-0.5);
const board = document.getElementById('board');
const msg = document.getElementById('msg');
let open = [], matched = 0;

deck.forEach((sym,i)=>{
  const d = document.createElement('button');
  d.className='cardx';
  d.dataset.sym=sym;
  d.onclick=()=>flip(d);
  board.appendChild(d);
});

function flip(d){
  if (d.classList.contains('matched')||d.classList.contains('revealed')) return;
  d.classList.add('revealed'); d.textContent=d.dataset.sym;
  open.push(d);
  if (open.length===2){
    const [a,b]=open; open=[];
    if (a.dataset.sym===b.dataset.sym){
      a.classList.add('matched'); b.classList.add('matched'); matched+=2;
      if (matched===deck.length) msg.textContent="✅ All matched!";
    } else {
      setTimeout(()=>{ a.textContent=''; b.textContent=''; a.classList.remove('revealed'); b.classList.remove('revealed'); }, 600);
    }
  }
}
