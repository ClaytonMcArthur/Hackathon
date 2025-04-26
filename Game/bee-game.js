// Game State
let money = 100;
let day = 1;
const maxDays = 10;
let garden = [];

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
]

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
    <img id="current-plant" src="../Game/sprites/LiterallyJustAPot.png" alt="Plant Pot" style="width: 200px; height: auto; image-rendering: pixelated;">
  </div>
`;

const plantImg = document.getElementById('current-plant');

// Buy flower
function buyFlower(flower) {
  if (money >= flower.price) {
    money -= flower.price;
    garden = [flower];
    plantImg.src = flower.image;
    updateUI();
  } else {
    alert('Not enough money!');
  }
}

// Buding seeds
seeds.forEach(seed => {
  const seedImg = document.createElement('img');
  seedImg.src = seed.image;
  seedImg.alt = seed.name;
  seedImg.classList.add('seed-packet');
  seedImg.setAttribute('draggable', true);
  shopItemsDiv.appendChild(seedImg);

  seedImg.addEventListener('dragstart', function (e) {
    e.dataTransfer.setData('text/plain', seed.flower);

    // seed image that is dragged
    const dragIcon = document.createElement('img');
    dragIcon.src = seed.image;
    dragIcon.style.width = '40px';
    dragIcon.style.height = '40px';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 25, 25);
  });
});

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

  const flowerName = e.dataTransfer.getData('text/plain');
  const flower = flowers.find(f => f.name === flowerName);
  if (flower) {
    buyFlower(flower);
  }
});

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
    plantImg.src = '../Game/sprites/LiterallyJustAPot.png';
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
    bee.src = '../Game/sprites/Bee.png';
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