const solar = document.getElementById('solar');
const battery = document.getElementById('battery');
const load = document.getElementById('load');
const readout = document.getElementById('readout');

function update(){
  const s = +solar.value, b = +battery.value, l = +load.value;
  const surplus = s - l;
  let newB = b + surplus * 2; // crude 'charge' effect
  newB = Math.max(0, Math.min(100, newB));
  battery.value = Math.round(newB);

  const ok = newB >= 20;
  readout.innerHTML = `Solar: ${s} kW • Usage: ${l} kW • Battery: ${Math.round(newB)}% ${ok ? "✅ Stable" : "⚠️ Low battery"}`;
}
[solar, battery, load].forEach(i=>i.addEventListener('input', update));
update();
