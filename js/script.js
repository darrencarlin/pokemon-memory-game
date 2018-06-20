let cardsArray = [];
let firstGuess = '';
let secondGuess = '';
let count = 0;
let counterTime = 0;
let matches = 0;
let guesses = 0;
let delay = 1000;
let previousTarget = null;
let gameOver = false;
let grid = document.getElementById('grid');
let difficulty = document.getElementById('difficulty');
let chosenDifficulty;
let easy = false;
let medium = true;
let hard = false;
let master = false;
let easyNum = 6;
let mediumNum = 12;
let hardNum = 24;
let masterNum = 48;
document.getElementById('guesses').innerHTML = guesses;
document.getElementById('medium').style.backgroundColor = '#ffcb05';

difficulty.addEventListener('click', () => {
    let clicked = event.target.id;
    if (clicked == 'easy') {
        populateCardsArray(easyNum)
        chosenDifficulty = 'Easy';
        easy = true;
        medium = false;
        hard = false;
        master = false;
        document.getElementById('easy').style.backgroundColor = '#ffcb05';
        document.getElementById('medium').style.backgroundColor = 'initial';
        document.getElementById('hard').style.backgroundColor = 'initial';
        document.getElementById('master').style.backgroundColor = 'initial';
    }
    if (clicked == 'medium') {
        populateCardsArray(mediumNum)
        chosenDifficulty = 'Medium';
        easy = false;
        medium = true;
        hard = false;
        master = false;
        document.getElementById('easy').style.backgroundColor = 'initial';
        document.getElementById('medium').style.backgroundColor = '#ffcb05';
        document.getElementById('hard').style.backgroundColor = 'initial';
        document.getElementById('master').style.backgroundColor = 'initial';

    }

    if (clicked == 'hard') {
        populateCardsArray(hardNum)
        chosenDifficulty = 'Hard';
        easy = false;
        medium = false;
        hard = true;
        master = false;
        document.getElementById('easy').style.backgroundColor = 'initial';
        document.getElementById('medium').style.backgroundColor = 'initial';
        document.getElementById('hard').style.backgroundColor = '#ffcb05';
        document.getElementById('master').style.backgroundColor = 'initial';
        let cellArray = Array.from(document.querySelectorAll('.card,.front,.back'));
        cellArray.forEach(function (node, idx) {
            node.classList.add('hard-difficulty');
        });
    }
    if (clicked == 'master') {
        populateCardsArray(masterNum, true)
        chosenDifficulty = 'Master';
        easy = false;
        medium = false;
        hard = false;
        master = true;
        document.getElementById('easy').style.backgroundColor = 'initial';
        document.getElementById('medium').style.backgroundColor = 'initial';
        document.getElementById('hard').style.backgroundColor = 'initial';
        document.getElementById('master').style.backgroundColor = '#ffcb05';
        document.querySelector('.wrapper').style.maxWidth = '1100px';
        let cellArray = Array.from(document.querySelectorAll('.card,.front,.back'));
        cellArray.forEach(function (node, idx) {
            node.classList.add('master-difficulty');
        });
    }
})

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

grid.addEventListener('click', () => {
    let clicked = event.target;
    if (counterTime === 0) {
        start = setInterval(timer, 1000);
    }
    if (clicked.className === 'front') {
        guesses++
        document.getElementById('guesses').innerHTML = guesses;
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
            clicked.parentNode.classList.add('selected');
        } else {
            secondGuess = clicked.parentNode.dataset.name;
            clicked.parentNode.classList.add('selected');
            game.style.pointerEvents = "none";
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
})

const match = () => {
    var selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.add('match');
    });
    matches += 2;
    if (matches === (easyNum * 2) && easy || matches === (mediumNum * 2) && medium || matches === (hardNum * 2) && hard || matches === (masterNum * 2) && master) {
        endGame();
    }
}

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

    gameOver = true;
    clearInterval(start);
    counterTime = false;
    let firebaseKey = firebase.database().ref().child("memory-game-99133").push().key;
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
    return firebase.database().ref().update(updates);


}

const timer = () => {
    counterTime++
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

populateCardsArray();