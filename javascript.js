// ==========================================
// GAME STATE & SYSTEM DATA (NASCOT GRAND PRIX)
// ==========================================
let gameData = {
  cash: 500000000,
  sponsor: "Toko Sparepart Jaya",
  points: 0,
  seasonStarted: false,
  currentCalendarIndex: 0,
  simSpeed: 1.0,

  playerTeam: null,
  workshopLevel: 1,
  myCars: [],       // Max 2 Mobil
  myDrivers: [],    // Max 2 Pembalap
  myMechanics: [],  // Min 1 Mekanik
  calendarSchedule: [],

  driverStandings: {}, // Tepat 120 Driver
  teamStandings: {}    // Tepat 60 Tim
};

// Sistem Poin Balapan (Top 10 Finishers)
const RACE_POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// Kosakata Komentator Balap (1000+ Combinations)
const COMMENTARY_VOCAB = {
  starts: [
    "Lampu merah padam dan balapan resmi dimulai! Semua angkot melesat di lintasan!",
    "Deru mesin menggelora! Para pembalap langsung adu akselerasi tajam di tikungan pertama!",
    "Start yang luar biasa bersih! Rombongan depan langsung memperebutkan line bagian dalam!",
    "Tancap gas pol! Persaingan mendebarkan langsung menyajikan aksi saling senggol halus!"
  ],
  overtakes: [
    "Luar biasa! Manuver mepet memotong dari sebelah dalam yang sangat berani!",
    "Menyalip dengan manuver telak di trek lurus utama! Kecepatan puncak benar-benar berbicara!",
    "Pembalap ini mengambil late-braking yang amat berisiko namun sukses mengambil posisi!",
    "Aksi slipstream tajam sebelum tikungan! Posisi berhasil direbut dengan sangat gemilang!"
  ],
  battles: [
    "Persaingan amat sengit antara dua angkot monster di garis lurus!",
    "Jarak antar pembalap sangat tipis, benar-benar adu mental dan daya tahan mesin!",
    "Tekanan besar diberikan oleh pembalap di belakang, pertahanan sudut yang amat rapat!",
    "Ban mulai mengeluarkan asap tipis saat kedua pembalap berduel di chicane ketat!"
  ],
  finishes: [
    "Bendera finish dikibarkan! Balapan dramatis resmi berakhir hari ini!",
    "Performa luar biasa tanpa cela! Kemenangan mutlak diraih dengan telak!",
    "Poin penuh berhasil diamanatkan untuk kejuaraan musim ini! Selamat bagi para pemenang!"
  ]
};

// Simulation Race Variables
let raceCars = [];
let totalLaps = 20;
let currentLapGlobal = 1;
let isRacing = false;
let raceInterval = null;
let activeRaceTrack = null;
let raceElapsedTime = 0; // Waktu balap berjalan (ms)

document.addEventListener("DOMContentLoaded", () => {
  initTeamSelectionModal();
  generate20RaceCalendar();
  initStandings120Drivers();
  updateFinancialUI();
});

// ==========================================
// 1. GENERATOR KLASEMEN 120 PEMBALAP (EXACT)
// ==========================================
function initStandings120Drivers() {
  gameData.driverStandings = {};
  gameData.teamStandings = {};

  if (typeof TEAMS_DATA === "undefined" || typeof INITIAL_DRIVERS === "undefined") return;

  // Inisialisasi 60 Tim
  TEAMS_DATA.forEach(t => {
    gameData.teamStandings[t.id] = { name: t.name, color: t.color, points: 0 };
  });

  // Inisialisasi Tepat 120 Driver (2 Driver per Tim)
  let driverIdCounter = 1;
  TEAMS_DATA.forEach(team => {
    for (let carNum = 1; carNum <= 2; carNum++) {
      let driverName = `Pembalap ${team.name} #${carNum}`;
      
      // Ambil nama dari INITIAL_DRIVERS jika tersedia
      let foundInDrivers = INITIAL_DRIVERS.find(d => d.teamId === team.id && d.carNumber === carNum);
      if (foundInDrivers) {
        driverName = foundInDrivers.name;
      }

      gameData.driverStandings[driverName] = {
        name: driverName,
        teamId: team.id,
        teamName: team.name,
        teamColor: team.color,
        points: 0
      };
      driverIdCounter++;
    }
  });
}

