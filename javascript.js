/* ============================================================
   NASCOT CHAMPIONSHIP MANAGER - COMPLETE INTEGRATED ENGINE
   ============================================================ */

// --- STATE UTAMA GAME & LOCALSTORAGE ---
let gameData = {
  cash: 500000000,
  sponsor: "Toko Sparepart Jaya",
  activeSponsors: [],
  points: 0,
  currentDate: new Date(2026, 5, 1),
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

// --- SIMULATION & LIVE RACE STATE ---
let raceCars = [];
let totalLaps = 20;
let currentLapGlobal = 1;
let isRacing = false;
let raceInterval = null;
let activeRaceTrack = null;
let raceElapsedTime = 0;

let liveRaceData = {
  weather: { type: 'Cerah ☀️', grip: 1.0, rec: 'Soft' },
  userTyreChoice: 'Soft'
};

const RACE_POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

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

// --- WEB AUDIO API ENGINE ---
const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e){}
  },
  playRaceEngine() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch(e){}
  },
  playVictory() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.25);
      });
    } catch(e){}
  }
};

// --- INISIALISASI GAME ---
document.addEventListener("DOMContentLoaded", () => {
  loadGameFromStorage();
  initTeamSelectionModal();
  generate40RaceCalendar(); // <-- Peta Kalender 40 Balapan (8 Bulan)
  initStandings120Drivers();
  updateFinancialUI();
  renderSponsorTab();

  if (gameData.playerTeam) {
    document.getElementById("welcome-modal").style.display = "none";
    document.getElementById("player-team-name").innerText = gameData.playerTeam.name;
    renderWelcomeBanner();
    renderMarketCards();
    renderDriverCards();
    renderMechanicCards();
    renderGarageCards();
    renderMyGarageCars();
    renderStandingsUI();
  }
});

function updateFinancialUI() {
  const cashEl = document.getElementById("team-cash");
  if (cashEl) cashEl.innerText = `Rp ${gameData.cash.toLocaleString('id-ID')}`;
  const dateEl = document.getElementById("current-game-date");
  if (dateEl && gameData.currentDate) {
    dateEl.innerText = formatDate(gameData.currentDate);
  }
  saveGameToStorage();
}

function formatDate(d) {
  const dateObj = new Date(d);
  return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// --- LOCALSTORAGE & EXPORT/IMPORT ---
function saveGameToStorage() {
  try {
    localStorage.setItem('NASCOT_GAME_DATA', JSON.stringify(gameData));
  } catch (e) {}
}

function loadGameFromStorage() {
  const saved = localStorage.getItem('NASCOT_GAME_DATA');
  if (saved) {
    try {
      gameData = JSON.parse(saved);
      if (gameData.currentDate) gameData.currentDate = new Date(gameData.currentDate);
    } catch (e) {}
  }
}

function exportSaveData() {
  AudioEngine.playClick();
  const json = JSON.stringify(gameData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nascot_save_${Date.now()}.json`;
  a.click();
}

function importSaveData(event) {
  AudioEngine.playClick();
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      gameData = JSON.parse(e.target.result);
      if (gameData.currentDate) gameData.currentDate = new Date(gameData.currentDate);
      alert('✅ Save Data Berhasil Dimuat!');
      location.reload();
    } catch (err) {
      alert('❌ Format File Save Tidak Valid!');
    }
  };
  reader.readAsText(file);
}

// --- KLASEMEN 120 DRIVERS ---
function initStandings120Drivers() {
  if (Object.keys(gameData.driverStandings).length > 0) return;
  gameData.driverStandings = {};
  gameData.teamStandings = {};

  if (typeof TEAMS_DATA === "undefined") return;

  TEAMS_DATA.forEach(t => {
    gameData.teamStandings[t.id] = { name: t.name, color: t.color, points: 0 };
  });

  TEAMS_DATA.forEach(team => {
    for (let carNum = 1; carNum <= 2; carNum++) {
      let driverName = `Pembalap ${team.name} #${carNum}`;
      if (typeof INITIAL_DRIVERS !== "undefined") {
        let found = INITIAL_DRIVERS.find(d => d.teamId === team.id && d.carNumber === carNum);
        if (found) driverName = found.name;
      }

      gameData.driverStandings[driverName] = {
        name: driverName,
        teamId: team.id,
        teamName: team.name,
        teamColor: team.color,
        points: 0
      };
    }
  });
}

