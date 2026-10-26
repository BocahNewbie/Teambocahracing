// --- STATE GAME ---
const gameState = {
  cash: 250000000,
  reputation: 100,
  ownedCars: [],
  selectedCarId: null,
  drivers: [],
  mechanics: [],
  selectedDriverId: null,
  selectedMechanicId: null,
  race: {
    active: false,
    track: 'sentul',
    laps: 5,
    currentLap: 1,
    strategy: 'balanced', // push, balanced, conserve
    boxRequested: false,
    carState: {
      dist: 0,
      lap: 1,
      speed: 0,
      tire: 100,
      heat: 30,
      inPit: false,
    },
    opponents: []
  }
};

// --- DATA MASTER MOBIL ---
const CAR_MARKET = [
  { id: 'avanza', name: 'Toyota Avanza Veloz', price: 120000000, baseSpeed: 140, baseAccel: 6, baseHandling: 50, baseRel: 90, baseWeight: 1150 },
  { id: 'granmax', name: 'Daihatsu Gran Max', price: 85000000, baseSpeed: 125, baseAccel: 4, baseHandling: 40, baseRel: 95, baseWeight: 1200 },
  { id: 'civic', name: 'Honda Civic Type R', price: 450000000, baseSpeed: 230, baseAccel: 8.5, baseHandling: 85, baseRel: 80, baseWeight: 1380 },
  { id: 'evo9', name: 'Mitsubishi Lancer Evo IX', price: 500000000, baseSpeed: 240, baseAccel: 9.0, baseHandling: 88, baseRel: 75, baseWeight: 1410 },
  { id: 'supra', name: 'Toyota Supra MK4', price: 750000000, baseSpeed: 260, baseAccel: 8.8, baseHandling: 82, baseRel: 85, baseWeight: 1490 }
];

// --- DATA MASTER MODIFIKASI ---
const MOD_CATALOG = [
  { id: 'ecu', name: 'Remap ECU Stage 1', price: 8000000, speedPlus: 15, accelPlus: 0.8, relMinus: 3 },
  { id: 'turbo', name: 'Bolt-on Turbo Kit', price: 35000000, speedPlus: 35, accelPlus: 1.8, relMinus: 10 },
  { id: 'coilovers', name: 'Coilover Racing Suspension', price: 18000000, handlingPlus: 18, speedPlus: 0 },
  { id: 'slick_tires', name: 'Ban Semi-Slick Racing', price: 12000000, handlingPlus: 12, accelPlus: 0.5 },
  { id: 'weight_red', name: 'Stripping Interior & Carbon Hood', price: 15000000, weightMinus: 80, accelPlus: 0.6 }
];

// --- DATA MASTER SKILL KRU ---
const DRIVER_CANDIDATES = [
  { id: 'd1', name: 'Rizky "Late-Braker"', salary: 15000000, skill: 'Late Braking (+15% speed saat cornering)' },
  { id: 'd2', name: 'Budi "Tire Whisperer"', salary: 12000000, skill: 'Tire Whisperer (-25% keausan ban)' },
  { id: 'd3', name: 'Agus "Drafting God"', salary: 20000000, skill: 'Drafting Master (+10% top speed saat membuntut)' }
];

const MECHANIC_CANDIDATES = [
  { id: 'm1', name: 'Pak Eko (Eks-Rally)', salary: 10000000, skill: 'Pitstop Demon (Pitstop 2x lebih cepat)' },
  { id: 'm2', name: 'Kang Ujang (Tuner)', salary: 14000000, skill: 'Reliability Guru (+15 Poin Reliabilitas Mesin)' }
];

// --- ROUTING TAB UI ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// --- INITIALIZATION ---
function init() {
  // Give starter car
  buyCar(CAR_MARKET[0], true);
  gameState.drivers.push(DRIVER_CANDIDATES[0]);
  gameState.selectedDriverId = DRIVER_CANDIDATES[0].id;
  gameState.mechanics.push(MECHANIC_CANDIDATES[0]);
  gameState.selectedMechanicId = MECHANIC_CANDIDATES[0].id;

  renderUI();
  initCanvas();
}

function renderUI() {
  document.getElementById('cash-val').textContent = `Rp ${gameState.cash.toLocaleString('id-ID')}`;
  document.getElementById('rep-val').textContent = `${gameState.reputation} REP`;

  renderMarket();
  renderGarage();
  renderCrew();
}