// ==========================================
// 2. SELEKSI TIM & MODAL
// ==========================================
function initTeamSelectionModal() {
  const container = document.getElementById("team-select-container");
  if (!container || typeof TEAMS_DATA === "undefined") return;

  container.innerHTML = TEAMS_DATA.map(t => `
    <div class="team-card-select" onclick="selectPlayerTeam('${t.id}')">
      <div class="team-badge" style="background: ${t.color}"></div>
      <div>
        <div style="font-weight:bold; color:#fff; font-size:13px;">${t.name}</div>
        <div style="font-size:10px; color:#8b949e;">Klik untuk Memilih</div>
      </div>
    </div>
  `).join('');
}

function selectPlayerTeam(teamId) {
  const selected = TEAMS_DATA.find(t => t.id === teamId);
  gameData.playerTeam = selected;

  document.getElementById("welcome-modal").style.display = "none";
  document.getElementById("player-team-name").innerText = selected.name;

  renderWelcomeBanner();
  updateFinancialUI();
  renderMarketCards();
  renderDriverCards();
  renderMechanicCards();
  renderGarageCards();
  renderMyGarageCars();
  renderStandingsUI();
}

function renderWelcomeBanner() {
  const container = document.getElementById("welcome-banner-container");
  if (!container || !gameData.playerTeam) return;

  container.innerHTML = `
    <div class="welcome-banner">
      <h2 style="color: #f39c12; margin-bottom: 5px;">🎉 Selamat Bergabung di Tim ${gameData.playerTeam.name}!</h2>
      <p style="color: #fff; font-size: 15px; font-weight:600; font-style: italic;">
        "Selamat bergabung di tim, semoga kita berhasil menjuarai Grand Prix ini!"
      </p>
      <p style="color: #8b949e; font-size: 12px; margin-top: 10px;">
        ⚠️ <strong>Garasi awal masih KOSONG:</strong> Beli 2 Mobil, kontrak 2 Pembalap & minimal 1 Mekanik dengan modal awal <strong>Rp 500.000.000</strong>.
      </p>
    </div>
  `;
}

// ==========================================
// 3. KALENDER 20 SIRKUIT BALAP (EXACT 20)
// ==========================================
function generate20RaceCalendar() {
  if (typeof TRACKS_DATA === "undefined") return;
  
  // Acak data sirkuit dan ambil tepat 20 sirkuit balap
  const shuffledTracks = [...TRACKS_DATA].sort(() => 0.5 - Math.random()).slice(0, 20);
  const startDate = new Date(2026, 5, 1);

  let schedule = [];
  for (let i = 0; i < 20; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (i * 7));

    schedule.push({
      raceNum: i + 1,
      dateStr: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      isRace: true,
      track: shuffledTracks[i]
    });
  }

  gameData.calendarSchedule = schedule;
  renderCalendarUI();
}

function renderCalendarUI() {
  const container = document.getElementById("calendar-container");
  if (!container) return;

  container.innerHTML = gameData.calendarSchedule.map((s, idx) => `
    <div class="calendar-day race-day ${idx === gameData.currentCalendarIndex ? 'active-day' : ''}">
      <div>
        <span class="date-num">📅 ${s.dateStr}</span>
        <div class="event-title">🏁 GP #${s.raceNum}: ${s.track.name}</div>
      </div>
      <div style="font-size:10px; color:#f39c12; margin-top:4px;">${s.track.type} (${s.track.lengthKm} KM)</div>
    </div>
  `).join('');
}

function startSeason() {
  if (gameData.myCars.length < 2) {
    alert("❌ Syarat Belum Terpenuhi: Kamu harus memiliki 2 Mobil balap!");
    return;
  }
  if (gameData.myDrivers.length < 2) {
    alert("❌ Syarat Belum Terpenuhi: Kamu harus mengontrak 2 Pembalap!");
    return;
  }
  if (gameData.myMechanics.length < 1) {
    alert("❌ Syarat Belum Terpenuhi: Kamu harus mengontrak minimal 1 Mekanik!");
    return;
  }

  gameData.seasonStarted = true;
  document.getElementById("btn-start-season").style.display = "none";
  document.getElementById("btn-next-day").style.display = "inline-block";
  alert("🎉 MUSIM BALAP 20 SIRKUIT RESMI DIMULAI!");
}

function advanceCalendarDay() {
  if (!gameData.seasonStarted) return;

  if (gameData.currentCalendarIndex < gameData.calendarSchedule.length) {
    const currentEvent = gameData.calendarSchedule[gameData.currentCalendarIndex];
    document.getElementById("current-game-date").innerText = currentEvent.dateStr;
    renderCalendarUI();

    activeRaceTrack = currentEvent.track;
    alert(`🏁 HARI BALAPAN GP #${currentEvent.raceNum}! Sirkuit ${activeRaceTrack.name}.`);
    switchTab('tab-race');
    prepareRaceGrid();
  } else {
    alert("🏆 MUSIM BALAP 20 SIRKUIT TELAH SELESAI!");
  }
}

