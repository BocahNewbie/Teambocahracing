// ==========================================
// GAME STATE & SYSTEM DATA (NASCAR SPEC)
// ==========================================
let gameData = {
  cash: 500000000,
  sponsor: "Toko Sparepart Jaya",
  points: 0,
  currentTab: "tab-dashboard",
  selectedTrackId: null,
  isRacing: false,
  isPaused: false,
  raceInterval: null,
  simSpeed: 1.0 // Multiplier Kecepatan Simulasi: 0.5x, 1x, 2x, 5x
};

let raceCars = [];
let totalLaps = 50; // Standar balap NASCAR Cup Series
let currentLapGlobal = 1;
let stage1Lap = 15;
let stage2Lap = 30;
let stageResults = { stage1: false, stage2: false };

// Standard Points System NASCAR Cup Series (Top 40)
const NASCAR_POINTS = [40, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const STAGE_BONUS_POINTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

// ==========================================
// INITIALIZATION ON LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initDashboard();
  initTrackSelector();
  setupEventListeners();
  renderPitWallTelemetryUI();
});

// ==========================================
// TAB NAVIGATION SYSTEM
// ==========================================
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
      gameData.currentTab = targetTab;
    });
  });
}

// Helper untuk Mencari Data Tim berdasarkan teamId
function getTeamById(teamId) {
  if (typeof TEAMS_DATA !== "undefined" && Array.isArray(TEAMS_DATA)) {
    return TEAMS_DATA.find(t => t.id === teamId) || null;
  }
  return null;
}

// Helper Menentukan Warna Berdasarkan Persentase Aus Ban
function getTireColor(wearPercent) {
  if (wearPercent > 70) return "#2ecc71"; // Hijau
  if (wearPercent > 35) return "#f1c40f"; // Kuning
  return "#e74c3c"; // Merah
}

// ==========================================
// DASHBOARD & KLASEMEN
// ==========================================
function initDashboard() {
  updateFinancialUI();
  renderStandings();
}

function updateFinancialUI() {
  const cashEl = document.getElementById("team-cash");
  const sponsorEl = document.getElementById("sponsor-name");
  const pointsEl = document.getElementById("team-points");

  if (cashEl) cashEl.innerText = `Rp ${gameData.cash.toLocaleString('id-ID')}`;
  if (sponsorEl) sponsorEl.innerText = gameData.sponsor;
  if (pointsEl) pointsEl.innerText = `${gameData.points} PTS`;
}

function renderStandings() {
  const teamBody = document.querySelector("#table-team-standings tbody");
  const driverBody = document.querySelector("#table-driver-standings tbody");

  if (teamBody && typeof TEAMS_DATA !== "undefined") {
    teamBody.innerHTML = TEAMS_DATA.map((t, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><span style="color:${t.color}; font-weight:bold;">●</span> ${t.name}</td>
        <td>${t.points || 0} PTS</td>
      </tr>
    `).join("");
  }

  if (driverBody && typeof INITIAL_DRIVERS !== "undefined") {
    driverBody.innerHTML = INITIAL_DRIVERS.map((d, idx) => {
      const teamObj = getTeamById(d.teamId);
      const teamName = teamObj ? teamObj.name : (d.teamId || '-');
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${d.name}</td>
          <td>${teamName}</td>
          <td>${d.points || 0} PTS</td>
        </tr>
      `;
    }).join("");
  }
}

// ==========================================
// TRACK SELECTOR & RACE PREPARATION
// ==========================================
function initTrackSelector() {
  const trackSelect = document.getElementById("select-track");
  if (!trackSelect || typeof TRACKS_DATA === "undefined") return;

  trackSelect.innerHTML = TRACKS_DATA.map(t => `<option value="${t.id}">${t.name} (${t.type}) - ${t.lengthKm} KM</option>`).join("");
  gameData.selectedTrackId = TRACKS_DATA[0]?.id || null;

  trackSelect.addEventListener("change", (e) => {
    gameData.selectedTrackId = e.target.value;
  });
}

