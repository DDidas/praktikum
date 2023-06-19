var cardsFlipped = [];
var matchesFound = 0;
var numPairs = 4;
var numCards;
var board = document.getElementById('game-board');
var imgIndices;
var players = []; // Array für Spieler
var currentPlayer = 0; // Aktueller Spieler
var gameInfo = document.getElementById('game-info');
var isPairMatched = false; // Flag, um zu überprüfen, ob das aufgedeckte Paar übereinstimmt

var configForm = document.getElementById('config-form');
configForm.addEventListener('submit', startGame);

function startGame(event) {
    event.preventDefault();
    numPairs = parseInt(document.getElementById('pairs-input').value);
    var numPlayers = parseInt(document.getElementById('players-input').value);
    numCards = numPairs * 2;
    resetGame();
    createPlayers(numPlayers);
    createBoard();
    displayGameInfo();
}

function resetGame() {
    cardsFlipped = [];
    matchesFound = 0;
    players = [];
    currentPlayer = 0;
    isPairMatched = false;
    board.innerHTML = '';
    gameInfo.innerHTML = '';
}

function createPlayers(numPlayers) {
    var colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'yellow'];
    for (var i = 0; i < numPlayers; i++) {
        players.push({
            name: 'Spieler ' + (i + 1),
            moves: 0,
            pairsFound: 0,
            color: colors[i % colors.length]
        });
    }
}

function createBoard() {
    imgIndices = createShuffledIndices();
    for (var i = 0; i < numCards; i++) {
        var card = createCard(imgIndices[i]);
        card.addEventListener('click', handleCardClick);
        board.appendChild(card);
    }
}

function displayGameInfo() {
    for (var i = 0; i < players.length; i++) {
        var playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');
        playerInfo.innerHTML = '<span class="player-name">' + players[i].name + '</span><span class="moves-counter">Züge: ' + players[i].moves + '</span><span class="pairs-counter">Paare: ' + players[i].pairsFound + '</span>';
        gameInfo.appendChild(playerInfo);
    }
    updateCurrentPlayer();
}

function updateCurrentPlayer() {
    var playerInfos = gameInfo.getElementsByClassName('player-info');
    for (var i = 0; i < playerInfos.length; i++) {
        if (i === currentPlayer) {
            playerInfos[i].classList.add('current-player');
        } else {
            playerInfos[i].classList.remove('current-player');
        }
    }
}

function handleCardClick(e) {
    var currentCard = e.target;
    if (cardsFlipped.length < 2 && !currentCard.classList.contains('flipped')) {
        flipCard(currentCard);
        if (cardsFlipped.length === 2) {
            if (!isPairMatched) {
                players[currentPlayer].moves++; // Zähle den Zug für den aktuellen Spieler
                updateMovesCounter();
                switchPlayer(); // Wechsel zum nächsten Spieler
            }
            checkForMatch();
            if (matchesFound === numPairs) {
                var winner = getWinner();
                var message = '';
                if (winner === -1) {
                    message = 'Unentschieden! Kein Spieler hat gewonnen.';
                } else {
                    message = 'Spieler ' + players[winner].name + ' hat gewonnen mit ' + players[winner].pairsFound + ' Paaren!';
                }
                setTimeout(function() {
                    alert(message);
                }, 500);
            }
        }
    }
}

function flipCard(card) {
    card.classList.add('flipped');
    cardsFlipped.push(card);
}

function checkForMatch() {
    setTimeout(function() {
        var value1 = cardsFlipped[0].dataset.value;
        var value2 = cardsFlipped[1].dataset.value;
        if (value1 === value2) {
            markAsMatched(cardsFlipped[0]);
            markAsMatched(cardsFlipped[1]);
            matchesFound++;
            players[currentPlayer].pairsFound++; // Zähle das aufgedeckte Paar für den aktuellen Spieler
            updatePairsCounter();
            isPairMatched = true; // Das aufgedeckte Paar stimmt überein
        } else {
            unflipCards(cardsFlipped[0], cardsFlipped[1]);
            isPairMatched = false; // Das aufgedeckte Paar stimmt nicht überein
        }
        cardsFlipped = [];
    }, 1000);
}

function markAsMatched(card) {
    var currentPlayerColor = players[currentPlayer].color;
    card.style.border = '2px solid ' + currentPlayerColor;
    card.classList.add('matched');
}

function unflipCards(card1, card2) {
    setTimeout(function() {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }, 1000);
}

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createShuffledIndices() {
    var indices = [];
    for (var i = 0; i < numPairs; i++) {
        indices.push(i, i);
    }
    return shuffleArray(indices);
}

function createCard(value) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.innerHTML = `<img src="https://picsum.photos/90/90?random=${value}"  alt="img"/>`;
    return card;
}

function getWinner() {
    var maxPairsFound = Math.max(...players.map(player => player.pairsFound));
    var winners = players.filter(player => player.pairsFound === maxPairsFound);
    if (winners.length === players.length) {
        return -1; // Unentschieden
    } else {
        var maxMoves = Math.max(...winners.map(player => player.moves));
        return players.findIndex(player => player.pairsFound === maxPairsFound && player.moves === maxMoves);
    }
}

function updateMovesCounter() {
    var movesCounters = gameInfo.getElementsByClassName('moves-counter');
    for (var i = 0; i < movesCounters.length; i++) {
        movesCounters[i].textContent = 'Züge: ' + players[i].moves;
    }
}

function updatePairsCounter() {
    var pairsCounters = gameInfo.getElementsByClassName('pairs-counter');
    for (var i = 0; i < pairsCounters.length; i++) {
        pairsCounters[i].textContent = 'Paare: ' + players[i].pairsFound;
    }
}

function switchPlayer() {
    currentPlayer++;
    if (currentPlayer === players.length) {
        currentPlayer = 0;
    }
    updateCurrentPlayer();
}
