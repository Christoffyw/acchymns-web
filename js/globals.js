const songView = document.getElementById('songview');
const searchContent = document.getElementById('content');
const backButton = document.getElementById('backButton');
const notesButton = document.getElementById('notesButton');
const bookmarkButton = document.getElementById('bookmarkButton');
const bookmarkIcon = document.getElementById('bookmarkIcon');
const songViewTitle = document.getElementById('titlenumber');
const songViewImage = document.getElementById('songimage');
const bookmarksList = document.getElementById('bookmarksList');

function pad(n, length) {
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var storage = window.localStorage;
var scrollPos = null;

var currentSongNumber = 0;
var currentSongBookShort = "";
var currentSongTitle = "";
let currentBookmarks = JSON.parse(storage.getItem("bookmarks"));

const displayCharacters = (characters) => {
    if(characters == null)
        return;
    const htmlString = characters
        .map((character) => {
            return `
            <a onclick="loadSong(${character.number}, '${character.bookShort}')">
                <div class="${getClassFromBook(character.bookShort)}">
                    <div class="book-gospelhymns--left">
                        <div class="song__title">${character.title}</div>
                        <div class="book__title">${character.book}</div>
                    </div>
                    <div class="booktext--right">
                        <div class="song__number">#${character.number}</div>
                        <ion-icon name="ellipsis-vertical"></ion-icon>
                    </div>
                </div>
            </a>
            `;
        })
        .join('');
        if(bookmarksList == null)
            return;
        console.log(htmlString);
        bookmarksList.innerHTML = htmlString;
};

function ToggleSongInverted(element){
    console.log(element.checked);
    storage.setItem("songInverted", element.checked);
}

var isPlaying = false;

function createNoteTable() {
    let noteFreq = [];
    for (let i=0; i< 9; i++) {
      noteFreq[i] = [];
    }
  
    noteFreq[0]["A"] = 27.500000000000000;
    noteFreq[0]["A#"] = 29.135235094880619;
    noteFreq[0]["B"] = 30.867706328507756;
  
    noteFreq[1]["C"] = 32.703195662574829;
    noteFreq[1]["C#"] = 34.647828872109012;
    noteFreq[1]["D"] = 36.708095989675945;
    noteFreq[1]["D#"] = 38.890872965260113;
    noteFreq[1]["E"] = 41.203444614108741;
    noteFreq[1]["F"] = 43.653528929125485;
    noteFreq[1]["F#"] = 46.249302838954299;
    noteFreq[1]["G"] = 48.999429497718661;
    noteFreq[1]["G#"] = 51.913087197493142;
    noteFreq[1]["A"] = 55.000000000000000;
    noteFreq[1]["A#"] = 58.270470189761239;
    noteFreq[1]["B"] = 61.735412657015513;
  
    noteFreq[2]["C"] = 65.406391325149658;
    noteFreq[2]["C#"] = 69.295657744218024;
    noteFreq[2]["D"] = 73.416191979351890;
    noteFreq[2]["D#"] = 77.781745930520227;
    noteFreq[2]["E"] = 82.406889228217482;
    noteFreq[2]["F"] = 87.307057858250971;
    noteFreq[2]["F#"] = 92.498605677908599;
    noteFreq[2]["G"] = 97.998858995437323;
    noteFreq[2]["G#"] = 103.826174394986284;
    noteFreq[2]["A"] = 110.000000000000000;
    noteFreq[2]["A#"] = 116.540940379522479;
    noteFreq[2]["B"] = 123.470825314031027;
  
    noteFreq[3]["C"] = 130.812782650299317;
    noteFreq[3]["C#"] = 138.591315488436048;
    noteFreq[3]["D"] = 146.832383958703780;
    noteFreq[3]["D#"] = 155.563491861040455;
    noteFreq[3]["E"] = 164.813778456434964;
    noteFreq[3]["F"] = 174.614115716501942;
    noteFreq[3]["F#"] = 184.997211355817199;
    noteFreq[3]["G"] = 195.997717990874647;
    noteFreq[3]["G#"] = 207.652348789972569;
    noteFreq[3]["A"] = 220.000000000000000;
    noteFreq[3]["A#"] = 233.081880759044958;
    noteFreq[3]["B"] = 246.941650628062055;
  
    noteFreq[4]["C"] = 261.625565300598634;
    noteFreq[4]["C#"] = 277.182630976872096;
    noteFreq[4]["D"] = 293.664767917407560;
    noteFreq[4]["D#"] = 311.126983722080910;
    noteFreq[4]["E"] = 329.627556912869929;
    noteFreq[4]["F"] = 349.228231433003884;
    noteFreq[4]["F#"] = 369.994422711634398;
    noteFreq[4]["G"] = 391.995435981749294;
    noteFreq[4]["G#"] = 415.304697579945138;
    noteFreq[4]["A"] = 440.000000000000000;
    noteFreq[4]["A#"] = 466.163761518089916;
    noteFreq[4]["B"] = 493.883301256124111;
  
    noteFreq[5]["C"] = 523.251130601197269;
    noteFreq[5]["C#"] = 554.365261953744192;
    noteFreq[5]["D"] = 587.329535834815120;
    noteFreq[5]["D#"] = 622.253967444161821;
    noteFreq[5]["E"] = 659.255113825739859;
    noteFreq[5]["F"] = 698.456462866007768;
    noteFreq[5]["F#"] = 739.988845423268797;
    noteFreq[5]["G"] = 783.990871963498588;
    noteFreq[5]["G#"] = 830.609395159890277;
    noteFreq[5]["A"] = 880.000000000000000;
    noteFreq[5]["A#"] = 932.327523036179832;
    noteFreq[5]["B"] = 987.766602512248223;
  
    noteFreq[6]["C"] = 1046.502261202394538;
    noteFreq[6]["C#"] = 1108.730523907488384;
    noteFreq[6]["D"] = 1174.659071669630241;
    noteFreq[6]["D#"] = 1244.507934888323642;
    noteFreq[6]["E"] = 1318.510227651479718;
    noteFreq[6]["F"] = 1396.912925732015537;
    noteFreq[6]["F#"] = 1479.977690846537595;
    noteFreq[6]["G"] = 1567.981743926997176;
    noteFreq[6]["G#"] = 1661.218790319780554;
    noteFreq[6]["A"] = 1760.000000000000000;
    noteFreq[6]["A#"] = 1864.655046072359665;
    noteFreq[6]["B"] = 1975.533205024496447;
  
    noteFreq[7]["C"] = 2093.004522404789077;
    noteFreq[7]["C#"] = 2217.461047814976769;
    noteFreq[7]["D"] = 2349.318143339260482;
    noteFreq[7]["D#"] = 2489.015869776647285;
    noteFreq[7]["E"] = 2637.020455302959437;
    noteFreq[7]["F"] = 2793.825851464031075;
    noteFreq[7]["F#"] = 2959.955381693075191;
    noteFreq[7]["G"] = 3135.963487853994352;
    noteFreq[7]["G#"] = 3322.437580639561108;
    noteFreq[7]["A"] = 3520.000000000000000;
    noteFreq[7]["A#"] = 3729.310092144719331;
    noteFreq[7]["B"] = 3951.066410048992894;
  
    noteFreq[8]["C"] = 4186.009044809578154;
    return noteFreq;
  }

let notes = createNoteTable();

function playNote(frequency, duration, nextNotes) {
    var volume = audioCtx.createGain();
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    volume.gain.value = 0.1;
    volume.gain.setValueAtTime(0, audioCtx.currentTime);
    volume.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.015);
    oscillator.start();

    setTimeout(
        function() {
            volume.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
            setTimeout(function() {
                oscillator.stop();
                playStartingNotes(nextNotes);
                isPlaying = false;
            }, 50);
    }, duration);
}

