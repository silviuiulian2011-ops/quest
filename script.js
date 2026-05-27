let currentUser = "";

const d = (value) => atob(value);

const users = {
  VANEA: {
    password: d("MTU5MTMx"),
    theme: "cartelTheme",
    mafia: "El Cartel",
    word: d("Q0FSVEVM"),
    code: d("VjROM0E=")
  },

  RECHINU: {
    password: d("NzE4MzQx"),
    theme: "sombrasTheme",
    mafia: "Sombras",
    word: d("U09NQlJBUw=="),
    code: d("UjNDSDFOVQ==")
  }
};

function login(){
  const username = document.getElementById("username").value.toUpperCase();
  const password = document.getElementById("password").value;

  if(users[username] && users[username].password === password){
    currentUser = username;

    document.body.classList.add(users[username].theme);

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");

    startIntroStory();
  }else{
    document.getElementById("errorText").innerText = "UTILIZATOR SAU PAROLĂ GREȘITĂ";
  }
}

function getIntroStory(){
  return `Ai ajuns mai departe decât majoritatea.

Numele ${users[currentUser].mafia} a fost auzit.
Prezența voastră în oraș a început să conteze.
Iar unele acțiuni au atras atenția potrivită.

Drumul până aici n-a fost simplu.
Dar partea grea începe acum.

Task-ul de oficializare nu oferă garanții.
Doar oportunitatea de a demonstra că meriți să continui.

Tot ce urmează depinde de tine.`;
}

function getFinalStory(){
  return `Ai demonstrat că poți ajunge până la capăt.
Dar rezultatul final nu este decis aici.

Păstrează codul primit.
Îl vei folosi mai departe.`;
}

function typeText(elementId, text, buttonId){
  const element = document.getElementById(elementId);
  const button = document.getElementById(buttonId);

  element.innerText = "";
  button.style.display = "none";

  let index = 0;

  const interval = setInterval(()=>{
    element.innerText += text[index];
    index++;

    if(index >= text.length){
      clearInterval(interval);
      button.style.display = "inline-block";
    }
  },28);
}

function startIntroStory(){
  typeText("introText", getIntroStory(), "introNextButton");
}

function goToDesktop(){
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("desktopScreen").classList.remove("hidden");
}

function openHackSystem(){
  document.getElementById("desktopScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  prepareGame();
}

function prepareGame(){
  document.getElementById("instructionsPanel").classList.remove("hidden");
  document.getElementById("columnsContainer").classList.add("hidden");
  document.getElementById("resultWord").innerText = "";
  document.getElementById("nextButton").style.display = "none";
}

function beginCrackGame(){
  document.getElementById("instructionsPanel").classList.add("hidden");
  document.getElementById("columnsContainer").classList.remove("hidden");

  startGame();
}

let currentColumn = 0;
let currentLetters = [];
let gameIntervals = [];
let canPress = true;

function startGame(){
  currentColumn = 0;
  currentLetters = [];

  gameIntervals.forEach(interval => clearInterval(interval));
  gameIntervals = [];

  canPress = true;

  document.getElementById("resultWord").innerText = "";
  document.getElementById("nextButton").style.display = "none";

  const word = users[currentUser].word;
  const container = document.getElementById("columnsContainer");

  container.innerHTML = "";

  for(let i = 0; i < word.length; i++){
    const column = document.createElement("div");
    column.className = "column";

    const centerLine = document.createElement("div");
    centerLine.className = "centerLine";

    const letter = document.createElement("div");
    letter.className = "letter";
    letter.innerText = "?";
    letter.style.color = "white";

    column.appendChild(centerLine);
    column.appendChild(letter);
    container.appendChild(column);

    currentLetters.push(letter);
  }

  startColumnAnimation(0);
}

function randomLetter(excludeLetter){
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter(letter => letter !== excludeLetter);

  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function startColumnAnimation(index){
  const word = users[currentUser].word;
  const targetLetter = word[index];
  const letterDiv = currentLetters[index];

  let counter = 0;

  const interval = setInterval(()=>{
    counter++;

    if(counter % 7 === 0){
      letterDiv.innerText = targetLetter;
      letterDiv.style.color = "red";
    }else{
      letterDiv.innerText = randomLetter(targetLetter);
      letterDiv.style.color = "white";
    }
  },400);

  gameIntervals[index] = interval;
}

function stopColumn(index){
  if(gameIntervals[index]){
    clearInterval(gameIntervals[index]);
    gameIntervals[index] = null;
  }
}

function resetColumnToQuestion(index){
  if(index < 0 || !currentLetters[index]) return;

  stopColumn(index);

  currentLetters[index].innerText = "?";
  currentLetters[index].style.color = "white";
}

function mistakePenalty(){
  const failedColumn = currentColumn;

  stopColumn(failedColumn);

  currentLetters[failedColumn].innerText = "X";
  currentLetters[failedColumn].style.color = "red";

  setTimeout(()=>{
    resetColumnToQuestion(failedColumn);

    if(failedColumn > 0){
      currentColumn = failedColumn - 1;

      resetColumnToQuestion(currentColumn);
      startColumnAnimation(currentColumn);
    }else{
      currentColumn = 0;

      resetColumnToQuestion(0);
      startColumnAnimation(0);
    }
  },450);
}

document.addEventListener("keydown",(e)=>{
  if(e.code !== "Space") return;
  if(!canPress) return;

  canPress = false;

  if(document.getElementById("gameScreen").classList.contains("hidden")){
    return;
  }

  const word = users[currentUser].word;
  const currentLetter = currentLetters[currentColumn];

  if(!currentLetter) return;

  if(currentLetter.innerText === word[currentColumn]){
    stopColumn(currentColumn);

    currentLetter.style.color = "lime";

    currentColumn++;

    if(currentColumn < word.length){
      startColumnAnimation(currentColumn);
    }else{
      finishGame();
    }
  }else{
    mistakePenalty();
  }
});

document.addEventListener("keyup",(e)=>{
  if(e.code === "Space"){
    canPress = true;
  }
});

function finishGame(){
  document.getElementById("resultWord").innerText = users[currentUser].word;
  document.getElementById("nextButton").style.display = "block";
}

function showFinalStory(){
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("finalStoryScreen").classList.remove("hidden");

  typeText("finalStoryText", getFinalStory(), "finalNextButton");
}

function showFinalCode(){
  document.getElementById("finalStoryScreen").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");

  document.getElementById("finalCode").innerText = users[currentUser].code;
}