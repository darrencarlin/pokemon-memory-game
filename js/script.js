let cardsArray = [];
let firstGuess = '';
let secondGuess = '';
let count = 0;
let counterTime = 0;
let counterStart = false;
let gameStart = false;
let matches = 0;
let guesses = 0;
let delay = 1000;
let previousTarget = null;
let game = document.getElementById('game');
let grid = document.getElementById('grid');
let difficulty = document.getElementById('difficulty');
var chosenDifficulty = 'Medium';
let easy = false;
let medium = true;
let hard = false;
let master = false;
let easyNum = 6;
let mediumNum = 12;
let hardNum = 24;
let masterNum = 48;


// Leaderboard Table Sorting 

function addListeners() {
    document.getElementById('orderByTime').addEventListener('click', function () {
        displayLeaderboard.orderByTime();
        document.getElementById('orderByTime').classList.add('highlight');
        document.getElementById('orderByGuess').classList.remove('highlight');
        document.getElementById('orderByGuess').classList.remove('highlight');
    });

    document.getElementById('orderByName').addEventListener('click', function () {
        displayLeaderboard.orderByName();
        document.getElementById('orderByName').classList.add('highlight');
        document.getElementById('orderByGuess').classList.remove('highlight');
        document.getElementById('orderByTime').classList.remove('highlight');
    });

    document.getElementById('orderByGuess').addEventListener('click', function () {
        displayLeaderboard.orderByGuesses();
        document.getElementById('orderByGuess').classList.add('highlight');
        document.getElementById('orderByTime').classList.remove('highlight');
        document.getElementById('orderByName').classList.remove('highlight');
    });
}


// Leaderboard Table Sorting End

// Music 

let music = document.getElementById('music');
let matched = document.getElementById('catch')
music.loop = true;
music.play();
document.getElementById('musicOn').classList.add('show');
document.getElementById('musicOff').classList.add('hide');

document.getElementById('guesses').innerHTML = guesses;
document.getElementById('medium').classList.add('mode-selected');

var isPlaying = true;

function togglePlay() {
    if (isPlaying) {
        music.pause();
        document.getElementById('musicOn').classList.add('hide');
        document.getElementById('musicOn').classList.remove('show');
        document.getElementById('musicOff').classList.add('show');
        document.getElementById('musicOff').classList.remove('hide');
    } else {
        music.play();
        document.getElementById('musicOn').classList.add('show');
        document.getElementById('musicOn').classList.remove('hide');
        document.getElementById('musicOff').classList.add('hide');
        document.getElementById('musicOff').classList.remove('show');

    }
};

music.onplaying = function () {
    isPlaying = true;
};
music.onpause = function () {
    isPlaying = false;
};

let musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', function () {
    togglePlay();
});

// Music End

difficulty.addEventListener('click', function () {

    // Reset everything if game is already started

    if (gameStart) {
        counterTime = 0;
        guesses = 0;
        document.getElementById('guesses').innerHTML = guesses;
        document.getElementById('timer').innerHTML = '0:00';
        clearInterval(start);
        counterStart = false;
    }

    game.style.display = 'initial';
    table.style.display = 'none';
    let clicked = event.target.id;
    if (clicked == 'easy') {
        chosenDifficulty = 'Easy';
        populateCardsArray(easyNum);
        easy = true;
        medium = false;
        hard = false;
        master = false;
        document.getElementById('easy').classList.add('mode-selected');
        document.getElementById('medium').classList.remove('mode-selected');
        document.getElementById('hard').classList.remove('mode-selected');
        document.getElementById('master').classList.remove('mode-selected');
    }
    if (clicked == 'medium') {
        chosenDifficulty = 'Medium';
        populateCardsArray(mediumNum);
        easy = false;
        medium = true;
        hard = false;
        master = false;
        document.getElementById('easy').classList.remove('mode-selected');
        document.getElementById('medium').classList.add('mode-selected');
        document.getElementById('hard').classList.remove('mode-selected');
        document.getElementById('master').classList.remove('mode-selected');
    }

    if (clicked == 'hard') {
        chosenDifficulty = 'Hard';
        populateCardsArray(hardNum);
        easy = false;
        medium = false;
        hard = true;
        master = false;
        document.getElementById('easy').classList.remove('mode-selected');
        document.getElementById('medium').classList.remove('mode-selected');
        document.getElementById('hard').classList.add('mode-selected');
        document.getElementById('master').classList.remove('mode-selected');
        let cellArray = Array.from(document.querySelectorAll('.card,.front,.back'));
        cellArray.forEach(function (node) {
            node.classList.add('hard-difficulty');
        });
    }
    if (clicked == 'master') {
        chosenDifficulty = 'Master';
        populateCardsArray(masterNum, true);
        easy = false;
        medium = false;
        hard = false;
        master = true;
        document.getElementById('easy').classList.remove('mode-selected');
        document.getElementById('medium').classList.remove('mode-selected');
        document.getElementById('hard').classList.remove('mode-selected');
        document.getElementById('master').classList.add('mode-selected');
        document.querySelector('.wrapper').style.maxWidth = '1100px';
        let cellArray = Array.from(document.querySelectorAll('.card,.front,.back'));
        cellArray.forEach(function (node) {
            node.classList.add('master-difficulty');
        });
    }

});