// --- MODAL SELEKSI TIM ---
function initTeamSelectionModal() {
  const container = document.getElementById("team-select-container");
  if (!container || typeof TEAMS_DATA === "undefined") return;

  container.innerHTML = TEAMS_DATA.map(t => `
    <div class="team-card-select" style="cursor:pointer;" onclick="selectPlayerTeam('${t.id}')">
      <div class="team-badge" style="background: ${t.color}"></div>
      <div>
        <div style="font-weight:bold; color:#fff; font-size:13px;">${t.name}</div>
        <div style="font-size:10px; color:#8b949e;">Klik untuk Memilih Tim Ini</div>
      </div>
    </div>
  `).join('');
}

function selectPlayerTeam(teamId) {
  AudioEngine.playClick();
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
    <div class="welcome-banner" style="background:#161b22; padding:15px; border-radius:8px; border:1px solid #30363d; margin-bottom:15px;">
      <h2 style="color: #f39c12; margin-bottom: 5px;">🎉 Selamat Bergabung di Tim ${gameData.playerTeam.name}!</h2>
      <p style="color: #fff; font-size: 14px; font-weight:600; font-style: italic;">
        "Selamat bertugas! Kelola tim balap Anda untuk merebut mahkota Juara Grand Prix."
      </p>
      <p style="color: #8b949e; font-size: 12px; margin-top: 8px;">
        ⚠️ <strong>Persiapan Karir:</strong> Beli 2 Mobil, kontrak 2 Pembalap & minimal 1 Mekanik dengan modal awal Anda.
      </p>
    </div>
  `;
}

// --- KALENDER BALAP 40 SERI (DISEBAR 8 BULAN) ---
function generate40RaceCalendar() {
  if (typeof TRACKS_DATA === "undefined") return;

  // Jika kalender sudah tersimpan dan jumlahnya 40, langsung render
  if (gameData.calendarSchedule && gameData.calendarSchedule.length === 40) {
    renderCalendarUI();
    return;
  }

  const startDate = new Date(2026, 5, 1); // 1 Juni 2026
  let schedule = [];

  let poolTracks = [];
  while (poolTracks.length < 40) {
    poolTracks = poolTracks.concat([...TRACKS_DATA].sort(() => 0.5 - Math.random()));
  }
  const selectedTracks = poolTracks.slice(0, 40);

  // Menyebar 40 balapan dalam waktu 8 bulan (~sekitar 6 hari sekali)
  for (let i = 0; i < 40; i++) {
    let raceDate = new Date(startDate);
    raceDate.setDate(startDate.getDate() + Math.floor(i * 5.8));

    schedule.push({
      raceNum: i + 1,
      dateStr: raceDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateRaw: raceDate.toISOString(),
      isRace: true,
      track: selectedTracks[i]
    });
  }

  gameData.calendarSchedule = schedule;
  saveGameToStorage();
  renderCalendarUI();
}

function renderCalendarUI() {
  const container = document.getElementById("calendar-container");
  if (!container) return;

  if (!gameData.calendarSchedule || gameData.calendarSchedule.length === 0) {
    container.innerHTML = `<p style="color:#8b949e; grid-column:1/-1;">Sedang memuat jadwal balap...</p>`;
    return;
  }

  container.innerHTML = gameData.calendarSchedule.map((s, idx) => `
    <div class="calendar-day race-day ${idx === gameData.currentCalendarIndex ? 'active-day' : ''}" style="background:#161b22; border:1px solid ${idx === gameData.currentCalendarIndex ? '#f39c12':'#30363d'}; padding:10px; border-radius:6px;">
      <div>
        <span class="date-num" style="font-size:11px; color:#8b949e;">📅 ${s.dateStr}</span>
        <div class="event-title" style="font-weight:bold; color:#fff; font-size:12px; margin-top:2px;">🏁 GP #${s.raceNum}: ${s.track.name}</div>
      </div>
      <div style="font-size:10px; color:#f39c12; margin-top:4px;">${s.track.type || 'Sirkuit'} (${s.track.lengthKm || 3.8} KM)</div>
    </div>
  `).join('');
}

function advanceCalendarDay() {
  AudioEngine.playClick();
  if (!gameData.currentDate) gameData.currentDate = new Date(2026, 5, 1);
  gameData.currentDate.setDate(gameData.currentDate.getDate() + 1);

  // Potongan Mingguan (Senin)
  if (gameData.currentDate.getDay() === 1) {
    const weeklyCost = 5000000;
    gameData.cash -= weeklyCost;
    addCommentary(`💸 [FINANSIAL] Biaya operasional mingguan terpotong Rp ${weeklyCost.toLocaleString('id-ID')}`);
  }

  // Event Acak Harian (Peluang 20%)
  if (Math.random() < 0.20) {
    triggerRandomDailyEvent();
  }

  updateFinancialUI();

  if (gameData.calendarSchedule.length > 0 && gameData.currentCalendarIndex < gameData.calendarSchedule.length) {
    const currentEvent = gameData.calendarSchedule[gameData.currentCalendarIndex];
    renderCalendarUI();

    if (gameData.currentDate.getTime() >= new Date(currentEvent.dateRaw || currentEvent.dateStr).getTime()) {
      activeRaceTrack = currentEvent.track;
      alert(`🏁 HARI BALAPAN GP #${currentEvent.raceNum}! Sirkuit ${activeRaceTrack.name}.`);
      switchTab('tab-race');
      prepareRaceGrid();
    }
  }
}

