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
      angle: 0,
      speed: 0,
      tire: 100,
      heat: 30,
    },
    opponents: []
  }
};

// --- DATA MASTER MODIFIKASI & MEKANIK ---
const MOD_CATALOG = [
  { id: 'ecu', name: 'Remap ECU Stage 1', price: 8000000, speedPlus: 15, accelPlus: 0.8, relMinus: 3 },
  { id: 'turbo', name: 'Bolt-on Turbo Kit', price: 35000000, speedPlus: 35, accelPlus: 1.8, relMinus: 10 },
  { id: 'coilovers', name: 'Coilover Racing Suspension', price: 18000000, handlingPlus: 18, speedPlus: 0 },
  { id: 'slick_tires', name: 'Ban Semi-Slick Racing', price: 12000000, handlingPlus: 12, accelPlus: 0.5 },
  { id: 'weight_red', name: 'Stripping Interior & Carbon Hood', price: 15000000, weightMinus: 80, accelPlus: 0.6 }
];

const MECHANIC_CANDIDATES = [
  { id: 'm1', name: 'Pak Eko (Eks-Rally)', salary: 10000000, skill: 'Pitstop Demon (Pitstop 2x lebih cepat)' },
  { id: 'm2', name: 'Kang Ujang (Tuner)', salary: 14000000, skill: 'Reliability Guru (+15 Poin Reliabilitas Mesin)' }
];

let canvas, ctx;
let raceAnimationId;

// --- INITIALIZATION ---
function init() {
  // Navigation Tabs Listener
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // Strategy Buttons Listener
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

  // Save Button
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      localStorage.setItem('APEX_WORKSHOP_SAVE', JSON.stringify({
        cash: gameState.cash,
        reputation: gameState.reputation,
        ownedCars: gameState.ownedCars
      }));
      alert('Data bengkel berhasil disimpan!');
    });
  }

  // Race Start Button
  const raceBtn = document.getElementById('start-race-btn');
  if (raceBtn) {
    raceBtn.addEventListener('click', startLiveRace);
  }

  // Memberikan 2 Mobil Awal untuk Tim Player
  const carMarket = window.CAR_MARKET || [];
  if (carMarket.length > 0) {
    buyCar(carMarket[0], true); // Mobil Utama
    if (carMarket[1]) buyCar(carMarket[1], true); // Mobil Ke-2 Tim
  }

  if (typeof window.generateRandomDriver === 'function') {
    const driverA = window.generateRandomDriver('my_drv_1');
    const driverB = window.generateRandomDriver('my_drv_2');
    gameState.drivers.push(driverA, driverB);
    gameState.selectedDriverId = driverA.id;
  }

  gameState.mechanics.push(MECHANIC_CANDIDATES[0]);
  gameState.selectedMechanicId = MECHANIC_CANDIDATES[0].id;

  initCanvas();
  renderUI();
}

function renderUI() {
  const cashEl = document.getElementById('cash-val');
  const repEl = document.getElementById('rep-val');
  if (cashEl) cashEl.textContent = `Rp ${gameState.cash.toLocaleString('id-ID')}`;
  if (repEl) repEl.textContent = `${gameState.reputation} REP`;

  renderMarket();
  renderGarage();
  renderCrew();
}

