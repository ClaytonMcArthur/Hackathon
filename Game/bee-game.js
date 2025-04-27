// Game State
let money = 100;
let day = 1;
const maxDays = 10;
let garden = [];
let pots = [];

// Flowers for Sale
const flowers = [
  { name: 'Beebalm', price: 50, bees: 30, image: '../Game/sprites/Beebalm.png' },
  { name: 'Sunflower', price: 45, bees: 25, image: '../Game/sprites/Sunflower.png' },
  { name: 'Borage', price: 35, bees: 20, image: '../Game/sprites/Borage.png' },
  { name: 'Goldenrod', price: 25, bees: 15, image: '../Game/sprites/Goldenrod.png' },
  { name: 'Snapdragon', price: 20, bees: 10, image: '../Game/sprites/Snapdragon.png' },
  { name: 'Hyacinth', price: 15, bees: 5, image: '../Game/sprites/Hyacinth.png' }
];

// Seed Packets
const seeds = [
  { name: 'SeedsBeebalm', flower: 'Beebalm', image: '../Game/sprites/SeedsBeebalm.png' },
  { name: 'SeedsSunflower', flower: 'Sunflower', image: '../Game/sprites/SeedsSunflower.png' },
  { name: 'SeedsBorage', flower: 'Borage', image: '../Game/sprites/SeedsBorage.png' },
  { name: 'SeedsGoldenrod', flower: 'Goldenrod', image: '../Game/sprites/SeedsGoldenrod.png' },
  { name: 'SeedsSnapdragon', flower: 'Snapdragon', image: '../Game/sprites/SeedsSnapdragon.png' },
  { name: 'SeedsHyacinth', flower: 'Hyacinth', image: '../Game/sprites/SeedsHyacinth.png' }
];

// Pot
const pot = { name: 'EmptyPot', price: 50, image: '../Game/sprites/LiterallyJustAPot.png' };

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
const startOverlay = document.getElementById('game-start-overlay');
const startButton = document.getElementById('game-start-button');

// Setup Shop Seeds
seeds.forEach(seed => {
  const flower = flowers.find(f => f.name === seed.flower);

  const seedWrapper = document.createElement('div');
  seedWrapper.classList.add('seed-wrapper');

  const seedImg = document.createElement('img');
  seedImg.src = seed.image;
  seedImg.alt = seed.name;
  seedImg.classList.add('seed-packet');
  seedImg.setAttribute('draggable', true);

  const seedLabel = document.createElement('div');
  seedLabel.classList.add('seed-label');
  seedLabel.innerHTML = `<strong>${seed.flower}</strong><br>$${flower.price}`;

  seedWrapper.appendChild(seedImg);
  seedWrapper.appendChild(seedLabel);
  shopItemsDiv.appendChild(seedWrapper);

  seedWrapper.updateAffordability = function () {
    if (money < flower.price) {
      seedImg.classList.add('unaffordable');
    } else {
      seedImg.classList.remove('unaffordable');
    }
  };

  seedWrapper.updateAffordability();

  seedImg.addEventListener('dragstart', function (e) {
    e.dataTransfer.setData('text/plain', seed.flower);

    const dragIcon = document.createElement('img');
    dragIcon.src = seed.image;
    dragIcon.style.width = '40px';
    dragIcon.style.height = '40px';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 20, 20);

    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  });

  if (!shopItemsDiv.seedWrappers) shopItemsDiv.seedWrappers = [];
  shopItemsDiv.seedWrappers.push(seedWrapper);
});

// Setup Shop Pot
const potImg = document.createElement('img');
potImg.src = pot.image;
potImg.alt = pot.name;
potImg.classList.add('buyable-pot');
potImg.setAttribute('draggable', true);
shopPotDiv.appendChild(potImg);

potImg.addEventListener('dragstart', function (e) {
  e.dataTransfer.setData('text/plain', pot.name);

  const dragPotIcon = document.createElement('img');
  dragPotIcon.src = pot.image;
  dragPotIcon.style.width = '50px';
  dragPotIcon.style.height = '50px';
  document.body.appendChild(dragPotIcon);
  e.dataTransfer.setDragImage(dragPotIcon, 25, 25);

  setTimeout(() => {
    document.body.removeChild(dragPotIcon);
  }, 0);
});

// Setup Garden Drag and Drop
gardenArea.addEventListener('dragover', function (e) {
  e.preventDefault();
  gardenArea.classList.add('drag-over');
});

gardenArea.addEventListener('dragleave', function () {
  gardenArea.classList.remove('drag-over');
});

gardenArea.addEventListener('drop', function (e) {
  e.preventDefault();
  gardenArea.classList.remove('drag-over');

  const name = e.dataTransfer.getData('text/plain');
  const flower = flowers.find(f => f.name === name);

  if (flower) {
    buyFlower(flower);
  } else if (name === pot.name) {
    buyPot(pot);
  }
});

// Buy Flower
function buyFlower(flower) {
  if (money >= flower.price) {
    money -= flower.price;
    garden.push(flower);

    const newFlower = document.createElement('img');
    newFlower.src = flower.image;
    newFlower.alt = flower.name;
    newFlower.classList.add('flower-sprite');
    gardenArea.appendChild(newFlower);

    spawnBees(flower.bees);
    updateUI();
  } else {
    alert('Not enough money!');
  }
}

// Buy Pot
function buyPot(pot) {
  if (money >= pot.price) {
    money -= pot.price;
    pots.push(pot);
    updateUI();
  } else {
    alert('Not enough money!');
  }
}

// End Day Logic
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

// Calculate Bees
function calculateBees() {
  return garden.reduce((total, flower) => total + flower.bees, 0);
}

// Update UI
function updateUI() {
  moneySpan.textContent = `Money: $${money}`;
  daySpan.textContent = `Day: ${day}/${maxDays}`;

  if (shopItemsDiv.seedWrappers) {
    shopItemsDiv.seedWrappers.forEach(wrapper => {
      const seedImg = wrapper.querySelector('.seed-packet');
      const wasUnaffordable = seedImg.classList.contains('unaffordable');
      wrapper.updateAffordability();
      const isNowAffordable = !seedImg.classList.contains('unaffordable');
      if (wasUnaffordable && isNowAffordable) {
        seedImg.classList.add('just-affordable');
        setTimeout(() => {
          seedImg.classList.remove('just-affordable');
        }, 1000);
      }
    });
  }
}

// Spawn Bees Animation
function spawnBees(count) {
  for (let i = 0; i < Math.min(count, 10); i++) {
    const bee = document.createElement('img');
    bee.src = '../Game/sprites/Bee.png';
    bee.className = 'bee-sprite';
    bee.style.left = Math.random() * (gardenArea.clientWidth - 30) + 'px';
    bee.style.top = Math.random() * (gardenArea.clientHeight - 30) + 'px';
    gardenArea.appendChild(bee);

    setTimeout(() => {
      bee.remove();
    }, 2000);
  }
}

// Show Final Scoreboard
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

// Star Rating
function calculateStars(bees) {
  if (bees >= 100) return 5;
  if (bees >= 75) return 4;
  if (bees >= 50) return 3;
  if (bees >= 25) return 2;
  if (bees >= 10) return 1;
  return 0;
}

// Save and Load Best Score
function saveBestBees(bees) {
  localStorage.setItem('bestBees', bees);
}

function getBestBees() {
  return parseInt(localStorage.getItem('bestBees') || '0');
}

// Restart Game
restartButton.onclick = () => {
  location.reload();
};

// Start Button Logic
startButton.onclick = () => {
  startOverlay.style.display = 'none';
};
