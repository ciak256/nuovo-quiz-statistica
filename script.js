let domande = [];
let current = 0;
let score = 0;

const chat = document.getElementById("chat");

fetch("domande.json")
.then(r => r.json())
.then(data => {
  domande = data.sort(() => Math.random() - 0.5);
  mostraDomanda();
});

function bot(text){
  chat.innerHTML += `<div class="bot">${text}</div>`;
}

function user(text){
  chat.innerHTML += `<div class="user">${text}</div>`;
}

function mostraDomanda(){

  if(current >= domande.length){
    bot(`🎉 Quiz terminato!<br><br>Punteggio: <b>${score}/${domande.length}</b>`);
    return;
  }

  const d = domande[current];

  let html = `<div class="bot"><b>Domanda ${current+1}</b><br><br>${d.q}</div>`;
  html += `<div class="answers">`;

  d.a.forEach((r,i)=>{
    html += `<button onclick="rispondi(${i})">${r}</button>`;
  });

  html += `</div>`;

  chat.innerHTML += html;
}

function rispondi(i){

  const d = domande[current];

  user(d.a[i]);

  if(i === d.c){
    score++;
    bot("✅ Corretto!<br><br>" + d.s);
  } else {
    bot("❌ Errato.<br><br>" + d.s);
  }

  current++;
  mostraDomanda();
}