// ==========================================
// SETUP ROSTER BALAPAN (MENGAMBIL RELASI DARI TEAMS_DATA)
// ==========================================
function setupRaceCars() {
  raceCars = [];
  let driverRoster = [];

  if (typeof TEAMS_DATA !== "undefined" && typeof INITIAL_DRIVERS !== "undefined") {
    TEAMS_DATA.forEach(team => {
      const teamDrivers = INITIAL_DRIVERS.filter(d => d.teamId === team.id).slice(0, 2);
      driverRoster.push(...teamDrivers);
    });
  } else {
    driverRoster = Array.from({ length: 20 }, (_, i) => ({
      id: `drv_${i + 1}`,
      name: `Pembalap ${i + 1}`,
      teamId: `team_${Math.ceil((i + 1) / 2)}`
    }));
  }

  raceCars = driverRoster.map((driver, index) => {
    const teamObj = getTeamById(driver.teamId);
    const isPlayer = teamObj ? teamObj.isPlayer : (index === 0 || index === 1);

    return {
      id: driver.id,
      number: index + 1,
      driverName: driver.name,
      teamId: driver.teamId,
      teamName: teamObj ? teamObj.name : driver.teamId,
      teamColor: teamObj ? teamObj.color : "#ffffff",
      isTeamCar: isPlayer,
      distanceCovered: 0,
      currentLap: 1,
      currentPosition: index + 1,
      baseSpeed: 100 + Math.random() * 15,
      strategy: 'neutral',
      
      fuel: 100.0,
      engineTemp: 85.0,
      engineHealth: 100.0,
      bodyHealth: 100.0,
      suspensionHealth: 100.0,
      tires: {
        FL: 100.0,
        FR: 100.0,
        RL: 100.0,
        RR: 100.0
      },
      
      inPit: false,
      pitTimer: 0,
      status: "RUNNING",
      lastLapTime: 0,
      bestLapTime: null,
      lapStartTime: Date.now(),
      pointsEarned: 0
    };
  });
}

// ==========================================
// LIVE RACE ENGINE (SIMULASI NASCAR & KONTROL PAUSE)
// ==========================================
function setupEventListeners() {
  const btnStart = document.getElementById("btn-start-race");
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      if (!gameData.isRacing) {
        startRace();
      } else {
        stopRace();
      }
    });
  }
}

function setSimSpeed(speed, evt) {
  gameData.simSpeed = speed;
  const btns = document.querySelectorAll(".btn-speed");
  btns.forEach(b => b.classList.remove("active"));
  if (evt && evt.target) evt.target.classList.add("active");

  if (gameData.isRacing && !gameData.isPaused) {
    clearInterval(gameData.raceInterval);
    gameData.raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  }
}

function togglePauseRace() {
  if (!gameData.isRacing) return;

  const btnPause = document.getElementById("btn-pause-race");
  const raceStatus = document.getElementById("race-status");

  if (gameData.isPaused) {
    gameData.isPaused = false;
    if (btnPause) btnPause.innerText = "⏸️ PAUSE";
    if (raceStatus) raceStatus.innerText = "GREEN FLAG 🟢";
    gameData.raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  } else {
    gameData.isPaused = true;
    clearInterval(gameData.raceInterval);
    if (btnPause) btnPause.innerText = "▶️ RESUME";
    if (raceStatus) raceStatus.innerText = "YELLOW FLAG (PAUSED) 🟡";
  }
}

function startRace() {
  gameData.isRacing = true;
  gameData.isPaused = false;
  currentLapGlobal = 1;
  stageResults = { stage1: false, stage2: false };

  const btnStart = document.getElementById("btn-start-race");
  const btnPause = document.getElementById("btn-pause-race");
  const raceStatus = document.getElementById("race-status");

  if (btnStart) btnStart.innerText = "⏹️ HENTIKAN BALAPAN";
  if (btnPause) { btnPause.style.display = "inline-block"; btnPause.innerText = "⏸️ PAUSE"; }
  if (raceStatus) raceStatus.innerText = "GREEN FLAG 🟢";

  setupRaceCars();

  if (gameData.raceInterval) clearInterval(gameData.raceInterval);
  gameData.raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
}

function stopRace() {
  gameData.isRacing = false;
  gameData.isPaused = false;
  clearInterval(gameData.raceInterval);

  const btnStart = document.getElementById("btn-start-race");
  const btnPause = document.getElementById("btn-pause-race");
  const raceStatus = document.getElementById("race-status");

  if (btnStart) btnStart.innerText = "🟢 MULAI BALAPAN";
  if (btnPause) btnPause.style.display = "none";
  if (raceStatus) raceStatus.innerText = "CHECKERED FLAG 🏁";

  calculateFinalNascarPoints();
}

