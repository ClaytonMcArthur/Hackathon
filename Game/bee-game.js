// Game State
let money = 100;
let day = 1;
const maxDays = 10;
let garden = []; // array of flowers planted
let pots = [true, false, false]; // first pot unlocked by default

// Flowers for sale
const flowers = [
  { name: 'Goldenrod', price: 10, bees: 5, image: '../Game/sprites/Goldenrod.png' },
  { name: 'Borage', price: 20, bees: 10, image: '../Game/sprites/Borage.png' },
  { name: 'Sunflower', price: 30, bees: 15, image: '../Game/sprites/Sunflower.png' },
  { name: 'Beebalm', price: 30, bees: 15, image: '../Game/sprites/Beebalm.png' },
  { name: 'Hyacinth', price: 30, bees: 15, image: '../Game/sprites/Hyacinth.png' },
  { name: 'Snapdragon', price: 30, bees: 15, image: '../Game/sprites/Snapdragon.png' }
];

// Seed packets
const seeds = [
  { name: 'SeedsGoldenrod', flower: 'Goldenrod', image: '../Game/sprites/SeedsGoldenrod.png' },
  { name: 'SeedsBorage', flower: 'Borage', image: '../Game/sprites/SeedsBorage.png' },
  { name: 'SeedsSunflower', flower: 'Sunflower', image: '../Game/sprites/SeedsSunflower.png' },
  { name: 'SeedsBeebalm', flower: 'Beebalm', image: '../Game/sprites/SeedsBeebalm.png' },
  { name: 'SeedsHyacinth', flower: 'Hyacinth', image: '../Game/sprites/SeedsHyacinth.png' },
  { name: 'SeedsSnapdragon', flower: 'Snapdragon', image: '../Game/sprites/SeedsSnapdragon.png' }
];

const potItem = { name: 'EmptyPot', price: 50, image: '../Game/sprites/LiterallyJustAPot.png' };

// DOM Elements
const moneySpan = document.getElementById('money');
const daySpan = document.getElementById('day');
const shopItemsDiv = document.getElementById('shop-items');
const shopPotDiv = document.getElementById('shop-pot');
const gardenArea = document.getElementById('garden-area');
const endDayButton = document.getElementById('end-day-button');
const scoreboard = document.getElementById('scoreboard');
const scoreMoney = document.getElementById('score-money');
const scoreBees = document.getElementById('score-bees');
const scoreFlowers = document.getElementById('score-flowers');
const scoreStars = document.getElementById('score-stars');
const scoreBest = document.getElementById('score-best');
const restartButton = document.getElementById('restart-button');
const gameStartButton = document.getElementById('game-start-button');
const gameStartOverlay = document.getElementById('game-start-overlay');
const plantDisplay = document.getElementById('plant-display');
const plantImgs = plantDisplay.querySelectorAll('img');

// Setup shop seeds
seeds.forEach(seed => {
  const seedImg = document.createElement('img');
  seedImg.src = seed.image;
  seedImg.alt = seed.name;
  seedImg.classList.add('seed-packet');
  seedImg.setAttribute('draggable', true);
  shopItemsDiv.appendChild(seedImg);

  seedImg.addEventListener('dragstart', function (e) {
    e.dataTransfer.setData('text/plain', seed.flower);
  });
});

// Setup buy pot
const potImg = document.createElement('img');
potImg.src = potItem.image;
potImg.alt = potItem.name;
potImg.classList.add('buyable-pot');
potImg.setAttribute('draggable', true);
shopPotDiv.appendChild(potImg);

potImg.addEventListener('dragstart', function (e) {
  e.dataTransfer.setData('text/plain', 'BUY_POT');
});