function triggerRandomDailyEvent() {
  const events = [
    { text: "👨‍🔧 Mekanik menemukan setup aerodinamis baru! (+3 Power/Speed Mobil)", action: () => { if(gameData.myCars[0]) gameData.myCars[0].baseSpeed += 3; } },
    { text: "💸 Masalah kelistrikan bengkel! Kas berkurang Rp 10.000.000", action: () => { gameData.cash -= 10000000; } },
    { text: "🌟 Driver mendapatkan liputan media nasional! Moral tim meningkat.", action: () => { gameData.cash += 5000000; } },
    { text: "🌧️ Cuaca buruk melanda area bengkel, perawatan ringan diselesaikan.", action: () => {} }
  ];
  const ev = events[Math.floor(Math.random() * events.length)];
  ev.action();
  alert(`[BERITA TIM] ${ev.text}`);
}

// --- SPONSOR TAB ---
function renderSponsorTab() {
  const container = document.getElementById('sponsor-cards-container');
  if (!container) return;

  const sponsorList = [
    { id: 'sp1', name: 'Pertamina Turbo', bonusPerRace: 25000000, req: 'Finish Top 5' },
    { id: 'sp2', name: 'Bank Central Asia', bonusPerRace: 40000000, req: 'Juara 1' },
    { id: 'sp3', name: 'Kopi Kapal Api', bonusPerRace: 15000000, req: 'Selesaikan Balapan' }
  ];

  container.innerHTML = sponsorList.map(s => {
    const isSigned = gameData.activeSponsors && gameData.activeSponsors.includes(s.id);
    return `
      <div class="card-item panel-box">
        <h4>🏢 ${s.name}</h4>
        <p style="font-size:12px; margin-top:4px;">Bonus: Rp ${s.bonusPerRace.toLocaleString('id-ID')} / Race</p>
        <p style="font-size:12px; color:#f39c12;">Syarat Target: ${s.req}</p>
        <button class="btn-action" style="margin-top:10px; background:${isSigned ? '#238636':'#1f6feb'};" ${isSigned ? 'disabled':''} onclick="signSponsor('${s.id}')">
          ${isSigned ? 'Telah Terkontrak' : 'Tanda Tangan Kontrak'}
        </button>
      </div>
    `;
  }).join('');
}

function signSponsor(id) {
  AudioEngine.playClick();
  if (!gameData.activeSponsors) gameData.activeSponsors = [];
  if (!gameData.activeSponsors.includes(id)) {
    gameData.activeSponsors.push(id);
    updateFinancialUI();
    renderSponsorTab();
  }
}

