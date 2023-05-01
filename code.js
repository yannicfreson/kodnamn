const cards = document.getElementsByClassName("card");
const dbRefGames = firebase.database().ref().child("games");

let language = "nl";
let spymaster = false;
let male = false;

let seed;
let done = false;

/* 
0  = red
1  = blue
2  = white
3  = black
4  = redDown
5  = blueDown
6  = whiteDown
7  = blackDown
*/
let boardState = {
  cardValue: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  guessedCards: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  cardGender: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  countedCards: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  scoreCountRed: 0,
  scoreCountBlue: 0,
};

let scoreRed;
let scoreBlue;

let colors;

function setup(seed) {
  setWords(seed);
  setWhichColors(seed);
  initBoardState(seed);
}

function render(boardState) {
  setCardClasses(boardState, spymaster);
  updateScore(boardState);
  done = true;
  updateDatabase(seed);
}

async function getSeed() {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  if (params.has("seed")) {
    seed = params.get("seed");
    language = params.get("lang");
    console.log("Got seed from url");
    firebase
      .database()
      .ref(`games/${seed}`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          boardState = snapshot.val().boardState;
          scoreCountRed = boardState.scoreCountRed;
          scoreCountBlue = boardState.scoreCountBlue;
          done = true;
          document.getElementById("switchLang").style.display = "none";
        }
      });
  } else if (!params.has("seed")) {
    seed = Math.floor(Math.random() * 1000000000) + 1;
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("seed", seed);
    newURL.searchParams.set("lang", language);
    window.location.replace(newURL);
    console.log("Generated seed and changed URL");
  }
}

function setWords(seed) {
  let shuffledWords;
  if (language.toLowerCase() === "nl") {
    shuffledWords = shuffle(wordsNed, seed);
  } else if (language.toLowerCase() === "en") {
    shuffledWords = shuffle(wordsEng, seed);
  }

  for (i = 0; i < cards.length; i++) {
    cards[i].innerText = shuffledWords[i];
  }
}

function setWhichColors(seed) {
  if (Math.round(seed / 100) % 2 === 0) {
    colors = colors0;
    if (boardState.scoreCountBlue == 0 && boardState.scoreCountRed == 0) {
      boardState.scoreCountRed = 9;
      boardState.scoreCountBlue = 8;
    }
  } else if (Math.round(seed / 100) % 2 !== 0) {
    colors = colors1;
    if (boardState.scoreCountBlue == 0 && boardState.scoreCountRed == 0) {
      boardState.scoreCountRed = 8;
      boardState.scoreCountBlue = 9;
    }
  }
}

function initBoardState(seed) {
  let shuffledColors = shuffle(colors, seed);
  for (i = 0; i < cards.length; i++) {
    boardState.cardValue[i] = shuffledColors[i];
  }
  updateDatabase(seed);
}

function updateDatabase(seed) {
  firebase
    .database()
    .ref("games/" + seed)
    .set({ boardState: boardState });
}

function setCardClasses(boardState, spymaster) {
  if (spymaster) {
    for (let i = 0; i < cards.length; i++) {
      if (boardState.cardValue[i] == 0) {
        cards[i].classList.add("redSpy");
      } else if (boardState.cardValue[i] == 1) {
        cards[i].classList.add("blueSpy");
      } else if (boardState.cardValue[i] == 2) {
        cards[i].classList.add("whiteSpy");
      } else if (boardState.cardValue[i] == 3) {
        cards[i].classList.add("blackSpy");
      }
    }
  }

  for (let i = 0; i < cards.length; i++) {
    if (
      (boardState.cardValue[i] == 4 && !cards[i].classList.contains("down")) ||
      (boardState.cardValue[i] == 0 && boardState.guessedCards[i] == 1)
    ) {
      if (boardState.cardGender[i] == 1) {
        cards[i].classList.add("redDown0", "down");
      } else {
        cards[i].classList.add("redDown1", "down");
      }
      cards[i].innerText = "";
    } else if (
      (boardState.cardValue[i] == 5 && !cards[i].classList.contains("down")) ||
      (boardState.cardValue[i] == 1 && boardState.guessedCards[i] == 1)
    ) {
      if (boardState.cardGender[i] == 1) {
        cards[i].classList.add("blueDown0", "down");
      } else {
        cards[i].classList.add("blueDown1", "down");
      }
      cards[i].innerText = "";
    } else if (
      (boardState.cardValue[i] == 6 && !cards[i].classList.contains("down")) ||
      (boardState.cardValue[i] == 2 && boardState.guessedCards[i] == 1)
    ) {
      if (boardState.cardGender[i] == 1) {
        cards[i].classList.add("whiteDown0", "down");
      } else {
        cards[i].classList.add("whiteDown1", "down");
      }
      cards[i].innerText = "";
    } else if (
      (boardState.cardValue[i] == 7 && !cards[i].classList.contains("down")) ||
      (boardState.cardValue[i] == 3 && boardState.guessedCards[i] == 1)
    ) {
      if (boardState.cardGender[i] == 1) {
        cards[i].classList.add("blackDown0", "down");
      } else {
        cards[i].classList.add("blackDown0", "down"); // there is only one black card
      }
      cards[i].innerText = "";
    }
  }
}

