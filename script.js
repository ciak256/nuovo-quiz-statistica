let domande = [];
let index = 0;
let score = 0;

// shuffle vero
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}

// evita ripetizioni assolute
let viste = new Set();

fetch("domande.json")
.then(r => r.json())
.then(data => {
    domande = shuffle(data);
    show();
});

function show(){

    if(index >= domande.length){
        document.getElementById("question").innerText = "FINITO 🎉";
        document.getElementById("answers").innerHTML = "";
        document.getElementById("score").innerText = "Punteggio: " + score + "/" + domande.length;
        return;
    }

    let d = domande[index];

    // evita doppioni (extra sicurezza)
    if(viste.has(d.q)){
        index++;
        return show();
    }

    viste.add(d.q);

    document.getElementById("progress").innerText =
        `Domanda ${index+1} / ${domande.length}`;

    document.getElementById("question").innerText = d.q;

    let html = "";

    d.a.forEach((opt,i)=>{
        html += `<button onclick="check(${i})">${opt}</button>`;
    });

    document.getElementById("answers").innerHTML = html;
}

function check(i){
    let correct = domande[index].c;

    if(i === correct){
        score++;
        alert("✔️ Corretto");
    } else {
        alert("❌ Sbagliato");
    }
}

function next(){
    index++;
    show();
}