// --- GARASI & DIAGNOSTIK MOBIL ---
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
        🛠️ Bengkel Lv. ${gameData.workshopLevel} | Perbaikan Manual Rp 15.000.000
      </div>
      <button class="btn-action" style="margin-top:8px; background:#d35400;" onclick="manualRepairCar(${idx})">👨‍🔧 Servis Full Mobil</button>
    </div>
  `).join('');
}

function manualRepairCar(idx) {
  if (gameData.cash >= 15000000) {
    AudioEngine.playClick();
    gameData.cash -= 15000000;
    gameData.myCars[idx].durabilityEngine = 100;
    gameData.myCars[idx].durabilityBody = 100;
    gameData.myCars[idx].durabilityTires = 100;
    updateFinancialUI();
    renderMyGarageCars();
  } else {
    alert("❌ Modal kas tidak mencukupi!");
  }
}

function getDurabilityColor(val) {
  if (val > 70) return "#2ecc71";
  if (val > 35) return "#f39c12";
  return "#e74c3c";
}

// --- LIVE RACE ENGINE, PIT STOP & CANVAS RADAR ---
function prepareRaceGrid() {
  if (!activeRaceTrack && typeof TRACKS_DATA !== "undefined") {
    activeRaceTrack = TRACKS_DATA[0];
  }

  const weatherList = [
    { type: 'Cerah ☀️', grip: 1.0, rec: 'Soft' },
    { type: 'Mendung ☁️', grip: 0.95, rec: 'Medium' },
    { type: 'Hujan Deras 🌧️', grip: 0.70, rec: 'Wet' }
  ];
  liveRaceData.weather = weatherList[Math.floor(Math.random() * weatherList.length)];

  document.getElementById("race-track-name").innerText = `🏁 ${activeRaceTrack.name} (${activeRaceTrack.lengthKm} KM)`;
  document.getElementById("race-status").innerText = `KONDISI: ${liveRaceData.weather.type} (Grip: ${liveRaceData.weather.grip})`;
  document.getElementById("btn-toggle-race").innerText = "🟢 MULAI START BALAPAN";
  isRacing = false;
  currentLapGlobal = 1;
  totalLaps = activeRaceTrack.lapsDefault || 20;
  raceElapsedTime = 0;

  addCommentary(`🎙️ [START] Cuaca sirkuit saat ini ${liveRaceData.weather.type}. Rekomendasi Ban: ${liveRaceData.weather.rec}`);

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
      let actualSpeed = 120 + Math.random() * 20;

      if (isPlayer) {
        let pDriver = gameData.myDrivers[i];
        let pCar = gameData.myCars[i];
        if (pDriver) driverName = pDriver.name;
        if (pCar) {
          actualSpeed = pCar.baseSpeed + ((pCar.baseHandling || 50) * 0.2);
        }
      } else {
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
        speed: actualSpeed,
        durability: 100,
        tyre: isPlayer ? liveRaceData.userTyreChoice : (Math.random() < 0.5 ? 'Soft' : 'Medium'),
        totalTimeMs: 0,
        lastLapTime: 0,
        bestLapTime: null,
        lapStartTime: 0
      });

      globalCarIdx++;
    }
  });

  renderTimingTower();
  drawRaceRadar();
}

function toggleRaceEngine() {
  if (!isRacing) {
    AudioEngine.playRaceEngine();
    isRacing = true;
    document.getElementById("race-status").innerText = `RACING (${liveRaceData.weather.type}) 🟢`;
    document.getElementById("btn-toggle-race").innerText = "⏸️ PAUSE BALAPAN";
    document.getElementById("btn-toggle-race").style.background = "#e74c3c";
    
    addCommentary(`🏁 [GREEN FLAG] ${getRandomArrayItem(COMMENTARY_VOCAB.starts)}`);
    raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  } else {
    AudioEngine.playClick();
    isRacing = false;
    clearInterval(raceInterval);
    document.getElementById("race-status").innerText = "PAUSED 🟡";
    document.getElementById("btn-toggle-race").innerText = "▶️ LANJUTKAN BALAPAN";
    document.getElementById("btn-toggle-race").style.background = "#238636";
  }
}

function setSimSpeed(speed) {
  AudioEngine.playClick();
  gameData.simSpeed = speed;
  if (isRacing) {
    clearInterval(raceInterval);
    raceInterval = setInterval(updateRaceLogic, 100 / gameData.simSpeed);
  }
}

function triggerPitStop() {
  if (!isRacing) return;
  AudioEngine.playClick();
  
  let playerCars = raceCars.filter(c => c.isPlayer);
  playerCars.forEach(p => {
    p.totalTimeMs += 15000; // Penalti pit stop 15 detik
    p.durability = 100;
    p.speed += 2; // Penggantian ban baru
    addCommentary(`👨‍🔧 [PIT STOP] ${p.driverName} masuk pit stop! Ban baru terpasang & durabilitas dipulihkan (+15s penalty).`);
  });

  if (gameData.myCars.length > 0) {
    gameData.myCars.forEach(car => {
      car.durabilityEngine = 100;
      car.durabilityBody = 100;
      car.durabilityTires = 100;
    });
    renderMyGarageCars();
  }
}

function updateRaceLogic() {
  let finished = true;
  raceElapsedTime += (100 * gameData.simSpeed);

  raceCars.forEach(car => {
    if (car.currentLap <= totalLaps) {
      finished = false;
      car.totalTimeMs += (100 * gameData.simSpeed);
      
      // Pengaruh Cuaca & Ban
      let weatherGrip = liveRaceData.weather.grip;
      if (car.tyre === liveRaceData.weather.rec) weatherGrip += 0.1;
      
      // Keausan Ban/Mobil
      car.durability -= (0.05 * gameData.simSpeed);
      let wearPenalty = car.durability < 40 ? 0.85 : 1.0;

      car.distance += ((car.speed * weatherGrip * wearPenalty) * 0.15) + (Math.random() * 2);

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

  raceCars.sort((a, b) => b.distance - a.distance);
  raceCars.forEach((c, idx) => c.pos = idx + 1);

  currentLapGlobal = Math.min(raceCars[0].currentLap, totalLaps);
  document.getElementById("race-lap-counter").innerText = `LAP ${currentLapGlobal} / ${totalLaps}`;

  if (Math.random() < 0.08) {
    let topCar = raceCars[0];
    let fightCar = raceCars[1];
    if (Math.random() < 0.5 && fightCar) {
      addCommentary(`🎙️ [LAP ${currentLapGlobal}] ${getRandomArrayItem(COMMENTARY_VOCAB.battles)} (${topCar.driverName} vs ${fightCar.driverName})`);
    } else {
      addCommentary(`⚡ [LAP ${currentLapGlobal}] ${getRandomArrayItem(COMMENTARY_VOCAB.overtakes)}`);
    }
  }

  renderTimingTower();
  drawRaceRadar();

  if (finished || currentLapGlobal > totalLaps) {
    clearInterval(raceInterval);
    isRacing = false;
    document.getElementById("race-status").innerText = "CHECKERED FLAG 🏁";
    document.getElementById("btn-toggle-race").innerText = "Selesai Balapan";
    document.getElementById("btn-toggle-race").style.background = "#238636";
    
    AudioEngine.playVictory();
    addCommentary(`🏁 [FINISH] ${getRandomArrayItem(COMMENTARY_VOCAB.finishes)} Pemenang: #${raceCars[0].number} ${raceCars[0].driverName}!`);

    calculateRacePoints();
    showPodiumModal();
    repairCarsPostRace();
    gameData.currentCalendarIndex++;
  }
}