function playStartingNotes(startingNotes) {
    isPlaying = true;
    var currentNote = startingNotes.shift();
    playNote(currentNote[0], currentNote[1], startingNotes);
}

if(notesButton)
notesButton.addEventListener('click', () => {
    if(!isPlaying)
        playStartingNotes([
            [notes[3]["F"], 400],
            [notes[4]["C"], 400],
            [notes[4]["F"], 1600]
        ]);
});

backButton.addEventListener('click', () => {
    searchContent.classList.remove('hidden');
    songView.classList.add('hidden');
    if(bookmarksList != null) {
        loadBookmarkCharacters();
    }
    if(scrollPos != null) {
        window.scrollTo(0, scrollPos);
    }
});

displayCharacters(currentBookmarks);

function getClassFromBook(bookShort) {
    switch(bookShort) {
        case "ZH":
            return "book-zionsharp";
        case "GH":
            return "book-gospelhymns";
        case "HG":
            return "book-higherground";
        case "JH":
            return "book-juniorhymnal";
    }
}

function getFullBook(bookShort) {
    switch(bookShort) {
        case "ZH":
            return "Zion's Harp";
        case "GH":
            return "Gospel Hymns";
        case "HG":
            return "Higher Ground";
        case "JH":
            return "Junior Hymnal";
    }
}