// LOOP UTAMA SIMULASI BALAP
function updateRaceLogic() {
  if (gameData.isPaused) return;

  let raceFinished = true;

  // Sorting Posisi Lintasan untuk Drafting & Peringkat Driver
  let sortedPositions = [...raceCars].sort((a, b) => b.distanceCovered - a.distanceCovered);

  sortedPositions.forEach((car, posIdx) => {
    car.currentPosition = posIdx + 1; // Update posisi real-time
  });

  raceCars.forEach(car => {
    if (car.status === "DNF") return;

    if (car.currentLap <= totalLaps) {
      raceFinished = false;

      if (car.inPit) {
        car.pitTimer -= (0.1 * gameData.simSpeed);
        if (car.pitTimer <= 0) {
          car.inPit = false;
          car.status = "RUNNING";
        }
        return;
      }

      let avgTireWear = (car.tires.FL + car.tires.FR + car.tires.RL + car.tires.RR) / 4;
      let tireGripFactor = avgTireWear / 100;
      let aeroFactor = car.bodyHealth / 100;
      let engineFactor = car.engineHealth / 100;

      let stratMultiplier = 1.0;
      let wearMultiplier = 1.0;
      if (car.strategy === 'push') { stratMultiplier = 1.12; wearMultiplier = 1.8; }
      if (car.strategy === 'save') { stratMultiplier = 0.88; wearMultiplier = 0.5; }

      let draftingBonus = 1.0;
      let carIndex = sortedPositions.findIndex(c => c.id === car.id);
      if (carIndex > 0) {
        let carAhead = sortedPositions[carIndex - 1];
        let gapToAhead = carAhead.distanceCovered - car.distanceCovered;
        if (gapToAhead > 0 && gapToAhead < 50) {
          draftingBonus = 1.06;
        }
      }

      let currentSpeed = car.baseSpeed * stratMultiplier * tireGripFactor * aeroFactor * engineFactor * draftingBonus;

      if (car.fuel <= 0) currentSpeed *= 0.3;
      if (car.engineTemp > 120 || car.engineHealth <= 0) {
        car.status = "DNF";
        return;
      }

      car.distanceCovered += (currentSpeed * 0.1);

      car.fuel = Math.max(0, car.fuel - (0.05 * wearMultiplier));
      car.tires.FL = Math.max(0, car.tires.FL - (0.06 * wearMultiplier));
      car.tires.FR = Math.max(0, car.tires.FR - (0.08 * wearMultiplier));
      car.tires.RL = Math.max(0, car.tires.RL - (0.05 * wearMultiplier));
      car.tires.RR = Math.max(0, car.tires.RR - (0.07 * wearMultiplier));

      if (car.strategy === 'push') car.engineTemp = Math.min(125, car.engineTemp + 0.15);
      else car.engineTemp = Math.max(85, car.engineTemp - 0.1);

      let calculatedLap = Math.floor(car.distanceCovered / 1000) + 1;
      if (calculatedLap > car.currentLap && car.currentLap <= totalLaps) {
        let now = Date.now();
        let lapTime = (now - car.lapStartTime) / 1000 + (Math.random() * 1.5);
        car.lastLapTime = lapTime;

        if (!car.bestLapTime || lapTime < car.bestLapTime) car.bestLapTime = lapTime;

        car.currentLap = calculatedLap;
        car.lapStartTime = now;
      }
    }
  });

  if (sortedPositions[0]) {
    currentLapGlobal = Math.min(sortedPositions[0].currentLap, totalLaps);
  }

  checkNascarStagePoints(sortedPositions);
  updateTimingTower(sortedPositions);
  updateLiveTelemetryUI();

  if (raceFinished || currentLapGlobal > totalLaps) {
    stopRace();
  }
}

