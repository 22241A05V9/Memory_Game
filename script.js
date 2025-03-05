
const cardsArray = ['😊', '😊', '😜', '😜', '😂', '😂', '🤔', '🤔', '😆', '😆', '😍', '😍', '😉', '😉', '😎', '😎'];
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let lockBoard = false;
let timer;
let startTime;
let playerTimes = JSON.parse(localStorage.getItem('playerTimes')) || [];
let playerName;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const grid = document.getElementById('grid');
  grid.innerHTML = ''; // Clear the grid before creating a new board
  shuffleArray(cardsArray);
  for (let i = 0; i < cardsArray.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-id', i);
    
    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = cardsArray[i]; // Emoji for the front side of the card
    
    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = ' '; // Empty content for the back side of the card
    
    card.appendChild(front);
    card.appendChild(back);
    
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  }
  startTimer();
}

function startTimer() {
  startTime = new Date().getTime();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const formattedTime = `${minutes}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
  document.getElementById('timer').textContent = formattedTime;
}

function endTimer() {
  clearInterval(timer);
  const elapsedTime = (new Date().getTime() - startTime) / 1000;
  playerTimes.push({ name: playerName, time: elapsedTime });
  playerTimes.sort((a, b) => a.time - b.time);
  if (playerTimes.length > 5) playerTimes.pop(); // Keep only top 5 players
  localStorage.setItem('playerTimes', JSON.stringify(playerTimes));
  updateBestTimes();
}

function updateBestTimes() {
  const bestTimesList = document.getElementById('best-times');
  bestTimesList.innerHTML = '';
  playerTimes.forEach(player => {
    const listItem = document.createElement('li');
    listItem.textContent = `${player.name}: ${formatTime(player.time)}`;
    bestTimesList.appendChild(listItem);
  });
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function flipCard() {
  if (lockBoard) return; // Prevent flipping more than 2 cards at once
  const cardId = this.getAttribute('data-id');
  
  if (!cardsChosenId.includes(cardId) && cardsChosen.length < 2) {
    this.classList.add('flipped');
    cardsChosen.push(cardsArray[cardId]);
    cardsChosenId.push(cardId);
    
    if (cardsChosen.length === 2) {
      lockBoard = true;
      setTimeout(checkForMatch, 1000);
    }
  }
}

function checkForMatch() {
  const cards = document.querySelectorAll('.card');
  const optionOneId = cardsChosenId[0];
  const optionTwoId = cardsChosenId[1];

  if (cardsChosen[0] === cardsChosen[1] && optionOneId !== optionTwoId) {
    cards[optionOneId].classList.add('matched');
    cards[optionTwoId].classList.add('matched');
    cardsWon.push(cardsChosen);
  } else {
    cards[optionOneId].classList.remove('flipped');
    cards[optionTwoId].classList.remove('flipped');
  }

  cardsChosen = [];
  cardsChosenId = [];
  lockBoard = false;

  if (cardsWon.length === cardsArray.length / 2) {
    endTimer();
    alert('Congratulations! You found all the matches!');
  }
}

function resetGame() {
  clearInterval(timer);
  document.getElementById('timer').textContent = '0:00';
  cardsChosen = [];
  cardsChosenId = [];
  cardsWon = [];
  lockBoard = false;
  createBoard();
}

document.addEventListener('DOMContentLoaded', () => {
  playerName = prompt('Enter your name:');
  updateBestTimes();
  createBoard();
  document.getElementById('reset-button').addEventListener('click', resetGame);
});