// ==========================================
// 4. GARASI DEDIKASI (DIAGNOSIS DURABILITY)
// ==========================================
function renderMyGarageCars() {
  const container = document.getElementById("my-garage-container");
  if (!container) return;

  if (gameData.myCars.length === 0) {
    container.innerHTML = `<p style="color:#e74c3c; grid-column:1/-1;">⚠️ Belum ada mobil di garasi tim Anda. Silakan beli di menu Toko Mobil Awal.</p>`;
    return;
  }

  container.innerHTML = gameData.myCars.map((car, idx) => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">🚐 ${car.name} (Mobil #${idx + 1})</span>
          <span class="card-badge">Base Speed: ${car.baseSpeed} KM/H</span>
        </div>
        
        <div class="card-stats">
          <div class="stat-row">
            <span>Kondisi Mesin:</span>
            <span>${car.durabilityEngine || 100}%</span>
          </div>
          <div class="durability-bar">
            <div class="durability-fill" style="width: ${car.durabilityEngine || 100}%; background: ${getDurabilityColor(car.durabilityEngine || 100)};"></div>
          </div>

          <div class="stat-row" style="margin-top: 8px;">
            <span>Kondisi Bodi/Sasis:</span>
            <span>${car.durabilityBody || 100}%</span>
          </div>
          <div class="durability-bar">
            <div class="durability-fill" style="width: ${car.durabilityBody || 100}%; background: ${getDurabilityColor(car.durabilityBody || 100)};"></div>
          </div>

          <div class="stat-row" style="margin-top: 8px;">
            <span>Kondisi Ban (Kompon):</span>
            <span>${car.durabilityTires || 100}%</span>
          </div>
          <div class="durability-bar">
            <div class="durability-fill" style="width: ${car.durabilityTires || 100}%; background: ${getDurabilityColor(car.durabilityTires || 100)};"></div>
          </div>
        </div>
      </div>

      <div style="font-size:11px; color:#8b949e; margin-top:10px; border-top:1px solid #30363d; padding-top:6px;">
        🛠️ Perbaikan ditangani oleh ${gameData.myMechanics.length} Kepala Mekanik (Bengkel Lv. ${gameData.workshopLevel}).
      </div>
    </div>
  `).join('');
}

function getDurabilityColor(val) {
  if (val > 70) return "#2ecc71";
  if (val > 35) return "#f39c12";
  return "#e74c3c";
}

// ==========================================
// 5. LIVE RACE ENGINE, KOMENTATOR & FULL TIME
// ==========================================
function prepareRaceGrid() {
  if (!activeRaceTrack) return;

  document.getElementById("race-track-name").innerText = `🏁 ${activeRaceTrack.name} (${activeRaceTrack.lengthKm} KM)`;
  document.getElementById("race-status").innerText = "READY AT GRID";
  document.getElementById("btn-toggle-race").innerText = "🟢 MULAI START BALAPAN";
  isRacing = false;
  currentLapGlobal = 1;
  totalLaps = activeRaceTrack.lapsDefault || 20;
  raceElapsedTime = 0;

  addCommentary(`🎙️ [START] Para pembalap dan 60 tim telah bersiap di grid sirkuit ${activeRaceTrack.name}!`);

  raceCars = [];
  let usedNumbers = new Set();
  function getUniqueCarNumber() {
    let num;
    do { num = Math.floor(Math.random() * 999) + 1; } while (usedNumbers.has(num));
    usedNumbers.add(num);
    return num;
  }

  let globalCarIdx = 0;

  TEAMS_DATA.forEach((team) => {
    const isPlayer = (gameData.playerTeam && team.id === gameData.playerTeam.id);

    for (let i = 0; i < 2; i++) {
      let driverName = `Pembalap ${team.name} #${i + 1}`;
      let carNumber = getUniqueCarNumber();
      let actualSpeed = 120 + Math.random() * 20; // Default base speed

      if (isPlayer) {
        let pDriver = gameData.myDrivers[i];
        let pCar = gameData.myCars[i];
        if (pDriver) driverName = pDriver.name;
        
        // Pengaruh Kecepatan Nyata (Base Speed Mobil + Handling Bonus)
        if (pCar) {
          actualSpeed = pCar.baseSpeed + ((pCar.baseHandling || 50) * 0.2);
        }
      } else {
        // Ambil nama dari daftar driver jika ada
        let matchKeys = Object.keys(gameData.driverStandings).filter(k => gameData.driverStandings[k].teamId === team.id);
        if (matchKeys[i]) driverName = matchKeys[i];
      }

      raceCars.push({
        id: `car_${globalCarIdx + 1}`,
        number: carNumber,
        teamId: team.id,
        pos: globalCarIdx + 1,
        driverName: driverName,
        teamName: team.name,
        teamColor: team.color,
        isPlayer: isPlayer,
        distance: 0,
        currentLap: 1,
        speed: actualSpeed, // Kecepatan berfungsi nyata!
        totalTimeMs: 0,
        lastLapTime: 0,
        bestLapTime: null,
        lapStartTime: 0
      });

      globalCarIdx++;
    }
  });

  renderTimingTower();
}

