// Game State
let money = 100;
let day = 1;
const maxDays = 10;
let garden = [];

// Flowers for sale
const flowers = [
  { name: 'Goldenrod', price: 10, bees: 5, image: 'sprites/Goldenrod.png' },
  { name: 'Borage', price: 20, bees: 10, image: 'sprites/Borage.png' },
  { name: 'Sunflower', price: 30, bees: 15, image: 'sprites/Sunflower.png' },
  { name: 'Beebalm', price: 30, bees: 15, image: 'sprites/Beebalm.png' },
  { name: 'Hyacinth', price: 30, bees: 15, image: 'sprites/Hyacinth.png' },
  { name: 'Snapdragon', price: 30, bees: 15, image: 'sprites/Snapdragon.png' }
];

// DOM Elements
const moneySpan = document.getElementById('money');
const daySpan = document.getElementById('day');
const shopItemsDiv = document.getElementById('shop-items');
const gardenArea = document.getElementById('garden-area');
const endDayButton = document.getElementById('end-day-button');

const scoreboard = document.getElementById('scoreboard');
const scoreMoney = document.getElementById('score-money');
const scoreBees = document.getElementById('score-bees');
const scoreFlowers = document.getElementById('score-flowers');
const scoreStars = document.getElementById('score-stars');
const scoreBest = document.getElementById('score-best');
const restartButton = document.getElementById('restart-button');

// Create plant display area
gardenArea.innerHTML = `
  <div id="plant-display">
    <img id="current-plant" src="sprites/pot.png" alt="Plant Pot" style="width: 200px; height: auto; image-rendering: pixelated;">
  </div>
`;

const plantImg = document.getElementById('current-plant');

// Initialize shop
flowers.forEach(flower => {
    const btn = document.createElement('button');
    btn.textContent = `${flower.name} ($${flower.price})`;
    btn.onclick = () => buyFlower(flower);
    shopItemsDiv.appendChild(btn);
});

// Buy flower
function buyFlower(flower) {
  if (money >= flower.price) {
    money -= flower.price;
    garden = [flower];
    updateUI();
  } else {
    alert('Not enough money!');
  }
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

// Calculate bees attracted
function calculateBees() {
  return garden.reduce((total, flower) => total + flower.bees, 0);
}

// Update the UI
function updateUI() {
  moneySpan.textContent = `Money: $${money}`;
  daySpan.textContent = `Day: ${day}/${maxDays}`;
  if (garden.length > 0) {
    plantImg.src = garden[0].image;
    plantImg.alt = garden[0].name;
  } else {
    plantImg.src = 'sprites/LiterallyJustAPot.png';
    plantImg.alt = 'Empty Pot';
  }
}

// Reset the game
function resetGame() {
  money = 100;
  day = 1;
  garden = [];
  updateUI();
}

// Spawn bees animation
function spawnBees(count) {
  for (let i = 0; i < count; i++) {
    const bee = document.createElement('img');
    bee.src = 'sprites/Bee.png';
    bee.className = 'bee-sprite';
    bee.style.left = Math.random() * (gardenArea.clientWidth - 30) + 'px';
    bee.style.top = Math.random() * (gardenArea.clientHeight - 30) + 'px';
    gardenArea.appendChild(bee);

    // Animate bee to flutter randomly
    let flutterDistance = Math.random() * 100 - 50; // random between -50 and +50
    bee.animate([
      { transform: `translate(${flutterDistance}px, -120px)`, opacity: 0 }
    ], {
      duration: 2000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });

    setTimeout(() => {
      bee.remove();
    }, 2000);
  }
}

// Show final scoreboard
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

// Star rating system
function calculateStars(bees) {
  if (bees >= 100) return 5;
  if (bees >= 75) return 4;
  if (bees >= 50) return 3;
  if (bees >= 25) return 2;
  if (bees >= 10) return 1;
  return 0;
}

// Save and load best score
function saveBestBees(bees) {
  localStorage.setItem('bestBees', bees);
}

function getBestBees() {
  return parseInt(localStorage.getItem('bestBees') || '0');
}

// Restart game
restartButton.onclick = () => {
  resetGame();
  scoreboard.style.display = 'none';
  document.getElementById('bee-garden-game').style.display = 'block';
};