// Dragging into garden
gardenArea.addEventListener('dragover', function (e) {
  e.preventDefault();
  gardenArea.classList.add('drag-over');
});
gardenArea.addEventListener('dragleave', function (e) {
  gardenArea.classList.remove('drag-over');
});
gardenArea.addEventListener('drop', function (e) {
  e.preventDefault();
  gardenArea.classList.remove('drag-over');

  const droppedData = e.dataTransfer.getData('text/plain');

  if (droppedData === 'BUY_POT') {
    buyPot();
  } else {
    const flower = flowers.find(f => f.name === droppedData);
    if (flower) {
      buyFlower(flower);
    }
  }
});

// Buy a flower into available pot
function buyFlower(flower) {
  if (money >= flower.price) {
    const potIndex = garden.length;
    if (potIndex >= pots.length || !pots[potIndex]) {
      alert('You need to buy a pot first!');
      return;
    }
    money -= flower.price;
    garden.push(flower);
    updateUI();
  } else {
    alert('Not enough money!');
  }
}

// Buy new pot
function buyPot() {
  if (money >= potItem.price) {
    const nextLockedIndex = pots.findIndex(unlocked => !unlocked);
    if (nextLockedIndex !== -1) {
      money -= potItem.price;
      pots[nextLockedIndex] = true;
      updateUI();
    } else {
      alert('All pots already unlocked!');
    }
  } else {
    alert('Not enough money to buy a pot!');
  }
}

// Update UI
function updateUI() {
  moneySpan.textContent = `Money: $${money}`;
  daySpan.textContent = `Day: ${day}/${maxDays}`;

  // Update each pot image
  plantImgs.forEach((img, index) => {
    if (garden[index]) {
      img.src = garden[index].image;
      img.alt = garden[index].name;
    } else if (pots[index]) {
      img.src = '../Game/sprites/LiterallyJustAPot.png';
      img.alt = 'Empty Pot';
    } else {
      img.src = '../Game/sprites/GreyPot.png';
      img.alt = 'Locked Pot';
    }
  });
}

// End Day logic
endDayButton.onclick = () => {
  if (day >= maxDays) {
    showScoreboard();
  } else {
    const beesToday = calculateBees();
    money += beesToday;
    day++;
    updateUI();
  }
};

// Calculate total bees attracted
function calculateBees() {
  return garden.reduce((total, flower) => total + flower.bees, 0);
}

// Reset the game
function resetGame() {
  money = 100;
  day = 1;
  garden = [];
  pots = [true, false, false];
  updateUI();
}

// Show scoreboard
function showScoreboard() {
  const totalBees = calculateBees();
  const stars = calculateStars(totalBees);
  const bestBees = getBestBees();

  scoreMoney.textContent = `Total Money: $${money}`;
  scoreBees.textContent = `Total Bees Attracted: ${totalBees}`;
  scoreFlowers.textContent = `Total Flowers Planted: ${garden.length}`;
  scoreStars.textContent = `⭐ ${stars} Stars`;

  if (totalBees > bestBees) {
    saveBestBees(totalBees);
    scoreBest.textContent = `🎉 New Best! ${totalBees} Bees!`;
  } else {
    scoreBest.textContent = `Best Record: ${bestBees} Bees`;
  }

  document.getElementById('bee-garden-game').style.display = 'none';
  scoreboard.style.display = 'block';
}

// Calculate star rating
function calculateStars(bees) {
  if (bees >= 100) return 5;
  if (bees >= 75) return 4;
  if (bees >= 50) return 3;
  if (bees >= 25) return 2;
  if (bees >= 10) return 1;
  return 0;
}

// Save/load best bees
function saveBestBees(bees) {
  localStorage.setItem('bestBees', bees);
}

function getBestBees() {
  return parseInt(localStorage.getItem('bestBees') || '0');
}

// Start Game Button
gameStartButton.onclick = () => {
  gameStartOverlay.style.display = 'none';
  resetGame();
};

// Restart Game Button
restartButton.onclick = () => {
  scoreboard.style.display = 'none';
  document.getElementById('bee-garden-game').style.display = 'block';
  resetGame();
};