function toggleRaceEngine() {
  if (!isRacing) {
    isRacing = true;
    document.getElementById("race-status").innerText = "RACING (GREEN FLAG) 🟢";
    document.getElementById("btn-toggle-race").innerText = "⏸️ PAUSE BALAPAN";
    
    addCommentary(`🏁 [GREEN FLAG] ${getRandomArrayItem(COMMENTARY_VOCAB.starts)}`);
    raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  } else {
    isRacing = false;
    clearInterval(raceInterval);
    document.getElementById("race-status").innerText = "PAUSED 🟡";
    document.getElementById("btn-toggle-race").innerText = "▶️ LANJUTKAN BALAPAN";
  }
}

function setSimSpeed(speed) {
  gameData.simSpeed = speed;
  if (isRacing) {
    clearInterval(raceInterval);
    raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  }
}

function updateRaceLogic() {
  let finished = true;
  raceElapsedTime += (100 * gameData.simSpeed);

  raceCars.forEach(car => {
    if (car.currentLap <= totalLaps) {
      finished = false;
      car.totalTimeMs += (100 * gameData.simSpeed);
      
      // Jarak dihitung berdasarkan Kecepatan Nyata
      car.distance += (car.speed * 0.15) + (Math.random() * 2);

      let calcLap = Math.floor(car.distance / 1000) + 1;
      if (calcLap > car.currentLap && car.currentLap <= totalLaps) {
        let lapTime = (car.totalTimeMs - car.lapStartTime) / 1000;
        car.lastLapTime = lapTime;
        if (!car.bestLapTime || lapTime < car.bestLapTime) car.bestLapTime = lapTime;

        car.currentLap = calcLap;
        car.lapStartTime = car.totalTimeMs;
      }
    }
  });

  // Urutkan Posisi
  raceCars.sort((a, b) => b.distance - a.distance);
  raceCars.forEach((c, idx) => c.pos = idx + 1);

  currentLapGlobal = Math.min(raceCars[0].currentLap, totalLaps);
  document.getElementById("race-lap-counter").innerText = `LAP ${currentLapGlobal} / ${totalLaps}`;

  // Komentator Otomatis saat balap berjalan
  if (Math.random() < 0.08) {
    let topCar = raceCars[0];
    let fightCar = raceCars[1];
    if (Math.random() < 0.5) {
      addCommentary(`🎙️ [LAP ${currentLapGlobal}] ${getRandomArrayItem(COMMENTARY_VOCAB.battles)} (${topCar.driverName} vs ${fightCar.driverName})`);
    } else {
      addCommentary(`⚡ [LAP ${currentLapGlobal}] ${getRandomArrayItem(COMMENTARY_VOCAB.overtakes)}`);
    }
  }

  renderTimingTower();

  if (finished || currentLapGlobal > totalLaps) {
    clearInterval(raceInterval);
    isRacing = false;
    document.getElementById("race-status").innerText = "CHECKERED FLAG 🏁";
    document.getElementById("btn-toggle-race").innerText = "Selesai";
    
    addCommentary(`🏁 [FINISH] ${getRandomArrayItem(COMMENTARY_VOCAB.finishes)} Pemenang: #${raceCars[0].number} ${raceCars[0].driverName}!`);

    calculateRacePoints();
    showPodiumModal();
    repairCarsPostRace();
    gameData.currentCalendarIndex++; // Lanjut ke jadwal berikutnya
  }
}