function getIsBookmarked(number, book) {
    if(currentBookmarks == null)
        return;
    for(var i = 0; i < currentBookmarks.length; i++) {
        if(currentBookmarks[i].number == currentSongNumber) {
            if(currentBookmarks[i].bookShort == currentSongBookShort) {
                return true;
            }
        }
    }
    return false;
}

bookmarkButton.addEventListener('click', () => {
    if(currentBookmarks == null) {
        currentBookmarks = [];
    }
    var isBookmarked = getIsBookmarked(currentSongNumber, currentSongBookShort);
    if(isBookmarked) {
        for(var i = 0; i < currentBookmarks.length; i++) {
            console.log(currentBookmarks[i]);
            if(currentBookmarks[i].number == currentSongNumber) {
                if(currentBookmarks[i].bookShort == currentSongBookShort) {
                    console.log(i);
                    currentBookmarks.splice(i, 1);
                    bookmarkIcon.setAttribute('name', "bookmark-outline");
                }
            }
        }
    }
    else {
        currentBookmarks.push(
            {"number": currentSongNumber, "bookShort": currentSongBookShort, "title": currentSongTitle, "book": getFullBook(currentSongBookShort), "filename": `${pad(currentSongNumber, 3)}.png`}
        );
        bookmarkIcon.setAttribute('name', "bookmark");
    }
    storage.setItem("bookmarks", JSON.stringify(currentBookmarks));
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    if(newColorScheme == "dark")
        songViewImage.style.filter = "invert(92%)";
    else
        songViewImage.style.filter = "invert(0%)";
});

function loadSong(input, songBook) {
    scrollPos = window.scrollY;
    window.scrollTo(0,0);
    searchContent.classList.add('hidden');
    songView.classList.remove('hidden');
    songViewTitle.innerHTML = "";
    const textNode = document.createTextNode(`#${input}`);
    songViewTitle.appendChild(textNode);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if(storage.getItem("songInverted") == "true") {
            console.log("should be inverted");
            songViewImage.style.filter = "invert(92%)";
        }
    }

    const songArray = getSongData();

    for(var i = 0; i < songArray.length; i++) {
        if(songArray[i].number == input && songArray[i].bookShort == songBook) {
            songViewImage.setAttribute('src', `./songs/${songArray[i].bookShort}/${songArray[i].filename}`);
            currentSongNumber = songArray[i].number;
            currentSongBookShort = songArray[i].bookShort;
            currentSongTitle = songArray[i].title;
        }
        else
            continue;
    }
    var isBookmarked = getIsBookmarked(currentSongNumber, currentSongBookShort);
    if(isBookmarked) {
        bookmarkIcon.setAttribute('name', "bookmark");
    }
    else {
        bookmarkIcon.setAttribute('name', "bookmark-outline");
    }
}