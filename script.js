let domande = [];
let quiz = [];
let current = 0;

let score = 0;
let errors = [];
let exp = 0;
let level = 1;

let startTime;
let times = [];

const chat = document.getElementById("chat");

// ================= LOAD =================

fetch("domande.json")
.then(r => r.json())
.then(data => {
  domande = data;

  loadProfile();
  menu();
});

// ================= PROFILO =================

function loadProfile(){
  const savedLevel = localStorage.getItem("level");
  const savedExp = localStorage.getItem("exp");

  if(savedLevel) level = parseInt(savedLevel);
  if(savedExp) exp = parseInt(savedExp);
}

function saveProfile(){
  localStorage.setItem("level", level);
  localStorage.setItem("exp", exp);
}

// ================= MENU =================

function menu(){
  chat.innerHTML = "";

  bot(`👋 Benvenuto<br>⭐ Livello: ${level}<br>⚡ EXP: ${exp}`);

  chat.innerHTML += `
  <div class="answers">
    <button onclick="startExam()">🎓 Esame Ultra (30 domande)</button>
    <button onclick="startStudy()">📚 Studio completo</button>
    <button onclick="showStats()">📊 Statistiche</button>
  </div>
  `;
}

// ================= MODES =================

function startExam(){
  quiz = shuffle([...domande]).slice(0,30);
  start();
}

function startStudy(){
  quiz = shuffle([...domande]);
  start();
}

// ================= CORE =================

function start(){
  current = 0;
  score = 0;
  errors = [];
  times = [];
  startTime = Date.now();
  chat.innerHTML = "";
  next();
}

// ================= CHAT =================

function bot(t){
  chat.innerHTML += `<div class="bot">${t}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function user(t){
  chat.innerHTML += `<div class="user">${t}</div>`;
}

// ================= QUESTION =================

function next(){

  if(current >= quiz.length){
    finish();
    return;
  }

  const d = quiz[current];

  bot(`<b>Domanda ${current+1}/${quiz.length}</b><br><br>${d.q}`);

  let html = `<div class="answers">`;

  d.a.forEach((r,i)=>{
    html += `<button onclick="answer(${i})">${r}</button>`;
  });

  html += `</div>`;

  chat.innerHTML += html;
}

// ================= ANSWER =================

function answer(i){

  const d = quiz[current];

  const t = Date.now();
  times.push(t);

  user(d.a[i]);

  if(i === d.c){
    score++;
    exp += 10;
    bot("✅ Corretto!");
  } else {
    errors.push(d);
    exp += 2;
    bot("❌ Errato<br><br>" + d.s);
  }

  levelUp();

  current++;
  saveProfile();

  setTimeout(next, 500);
}

// ================= LEVEL SYSTEM =================

function levelUp(){
  const needed = level * 100;

  if(exp >= needed){
    level++;
    bot(`🏆 LEVEL UP! Sei livello ${level}`);
  }
}

// ================= FINISH =================

function finish(){

  const percent = Math.round((score/quiz.length)*100);
  const vote = Math.round((score/quiz.length)*30);

  let label =
    vote < 18 ? "❌ Insufficiente" :
    vote < 22 ? "✔ Sufficiente" :
    vote < 27 ? "👍 Buono" :
                "🏆 Eccellente";

  bot("🎉 ESAME COMPLETATO");

  bot(`
  📊 RISULTATI:<br><br>
  ✔ Corrette: ${score}<br>
  ❌ Errori: ${errors.length}<br>
  📈 %: ${percent}%<br>
  🎓 Voto: ${vote}/30<br>
  🏷 ${label}<br>
  ⭐ Livello: ${level}<br>
  ⚡ EXP: ${exp}
  `);

  chat.innerHTML += `
  <div class="answers">
    <button onclick="retryErrors()">🔁 Errori</button>
    <button onclick="menu()">🏠 Menu</button>
  </div>`;
}

// ================= STATS =================

function showStats(){

  bot(`
  📊 STATISTICHE:<br><br>
  ⭐ Livello: ${level}<br>
  ⚡ EXP: ${exp}<br>
  🎯 Prossimo livello: ${level*100} EXP
  `);

  chat.innerHTML += `
  <div class="answers">
    <button onclick="menu()">🏠 Menu</button>
  </div>`;
}

// ================= RETRY =================

function retryErrors(){
  quiz = errors;
  current = 0;
  score = 0;
  errors = [];
  chat.innerHTML = "";
  bot("🔁 Ripasso errori");
  next();
}

// ================= UTILS =================

function shuffle(a){
  return a.sort(() => Math.random()-0.5);
}
