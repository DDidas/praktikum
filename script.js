var cardsFlipped = []; // Array zum Speichern der umgedrehten Karten
var matchesFound = 0; // Anzahl der gefundenen Paare
var numPairs = 4; // Anzahl der Paare (Standardwert: 4)
var numCards; // Gesamtanzahl der Karten
var board = document.getElementById('game-board'); // Spielbrett-Element
var imgIndices; // Array zum Speichern der Indizes der Bilder
var players = []; // Array für Spieler
var currentPlayer = 0; // Aktueller Spieler
var gameInfo = document.getElementById('game-info'); // Spielinfo-Element
var isPairMatched = false; // Flag, um zu überprüfen, ob das aufgedeckte Paar übereinstimmt

var configForm = document.getElementById('config-form'); // Konfigurationsformular
configForm.addEventListener('submit', startGame); // Eventlistener für das Formular

// Funktion zum Starten des Spiels
function startGame(event) {
    document.getElementById('game-board').style.visibility = "visible"; // Sichtbarkeit des Spielbretts setzen
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenneuladung)
    numPairs = parseInt(document.getElementById('pairs-input').value); // Anzahl der Paare aus dem Formular lesen und parsen
    var numPlayers = parseInt(document.getElementById('players-input').value); // Anzahl der Spieler aus dem Formular lesen und parsen
    numCards = numPairs * 2; // Gesamtanzahl der Karten berechnen
    resetGame(); // Spiel zurücksetzen
    var colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'yellow', 'brown', 'magenta', 'teal', 'olive', 'maroon', 'navy', 'aqua']; // Farben für die Spieler
    createPlayers(numPlayers, colors); // Spieler erstellen
    createBoard(); // Spielbrett erstellen
    displayGameInfo(colors); // Spielinfo anzeigen
}

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
    cardsFlipped = []; // Array für umgedrehte Karten leeren
    matchesFound = 0; // Anzahl der gefundenen Paare zurücksetzen
    players = []; // Spieler-Array leeren
    currentPlayer = 0; // Aktuellen Spieler zurücksetzen
    isPairMatched = false; // Flag für übereinstimmendes Paar zurücksetzen
    board.innerHTML = ''; // Spielbrett leeren
    gameInfo.innerHTML = ''; // Spielinfo leeren
}

// Funktion zum Erstellen der Spieler
function createPlayers(numPlayers, colors) {
    for (var i = 0; i < numPlayers; i++) {
        players.push({
            name: 'Spieler ' + (i + 1),
            moves: 0,
            pairsFound: 0,
            color: colors[i % colors.length]
        });
    }
}

// Funktion zum Erstellen des Spielbretts
function createBoard() {
    imgIndices = createShuffledIndices(); // Zufällige Indizes für die Bilder erstellen
    for (var i = 0; i < numCards; i++) {
        var card = createCard(imgIndices[i]); // Karte erstellen
        card.addEventListener('click', handleCardClick); // Eventlistener für Klick auf die Karte hinzufügen
        board.appendChild(card); // Karte dem Spielbrett hinzufügen
    }
}

// Funktion zum Anzeigen der Spielinformationen
function displayGameInfo() {
    for (var i = 0; i < players.length; i++) {
        var playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');
        playerInfo.innerHTML = `<span class="player-name" style="color: ${players[i].color}">${players[i].name}</span><span class="moves-counter">Züge: ${players[i].moves}</span><span class="pairs-counter">Paare: ${players[i].pairsFound}</span>`;
        gameInfo.appendChild(playerInfo);
    }
    updateCurrentPlayer();
}

// Funktion zum Aktualisieren des aktuellen Spielers
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

// Funktion zum Behandeln des Klicks auf eine Karte
function handleCardClick(e) {
    var currentCard = e.target;
    if (cardsFlipped.length < 2 && !currentCard.classList.contains('flipped')) {
        flipCard(currentCard);
        if (cardsFlipped.length === 2) {
            players[currentPlayer].moves++; // Zug für aktuellen Spieler zählen
            updateMovesCounter();
            if (!isPairMatched) {
                switchPlayer(); // Zum nächsten Spieler wechseln
            }
            checkForMatch();
        }
    }
    checkIfGameOver();
}