grid.addEventListener('click', () => {

    let clicked = event.target;

    gameStart = true

    console.log(clicked);
    if (!counterStart) {
        counterTime = 0;
        guesses = 0;
        start = setInterval(timer, 1000);
        counterStart = true;
    }

    if (clicked.nodeName === 'section' || clicked === previousTarget) {
        return;
    }
    if (clicked.nodeName === 'section') {
        return;
    }
    if (count < 2) {
        count++;
        if (count === 1) {
            firstGuess = clicked.parentNode.dataset.name;
            clicked.closest(".card").classList.add('selected');
        } else {
            secondGuess = clicked.parentNode.dataset.name;
            clicked.closest(".card").classList.add('selected');
            game.style.pointerEvents = "none";
            guesses++
            document.getElementById('guesses').innerHTML = guesses;
        }
        if (firstGuess !== '' && secondGuess !== '') {
            if (firstGuess === secondGuess) {

                setTimeout(match, delay);
                setTimeout(resetGuesses, delay);
            } else {
                setTimeout(resetGuesses, delay);
            }
        }
    }
    previousTarget = clicked;
});

function populateCardsArray(diff = mediumNum, master = false) {
    let prev;
    cardsArray = [];
    for (let i = 0; i < diff; i++) {
        if (master) {
            cardsArray.push({
                name: `${pokemon[i]['name']}`,
                img: `img/${pokemon[i]['name']}.png`
            });
        } else {
            var number = Math.floor((Math.random() * 151) + 0);
            prev == number ? number = 0 : number;
            cardsArray.push({
                name: `${pokemon[number]['name']}`,
                img: `img/${pokemon[number]['name']}.png`
            });
        }
        prev = number;
    }
    let gameGrid = cardsArray.concat(cardsArray);
    gameGrid.sort(() => 0.5 - Math.random());
    populateGrid(gameGrid);
}

function populateGrid(gameGrid) {
    grid.innerHTML = '';
    gameGrid.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;
        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');
        back.style.backgroundImage = `url(${item.img})`;
        grid.appendChild(card);
        card.appendChild(front);
        card.appendChild(back);
    });
}


const match = () => {
    var selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.add('match');
    });
    matches += 2;
    if (matches === (easyNum * 2) && easy ||
        matches === (mediumNum * 2) && medium ||
        matches === (hardNum * 2) && hard ||
        matches === (masterNum * 2) && master) {
        endGame();
    };
};

const resetGuesses = () => {
    game.style.pointerEvents = "initial";
    firstGuess = '';
    secondGuess = '';
    count = 0;
    var selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.remove('selected');
    });
};

const endGame = () => {
    matched.play();
    game.style.display = 'none';
    table.style.display = 'inline-table';
    enterName();
    displayLeaderboard.orderByGuesses();
    clearInterval(start);
    counterStart = false;
};

const enterName = () => {

    let firebaseKey = firebase.database().ref().child('memory-game-5bdeb').push().key;
    let player = prompt('Please enter your name');
    let data = {
        player: player,
        id: firebaseKey,
        time: document.getElementById('timer').innerHTML,
        guesses: guesses,
        difficulty: chosenDifficulty
    }
    let updates = {};
    updates['/' + firebaseKey] = data;
    return firebase.database().ref(`scores/${chosenDifficulty}/`).update(updates);
}

const timer = () => {
    counterTime += 1;
    let hours = Math.floor(counterTime / 3600);
    let minutes = Math.floor((counterTime % 3600) / 60);
    let seconds = counterTime % 60;
    var timerOutput = '';
    if (hours > 0) {
        timerOutput += '' + hours + ':' + (minutes < 10 ? '0' : '');
    }
    timerOutput += '' + minutes + ':' + (seconds < 10 ? '0' : '');
    timerOutput += '' + seconds;
    document.getElementById('timer').innerHTML = timerOutput;
}

let displayLeaderboard = {
    orderByEasy: function () {
        let data = firebase.database().ref('/scores/' + chosenDifficulty);
        data.orderByChild('Easy').on("value", function (snapshot) {
            if (snapshot.val() === null) {
                displayLeaderboard.display('No one has completed the game on this mode yet')
            } else {
                displayLeaderboard.display(snapshot);
            }
        })
    },

    orderByName: function () {
        let data = firebase.database().ref('/scores/' + chosenDifficulty);
        data.orderByChild('player').on("value", function (snapshot) {
            if (snapshot.val() === null) {
                displayLeaderboard.display('No one has completed the game on this mode yet')
            } else {
                displayLeaderboard.display(snapshot);
            }
        });
    },

    orderByTime: function () {
        let data = firebase.database().ref('/scores/' + chosenDifficulty);
        data.orderByChild('time').on("value", function (snapshot) {
            if (snapshot.val() === null) {
                displayLeaderboard.display('No one has completed the game on this mode yet')
            } else {
                displayLeaderboard.display(snapshot);
            }
        })
    },

    orderByGuesses: function () {
        let data = firebase.database().ref('/scores/' + chosenDifficulty).limitToLast(10);
        data.orderByChild('guesses').on("value", function (snapshot) {
            if (snapshot.val() === null) {
                displayLeaderboard.display('No one has completed the game on this mode yet')
            } else {
                displayLeaderboard.display(snapshot);
            }
        })
    },

    display: function (data) {
        let table = document.getElementById('table');
        table.innerHTML = ` 
                        <tr>
                            <th >Rank</th>
                            <th id='orderByName'>Player</th>
                            <th id='orderByTime'>Time</th>
                            <th id='orderByGuess'>Guesses</th>
                        </tr>`;
        if (typeof data === 'string') {
            table.innerHTML = `<tr><td>No scores recorded for this mode</td></tr>`;
        } else {
            let i = 0
            data.forEach(function (data) {
                table.innerHTML += `
                        <tr>
                            <td>${i += 1}</td>
                            <td>${data.val().player}</td>
                            <td>${data.val().time}</td>
                            <td>${data.val().guesses}</td>
                        </tr>`;
            });
        };
        addListeners();
    }
};

populateCardsArray();