// ==========================================
// STAGE RACING SYSTEM
// ==========================================
function checkNascarStagePoints(sortedCars) {
  const raceStatus = document.getElementById("race-status");

  if (currentLapGlobal >= stage1Lap && !stageResults.stage1) {
    stageResults.stage1 = true;
    awardStagePoints(sortedCars, "STAGE 1");
    if (raceStatus) raceStatus.innerText = "STAGE 1 COMPLETE 🟡";
  }

  if (currentLapGlobal >= stage2Lap && !stageResults.stage2) {
    stageResults.stage2 = true;
    awardStagePoints(sortedCars, "STAGE 2");
    if (raceStatus) raceStatus.innerText = "STAGE 2 COMPLETE 🟡";
  }
}

function awardStagePoints(sortedCars, stageName) {
  for (let i = 0; i < Math.min(10, sortedCars.length); i++) {
    let bonus = STAGE_BONUS_POINTS[i];
    sortedCars[i].pointsEarned += bonus;
  }
}

function calculateFinalNascarPoints() {
  let sortedCars = [...raceCars].sort((a, b) => b.distanceCovered - a.distanceCovered);
  sortedCars.forEach((car, index) => {
    let basePoints = NASCAR_POINTS[index] || 1;
    car.pointsEarned += basePoints;
  });
  alert("Balapan Selesai! Poin Musim NASCAR Telah Diperbarui.");
}