// Funktion zum Überprüfen, ob das Spiel beendet ist
function checkIfGameOver() {
    if (matchesFound === numPairs) {
        setTimeout(function() {
            var winner = getWinner(); // Gewinner ermitteln
            var message = '';
            if (winner === -1) {
                message = 'Unentschieden! Kein Spieler hat gewonnen.';
            } else {
                message = 'Spieler ' + players[winner].name + ' hat gewonnen mit ' + players[winner].pairsFound + ' Paaren in ' + players[winner].moves + ' Zügen!';
            }
            alert(message);
        }, 1000);
    }
}

// Funktion zum Umdrehen einer Karte
function flipCard(card) {
    card.classList.add('flipped');
    cardsFlipped.push(card);
}

// Funktion zum Überprüfen auf ein Paar
function checkForMatch() {
    setTimeout(function() {
        var value1 = cardsFlipped[0].dataset.value;
        var value2 = cardsFlipped[1].dataset.value;
        if (value1 === value2) {
            markAsMatched(cardsFlipped[0]);
            markAsMatched(cardsFlipped[1]);
            matchesFound++;
            players[currentPlayer].pairsFound++; // Aufgedecktes Paar für aktuellen Spieler zählen
            updatePairsCounter();
            isPairMatched = true; // Aufgedecktes Paar stimmt überein
        } else {
            unflipCards(cardsFlipped[0], cardsFlipped[1]);
            isPairMatched = false; // Aufgedecktes Paar stimmt nicht überein
        }
        cardsFlipped = [];
        checkIfGameOver(); // Überprüfen, ob das Spiel beendet ist
    }, 1000);
}

// Funktion zum Markieren einer Karte als gefunden
function markAsMatched(card) {
    var currentPlayerColor = players[currentPlayer].color;
    card.style.border = '2px solid ' + currentPlayerColor;
    card.classList.add('matched');
}

// Funktion zum Zurückdrehen von Karten
function unflipCards(card1, card2) {
    setTimeout(function() {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }, 1000);
}

// Funktion zum Mischen eines Arrays
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

// Funktion zum Erstellen von zufälligen Indizes für die Bilder
function createShuffledIndices() {
    var indices = [];
    for (var i = 0; i < numPairs; i++) {
        indices.push(i, i);
    }
    return shuffleArray(indices);
}

// Funktion zum Erstellen einer Karte
function createCard(value) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.innerHTML = `<img src="https://picsum.photos/90/90?random=${value}"  alt="img"/>`;
    return card;
}

// Funktion zum Ermitteln des Gewinners
function getWinner() {
    var maxPairsFound = Math.max(...players.map(player => player.pairsFound));
    var playersWithMaxPairs = players.filter(player => player.pairsFound === maxPairsFound);
    if (playersWithMaxPairs.length === 1) {
        return players.indexOf(playersWithMaxPairs[0]); // Wenn nur ein Spieler die höchste Anzahl an Paaren gefunden hat, ist er der Gewinner.
    } else {
        // Bei mehreren Spielern mit der gleichen Anzahl an gefundenen Paaren gewinnt der Spieler mit den wenigsten Zügen.
        var minMoves = Math.min(...playersWithMaxPairs.map(player => player.moves));
        var playerWithMinMoves = playersWithMaxPairs.find(player => player.moves === minMoves);
        return players.indexOf(playerWithMinMoves);
    }
}

// Funktion zum Aktualisieren des Zug-Zählers
function updateMovesCounter() {
    var movesCounters = gameInfo.getElementsByClassName('moves-counter');
    for (var i = 0; i < movesCounters.length; i++) {
        movesCounters[i].textContent = 'Züge: ' + players[i].moves;
    }
}

// Funktion zum Aktualisieren des Paar-Zählers
function updatePairsCounter() {
    var pairsCounters = gameInfo.getElementsByClassName('pairs-counter');
    for (var i = 0; i < pairsCounters.length; i++) {
        pairsCounters[i].textContent = 'Paare: ' + players[i].pairsFound;
    }
}

// Funktion zum Wechseln des aktuellen Spielers
function switchPlayer() {
    currentPlayer++;
    if (currentPlayer === players.length) {
        currentPlayer = 0;
    }
    updateCurrentPlayer();
}