function renderTimingTower() {
  const tbody = document.getElementById("timing-tower-body");
  if (!tbody) return;

  let leaderDist = raceCars[0]?.distance || 0;

  tbody.innerHTML = raceCars.map((car, idx) => {
    let gapText = idx === 0 ? "LEADER" : `+${((leaderDist - car.distance) / 100).toFixed(2)}s`;

    return `
      <tr style="${car.isPlayer ? 'background: rgba(243, 156, 18, 0.2); font-weight:bold;' : ''}">
        <td><strong>#${car.pos}</strong></td>
        <td>
          <div class="chamfer-badge" style="background: ${car.teamColor}; padding:2px 6px; border-radius:4px; font-size:11px;">
            ${car.teamName}
          </div>
        </td>
        <td style="color:#fff;">
          <span style="color:#f39c12; font-family:monospace; margin-right:6px;">[#${car.number}]</span>${car.driverName} ${car.isPlayer ? '⭐' : ''}
        </td>
        <td style="font-family:monospace; color:#2ecc71;">${formatFullTime(car.totalTimeMs)}</td>
        <td>${gapText}</td>
        <td>${car.tyre || 'Soft'}</td>
        <td><span style="color:${car.durability < 40 ? '#e74c3c':'#2ecc71'}">${Math.max(0, car.durability).toFixed(0)}%</span></td>
        <td style="color:#f39c12;">${car.bestLapTime ? car.bestLapTime.toFixed(3) + 's' : '-'}</td>
      </tr>
    `;
  }).join('');
}