// --- RENDER MARKET ---
function renderMarket() {
  const container = document.getElementById('market-cars-list');
  if (!container) return;
  container.innerHTML = '';

  const carMarket = window.CAR_MARKET || [];
  carMarket.forEach(car => {
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

window.buyCarById = function(id) {
  const carMarket = window.CAR_MARKET || [];
  const car = carMarket.find(c => c.id === id);
  if (car) buyCar(car);
};

function buyCar(carTemplate, free = false) {
  if (!free && gameState.cash < carTemplate.price) {
    alert('Uang kas tidak cukup!');
    return;
  }

  if (!free) gameState.cash -= carTemplate.price;

  const newCar = {
    uniqueId: 'car_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
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
  if (!listContainer) return;
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
  if (!modsContainer) return;
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

window.installMod = function(modId) {
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
};

// --- RENDER KRU ---
function renderCrew() {
  const driversDiv = document.getElementById('drivers-list');
  if (driversDiv) {
    driversDiv.innerHTML = '';
    gameState.drivers.forEach(d => {
      driversDiv.innerHTML += `
        <div class="crew-card">
          <h4>${d.name}</h4>
          <div class="stats-mini"><span>Skill: ${d.skillName || 'Standard Driver'} (${d.skillDesc || 'No passive'})</span></div>
        </div>
      `;
    });
  }

  const mechDiv = document.getElementById('mechanics-list');
  if (mechDiv) {
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
}

// --- CANVAS & RACE SIMULATION ENGINE ---
function initCanvas() {
  canvas = document.getElementById('raceCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    drawStaticTrack();
  }
}

function drawStaticTrack() {
  if (!ctx || !canvas) return;
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

function startLiveRace() {
  const activeCar = gameState.ownedCars.find(c => c.uniqueId === gameState.selectedCarId);
  if (!activeCar) {
    alert('Pilih mobil di garasi terlebih dahulu!');
    return;
  }

  gameState.race.active = true;
  gameState.race.laps = parseInt(document.getElementById('laps-select').value) || 5;
  gameState.race.currentLap = 1;
  gameState.race.carState = {
    angle: 0,
    speed: activeCar.speed,
    tire: 100,
    heat: 30
  };

  const allRivalCars = [];
  let gridOffset = 0.03;

  // 1. Mobil Ke-2 milik Tim Player (Teammate)
  const teammateCar = gameState.ownedCars.find(c => c.uniqueId !== gameState.selectedCarId);
  if (teammateCar) {
    gridOffset += 0.025;
    allRivalCars.push({
      number: 2,
      teamName: 'Tim Kamu (Teammate)',
      driverName: gameState.drivers[1] ? gameState.drivers[1].shortName : 'Rekan Tim',
      carModel: teammateCar.name,
      angle: -gridOffset,
      speed: teammateCar.speed,
      color: '#3b82f6' // Warna Biru Tim Player
    });
  }

  // 2. Generate 11 Tim Lawan x 2 Mobil (22 Mobil Lawan)
  let elevenTeams = [];
  if (typeof window.generate12Teams === 'function') {
    // Mengambil 11 tim pertama untuk lawan
    elevenTeams = window.generate12Teams().slice(0, 11);
  }

  elevenTeams.forEach((team) => {
    team.cars.forEach((carItem) => {
      gridOffset += 0.025;
      allRivalCars.push({
        number: carItem.carNumber + 2,
        teamName: team.teamName,
        driverName: carItem.driver ? carItem.driver.shortName : 'Driver',
        carModel: carItem.model,
        angle: -gridOffset,
        speed: carItem.topSpeed * (0.85 + Math.random() * 0.15),
        color: team.liveryColor
      });
    });
  });

  // Total: 1 Mobil Utama Kamu + 1 Mobil Teammate + 22 Mobil Lawan = 24 Mobil
  gameState.race.opponents = allRivalCars;

  const overlayMsg = document.getElementById('race-overlay-msg');
  if (overlayMsg) overlayMsg.style.display = 'none';

  if (raceAnimationId) cancelAnimationFrame(raceAnimationId);
  
  raceLoop();
}

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
  if (!activeCar) return;

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

  const gripFactor = car.tire / 100;
  car.speed = activeCar.speed * speedMult * (0.6 + 0.4 * gripFactor);
  car.tire = Math.max(0, car.tire - tireDep);

  const angularSpeed = (car.speed / 10000);
  car.angle += angularSpeed;

  if (car.angle >= Math.PI * 2) {
    car.angle -= Math.PI * 2;
    gameState.race.currentLap++;

    if (gameState.race.boxRequested) {
      car.tire = 100;
      car.heat = 30;
      gameState.race.boxRequested = false;
      const boxBtn = document.getElementById('box-btn');
      if (boxBtn) boxBtn.innerText = '🔧 BOX THIS LAP (Pitstop)';
    }
  }

  gameState.race.opponents.forEach(opp => {
    opp.angle += (opp.speed / 10000);
    if (opp.angle >= Math.PI * 2) opp.angle -= Math.PI * 2;
  });
}

function renderRaceCanvas() {
  drawStaticTrack();
  if (!ctx) return;

  // Render Mobil Utama Player (Titik Cyan)
  const pX = 400 + 320 * Math.cos(gameState.race.carState.angle);
  const pY = 250 + 170 * Math.sin(gameState.race.carState.angle);

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(pX, pY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Render 23 Mobil Lainnya (Teammate + 22 Lawan)
  gameState.race.opponents.forEach(opp => {
    const oX = 400 + 320 * Math.cos(opp.angle);
    const oY = 250 + 170 * Math.sin(opp.angle);
    ctx.fillStyle = opp.color || '#ff2a5f';
    ctx.beginPath();
    ctx.arc(oX, oY, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateTelemetryUI() {
  const car = gameState.race.carState;
  const speedEl = document.getElementById('tele-speed');
  const tireBar = document.getElementById('bar-tire');
  const heatBar = document.getElementById('bar-heat');
  const lapsEl = document.getElementById('tele-laps');

  if (speedEl) speedEl.innerText = `${Math.round(car.speed)} km/h`;
  if (tireBar) tireBar.style.width = `${car.tire}%`;
  if (heatBar) heatBar.style.width = `${car.heat}%`;
  if (lapsEl) lapsEl.innerText = `${Math.min(gameState.race.currentLap, gameState.race.laps)} / ${gameState.race.laps}`;
}

function endRace() {
  gameState.race.active = false;
  cancelAnimationFrame(raceAnimationId);

  const prize = 50000000;
  const repGain = 25;
  gameState.cash += prize;
  gameState.reputation += repGain;

  const msg = document.getElementById('race-overlay-msg');
  if (msg) {
    msg.style.display = 'block';
    msg.innerHTML = `🏁 FINISH! <br> Balapan Selesai! Hadiah: Rp ${prize.toLocaleString('id-ID')} & +${repGain} REP`;
  }

  renderUI();
}

// Jalankan init setelah seluruh elemen DOM siap dimuat
document.addEventListener('DOMContentLoaded', () => {
  init();
});