function renderTimingTower() {
  const tbody = document.getElementById("timing-tower-body");
  if (!tbody) return;

  let leaderDist = raceCars[0]?.distance || 0;

  tbody.innerHTML = raceCars.map((car, idx) => {
    let gapText = idx === 0 ? "LEADER" : `+${((leaderDist - car.distance) / 100).toFixed(2)}s`;
    let intervalText = idx === 0 ? "-" : `+${((raceCars[idx - 1].distance - car.distance) / 100).toFixed(2)}s`;

    return `
      <tr style="${car.isPlayer ? 'background: rgba(243, 156, 18, 0.15);' : ''}">
        <td><strong>#${car.pos}</strong></td>
        <td>
          <div class="chamfer-badge" style="background: ${car.teamColor};">
            ${car.teamName}
          </div>
        </td>
        <td style="font-weight:bold; color:#fff;">
          <span style="color:#f39c12; font-family:monospace; margin-right:6px;">[#${car.number}]</span>${car.driverName}
        </td>
        <td style="font-family:monospace; color:#2ecc71;">${formatFullTime(car.totalTimeMs)}</td>
        <td>${gapText}</td>
        <td>${intervalText}</td>
        <td>${car.lastLapTime ? car.lastLapTime.toFixed(3) + 's' : '-'}</td>
        <td style="color:#f39c12;">${car.bestLapTime ? car.bestLapTime.toFixed(3) + 's' : '-'}</td>
      </tr>
    `;
  }).join('');
}