// ==========================================
// UI TIMING TOWER & PIT WALL TELEMETRY
// ==========================================
function updateTimingTower(sortedCars) {
  const tbody = document.getElementById("timing-tower-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  let leaderDistance = sortedCars[0]?.distanceCovered || 0;

  sortedCars.forEach((car, index) => {
    let gap = index === 0 ? "LEADER" : (car.status === "DNF" ? "DNF" : `+${((leaderDistance - car.distanceCovered) / 100).toFixed(2)}s`);

    let tr = document.createElement("tr");
    if (car.isTeamCar) tr.classList.add("highlight-row");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>#${car.number}</td>
      <td>${car.driverName}</td>
      <td><span style="color:${car.teamColor}; font-weight:bold;">●</span> ${car.teamName}</td>
      <td>${gap}</td>
      <td>${car.lastLapTime ? car.lastLapTime.toFixed(3) + "s" : "-"}</td>
      <td>${car.bestLapTime ? car.bestLapTime.toFixed(3) + "s" : "-"}</td>
    `;
    tbody.appendChild(tr);
  });

  const lapCounter = document.getElementById("race-lap-counter");
  if (lapCounter) {
    lapCounter.innerText = `LAP ${currentLapGlobal} / ${totalLaps}`;
  }
}

function renderPitWallTelemetryUI() {
  const panel = document.querySelector(".pit-wall-panel");
  if (!panel) return;

  panel.innerHTML = `
    <h3>Pit Wall Control & Telemetry</h3>
    <div class="sim-speed-controls" style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
      <button id="btn-pause-race" class="btn-strat" style="display:none; background:#d35400; font-weight:bold;" onclick="togglePauseRace()">⏸️ PAUSE</button>
      <span style="font-size: 11px; color:#8b949e; margin-left: 5px;">Kecepatan:</span>
      <button class="btn-strat btn-speed" onclick="setSimSpeed(0.5, event)">0.5x</button>
      <button class="btn-strat btn-speed active" onclick="setSimSpeed(1.0, event)">1x</button>
      <button class="btn-strat btn-speed" onclick="setSimSpeed(2.0, event)">2x</button>
      <button class="btn-strat btn-speed" onclick="setSimSpeed(5.0, event)">5x</button>
    </div>
    <div id="telemetry-drivers-container"></div>
  `;
}

// Visualisasi Siluet Mobil 2D & Telemetri Realtime
function updateLiveTelemetryUI() {
  const container = document.getElementById("telemetry-drivers-container");
  if (!container) return;

  const teamCars = raceCars.filter(c => c.isTeamCar);
  if (teamCars.length === 0) {
    container.innerHTML = "<p>Tidak ada mobil tim aktif di lintasan.</p>";
    return;
  }

  container.innerHTML = teamCars.map((car) => {
    const colFL = getTireColor(car.tires.FL);
    const colFR = getTireColor(car.tires.FR);
    const colRL = getTireColor(car.tires.RL);
    const colRR = getTireColor(car.tires.RR);

    return `
      <div class="driver-control" style="background: #161b22; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #30363d;">
        <!-- Header Driver & Posisi Balap -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="color:${car.teamColor}; margin:0;">Mobil #${car.number} - ${car.driverName}</h4>
          <span style="background: #f39c12; color: #111; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
            POS #${car.currentPosition}
          </span>
        </div>
        
        <!-- Grid LayOut: Siluet Mobil & Telemetri -->
        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 12px;">
          
          <!-- Visual Siluet Mobil 2D & 4 Ban -->
          <div style="position: relative; width: 70px; height: 110px; background: #0d1117; border: 2px solid #30363d; border-radius: 10px; flex-shrink: 0; display: flex; justify-content: center; align-items: center;">
            <div style="font-size: 8px; color: #555; font-weight: bold;">FRONT</div>
            
            <!-- Ban FL (Front Left) -->
            <div title="Front Left: ${car.tires.FL.toFixed(0)}%" style="position: absolute; top: 10px; left: -8px; width: 10px; height: 22px; background: ${colFL}; border-radius: 3px; border: 1px solid #000;"></div>
            <!-- Ban FR (Front Right) -->
            <div title="Front Right: ${car.tires.FR.toFixed(0)}%" style="position: absolute; top: 10px; right: -8px; width: 10px; height: 22px; background: ${colFR}; border-radius: 3px; border: 1px solid #000;"></div>
            <!-- Ban RL (Rear Left) -->
            <div title="Rear Left: ${car.tires.RL.toFixed(0)}%" style="position: absolute; bottom: 10px; left: -8px; width: 10px; height: 22px; background: ${colRL}; border-radius: 3px; border: 1px solid #000;"></div>
            <!-- Ban RR (Rear Right) -->
            <div title="Rear Right: ${car.tires.RR.toFixed(0)}%" style="position: absolute; bottom: 10px; right: -8px; width: 10px; height: 22px; background: ${colRR}; border-radius: 3px; border: 1px solid #000;"></div>
          </div>

          <!-- Telemetri Angka / Statistik -->
          <div style="flex: 1; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>Bensin: <strong style="color:${car.fuel < 20 ? '#e74c3c' : '#2ecc71'}">${car.fuel.toFixed(1)}%</strong></div>
            <div>Suhu: <strong style="color:${car.engineTemp > 105 ? '#e74c3c' : '#f1c40f'}">${car.engineTemp.toFixed(1)}°C</strong></div>
            <div>Mesin: <strong>${car.engineHealth.toFixed(0)}%</strong></div>
            <div>Bodi: <strong>${car.bodyHealth.toFixed(0)}%</strong></div>
            <div style="grid-column: span 2; font-size: 10px; color: #8b949e; margin-top: 3px;">
              FL: <span style="color:${colFL}">${car.tires.FL.toFixed(0)}%</span> | 
              FR: <span style="color:${colFR}">${car.tires.FR.toFixed(0)}%</span> | 
              RL: <span style="color:${colRL}">${car.tires.RL.toFixed(0)}%</span> | 
              RR: <span style="color:${colRR}">${car.tires.RR.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <!-- Tombol Intervensi Strategi -->
        <div style="display: flex; gap: 4px;">
          <button class="btn-strat ${car.strategy === 'push' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'push', event)">🔥 Push</button>
          <button class="btn-strat ${car.strategy === 'neutral' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'neutral', event)">⚖️ Neutral</button>
          <button class="btn-strat ${car.strategy === 'save' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'save', event)">🌱 Save</button>
          <button class="btn-pit" onclick="callPitStop(${car.number})" ${car.inPit ? 'disabled' : ''}>🔧 BOX (PIT)</button>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// STRATEGI & INTERVENSI PIT STOP (FIXED)
// ==========================================
function setStrategy(carNum, strat, evt) {
  let targetCar = raceCars.find(c => c.number === carNum);
  if (targetCar) {
    // 1. Update data strategi utama pada objek mobil
    targetCar.strategy = strat;
  }

  // 2. Langsung perbarui kelas active pada UI saat diklik (instant feedback)
  if (evt && evt.currentTarget) {
    const parent = evt.currentTarget.parentElement;
    if (parent) {
      parent.querySelectorAll(".btn-strat").forEach(btn => btn.classList.remove("active"));
      evt.currentTarget.classList.add("active");
    }
  }
}

// Update Visual Telemetri Realtime & Tombol Strategi
function updateLiveTelemetryUI() {
  const container = document.getElementById("telemetry-drivers-container");
  if (!container) return;

  const teamCars = raceCars.filter(c => c.isTeamCar);
  if (teamCars.length === 0) {
    container.innerHTML = "<p style='font-size: 12px; color: #8b949e;'>Tidak ada mobil tim aktif di lintasan.</p>";
    return;
  }

  container.innerHTML = teamCars.map((car) => {
    const colFL = getTireColor(car.tires.FL);
    const colFR = getTireColor(car.tires.FR);
    const colRL = getTireColor(car.tires.RL);
    const colRR = getTireColor(car.tires.RR);

    return `
      <div class="driver-control" style="background: #161b22; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #30363d;">
        <!-- Header Driver & Posisi Balap -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="color:${car.teamColor}; margin:0;">Mobil #${car.number} - ${car.driverName}</h4>
          <span style="background: #f39c12; color: #111; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
            POS #${car.currentPosition}
          </span>
        </div>
        
        <!-- Grid Layout: Siluet Mobil & Telemetri -->
        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 12px;">
          
          <!-- Visual Siluet Mobil 2D & 4 Ban -->
          <div style="position: relative; width: 70px; height: 110px; background: #0d1117; border: 2px solid #30363d; border-radius: 10px; flex-shrink: 0; display: flex; justify-content: center; align-items: center;">
            <div style="font-size: 8px; color: #555; font-weight: bold;">FRONT</div>
            
            <div title="Front Left: ${car.tires.FL.toFixed(0)}%" style="position: absolute; top: 10px; left: -8px; width: 10px; height: 22px; background: ${colFL}; border-radius: 3px; border: 1px solid #000;"></div>
            <div title="Front Right: ${car.tires.FR.toFixed(0)}%" style="position: absolute; top: 10px; right: -8px; width: 10px; height: 22px; background: ${colFR}; border-radius: 3px; border: 1px solid #000;"></div>
            <div title="Rear Left: ${car.tires.RL.toFixed(0)}%" style="position: absolute; bottom: 10px; left: -8px; width: 10px; height: 22px; background: ${colRL}; border-radius: 3px; border: 1px solid #000;"></div>
            <div title="Rear Right: ${car.tires.RR.toFixed(0)}%" style="position: absolute; bottom: 10px; right: -8px; width: 10px; height: 22px; background: ${colRR}; border-radius: 3px; border: 1px solid #000;"></div>
          </div>

          <!-- Telemetri Angka / Statistik -->
          <div style="flex: 1; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>Bensin: <strong style="color:${car.fuel < 20 ? '#e74c3c' : '#2ecc71'}">${car.fuel.toFixed(1)}%</strong></div>
            <div>Suhu: <strong style="color:${car.engineTemp > 105 ? '#e74c3c' : '#f1c40f'}">${car.engineTemp.toFixed(1)}°C</strong></div>
            <div>Mesin: <strong>${car.engineHealth.toFixed(0)}%</strong></div>
            <div>Bodi: <strong>${car.bodyHealth.toFixed(0)}%</strong></div>
            <div style="grid-column: span 2; font-size: 10px; color: #8b949e; margin-top: 3px;">
              FL: <span style="color:${colFL}">${car.tires.FL.toFixed(0)}%</span> | 
              FR: <span style="color:${colFR}">${car.tires.FR.toFixed(0)}%</span> | 
              RL: <span style="color:${colRL}">${car.tires.RL.toFixed(0)}%</span> | 
              RR: <span style="color:${colRR}">${car.tires.RR.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <!-- Tombol Intervensi Strategi (Terhubung langsung dengan car.strategy) -->
        <div style="display: flex; gap: 4px;">
          <button class="btn-strat ${car.strategy === 'push' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'push', event)">🔥 Push</button>
          <button class="btn-strat ${car.strategy === 'neutral' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'neutral', event)">⚖️ Neutral</button>
          <button class="btn-strat ${car.strategy === 'save' ? 'active' : ''}" onclick="setStrategy(${car.number}, 'save', event)">🌱 Save</button>
          <button class="btn-pit" onclick="callPitStop(${car.number})" ${car.inPit ? 'disabled' : ''}>🔧 BOX (PIT)</button>
        </div>
      </div>
    `;
  }).join("");
}