// --- RENDER MARKET ---
function renderMarket() {
  const container = document.getElementById('market-cars-list');
  container.innerHTML = '';

  CAR_MARKET.forEach(car => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <h4>${car.name}</h4>
      <div class="stats-mini">
        <span>Top Speed: ${car.baseSpeed} km/h</span>
        <span>Akselerasi: ${car.baseAccel} s</span>
        <span>Handling: ${car.baseHandling}</span>
      </div>
      <strong>Rp ${car.price.toLocaleString('id-ID')}</strong>
      <button class="btn-sm" onclick="buyCarById('${car.id}')">Beli Mobil</button>
    `;
    container.appendChild(card);
  });
}

function buyCarById(id) {
  const car = CAR_MARKET.find(c => c.id === id);
  if (car) buyCar(car);
}

function buyCar(carTemplate, free = false) {
  if (!free && gameState.cash < carTemplate.price) {
    alert('Uang kas tidak cukup!');
    return;
  }

  if (!free) gameState.cash -= carTemplate.price;

  const newCar = {
    uniqueId: 'car_' + Date.now(),
    name: carTemplate.name,
    speed: carTemplate.baseSpeed,
    accel: carTemplate.baseAccel,
    handling: carTemplate.baseHandling,
    rel: carTemplate.baseRel,
    weight: carTemplate.baseWeight,
    installedMods: []
  };

  gameState.ownedCars.push(newCar);
  if (!gameState.selectedCarId) gameState.selectedCarId = newCar.uniqueId;

  renderUI();
}

// --- RENDER GARAGE & MODS ---
function renderGarage() {
  const listContainer = document.getElementById('owned-cars-list');
  listContainer.innerHTML = '';

  gameState.ownedCars.forEach(car => {
    const card = document.createElement('div');
    card.className = `car-card ${car.uniqueId === gameState.selectedCarId ? 'selected' : ''}`;
    card.onclick = () => {
      gameState.selectedCarId = car.uniqueId;
      renderGarage();
    };
    card.innerHTML = `
      <h4>${car.name}</h4>
      <div class="stats-mini">
        <span>Top Speed: ${car.speed} km/h</span>
        <span>Handling: ${car.handling}</span>
        <span>Reliabilitas: ${car.rel}%</span>
      </div>
    `;
    listContainer.appendChild(card);
  });

  const modsContainer = document.getElementById('garage-mods-container');
  const activeCar = gameState.ownedCars.find(c => c.uniqueId === gameState.selectedCarId);

  if (!activeCar) {
    modsContainer.innerHTML = '<p class="empty-msg">Pilih mobil terlebih dahulu.</p>';
    return;
  }

  modsContainer.innerHTML = `<h4>Upgrade untuk: ${activeCar.name}</h4>`;
  
  MOD_CATALOG.forEach(mod => {
    const isInstalled = activeCar.installedMods.includes(mod.id);
    const modEl = document.createElement('div');
    modEl.className = 'mod-item';
    modEl.innerHTML = `
      <div class="mod-info">
        <strong>${mod.name}</strong>
        <span>Rp ${mod.price.toLocaleString('id-ID')}</span>
      </div>
      <button class="btn-sm" ${isInstalled ? 'disabled' : ''} onclick="installMod('${mod.id}')">
        ${isInstalled ? 'Terpasang' : 'Pasang'}
      </button>
    `;
    modsContainer.appendChild(modEl);
  });
}

function installMod(modId) {
  const car = gameState.ownedCars.find(c => c.uniqueId === gameState.selectedCarId);
  const mod = MOD_CATALOG.find(m => m.id === modId);

  if (!car || !mod) return;
  if (gameState.cash < mod.price) {
    alert('Uang kas tidak cukup untuk modifikasi!');
    return;
  }

  gameState.cash -= mod.price;
  car.installedMods.push(mod.id);
  
  if (mod.speedPlus) car.speed += mod.speedPlus;
  if (mod.accelPlus) car.accel += mod.accelPlus;
  if (mod.handlingPlus) car.handling += mod.handlingPlus;
  if (mod.relMinus) car.rel -= mod.relMinus;

  renderUI();
}

// --- RENDER KRU ---
function renderCrew() {
  const driversDiv = document.getElementById('drivers-list');
  driversDiv.innerHTML = '';
  gameState.drivers.forEach(d => {
    driversDiv.innerHTML += `
      <div class="crew-card">
        <h4>${d.name}</h4>
        <div class="stats-mini"><span>Skill: ${d.skill}</span></div>
      </div>
    `;
  });

  const mechDiv = document.getElementById('mechanics-list');
  mechDiv.innerHTML = '';
  gameState.mechanics.forEach(m => {
    mechDiv.innerHTML += `
      <div class="crew-card">
        <h4>${m.name}</h4>
        <div class="stats-mini"><span>Skill: ${m.skill}</span></div>
      </div>
    `;
  });
}

// --- CANVAS & RACE SIMULATION ENGINE ---
let canvas, ctx;
let raceAnimationId;

function initCanvas() {
  canvas = document.getElementById('raceCanvas');
  ctx = canvas.getContext('2d');
  drawStaticTrack();
}

function drawStaticTrack() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Outer circuit track loop
  ctx.beginPath();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 40;
  ctx.ellipse(400, 250, 320, 170, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Racing Line
  ctx.beginPath();
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.ellipse(400, 250, 320, 170, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

document.getElementById('start-race-btn').addEventListener('click', startLiveRace);

function startLiveRace() {
  const activeCar = gameState.ownedCars.find(c => c.uniqueId === gameState.selectedCarId);
  if (!activeCar) {
    alert('Pilih mobil di garasi terlebih dahulu!');
    return;
  }

  gameState.race.active = true;
  gameState.race.laps = parseInt(document.getElementById('laps-select').value);
  gameState.race.currentLap = 1;
  gameState.race.carState = {
    angle: 0,
    speed: 0,
    targetSpeed: activeCar.speed,
    tire: 100,
    heat: 30,
    inPit: false,
    lapProgress: 0
  };

  // Generate 2 opponents
  gameState.race.opponents = [
    { name: 'Sirkuit Rival A', angle: 0.05, speed: activeCar.speed * 0.95, color: '#ff2a5f' },
    { name: 'Sirkuit Rival B', angle: -0.05, speed: activeCar.speed * 0.9, color: '#ffb703' }
  ];

  document.getElementById('race-overlay-msg').style.display = 'none';
  if (raceAnimationId) cancelAnimationFrame(raceAnimationId);
  
  raceLoop();
}

// STRATEGY BUTTONS
document.querySelectorAll('.strat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id === 'box-btn') {
      gameState.race.boxRequested = true;
      btn.innerText = '🔧 PITSTOP SCHEDULED...';
      return;
    }
    document.querySelectorAll('.strat-btn').forEach(b => {
      if (b.id !== 'box-btn') b.classList.remove('active');
    });
    btn.classList.add('active');
    gameState.race.strategy = btn.dataset.strat;
  });
});

function raceLoop() {
  if (!gameState.race.active) return;

  updatePhysics();
  renderRaceCanvas();
  updateTelemetryUI();

  if (gameState.race.currentLap > gameState.race.laps) {
    endRace();
    return;
  }

  raceAnimationId = requestAnimationFrame(raceLoop);
}

function updatePhysics() {
  const car = gameState.race.carState;
  const activeCar = gameState.ownedCars.find(c => c.uniqueId === gameState.selectedCarId);

  // Strategy Modifiers
  let speedMult = 1.0;
  let tireDep = 0.05;

  if (gameState.race.strategy === 'push') {
    speedMult = 1.15;
    tireDep = 0.12;
    car.heat = Math.min(100, car.heat + 0.05);
  } else if (gameState.race.strategy === 'conserve') {
    speedMult = 0.85;
    tireDep = 0.02;
    car.heat = Math.max(20, car.heat - 0.05);
  }

  // Tire Grip factor
  const gripFactor = car.tire / 100;
  car.speed = activeCar.speed * speedMult * (0.6 + 0.4 * gripFactor);

  // Tire Wear
  car.tire = Math.max(0, car.tire - tireDep);

  // Movement along track circle (angle rad)
  const angularSpeed = (car.speed / 10000);
  car.angle += angularSpeed;

  // Check Lap Completion
  if (car.angle >= Math.PI * 2) {
    car.angle -= Math.PI * 2;
    gameState.race.currentLap++;

    // Handle Pitstop
    if (gameState.race.boxRequested) {
      car.tire = 100;
      car.heat = 30;
      gameState.race.boxRequested = false;
      document.getElementById('box-btn').innerText = '🔧 BOX THIS LAP (Pitstop)';
    }
  }

  // Update Opponents
  gameState.race.opponents.forEach(opp => {
    opp.angle += (opp.speed / 10000);
    if (opp.angle >= Math.PI * 2) opp.angle -= Math.PI * 2;
  });
}

function renderRaceCanvas() {
  drawStaticTrack();

  // Draw Player Car
  const pX = 400 + 320 * Math.cos(gameState.race.carState.angle);
  const pY = 250 + 170 * Math.sin(gameState.race.carState.angle);

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(pX, pY, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;

  // Draw Opponents
  gameState.race.opponents.forEach(opp => {
    const oX = 400 + 320 * Math.cos(opp.angle);
    const oY = 250 + 170 * Math.sin(opp.angle);
    ctx.shadowBlur = 0;
    ctx.fillStyle = opp.color;
    ctx.beginPath();
    ctx.arc(oX, oY, 8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateTelemetryUI() {
  const car = gameState.race.carState;
  document.getElementById('tele-speed').innerText = `${Math.round(car.speed)} km/h`;
  document.getElementById('bar-tire').style.width = `${car.tire}%`;
  document.getElementById('bar-heat').style.width = `${car.heat}%`;
  document.getElementById('tele-laps').innerText = `${Math.min(gameState.race.currentLap, gameState.race.laps)} / ${gameState.race.laps}`;
}

function endRace() {
  gameState.race.active = false;
  cancelAnimationFrame(raceAnimationId);

  const prize = 50000000;
  const repGain = 25;
  gameState.cash += prize;
  gameState.reputation += repGain;

  const msg = document.getElementById('race-overlay-msg');
  msg.style.display = 'block';
  msg.innerHTML = `🏁 FINISH! <br> Juara 1! Hadiah: Rp ${prize.toLocaleString('id-ID')} & +${repGain} REP`;

  renderUI();
}

// SAVE DATA
document.getElementById('save-btn').addEventListener('click', () => {
  localStorage.setItem('APEX_WORKSHOP_SAVE', JSON.stringify({
    cash: gameState.cash,
    reputation: gameState.reputation,
    ownedCars: gameState.ownedCars
  }));
  alert('Data bengkel berhasil disimpan!');
});

// START GAME
init();
