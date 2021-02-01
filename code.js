const cards = document.getElementsByClassName("card");

let language = "nederlands";
let spymaster = false;
let male = false

let seed;

function getSeed() {
  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  if (params.has('seed')) {
    seed = params.get('seed')
  } else if (!params.has('seed')) {
    seed = Math.floor(Math.random() * 1000000) + 1
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("seed", seed);
    window.location.replace(newURL)
  } 
}

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
  "cardValue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "guessedCards":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

let scoreRed;
let scoreBlue;

let colors0 = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  2,
  2,
  2,
  2,
  2,
  2,
  2,

  3,
];
let colors1 = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  2,
  2,
  2,
  2,
  2,
  2,
  2,

  3,
];
let colors;

let wordsEng = [
  "africa",
  "agent",
  "air",
  "alien",
  "amazon",
  "angel",
  "antarctica",
  "apple",
  "arm",
  "back",
  "band",
  "bank",
  "bark",
  "beach",
  "belt",
  "berlin",
  "berry",
  "board",
  "bond",
  "boom",
  "bow",
  "box",
  "bug",
  "canada",
  "capital",
  "cell",
  "center",
  "china",
  "chocolate",
  "circle",
  "club",
  "compound",
  "copper",
  "crash",
  "cricket",
  "cross",
  "death",
  "dice",
  "dinosaur",
  "doctor",
  "dog",
  "dress",
  "dwarf",
  "eagle",
  "egypt",
  "engine",
  "england",
  "europe",
  "eye",
  "fair",
  "fall",
  "fan",
  "field",
  "file",
  "film",
  "fish",
  "flute",
  "fly",
  "forest",
  "fork",
  "france",
  "gas",
  "ghost",
  "giant",
  "glass",
  "glove",
  "gold",
  "grass",
  "greece",
  "green",
  "ham",
  "head",
  "himalaya",
  "hole",
  "hood",
  "hook",
  "human",
  "horseshoe",
  "hospital",
  "hotel",
  "ice",
  "ice cream",
  "india",
  "iron",
  "ivory",
  "jam",
  "jet",
  "jupiter",
  "kangaroo",
  "ketchup",
  "kid",
  "king",
  "kiwi",
  "knife",
  "knight",
  "lab",
  "lap",
  "laser",
  "lawyer",
  "lead",
  "lemon",
  "limousine",
  "log",
  "mammoth",
  "maple",
  "march",
  "mass",
  "mercury",
  "millionaire",
  "model",
  "mole",
  "moscow",
  "mouth",
  "mug",
  "needle",
  "net",
  "new york",
  "night",
  "note",
  "novel",
  "nurse",
  "nut",
  "oil",
  "olive",
  "olympus",
  "opera",
  "orange",
  "paper",
  "park",
  "part",
  "paste",
  "phoenix",
  "piano",
  "telescope",
  "teacher",
  "switch",
  "swing",
  "sub",
  "stick",
  "staff",
  "stadium",
  "sprint",
  "spike",
  "snowman",
  "slip",
  "shot",
  "shadow",
  "server",
  "ruler",
  "row",
  "rose",
  "root",
  "rome",
  "rock",
  "robot",
  "robin",
  "revolution",
  "rat",
  "racket",
  "queen",
  "press",
  "port",
  "pilot",
  "time",
  "tooth",
  "tower",
  "truck",
  "triangle",
  "trip",
  "turkey",
  "undertaker",
  "unicorn",
  "vacuum",
  "van",
  "wake",
  "wall",
  "war",
  "washer",
  "washington",
  "water",
  "wave",
  "well",
  "whale",
  "whip",
  "worm",
  "yard",
];
let wordsNed = [
  "defenestratie",
  "tondeuse",
  "bladgoud",
  "kurk",
  "preparee",
  "ambtenaar",
  "frietchinees",
  "fotoshoot",
  "kruidvat",
  "teddybeer",
  "tankstation",
  "zebra",
  "post",
  "roulette",
  "draak",
  "oorlog",
  "honing",
  "bom",
  "casino",
  "wolkenkrabber",
  "Saturnus",
  "astronaut",
  "zweep",
  "Antarctica",
  "sneeuwpop",
  "concert",
  "chocolade",
  "vliegtuig",
  "miljonair",
  "dinosaurus",
  "kameleon",
  "trompet",
  "pinguïn",
  "spin",
  "raket",
  "ambassade",
  "pistool",
  "ziekte",
  "spion",
  "prinses",
  "genie",
  "dief",
  "opera",
  "ridder",
  "stadion",
  "limousine",
  "spook",
  "bus",
  "lolly",
  "laser",
  "dood",
  "ziekenhuis",
  "ambulance",
  "inktvis",
  "helikopter",
  "kangoeroe",
  "microscoop",
  "pretpark",
  "superheld",
  "telescoop",
  "parachute",
  "vampier",
  "rotonde",
  "satelliet",
  "engel",
  "robot",
  "eenhoorn",
  "heks",
  "kolonist",
  "duiker",
  "gif",
  "brug",
  "vuur",
  "cobra",
  "walvis",
  "maan",
  "vis",
  "dokter",
  "kerk",
  "pleister",
  "zuster",
  "wind",
  "leeuw",
  "oog",
  "lucht",
  "konijn",
  "bank",
  "gras",
  "jurk",
  "dwerg",
  "bos",
  "auto",
  "handschoen",
  "appel",
  "olie",
  "kok",
  "beer",
  "poes",
  "leven",
  "geluk",
  "reus",
  "spiegel",
  "strand",
  "hotel",
  "water",
  "papier",
  "worm",
  "advocaat",
  "wetenschapper",
  "dans",
  "wortel",
  "ketchup",
  "nacht",
  "katoen",
  "voet",
  "muis",
  "mes",
  "theater",
  "agent",
  "schip",
  "piloot",
  "duim",
  "leraar",
  "fles",
  "dag",
  "koning",
  "glas",
  "kabel",
  "tand",
  "hond",
  "paard",
  "schoen",
  "stoel",
  "kroon",
  "ijs",
  "goud",
  "vork",
  "tijd",
  "fluit",
  "vlam",
  "sneeuw",
  "ivoor",
  "soldaat",
  "piramide",
  "kubus",
  "ster",
  "ring",
  "hoorn",
  "hart",
  "blok",
  "buis",
  "naald",
  "lijn",
  "krijt",
  "bord",
  "box",
  "scherm",
  "stuk",
  "spot",
  "knop",
  "mond",
  "etiket",
  "hand",
  "bed",
  "muur",
  "toren",
  "kaart",
  "bad",
  "diamant",
  "kruis",
  "net",
  "punt",
  "noot",
  "plaat",
  "hol",
  "wijzer",
  "kracht",
  "sleutel",
  "machine",
  "overgang",
  "stroom",
  "hoofd",
  "paal",
  "centrum",
  "ongeluk",
  "schat",
  "slot",
  "code",
  "cirkel",
  "link",
  "pijp",
  "Amsterdam",
  "Nederland",
  "Limburg",
  "Brussel",
  "Egypte",
  "Londen",
  "carnaval",
  "Rotterdam",
  "België",
  "hunebed",
  "Hollywood",
  "Griekenland",
  "Rome",
  "Ardennen",
  "ninja",
  "pool",
  "shoarma",
  "Duitsland",
  "provincie",
  "Amerika",
  "Atlantis",
  "Engeland",
  "loempia",
  "Afrika",
  "tablet",
  "Frankrijk",
  "klomp",
  "polder",
  "euro",
  "voetbal",
  "Zeeland",
  "Berlijn",
  "pizza",
  "dolfijn",
  "Hawaï",
  "motor",
  "laars",
  "caravan",
  "friet",
  "Alpen",
  "seizoen",
  "kamer",
  "blik",
  "vorst",
  "ijzer",
  "zegel",
  "licht",
  "mars",
  "groen",
  "jam",
  "Europa",
  "leiding",
  "wissel",
  "aarde",
  "straal",
  "deksel",
  "citroen",
  "roos",
  "tafel",
  "staart",
  "meter",
  "dijk",
  "batterij",
  "arena",
  "beeld",
  "kostuum",
  "slang",
  "spoor",
  "garen",
  "aandeel",
  "vet",
  "blond",
  "slip",
  "gemeente",
  "slag",
  "proef",
  "club",
  "schaduw",
  "bende",
  "strip",
  "tweeling",
  "band",
  "chip",
  "tocht",
  "duikboot",
  "mijn",
  "vink",
  "vlieg",
  "koud",
  "knikker",
  "spel",
  "haak",
  "knuppel",
  "ketting",
  "scheiding",
  "stapel",
  "bar",
  "bubbel",
  "pond",
  "rond",
  "veld",
  "hemel",
  "bok",
  "veer",
  "zink",
  "fiets",
  "schrift",
  "mat",
  "slee",
  "patroon",
  "grond",
  "rug",
  "stam",
  "munt",
  "graad",
  "kegel",
  "uitzending",
  "eikel",
  "mol",
  "geslacht",
  "tempel",
  "pompoen",
  "ijsbeer",
  "smokkelaar",
  "ham",
  "vlucht",
  "kruik",
  "val",
  "spreuk",
  "boek",
  "raad",
  "bal",
  "pil",
  "elf",
  "bureau",
  "arm",
  "schaal",
  "flits",
  "cel",
  "vulkaan",
  "contract",
  "chinees",
  "baan",
  "dierenarts",
  "haven",
  "golf",
  "nicht",
  "steek",
  "masker",
  "riet",
  "geluid",
  "prijs",
  "schroef",
  "havik",
  "pers",
  "formule",
  "as",
  "kuip",
  "viool",
  "regel",
  "dicht",
  "massa",
  "web",
  "zak",
  "palm",
  "kraan",
  "pasta",
  "taart",
  "gerecht",
  "spijker",
  "model",
  "weegschaal",
  "revolutie",
  "Parijs",
  "gas",
  "single",
  "piano",
  "bestand",
  "bron",
  "podium",
  "aanval",
  "asiel",
  "netwerk",
  "wedstrijd",
  "film",
  "schijf",
  "amazone",
  "ruimte",
  "beurs",
  "staf",
  "shuttle",
  "piraat",
  "kop",
  "stem",
  "gat",
  "kussen",
  "kamp",
  "ton",
  "spa",
  "pad",
  "figuur",
  "gezicht",
  "doos",
  "nagel",
  "pinda",
  "monster",
  "was",
  "recept",
  "toets",
  "tap",
  "school",
  "trommel",
  "kever",
  "kater",
  "tank",
  "koper",
  "schot",
  "hagel",
  "riem",
  "pupil",
  "oranje",
];

