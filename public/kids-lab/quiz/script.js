const qs = [
  { q: "What does a battery provide in a circuit?", choices:["Resistance","Current","Voltage (push)","Light"], correct:2, explain:"A battery provides voltage — the push that moves charge."},
  { q: "Which unit measures current?", choices:["Volts","Watts","Ohms","Amps"], correct:3, explain:"Current is measured in amperes (amps)."},
  { q: "Ohm’s Law says V = ? × R", choices:["P","I","Q","C"], correct:1, explain:"V = I × R, where I is current, R is resistance."},
  { q: "What happens in a short circuit?", choices:["Very high current","No current","Only DC flows","Only AC flows"], correct:0, explain:"With little resistance, current spikes dangerously."},
  { q: "Which material is a good conductor?", choices:["Rubber","Glass","Copper","Wood"], correct:2, explain:"Copper is an excellent conductor; rubber and glass are insulators."},
  { q: "Unit of electrical power:", choices:["Volt","Watt","Ohm","Coulomb"], correct:1, explain:"Power is measured in watts."},
  { q: "A switch in the OFF position makes the circuit…", choices:["Open","Closed","Shorted","Reversed"], correct:0, explain:"Open circuit = no current flow."},
  { q: "LEDs must be connected with correct…", choices:["Polarity","Color","Length","Temperature"], correct:0, explain:"LEDs are diodes; polarity matters."},
  { q: "What device protects a circuit from too much current?", choices:["Resistor","Fuse","Capacitor","Transformer"], correct:1, explain:"Fuses (and breakers) interrupt excessive current."},
  { q: "Solar panels produce which type of electricity?", choices:["AC","DC","Both","Static"], correct:1, explain:"Panels produce DC; inverters turn it into AC for homes."}
];

let order = qs.map((_,i)=>i);
for (let i=order.length-1;i>0;i--){
  const j = Math.floor(Math.random()*(i+1));
  [order[i],order[j]]=[order[j],order[i]];
}

let idx = 0;
let score = 0;
const selected = new Array(qs.length).fill(null);

const progress = document.getElementById('progress');
const card = document.getElementById('card');
const qtext = document.getElementById('qtext');
const answers = document.getElementById('answers');
const nextBtn = document.getElementById('next');
const result = document.getElementById('result');

function render(){
  const n = order[idx];
  const q = qs[n];
  qtext.textContent = `Q${idx+1}. ${q.q}`;
  progress.textContent = `Question ${idx+1} of ${qs.length}`;

  answers.innerHTML = "";
  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.textContent = c;
    btn.onclick = () => pick(i);
    answers.appendChild(btn);
  });

  nextBtn.disabled = selected[n] === null;
  nextBtn.textContent = idx === qs.length - 1 ? "Finish" : "Next";
}

function pick(i){
  const n = order[idx];
  const q = qs[n];
  selected[n] = i;

  // color answers
  [...answers.children].forEach((btn, k)=>{
    btn.classList.remove('correct','wrong');
    if (k === q.correct) btn.classList.add('correct');
    else if (k === i) btn.classList.add('wrong');
    btn.disabled = true;
  });

  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  if (idx < qs.length - 1) {
    idx++;
    render();
  } else {
    showResults();
  }
});

function showResults(){
  card.classList.add('hidden');
  result.classList.remove('hidden');

  // score
  score = selected.reduce((s,ans,i)=> s + (ans === qs[i].correct ? 1 : 0), 0);

  let review = `<h3>Your Score: ${score}/${qs.length}</h3><ol>`;
  qs.forEach((q, i) => {
    const ok = selected[i] === q.correct;
    review += `<li style="margin:8px 0">
      <strong>${q.q}</strong><br>
      You answered: <em>${q.choices[selected[i]] ?? "—"}</em> ${ok ? "✅" : "❌"}<br>
      Correct: <em>${q.choices[q.correct]}</em><br>
      <span style="color:#9fb6ff">${q.explain}</span>
    </li>`;
  });
  review += "</ol><div class='controls'><a class='btn' href='../'>Back to Lab</a></div>";
  result.innerHTML = review;
}

render();
