// ==========================================
// GAME STATE & SYSTEM DATA
// ==========================================
let gameData = {
  cash: 500000000,
  sponsor: "Toko Sparepart Jaya",
  points: 0,
  currentTab: "tab-dashboard",
  selectedTrackId: null,
  isRacing: false,
  raceInterval: null
};

let raceCars = [];
let totalLaps = 15;

// ==========================================
// INITIALIZATION ON LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initDashboard();
  initTrackSelector();
  setupEventListeners();
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
        <td>${t.name}</td>
        <td>${t.points || 0} PTS</td>
      </tr>
    `).join("");
  }

  if (driverBody && typeof INITIAL_DRIVERS !== "undefined") {
    driverBody.innerHTML = INITIAL_DRIVERS.map((d, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${d.name}</td>
        <td>${d.teamId || '-'}</td>
        <td>${d.points || 0} PTS</td>
      </tr>
    `).join("");
  }
}

// ==========================================
// TRACK SELECTOR & RACE PREPARATION
// ==========================================
function initTrackSelector() {
  const trackSelect = document.getElementById("select-track");
  if (!trackSelect || typeof TRACKS_DATA === "undefined") return;

  trackSelect.innerHTML = TRACKS_DATA.map(t => `<option value="${t.id}">${t.name} (${t.type})</option>`).join("");
  gameData.selectedTrackId = TRACKS_DATA[0]?.id || null;

  trackSelect.addEventListener("change", (e) => {
    gameData.selectedTrackId = e.target.value;
  });
}

// ==========================================
// LIVE RACE ENGINE (TIMING TOWER BASED)
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

function startRace() {
  gameData.isRacing = true;
  const btnStart = document.getElementById("btn-start-race");
  const raceStatus = document.getElementById("race-status");

  if (btnStart) btnStart.innerText = "⏹️ HENTIKAN BALAPAN";
  if (raceStatus) raceStatus.innerText = "RACING";

  // Inisialisasi Mobil untuk Balapan
  setupRaceCars();

  // Jalankan Game Loop Setiap 100ms (0.1 detik simulasi)
  if (gameData.raceInterval) clearInterval(gameData.raceInterval);
  gameData.raceInterval = setInterval(updateRaceLogic, 100);
}

function stopRace() {
  gameData.isRacing = false;
  clearInterval(gameData.raceInterval);

  const btnStart = document.getElementById("btn-start-race");
  const raceStatus = document.getElementById("race-status");

  if (btnStart) btnStart.innerText = "🟢 MULAI BALAPAN";
  if (raceStatus) raceStatus.innerText = "FINISHED";
}

function setupRaceCars() {
  raceCars = [];
  
  // Mengambil data pembalap atau generate data default
  let listDrivers = (typeof INITIAL_DRIVERS !== "undefined" && INITIAL_DRIVERS.length > 0) 
    ? INITIAL_DRIVERS 
    : Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Pembalap ${i + 1}`, teamId: `Tim ${Math.ceil((i + 1) / 2)}` }));

  raceCars = listDrivers.map((driver, index) => {
    return {
      id: driver.id || index + 1,
      number: index + 1,
      driverName: driver.name || `Pembalap ${index + 1}`,
      teamName: driver.teamId || "Independent",
      isTeamCar: index === 0 || index === 1, // Mobil #1 & #2 milik tim pemain
      distanceCovered: 0,
      currentLap: 1,
      speed: 80 + Math.random() * 20, // Kecepatan dasar
      strategy: 'neutral',
      lastLapTime: 0,
      bestLapTime: null,
      lapStartTime: Date.now()
    };
  });
}

function updateRaceLogic() {
  let raceFinished = true;

  raceCars.forEach(car => {
    if (car.currentLap <= totalLaps) {
      raceFinished = false;

      // Kalkulasi Kecepatan Berdasarkan Strategi
      let stratMultiplier = 1.0;
      if (car.strategy === 'push') stratMultiplier = 1.15;
      if (car.strategy === 'save') stratMultiplier = 0.88;

      let actualSpeed = car.speed * stratMultiplier * (0.95 + Math.random() * 0.1);
      car.distanceCovered += actualSpeed;

      // Simulasi Penyelesaian Lap (Tiap 1000 unit jarak = 1 Lap)
      let calculatedLap = Math.floor(car.distanceCovered / 1000) + 1;
      if (calculatedLap > car.currentLap && car.currentLap <= totalLaps) {
        let now = Date.now();
        let lapTime = (now - car.lapStartTime) / 1000 + (Math.random() * 2);
        car.lastLapTime = lapTime;
        
        if (!car.bestLapTime || lapTime < car.bestLapTime) {
          car.bestLapTime = lapTime;
        }

        car.currentLap = calculatedLap;
        car.lapStartTime = now;
      }
    }
  });

  // Update Tampilan Timing Tower
  updateTimingTower();

  // Cek jika seluruh mobil sudah finish
  if (raceFinished) {
    stopRace();
  }
}

function updateTimingTower() {
  const tbody = document.getElementById("timing-tower-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Sortir mobil berdasarkan jarak tempuh tertinggi (posisi paling depan)
  let sortedCars = [...raceCars].sort((a, b) => b.distanceCovered - a.distanceCovered);
  let leaderDistance = sortedCars[0]?.distanceCovered || 0;

  sortedCars.forEach((car, index) => {
    let gap = index === 0 ? "LEADER" : `+${((leaderDistance - car.distanceCovered) / 100).toFixed(2)}s`;

    let tr = document.createElement("tr");
    if (car.isTeamCar) tr.classList.add("highlight-row");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>#${car.number}</td>
      <td>${car.driverName}</td>
      <td>${car.teamName}</td>
      <td>${gap}</td>
      <td>${car.lastLapTime ? car.lastLapTime.toFixed(3) + "s" : "-"}</td>
      <td>${car.bestLapTime ? car.bestLapTime.toFixed(3) + "s" : "-"}</td>
    `;
    tbody.appendChild(tr);
  });

  // Update Lap Counter di Info Bar
  const lapCounter = document.getElementById("race-lap-counter");
  if (lapCounter && sortedCars[0]) {
    let displayLap = Math.min(sortedCars[0].currentLap, totalLaps);
    lapCounter.innerText = `LAP ${displayLap} / ${totalLaps}`;
  }
}

// ==========================================
// PIT WALL STRATEGY CONTROLLERS
// ==========================================
function setStrategy(carNum, strat, evt) {
  let targetCar = raceCars.find(c => c.number === carNum);
  if (targetCar) {
    targetCar.strategy = strat;
  }

  // Update Visual Tombol Strategi
  const controls = document.querySelectorAll(`.driver-control`)[carNum - 1];
  if (controls) {
    controls.querySelectorAll(".btn-strat").forEach(btn => btn.classList.remove("active"));
    if (evt && evt.target) {
      evt.target.classList.add("active");
    }
  }
}

function callPitStop(carNum) {
  let targetCar = raceCars.find(c => c.number === carNum);
  if (targetCar && gameData.isRacing) {
    // Kurangi jarak tempuh seolah mobil masuk pit stop
    targetCar.distanceCovered -= 300; 
    alert(`Mobil #${carNum} (${targetCar.driverName}) masuk Pit Stop! (Memperbaiki komponen & ganti ban)`);
  }
}
