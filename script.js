let domande = [];
let quiz = [];
let current = 0;
let score = 0;
let errors = [];

let startTime;
let answerTimes = [];

const chat = document.getElementById("chat");

// carica domande
fetch("domande.json")
.then(r => r.json())
.then(data => {
  domande = data;
  showMenu();
});

// ================= MENU =================

function showMenu(){
  chat.innerHTML = "";

  bot("👋 Benvenuto nel simulatore Pegaso PRO");
  bot("Scegli modalità:");

  chat.innerHTML += `
  <div class="answers">
    <button onclick="startExam()">🎓 Esame PRO (30 domande)</button>
    <button onclick="startStudy()">📚 Studio completo</button>
  </div>
  `;
}

// ================= MODALITÀ =================

function startExam(){
  quiz = shuffle([...domande]).slice(0,30);
  start();
}

function startStudy(){
  quiz = shuffle([...domande]);
  start();
}

function start(){
  current = 0;
  score = 0;
  errors = [];
  answerTimes = [];
  chat.innerHTML = "";
  startTime = Date.now();
  nextQuestion();
}

// ================= CHAT =================

function bot(text){
  chat.innerHTML += `<div class="bot">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function user(text){
  chat.innerHTML += `<div class="user">${text}</div>`;
}

// ================= DOMANDE =================

function nextQuestion(){

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

// ================= RISPOSTA =================

function answer(i){

  const d = quiz[current];

  const t = Date.now();
  answerTimes.push(t);

  user(d.a[i]);

  if(i === d.c){
    score++;
    bot("✅ Corretto!<br><br>" + d.s);
  } else {
    errors.push(d);
    bot("❌ Errato.<br><br>" + d.s);
  }

  current++;
  setTimeout(nextQuestion, 600);
}

// ================= FINE =================

function finish(){

  const totalTime = (Date.now() - startTime)/1000;
  const avgTime = (totalTime / quiz.length).toFixed(1);

  const percent = Math.round((score / quiz.length) * 100);
  const vote = Math.round((score / quiz.length) * 30);

  let label = "";

  if(vote < 18) label = "❌ Insufficiente";
  else if(vote < 22) label = "✔ Sufficiente";
  else if(vote < 27) label = "👍 Buono";
  else label = "🏆 Eccellente";

  bot("🎉 ESAME COMPLETATO");

  bot(`
  📊 RISULTATI:<br><br>
  ✔ Corrette: ${score}<br>
  ❌ Errori: ${errors.length}<br>
  📈 Percentuale: ${percent}%<br>
  🎓 Voto: ${vote}/30<br>
  🏷 Valutazione: <b>${label}</b><br>
  ⏱ Tempo medio: ${avgTime}s
  `);

  if(errors.length > 0){
    chat.innerHTML += `
    <div class="answers">
      <button onclick="retryErrors()">🔁 Ripeti errori</button>
      <button onclick="showMenu()">🏠 Menu</button>
    </div>`;
  }
}

// ================= RIPETI ERRORI =================

function retryErrors(){
  quiz = errors;
  current = 0;
  score = 0;
  errors = [];
  chat.innerHTML = "";
  bot("🔁 Ripetizione errori");
  nextQuestion();
}

// ================= UTILS =================

function shuffle(a){
  return a.sort(() => Math.random() - 0.5);
}