function drawRaceRadar() {
  const canvas = document.getElementById('race-radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Outer Track
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height / 2, 240, 40, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw Cars on Track Radar
  raceCars.forEach((car, idx) => {
    const progress = ((car.distance % 1000) / 1000);
    const angle = progress * 2 * Math.PI;
    const x = canvas.width / 2 + 240 * Math.cos(angle);
    const y = canvas.height / 2 + 40 * Math.sin(angle);
    
    ctx.fillStyle = car.isPlayer ? '#f1c40f' : (idx === 0 ? '#2ecc71' : '#e74c3c');
    ctx.beginPath();
    ctx.arc(x, y, car.isPlayer ? 6 : 4, 0, 2 * Math.PI);
    ctx.fill();
  });
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

// --- POIN & PODIUM MODAL ---
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

  // Pay Sponsor Bonuses if requirements are met
  if (gameData.activeSponsors && gameData.activeSponsors.length > 0) {
    let playerBestPos = raceCars.findIndex(c => c.isPlayer) + 1;
    if (playerBestPos > 0) {
      if (gameData.activeSponsors.includes('sp3')) gameData.cash += 15000000;
      if (gameData.activeSponsors.includes('sp1') && playerBestPos <= 5) gameData.cash += 25000000;
      if (gameData.activeSponsors.includes('sp2') && playerBestPos === 1) gameData.cash += 40000000;
    }
  }

  renderStandingsUI();
  updateFinancialUI();
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
      <div style="font-size:12px; margin-top:4px;">[#${p2 ? p2.number : '-'}]</div>
      <div>${p2 ? p2.driverName : '-'}</div>
    </div>
    <div class="podium-step podium-1">
      <div style="font-size:18px;">👑</div>
      <div style="font-size:10px;">JUARA 1 (+25 PTS)</div>
      <div style="font-size:12px; margin-top:4px;">[#${p1 ? p1.number : '-'}]</div>
      <div>${p1 ? p1.driverName : '-'}</div>
    </div>
    <div class="podium-step podium-3">
      <div style="font-size:10px;">POS 3 (+15 PTS)</div>
      <div style="font-size:12px; margin-top:4px;">[#${p3 ? p3.number : '-'}]</div>
      <div>${p3 ? p3.driverName : '-'}</div>
    </div>
  `;

  modal.style.display = "flex";
}

function closePodiumAndShowStandings() {
  AudioEngine.playClick();
  document.getElementById("podium-modal").style.display = "none";
  switchTab('tab-standings');
}

function renderStandingsUI() {
  const driverBody = document.getElementById("driver-standings-body");
  const teamBody = document.getElementById("team-standings-body");

  if (driverBody) {
    let sortedDrivers = Object.values(gameData.driverStandings).sort((a, b) => b.points - a.points);
    driverBody.innerHTML = sortedDrivers.map((d, idx) => `
      <tr style="${gameData.playerTeam && d.teamId === gameData.playerTeam.id ? 'background:rgba(243,156,18,0.15);' : ''}">
        <td><strong>#${idx + 1}</strong></td>
        <td style="font-weight:bold; color:#fff;">${d.name}</td>
        <td><span style="color:${d.teamColor}; font-weight:bold;">●</span> ${d.teamName}</td>
        <td style="color:#f39c12; font-weight:bold;">${d.points} PTS</td>
      </tr>
    `).join('');
  }

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
    car.durabilityEngine = Math.max(20, (car.durabilityEngine || 100) - Math.floor(Math.random() * 20));
    car.durabilityBody = Math.max(20, (car.durabilityBody || 100) - Math.floor(Math.random() * 15));
    car.durabilityTires = Math.max(10, (car.durabilityTires || 100) - Math.floor(Math.random() * 30));

    car.durabilityEngine = Math.min(100, car.durabilityEngine + repairRate);
    car.durabilityBody = Math.min(100, car.durabilityBody + repairRate);
    car.durabilityTires = Math.min(100, car.durabilityTires + repairRate);
  });

  renderMyGarageCars();
}

// --- BURSA DRIVER & MEKANIK ---
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
            <div class="stat-row"><span>Agresivitas:</span><span>${drv.aggression || 80}</span></div>
            <div class="stat-row"><span>Ekspektasi:</span><span>Rp ${((drv.salaryPerRace || 5000000) / 1000000).toFixed(1)} Jt / Race</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container" style="margin-top:10px;">
          <div class="slider-group">
            <div class="slider-label"><span>Gaji / Race:</span><strong id="val-salary-drv-${drv.id}" style="color:#2ecc71;">Rp ${((drv.salaryPerRace || 5000000) / 1000000).toFixed(1)} Jt</strong></div>
            <input type="range" class="custom-slider" id="slider-salary-drv-${drv.id}" min="${minOffer}" max="${maxOffer}" step="500000" value="${drv.salaryPerRace || 5000000}" oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>
          <div class="slider-group" style="margin-top: 6px;">
            <div class="slider-label"><span>Durasi:</span><strong id="val-races-drv-${drv.id}" style="color:#f39c12;">7 Race</strong></div>
            <input type="range" class="custom-slider" id="slider-races-drv-${drv.id}" min="7" max="20" step="1" value="7" oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>
          <div class="total-contract-display" style="font-size:11px; margin-top:4px;">Total: <span id="total-pay-drv-${drv.id}">Rp ${((drv.salaryPerRace || 5000000) * 7).toLocaleString('id-ID')}</span></div>
          <button class="btn-action" style="margin-top:8px;" ${isHired || gameData.myDrivers.length >= 2 ? 'disabled' : ''} onclick="negoDriver('${drv.id}')">${isHired ? 'Sudah Dikontrak' : (gameData.myDrivers.length >= 2 ? 'Slot Full (2/2)' : 'Ajukan Kontrak')}</button>
        </div>
      </div>
    `;
  }).join('');
}

function negoDriver(drvId) {
  AudioEngine.playClick();
  const drv = INITIAL_DRIVERS.find(d => d.id === drvId);
  const offerPerRace = parseInt(document.getElementById(`slider-salary-drv-${drvId}`).value);
  const raceCount = parseInt(document.getElementById(`slider-races-drv-${drvId}`).value);

  if (offerPerRace >= drv.salaryPerRace * 0.85) {
    const totalPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalPayment) {
      gameData.cash -= totalPayment;
      gameData.myDrivers.push({ ...drv, salaryPerRace: offerPerRace, remainingRaces: raceCount });
      alert(`✅ Negosiasi Sukses!\n${drv.name} resmi dikontrak.`);
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
            <span class="card-badge">Rating: ${mech.engineRating || 80}</span>
          </div>
          <div class="card-stats">
            <div class="stat-row"><span>Spesialis:</span><span>${mech.specialty || 'Tuning'}</span></div>
            <div class="stat-row"><span>Ekspektasi:</span><span>Rp ${((mech.salaryPerRace || 3000000) / 1000000).toFixed(1)} Jt / Race</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container" style="margin-top:10px;">
          <div class="slider-group">
            <div class="slider-label"><span>Gaji / Race:</span><strong id="val-salary-mech-${mech.id}" style="color:#2ecc71;">Rp ${((mech.salaryPerRace || 3000000) / 1000000).toFixed(1)} Jt</strong></div>
            <input type="range" class="custom-slider" id="slider-salary-mech-${mech.id}" min="${minOffer}" max="${maxOffer}" step="500000" value="${mech.salaryPerRace || 3000000}" oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>
          <div class="slider-group" style="margin-top: 6px;">
            <div class="slider-label"><span>Durasi:</span><strong id="val-races-mech-${mech.id}" style="color:#f39c12;">7 Race</strong></div>
            <input type="range" class="custom-slider" id="slider-races-mech-${mech.id}" min="7" max="20" step="1" value="7" oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>
          <div class="total-contract-display" style="font-size:11px; margin-top:4px;">Total: <span id="total-pay-mech-${mech.id}">Rp ${((mech.salaryPerRace || 3000000) * 7).toLocaleString('id-ID')}</span></div>
          <button class="btn-action" style="margin-top:8px;" ${isHired ? 'disabled' : ''} onclick="negoMechanic('${mech.id}')">${isHired ? 'Sudah Dikontrak' : 'Ajukan Kontrak'}</button>
        </div>
      </div>
    `;
  }).join('');
}

function negoMechanic(mechId) {
  AudioEngine.playClick();
  const mech = MECHANICS_DATA.find(m => m.id === mechId);
  const offerPerRace = parseInt(document.getElementById(`slider-salary-mech-${mechId}`).value);
  const raceCount = parseInt(document.getElementById(`slider-races-mech-${mechId}`).value);

  if (offerPerRace >= mech.salaryPerRace * 0.85) {
    const totalPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalPayment) {
      gameData.cash -= totalPayment;
      gameData.myMechanics.push({ ...mech, salaryPerRace: offerPerRace, remainingRaces: raceCount });
      alert(`✅ Kepala Mekanik ${mech.name} resmi dikontrak.`);
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
  document.getElementById(`val-races-${type}-${id}`).innerText = `${raceVal} Race`;
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
          <div class="stat-row"><span>Daya Tahan:</span><span>${car.baseDurability || 100} / 100</span></div>
        </div>
      </div>
      <button class="btn-action" style="margin-top:10px;" ${gameData.myCars.length >= 2 ? 'disabled' : ''} onclick="buyCar('${car.id}')">
        ${gameData.myCars.length >= 2 ? 'Slot Mobil Full (2/2)' : 'Beli Mobil Ini'}
      </button>
    </div>
  `).join('');
}

function buyCar(carId) {
  AudioEngine.playClick();
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
    alert(`🎉 Berhasil membeli ${car.name}!`);
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
    <div style="grid-column:1/-1; background:#161b22; padding:12px; border-radius:8px; border:1px solid #30363d; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="color:#f39c12; margin:0;">Level Bengkel Tim: Level ${gameData.workshopLevel} / 5</h4>
        <span style="font-size:11px; color:#8b949e;">Mekanik Aktif: ${gameData.myMechanics.length} Orang</span>
      </div>
      <button class="btn-action" style="width:auto; padding:6px 15px;" onclick="upgradeWorkshop()">Upgrade Bengkel (Rp ${(gameData.workshopLevel * 75).toFixed(0)} Jt)</button>
    </div>
  `;

  if (typeof MODS_CATALOG !== "undefined") {
    const allMods = [...(MODS_CATALOG.engine||[]), ...(MODS_CATALOG.suspension||[]), ...(MODS_CATALOG.transmission||[])];
    html += allMods.map(mod => `
      <div class="card-item">
        <div>
          <div class="card-header"><span class="card-title">🔧 ${mod.name}</span><span class="card-badge">Rp ${(mod.cost / 1000000).toFixed(1)} Jt</span></div>
          <div class="card-stats">
            ${mod.speedBonus ? `<div class="stat-row"><span>Bonus Speed:</span><span>+${mod.speedBonus} KM/H</span></div>` : ''}
            ${mod.handlingBonus ? `<div class="stat-row"><span>Bonus Handling:</span><span>+${mod.handlingBonus}</span></div>` : ''}
          </div>
        </div>
        <button class="btn-action" style="margin-top:10px;" onclick="installModToCar('${mod.id}')">Pasang ke Mobil Tim</button>
      </div>
    `).join('');
  }

  container.innerHTML = html;
}

function installModToCar(modId) {
  AudioEngine.playClick();
  if (gameData.myCars.length === 0) {
    alert("Belum ada mobil di garasi!");
    return;
  }
  const allMods = [...(MODS_CATALOG.engine||[]), ...(MODS_CATALOG.suspension||[]), ...(MODS_CATALOG.transmission||[])];
  const mod = allMods.find(m => m.id === modId);

  if (gameData.cash >= mod.cost) {
    gameData.cash -= mod.cost;
    let targetCar = gameData.myCars[0];
    if (mod.speedBonus) targetCar.baseSpeed += mod.speedBonus;
    if (mod.handlingBonus) targetCar.baseHandling += mod.handlingBonus;
    
    alert(`✅ Modifikasi ${mod.name} berhasil dipasang! Base speed menjadi ${targetCar.baseSpeed} KM/H.`);
    updateFinancialUI();
    renderMyGarageCars();
  } else {
    alert("❌ Modal kas tidak cukup!");
  }
}

function upgradeWorkshop() {
  AudioEngine.playClick();
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

// --- SWITCH TAB NAVIGATION ---
function switchTab(tabId) {
  AudioEngine.playClick();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  
  if (window.event && window.event.target) window.event.target.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}
