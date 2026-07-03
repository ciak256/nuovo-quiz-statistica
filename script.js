let domande = [];
let quiz = [];
let current = 0;
let score = 0;

let mode = "exam"; // "exam" oppure "study"
let timer;
let timeLeft = 30;

const chat = document.getElementById("chat");

// carica domande
fetch("domande.json")
.then(r => r.json())
.then(data => {
  domande = data;
  startExam();
});

// ============ MODALITÀ ============

function startExam(){
  mode = "exam";
  quiz = shuffle([...domande]).slice(0, 30); // 30 domande esame
  current = 0;
  score = 0;
  chat.innerHTML = "";
  bot("🎓 Modalità ESAME avviata (30 domande)");
  nextQuestion();
}

function startStudy(){
  mode = "study";
  quiz = shuffle([...domande]);
  current = 0;
  score = 0;
  chat.innerHTML = "";
  bot("📚 Modalità STUDIO avviata");
  nextQuestion();
}

// ============ UI ============

function bot(text){
  chat.innerHTML += `<div class="bot">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function user(text){
  chat.innerHTML += `<div class="user">${text}</div>`;
}

// ============ DOMANDE ============

function nextQuestion(){

  clearInterval(timer);

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

  if(mode === "exam"){
    startTimer();
  }
}

// ============ RISPOSTA ============

function answer(i){

  clearInterval(timer);

  const d = quiz[current];

  user(d.a[i]);

  if(i === d.c){
    score++;
    bot("✅ Corretto!<br><br>" + d.s);
  } else {
    bot("❌ Errato.<br><br>" + d.s);
  }

  current++;

  setTimeout(nextQuestion, 800);
}

// ============ TIMER ============

function startTimer(){

  timeLeft = 30;

  bot("⏱ Tempo: 30 secondi");

  timer = setInterval(() => {

    timeLeft--;

    if(timeLeft <= 0){
      clearInterval(timer);
      bot("⏰ Tempo scaduto!");
      current++;
      setTimeout(nextQuestion, 800);
    }

  }, 1000);
}

// ============ FINE ESAME ============

function finish(){

  let percent = Math.round((score / quiz.length) * 100);
  let vote = Math.round((score / quiz.length) * 30);

  bot("🎉 ESAME TERMINATO");
  bot(`📊 Risposte corrette: ${score}/${quiz.length}`);
  bot(`📈 Percentuale: ${percent}%`);
  bot(`🎓 Voto: ${vote}/30`);
}

// ============ UTILS ============

function shuffle(array){
  return array.sort(() => Math.random() - 0.5);
}

// avvio automatico
bot("👋 Benvenuto nel simulatore di Statistica Pegaso");
bot("Premi sotto per iniziare");

// bottoni modalità
chat.innerHTML += `
<div class="answers">
  <button onclick="startExam()">🎓 Inizia Esame</button>
  <button onclick="startStudy()">📚 Inizia Studio</button>
</div>
`;
