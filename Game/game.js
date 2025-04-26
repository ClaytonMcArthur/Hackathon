// Game state
let money = 100;
let day = 1;
const maxDays = 10;
let garden = [];

// Flowers you can buy
const flowers = [
  { name: 'Dandelion', price: 10, bees: 5, icon: 'sprites/dandelion.png' },
  { name: 'Lavender', price: 20, bees: 10, icon: 'sprites/lavender.png' },
  { name: 'Sunflower', price: 30, bees: 15, icon: 'sprites/sunflower.png' }
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
    const flowerImg = document.createElement('img');
    flowerImg.src = flower.image;
    flowerImg.alt = flower.name;
    flowerImg.classList.add('flower-sprite');
    gardenArea.appendChild(flowerImg);
  });
}

// Reset game
function resetGame() {
  money = 100;
  day = 1;
  garden = [];
  updateUI();
}

// Spawn bees flying across the garden
function spawnBees(count) {
  for (let i = 0; i < count; i++) {
    const bee = document.createElement('img');
    bee.src = 'sprites/bee.png';
    bee.className = 'bee-sprite';
    bee.style.left = Math.random() * (gardenArea.clientWidth - 30) + 'px';
    bee.style.top = Math.random() * (gardenArea.clientHeight - 30) + 'px';
    gardenArea.appendChild(bee);

    // Remove bee after animation
    setTimeout(() => {
      bee.remove();
    }, 2000);
  }
}
