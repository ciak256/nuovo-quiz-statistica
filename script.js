let domande = [];
let quiz = [];
let current = 0;

let score = 0;
let errors = [];

let startTime;
let examMode = false;
let locked = false;

const chat = document.getElementById("chat");

// ================= LOAD =================

fetch("domande.json")
.then(r => r.json())
.then(data => {
  domande = data;
  menu();
});

// ================= MENU =================

function menu(){
  chat.innerHTML = "";

  bot("🧠 FINAL BOSS SIMULATOR");
  bot("Seleziona modalità:");

  chat.innerHTML += `
  <div class="answers">
    <button onclick="startExam()">🎓 Esame Finale</button>
    <button onclick="startStudy()">📚 Studio</button>
  </div>
  `;
}

// ================= MODES =================

function startExam(){
  examMode = true;
  quiz = shuffle([...domande]).slice(0,30);
  start();
}

function startStudy(){
  examMode = false;
  quiz = shuffle([...domande]);
  start();
}

// ================= CORE =================

function start(){
  current = 0;
  score = 0;
  errors = [];
  startTime = Date.now();
  chat.innerHTML = "";

  bot("🚀 Inizio simulazione...");
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

  locked = false;
}

// ================= ANSWER =================

function answer(i){

  if(locked) return;
  locked = true;

  const d = quiz[current];

  user(d.a[i]);

  if(i === d.c){
    score++;
    bot("✅ Corretto");
  } else {
    errors.push(d);
    bot("❌ Errato<br><br>" + d.s);
  }

  current++;

  setTimeout(next, 700);
}

// ================= FINISH =================

function finish(){

  const time = ((Date.now() - startTime)/1000).toFixed(1);
  const percent = Math.round((score/quiz.length)*100);
  const vote = Math.round((score/quiz.length)*30);

  let label =
    vote < 18 ? "❌ Insufficiente" :
    vote < 22 ? "✔ Sufficiente" :
    vote < 27 ? "👍 Buono" :
    vote < 30 ? "🏆 Eccellente" :
                "💎 30 e LODE";

  bot("🎉 ESAME COMPLETATO");

  bot(`
  📊 RISULTATI FINALI:<br><br>
  ✔ Corrette: ${score}<br>
  ❌ Errori: ${errors.length}<br>
  📈 %: ${percent}%<br>
  🎓 Voto: ${vote}/30<br>
  🏷 ${label}<br>
  ⏱ Tempo: ${time}s
  `);

  chat.innerHTML += `
  <div class="answers">
    <button onclick="reviewErrors()">🔁 Ripassa errori</button>
    <button onclick="menu()">🏠 Menu</button>
  </div>`;
}

// ================= REVIEW =================

function reviewErrors(){
  if(errors.length === 0){
    bot("🎉 Nessun errore da ripassare!");
    return;
  }

  quiz = errors;
  current = 0;
  errors = [];
  chat.innerHTML = "";
  bot("🔁 RIPASSO ERRORI");
  next();
}

// ================= UTILS =================

function shuffle(a){
  return a.sort(()=>Math.random()-0.5);
}
