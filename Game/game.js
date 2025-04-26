// Game state
let money = 100;
let day = 1;
const maxDays = 10;
let garden = [];

// Flowers you can buy
const flowers = [
  { name: 'Dandelion', price: 10, bees: 5, icon: '' },
  { name: 'Lavender', price: 20, bees: 10, icon: '' },
  { name: 'Sunflower', price: 30, bees: 15, icon: '' }
];

// DOM Elements
const moneySpan = document.getElementById('money');
const daySpan = document.getElementById('day');
const shopItemsDiv = document.getElementById('shop-items');
const gardenArea = document.getElementById('garden-area');
const endDayButton = document.getElementById('end-day-button');

// Initialize shop
flowers.forEach(flower => {
  const btn = document.createElement('button');
  btn.textContent = `${flower.name} ($${flower.price})`;
  btn.onclick = () => buyFlower(flower);
  shopItemsDiv.appendChild(btn);
});

// Buy flower function
function buyFlower(flower) {
  if (money >= flower.price) {
    money -= flower.price;
    garden.push(flower);
    updateUI();
  } else {
    alert('Not enough money!');
  }
}

// End day function
endDayButton.onclick = () => {
  if (day >= maxDays) {
    alert(`Game Over! You finished with $${money}!`);
    resetGame();
  } else {
    const beesToday = calculateBees();
    money += beesToday;
    day++;
    updateUI();
  }
};

// Calculate how many bees are attracted
function calculateBees() {
  let bees = 0;
  garden.forEach(flower => {
    bees += flower.bees;
  });
  return bees;
}

// Update the UI
function updateUI() {
  moneySpan.textContent = `Money: $${money}`;
  daySpan.textContent = `Day: ${day}/${maxDays}`;
  gardenArea.innerHTML = '';
  garden.forEach(flower => {
    const flowerSpan = document.createElement('span');
    flowerSpan.textContent = flower.emoji;
    gardenArea.appendChild(flowerSpan);
  });
}

// Reset game
function resetGame() {
  money = 100;
  day = 1;
  garden = [];
  updateUI();
}

// Start game
updateUI();