function setup(seed) {
  setWords(seed);
  setWhichColors(seed);
  initBoardState(seed);
}

function render(boardState) {
  setCardClasses(boardState, spymaster);
}

function setWords(seed) {
  let shuffledWords;
  if (language.toLowerCase() === "nederlands") {
    shuffledWords = shuffle(wordsNed, seed);
  } else if (language.toLowerCase() === "engels") {
    shuffledWords = shuffle(wordsEng, seed);
  }

  for (i = 0; i < cards.length; i++) {
    cards[i].innerText = shuffledWords[i];
  }
}

function setWhichColors(seed) {
  if (seed % 2 == 0) {
    colors = colors0;
  } else if (seed % 2 != 0) {
    colors = colors1;
  }
}

function initBoardState(seed) {
  let shuffledColors = shuffle(colors, seed);
  for (i = 0; i < cards.length; i++) {
    boardState.cardValue[i] = shuffledColors[i];
  }
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

  if (!male) {
    for (let i = 0; i < cards.length; i++) {
      if ((boardState.cardValue[i] == 4 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 0 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("redDown0", "down");

      } else if ((boardState.cardValue[i] == 5 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 1 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("blueDown0", "down");

      } else if ((boardState.cardValue[i] == 6 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 2 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("whiteDown0", "down");

      } else if ((boardState.cardValue[i] == 7 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 3 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("blackDown0", "down");

      }
    }
  }

  if (male) {
    for (let i = 0; i < cards.length; i++) {
      if ((boardState.cardValue[i] == 4 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 0 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("redDown1", "down");

      } else if ((boardState.cardValue[i] == 5 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 1 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("blueDown1", "down");

      } else if ((boardState.cardValue[i] == 6 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 2 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("whiteDown1", "down");

      } else if ((boardState.cardValue[i] == 7 && !cards[i].classList.contains("down")) || 
      (boardState.cardValue[i] == 3 && boardState.guessedCards[i] == 1)) {
        cards[i].classList.add("blackDown1", "down");

      }
    }
  }
  male = !male
}

document.addEventListener('click', function (click) {
  if (click.target == document.getElementById("spySwitch") && spymaster === false) {
    spymaster = !spymaster
  }
  
  if (click.target.classList.contains("card")) {
    if (boardState.cardValue[click.target.id.substring(4)] == 0) {
      boardState.cardValue[click.target.id.substring(4)] = 4
      boardState.guessedCards[click.target.id.substring(4)] = 1
    } else if (boardState.cardValue[click.target.id.substring(4)] == 1) {
      boardState.cardValue[click.target.id.substring(4)] = 5
      boardState.guessedCards[click.target.id.substring(4)] = 1
    } else if (boardState.cardValue[click.target.id.substring(4)] == 2) {
      boardState.cardValue[click.target.id.substring(4)] = 6
      boardState.guessedCards[click.target.id.substring(4)] = 1
    } else if (boardState.cardValue[click.target.id.substring(4)] == 3) {
      boardState.cardValue[click.target.id.substring(4)] = 7
      boardState.guessedCards[click.target.id.substring(4)] = 1
    }
  }
  render(boardState)  
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

getSeed()
setup(seed);
render(boardState);
