var cardsFlipped = [];
var matchesFound = 0;
var numCards = 16;
var board = document.getElementById('game-board');
var imgIndices = createShuffledIndices();

for (var i = 0; i < numCards; i++) {
    var card = createCard(imgIndices[i]);
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
}

function createShuffledIndices() {
    var indices = [];
    for (var i = 0; i < numCards / 2; i++) {
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

function handleCardClick(e) {
    var currentCard = e.target;
    if (cardsFlipped.length < 2 && !currentCard.classList.contains('flipped')) {
        flipCard(currentCard);
        if (cardsFlipped.length === 2) {
            checkForMatch();
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
            if (matchesFound === numCards / 2) {
                alert('Du hast gewonnen!');
            }
        } else {
            unflipCards(cardsFlipped[0], cardsFlipped[1]);
        }
        cardsFlipped = [];
    }, 1000);
}

function markAsMatched(card) {
    card.classList.add('matched');
}

function unflipCards(card1, card2) {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
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