function addCommentary(msg) {
  const box = document.getElementById("race-commentary-stream");
  if (!box) return;

  const line = document.createElement("div");
  line.className = "commentary-line";
  line.innerText = msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function formatFullTime(ms) {
  let totalSec = Math.floor(ms / 1000);
  let min = Math.floor(totalSec / 60);
  let sec = totalSec % 60;
  let milli = Math.floor(ms % 1000);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${milli.toString().padStart(3, '0')}`;
}

function getRandomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==========================================
// 6. POIN, PODIUM & KLASEMEN 120 DRIVER
// ==========================================
function calculateRacePoints() {
  raceCars.forEach((car, index) => {
    let pts = RACE_POINTS_SYSTEM[index] || 0;
    if (pts > 0) {
      if (gameData.driverStandings[car.driverName]) {
        gameData.driverStandings[car.driverName].points += pts;
      }
      if (gameData.teamStandings[car.teamId]) {
        gameData.teamStandings[car.teamId].points += pts;
      }
    }
  });
  renderStandingsUI();
}

function showPodiumModal() {
  const modal = document.getElementById("podium-modal");
  const trackNameEl = document.getElementById("podium-track-name");
  const container = document.getElementById("podium-winners-display");

  if (!modal || !container) return;

  trackNameEl.innerText = `Grand Prix: ${activeRaceTrack ? activeRaceTrack.name : ''}`;

  let p1 = raceCars[0];
  let p2 = raceCars[1];
  let p3 = raceCars[2];

  container.innerHTML = `
    <div class="podium-step podium-2">
      <div style="font-size:10px;">POS 2 (+18 PTS)</div>
      <div style="font-size:12px; margin-top:4px;">[#${p2.number}]</div>
      <div>${p2.driverName}</div>
      <div style="font-size:9px; opacity:0.8;">${p2.teamName}</div>
    </div>
    <div class="podium-step podium-1">
      <div style="font-size:18px;">👑</div>
      <div style="font-size:10px;">JUARA 1 (+25 PTS)</div>
      <div style="font-size:12px; margin-top:4px;">[#${p1.number}]</div>
      <div>${p1.driverName}</div>
      <div style="font-size:9px; opacity:0.8;">${p1.teamName}</div>
    </div>
    <div class="podium-step podium-3">
      <div style="font-size:10px;">POS 3 (+15 PTS)</div>
      <div style="font-size:12px; margin-top:4px;">[#${p3.number}]</div>
      <div>${p3.driverName}</div>
      <div style="font-size:9px; opacity:0.8;">${p3.teamName}</div>
    </div>
  `;

  modal.style.display = "flex";
}

function closePodiumAndShowStandings() {
  document.getElementById("podium-modal").style.display = "none";
  switchTab('tab-standings');
}

function renderStandingsUI() {
  const driverBody = document.getElementById("driver-standings-body");
  const teamBody = document.getElementById("team-standings-body");

  // Render Tepat 120 Pembalap
  if (driverBody) {
    let sortedDrivers = Object.values(gameData.driverStandings).sort((a, b) => b.points - a.points);
    driverBody.innerHTML = sortedDrivers.map((d, idx) => `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td style="font-weight:bold; color:#fff;">${d.name}</td>
        <td><span style="color:${d.teamColor}; font-weight:bold;">●</span> ${d.teamName}</td>
        <td style="color:#f39c12; font-weight:bold;">${d.points} PTS</td>
      </tr>
    `).join('');
  }

  // Render 60 Tim
  if (teamBody) {
    let sortedTeams = Object.values(gameData.teamStandings).sort((a, b) => b.points - a.points);
    teamBody.innerHTML = sortedTeams.map((t, idx) => `
      <tr style="${gameData.playerTeam && t.name === gameData.playerTeam.name ? 'background: rgba(243, 156, 18, 0.15);' : ''}">
        <td><strong>#${idx + 1}</strong></td>
        <td><span style="color:${t.color}; font-weight:bold;">●</span> ${t.name}</td>
        <td style="color:#2ecc71; font-weight:bold;">${t.points} PTS</td>
      </tr>
    `).join('');
  }
}

function repairCarsPostRace() {
  if (gameData.myCars.length === 0) return;
  let repairRate = (gameData.myMechanics.length * 15) + (gameData.workshopLevel * 5);

  gameData.myCars.forEach(car => {
    // Kurangi Durability setelah balap
    car.durabilityEngine = Math.max(20, (car.durabilityEngine || 100) - Math.floor(Math.random() * 25));
    car.durabilityBody = Math.max(20, (car.durabilityBody || 100) - Math.floor(Math.random() * 20));
    car.durabilityTires = Math.max(10, (car.durabilityTires || 100) - Math.floor(Math.random() * 35));

    // Mekanik Memperbaiki
    car.durabilityEngine = Math.min(100, car.durabilityEngine + repairRate);
    car.durabilityBody = Math.min(100, car.durabilityBody + repairRate);
    car.durabilityTires = Math.min(100, car.durabilityTires + repairRate);
  });

  renderMyGarageCars();
}

// ==========================================
// 7. TOKO MOBIL & BURSA DRIVER/MEKANIK
// ==========================================
function renderDriverCards() {
  const container = document.getElementById("driver-cards-container");
  if (!container || typeof INITIAL_DRIVERS === "undefined") return;

  container.innerHTML = INITIAL_DRIVERS.slice(0, 10).map(drv => {
    const isHired = gameData.myDrivers.some(d => d.id === drv.id);
    const minOffer = Math.floor(drv.salaryPerRace * 0.5);
    const maxOffer = Math.floor(drv.salaryPerRace * 1.5);

    return `
      <div class="card-item">
        <div>
          <div class="card-header">
            <span class="card-title">🏎️ ${drv.name}</span>
            <span class="card-badge">${drv.trait ? drv.trait.name : 'Racer'}</span>
          </div>
          <div class="card-stats">
            <div class="stat-row"><span>Agresivitas:</span><span>${drv.aggression}</span></div>
            <div class="stat-row"><span>Ekspektasi:</span><span>Rp ${(drv.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container">
          <div class="slider-group">
            <div class="slider-label"><span>Gaji / Balap:</span><strong id="val-salary-drv-${drv.id}" style="color:#2ecc71;">Rp ${(drv.salaryPerRace / 1000000).toFixed(1)} Jt</strong></div>
            <input type="range" class="custom-slider" id="slider-salary-drv-${drv.id}" min="${minOffer}" max="${maxOffer}" step="500000" value="${drv.salaryPerRace}" oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>
          <div class="slider-group" style="margin-top: 8px;">
            <div class="slider-label"><span>Durasi Kontrak:</span><strong id="val-races-drv-${drv.id}" style="color:#f39c12;">7 Balapan</strong></div>
            <input type="range" class="custom-slider" id="slider-races-drv-${drv.id}" min="7" max="20" step="1" value="7" oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>
          <div class="total-contract-display">Total Kontrak: <span id="total-pay-drv-${drv.id}">Rp ${(drv.salaryPerRace * 7).toLocaleString('id-ID')}</span></div>
          <button class="btn-action" style="margin-top:8px;" ${isHired || gameData.myDrivers.length >= 2 ? 'disabled' : ''} onclick="negoDriver('${drv.id}')">${isHired ? 'Sudah Dikontrak' : (gameData.myDrivers.length >= 2 ? 'Slot Full (2/2)' : 'Ajukan Kontrak')}</button>
        </div>
      </div>
    `;
  }).join('');
}

function negoDriver(drvId) {
  const drv = INITIAL_DRIVERS.find(d => d.id === drvId);
  const offerPerRace = parseInt(document.getElementById(`slider-salary-drv-${drvId}`).value);
  const raceCount = parseInt(document.getElementById(`slider-races-drv-${drvId}`).value);

  if (offerPerRace >= drv.salaryPerRace * 0.85) {
    const totalPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalPayment) {
      gameData.cash -= totalPayment;
      gameData.myDrivers.push({ ...drv, salaryPerRace: offerPerRace, remainingRaces: raceCount });
      alert(`✅ Negosiasi Sukses!\n${drv.name} resmi dikontrak selama ${raceCount} balapan.`);
      updateFinancialUI();
      renderDriverCards();
    } else {
      alert(`❌ Modal kas tidak cukup!`);
    }
  } else {
    alert(`❌ Negosiasi Ditolak!`);
  }
}

function renderMechanicCards() {
  const container = document.getElementById("mechanic-cards-container");
  if (!container || typeof MECHANICS_DATA === "undefined") return;

  container.innerHTML = MECHANICS_DATA.slice(0, 10).map(mech => {
    const isHired = gameData.myMechanics.some(m => m.id === mech.id);
    const minOffer = Math.floor(mech.salaryPerRace * 0.5);
    const maxOffer = Math.floor(mech.salaryPerRace * 1.5);

    return `
      <div class="card-item">
        <div>
          <div class="card-header">
            <span class="card-title">👨‍🔧 ${mech.name}</span>
            <span class="card-badge">Rating: ${mech.engineRating}</span>
          </div>
          <div class="card-stats">
            <div class="stat-row"><span>Spesialis:</span><span>${mech.specialty}</span></div>
            <div class="stat-row"><span>Ekspektasi:</span><span>Rp ${(mech.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container">
          <div class="slider-group">
            <div class="slider-label"><span>Gaji / Balap:</span><strong id="val-salary-mech-${mech.id}" style="color:#2ecc71;">Rp ${(mech.salaryPerRace / 1000000).toFixed(1)} Jt</strong></div>
            <input type="range" class="custom-slider" id="slider-salary-mech-${mech.id}" min="${minOffer}" max="${maxOffer}" step="500000" value="${mech.salaryPerRace}" oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>
          <div class="slider-group" style="margin-top: 8px;">
            <div class="slider-label"><span>Durasi Kontrak:</span><strong id="val-races-mech-${mech.id}" style="color:#f39c12;">7 Balapan</strong></div>
            <input type="range" class="custom-slider" id="slider-races-mech-${mech.id}" min="7" max="20" step="1" value="7" oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>
          <div class="total-contract-display">Total Kontrak: <span id="total-pay-mech-${mech.id}">Rp ${(mech.salaryPerRace * 7).toLocaleString('id-ID')}</span></div>
          <button class="btn-action" style="margin-top:8px;" ${isHired ? 'disabled' : ''} onclick="negoMechanic('${mech.id}')">${isHired ? 'Sudah Dikontrak' : 'Ajukan Kontrak'}</button>
        </div>
      </div>
    `;
  }).join('');
}

function negoMechanic(mechId) {
  const mech = MECHANICS_DATA.find(m => m.id === mechId);
  const offerPerRace = parseInt(document.getElementById(`slider-salary-mech-${mechId}`).value);
  const raceCount = parseInt(document.getElementById(`slider-races-mech-${mechId}`).value);

  if (offerPerRace >= mech.salaryPerRace * 0.85) {
    const totalPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalPayment) {
      gameData.cash -= totalPayment;
      gameData.myMechanics.push({ ...mech, salaryPerRace: offerPerRace, remainingRaces: raceCount });
      alert(`✅ Kepala Mekanik ${mech.name} resmi dikontrak selama ${raceCount} balapan.`);
      updateFinancialUI();
      renderMechanicCards();
    } else {
      alert(`❌ Modal kas tidak cukup!`);
    }
  } else {
    alert(`❌ ${mech.name} menolak tawaran!`);
  }
}

function updateNegoCalc(type, id) {
  const salaryVal = parseInt(document.getElementById(`slider-salary-${type}-${id}`).value);
  const raceVal = parseInt(document.getElementById(`slider-races-${type}-${id}`).value);

  document.getElementById(`val-salary-${type}-${id}`).innerText = `Rp ${(salaryVal / 1000000).toFixed(1)} Jt`;
  document.getElementById(`val-races-${type}-${id}`).innerText = `${raceVal} Balapan`;
  document.getElementById(`total-pay-${type}-${id}`).innerText = `Rp ${(salaryVal * raceVal).toLocaleString('id-ID')}`;
}

function renderMarketCards() {
  const container = document.getElementById("market-cards-container");
  if (!container || typeof CAR_PRESETS === "undefined") return;

  container.innerHTML = CAR_PRESETS.map(car => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">${car.name}</span>
          <span class="card-badge">Rp ${(car.price / 1000000).toFixed(0)} Juta</span>
        </div>
        <div class="card-stats">
          <div class="stat-row"><span>Speed Dasar:</span><span>${car.baseSpeed} KM/H</span></div>
          <div class="stat-row"><span>Handling:</span><span>${car.baseHandling} / 100</span></div>
          <div class="stat-row"><span>Daya Tahan:</span><span>${car.baseDurability} / 100</span></div>
        </div>
      </div>
      <button class="btn-action" ${gameData.myCars.length >= 2 ? 'disabled' : ''} onclick="buyCar('${car.id}')">
        ${gameData.myCars.length >= 2 ? 'Slot Mobil Full (2/2)' : 'Beli Mobil Ini'}
      </button>
    </div>
  `).join('');
}

function buyCar(carId) {
  const car = CAR_PRESETS.find(c => c.id === carId);
  if (gameData.cash >= car.price) {
    gameData.cash -= car.price;
    gameData.myCars.push({ 
      ...car, 
      instanceId: 'car_' + Date.now(), 
      durabilityEngine: 100, 
      durabilityBody: 100, 
      durabilityTires: 100 
    });
    alert(`🎉 Berhasil membeli ${car.name}! Sisa modal: Rp ${gameData.cash.toLocaleString('id-ID')}`);
    updateFinancialUI();
    renderMarketCards();
    renderGarageCards();
    renderMyGarageCars();
  } else {
    alert("❌ Modal kas tidak cukup!");
  }
}

function renderGarageCards() {
  const container = document.getElementById("garage-cards-container");
  if (!container) return;

  let html = `
    <div style="grid-column:1/-1; background:#161b22; padding:12px; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="color:#f39c12; margin:0;">Level Bengkel Tim: Level ${gameData.workshopLevel} / 5</h4>
        <span style="font-size:11px; color:#8b949e;">Mekanik Aktif: ${gameData.myMechanics.length} Orang</span>
      </div>
      <button class="btn-action" style="width:auto; padding:6px 15px;" onclick="upgradeWorkshop()">Upgrade Bengkel (Rp ${(gameData.workshopLevel * 75).toFixed(0)} Jt)</button>
    </div>
  `;

  if (typeof MODS_CATALOG !== "undefined") {
    const allMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
    html += allMods.map(mod => `
      <div class="card-item">
        <div>
          <div class="card-header"><span class="card-title">🔧 ${mod.name}</span><span class="card-badge">Rp ${(mod.cost / 1000000).toFixed(1)} Jt</span></div>
          <div class="card-stats">
            ${mod.speedBonus ? `<div class="stat-row"><span>Bonus Speed:</span><span>+${mod.speedBonus} KM/H</span></div>` : ''}
            ${mod.handlingBonus ? `<div class="stat-row"><span>Bonus Handling:</span><span>+${mod.handlingBonus}</span></div>` : ''}
          </div>
        </div>
        <button class="btn-action" onclick="installModToCar('${mod.id}')">Pasang ke Mobil Tim</button>
      </div>
    `).join('');
  }

  container.innerHTML = html;
}

function installModToCar(modId) {
  if (gameData.myCars.length === 0) {
    alert("Belum ada mobil di garasi!");
    return;
  }
  const allMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
  const mod = allMods.find(m => m.id === modId);

  if (gameData.cash >= mod.cost) {
    gameData.cash -= mod.cost;
    let targetCar = gameData.myCars[0];
    if (mod.speedBonus) targetCar.baseSpeed += mod.speedBonus;
    if (mod.handlingBonus) targetCar.baseHandling += mod.handlingBonus;
    
    alert(`✅ Modifikasi ${mod.name} berhasil dipasang pada ${targetCar.name}! Base speed bertambah menjadi ${targetCar.baseSpeed} KM/H.`);
    updateFinancialUI();
    renderMyGarageCars();
  } else {
    alert("❌ Modal kas tidak cukup!");
  }
}

function upgradeWorkshop() {
  if (gameData.workshopLevel >= 5) return;
  let upgradeCost = gameData.workshopLevel * 75000000;
  if (gameData.cash >= upgradeCost) {
    gameData.cash -= upgradeCost;
    gameData.workshopLevel++;
    alert(`🎉 Bengkel berhasil di-upgrade ke Level ${gameData.workshopLevel}!`);
    updateFinancialUI();
    renderGarageCards();
  } else {
    alert(`Modal tidak mencukupi!`);
  }
}

function updateFinancialUI() {
  const cashEl = document.getElementById("team-cash");
  if (cashEl) cashEl.innerText = `Rp ${gameData.cash.toLocaleString('id-ID')}`;
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  
  if (event && event.target) event.target.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}