document.addEventListener("click", function (click) {
  if (
    click.target == document.getElementById("spySwitch") &&
    spymaster === false
  ) {
    spymaster = !spymaster;
  }

  if (click.target == document.getElementById("switchLang")) {
    if (language == "nl") {
      language = "en";
      const newURL = new URL(window.location.href);
      newURL.searchParams.set("seed", seed);
      newURL.searchParams.set("lang", language);
      window.history.replaceState("page2", "Title", newURL);
      setWords(seed);
    } else if (language == "en") {
      language = "nl";
      const newURL = new URL(window.location.href);
      newURL.searchParams.set("seed", seed);
      newURL.searchParams.set("lang", language);
      window.history.replaceState("page2", "Title", newURL);
      setWords(seed);
    }
  }

  if (click.target.classList.contains("card")) {
    male = Math.round(Math.random()) === 0;

    if (boardState.cardValue[click.target.id.substring(4)] == 0) {
      boardState.cardValue[click.target.id.substring(4)] = 4;
      boardState.guessedCards[click.target.id.substring(4)] = 1;
      if (male) {
        boardState.cardGender[click.target.id.substring(4)] = 1;
      } else {
        boardState.cardGender[click.target.id.substring(4)] = 2;
      }
    } else if (boardState.cardValue[click.target.id.substring(4)] == 1) {
      boardState.cardValue[click.target.id.substring(4)] = 5;
      boardState.guessedCards[click.target.id.substring(4)] = 1;
      if (male) {
        boardState.cardGender[click.target.id.substring(4)] = 1;
      } else {
        boardState.cardGender[click.target.id.substring(4)] = 2;
      }
    } else if (boardState.cardValue[click.target.id.substring(4)] == 2) {
      boardState.cardValue[click.target.id.substring(4)] = 6;
      boardState.guessedCards[click.target.id.substring(4)] = 1;
      if (male) {
        boardState.cardGender[click.target.id.substring(4)] = 1;
      } else {
        boardState.cardGender[click.target.id.substring(4)] = 2;
      }
    } else if (boardState.cardValue[click.target.id.substring(4)] == 3) {
      boardState.cardValue[click.target.id.substring(4)] = 7;
      boardState.guessedCards[click.target.id.substring(4)] = 1;
      if (male) {
        boardState.cardGender[click.target.id.substring(4)] = 1;
      } else {
        boardState.cardGender[click.target.id.substring(4)] = 2;
      }
    }
  }
  render(boardState);
});

function shuffle(array, seed) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  seed = seed || 1;
  var random = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  while (0 !== currentIndex) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

getSeed();
setTimeout(function () {
  setup(seed);
  render(boardState);
}, 3000);

var intervalID = setInterval(function () {
  firebase
    .database()
    .ref(`games/${seed}`)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        boardState = snapshot.val().boardState;
        console.log("Syncing on interval...");
      }
    });
}, 30000);

function checkGamePresent() {
  firebase
    .database()
    .ref(`games/${seed}`)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    });
}

function updateScore(boardState) {
  for (let i = 0; i < cards.length; i++) {
    if (
      boardState.cardValue[i] == 4 &&
      boardState.guessedCards[i] == 1 &&
      boardState.countedCards[i] == 0
    ) {
      boardState.scoreCountRed -= 1;
      boardState.countedCards[i] = 1;
    } else if (
      boardState.cardValue[i] == 5 &&
      boardState.guessedCards[i] == 1 &&
      boardState.countedCards[i] == 0
    ) {
      boardState.scoreCountBlue -= 1;
      boardState.countedCards[i] = 1;
    }
  }
  document.getElementById("scoreRed").innerText = boardState.scoreCountRed;
  document.getElementById("scoreBlue").innerText = boardState.scoreCountBlue;
}

dbRefGames.on("value", (snap) => {
  if (done) {
    boardState = snap.child(seed + "/boardState").val();
    render(boardState);
  }
});
