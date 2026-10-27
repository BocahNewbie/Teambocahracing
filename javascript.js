// ==========================================
// GAME STATE & SYSTEM DATA (NASCAR SPEC)
// ==========================================
let gameData = {
  cash: 500000000, // Modal awal Rp 500 Juta
  sponsor: "Toko Sparepart Jaya",
  points: 0,
  seasonStarted: false,
  currentCalendarIndex: 0,
  simSpeed: 1.0,

  // Player Setup
  playerTeam: null,
  workshopLevel: 1, // Level Bengkel 1-5
  myCars: [],       // Maksimal 2 Mobil
  myDrivers: [],    // Maksimal 2 Pembalap
  myMechanics: [],  // Minimal 1 Mekanik
  calendarSchedule: []
};

// Simulation Race Variables
let raceCars = [];
let totalLaps = 20;
let currentLapGlobal = 1;
let isRacing = false;
let raceInterval = null;
let activeRaceTrack = null;

// INITIALIZATION ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  initTeamSelectionModal();
  generateRandomCalendar();
  updateFinancialUI();
});

// ==========================================
// 1. SELEKSI TIM & BANNER SAMBUTAN
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

  const modal = document.getElementById("welcome-modal");
  if (modal) modal.style.display = "none";

  const teamNameEl = document.getElementById("player-team-name");
  if (teamNameEl) teamNameEl.innerText = selected.name;

  renderWelcomeBanner();
  updateFinancialUI();
  renderMarketCards();
  renderDriverCards();
  renderMechanicCards();
  renderGarageCards();
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
        ⚠️ <strong>Status Garasi Tim:</strong> Garasi saat ini masih <strong>KOSONG</strong>. 
        Gunakan modal awal <strong>Rp 500.000.000</strong> untuk melengkapi syarat tim: <strong>2 Mobil, 2 Pembalap, dan Minimal 1 Mekanik</strong>.
      </p>
    </div>
  `;
}

// ==========================================
// 2. KONTROL KALENDER & START SEASON
// ==========================================
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
  alert("🎉 MUSIM BALAP RESMI DIMULAI! Silakan jalankan tanggal kalender untuk mengikuti balapan.");
}

function advanceCalendarDay() {
  if (!gameData.seasonStarted) return;

  if (gameData.currentCalendarIndex < gameData.calendarSchedule.length - 1) {
    gameData.currentCalendarIndex++;
    const currentEvent = gameData.calendarSchedule[gameData.currentCalendarIndex];

    const dateEl = document.getElementById("current-game-date");
    if (dateEl) dateEl.innerText = currentEvent.dateStr;
    renderCalendarUI();

    // Jika hari ini adalah Hari Balapan (Race Day)
    if (currentEvent.isRace) {
      activeRaceTrack = currentEvent.track;
      alert(`🏁 HARI BALAPAN! GP ${activeRaceTrack.name}. Menuju ke layar Live Race!`);
      switchTab('tab-race');
      prepareRaceGrid();
    }
  } else {
    alert("🏆 MUSIM BALAP TELAH SELESAI!");
  }
}

// ==========================================
// 3. LIVE LEADERBOARD SIMULATOR ENGINE (#1-#999)
// ==========================================
function prepareRaceGrid() {
  if (!activeRaceTrack) return;

  document.getElementById("race-track-name").innerText = `🏁 ${activeRaceTrack.name} (${activeRaceTrack.lengthKm} KM)`;
  document.getElementById("race-status").innerText = "READY AT THE GRID";
  document.getElementById("btn-toggle-race").innerText = "🟢 MULAI START BALAPAN";
  isRacing = false;
  currentLapGlobal = 1;
  totalLaps = activeRaceTrack.lapsDefault || 20;

  raceCars = [];
  
  // Ambil data pembalap dari aset INITIAL_DRIVERS di drivers.js
  let availableDrivers = (typeof INITIAL_DRIVERS !== "undefined") ? [...INITIAL_DRIVERS] : [];
  
  // Generator Nomor Pembalap Acak Unik (#1 hingga #999)
  let usedNumbers = new Set();
  function getUniqueCarNumber() {
    let num;
    do {
      num = Math.floor(Math.random() * 999) + 1; // 1 s/d 999
    } while (usedNumbers.has(num));
    usedNumbers.add(num);
    return num;
  }

  let globalCarIdx = 0;

  // Grid Roster (2 Mobil Per Tim dari TEAMS_DATA)
  TEAMS_DATA.forEach((team) => {
    const isPlayer = (gameData.playerTeam && team.id === gameData.playerTeam.id);

    for (let i = 0; i < 2; i++) {
      let driverName = "";
      let carNumber = getUniqueCarNumber(); // Nomor #1-#999
      let baseSpeed = 120 + Math.random() * 25;

      if (isPlayer) {
        // Tim Player: Menggunakan Driver & Mobil yang dikontrak
        let pDriver = gameData.myDrivers[i];
        let pCar = gameData.myCars[i];
        
        driverName = pDriver ? pDriver.name : `Driver Cadangan ${i + 1}`;
        baseSpeed = pCar ? pCar.baseSpeed : 135;
      } else {
        // Tim NPC: Mengambil nama asli dari aset INITIAL_DRIVERS (drivers.js)
        if (availableDrivers.length > 0) {
          let teamDriverIdx = availableDrivers.findIndex(d => d.teamId === team.id);
          if (teamDriverIdx !== -1) {
            driverName = availableDrivers[teamDriverIdx].name;
            availableDrivers.splice(teamDriverIdx, 1);
          } else {
            let randomDrv = availableDrivers.pop();
            driverName = randomDrv ? randomDrv.name : `Pembalap ${globalCarIdx + 1}`;
          }
        } else {
          driverName = `Pembalap ${globalCarIdx + 1}`;
        }
      }

      raceCars.push({
        id: `car_${globalCarIdx + 1}`,
        number: carNumber, // Nomor Pembalap #1 - #999
        pos: globalCarIdx + 1,
        driverName: driverName,
        teamName: team.name,
        teamColor: team.color,
        isPlayer: isPlayer,
        distance: 0,
        currentLap: 1,
        speed: baseSpeed,
        lastLapTime: 0,
        bestLapTime: null,
        lapStartTime: Date.now()
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

  raceCars.forEach(car => {
    if (car.currentLap <= totalLaps) {
      finished = false;
      car.distance += (car.speed * 0.1) + (Math.random() * 2);

      let calcLap = Math.floor(car.distance / 1000) + 1;
      if (calcLap > car.currentLap && car.currentLap <= totalLaps) {
        let lapTime = ((Date.now() - car.lapStartTime) / 1000) + Math.random();
        car.lastLapTime = lapTime;
        if (!car.bestLapTime || lapTime < car.bestLapTime) car.bestLapTime = lapTime;

        car.currentLap = calcLap;
        car.lapStartTime = Date.now();
      }
    }
  });

  // Urutkan berdasarkan jarak tempuh tertinggi
  raceCars.sort((a, b) => b.distance - a.distance);
  raceCars.forEach((c, idx) => c.pos = idx + 1);

  currentLapGlobal = Math.min(raceCars[0].currentLap, totalLaps);
  document.getElementById("race-lap-counter").innerText = `LAP ${currentLapGlobal} / ${totalLaps}`;

  renderTimingTower();

  if (finished || currentLapGlobal > totalLaps) {
    clearInterval(raceInterval);
    isRacing = false;
    document.getElementById("race-status").innerText = "CHECKERED FLAG 🏁";
    document.getElementById("btn-toggle-race").innerText = "Selesai";
    alert(`🏁 BALAPAN SELESAI!\nPemenang GP: #${raceCars[0].number} ${raceCars[0].driverName} (${raceCars[0].teamName})`);
    repairCarsPostRace();
  }
}

// RENDER TIMING TOWER DENGAN CHAMFERED BADGE & NOMOR (#1-#999)
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
        <td>${gapText}</td>
        <td>${intervalText}</td>
        <td>${car.lastLapTime ? car.lastLapTime.toFixed(3) + 's' : '-'}</td>
        <td style="color:#f39c12;">${car.bestLapTime ? car.bestLapTime.toFixed(3) + 's' : '-'}</td>
      </tr>
    `;
  }).join('');
}

// Perbaikan Otomatis Durabilitas Mobil oleh Mekanik
function repairCarsPostRace() {
  if (gameData.myCars.length === 0 || gameData.myMechanics.length === 0) return;
  let repairAmount = Math.floor((gameData.myMechanics.length * 15) + (gameData.workshopLevel * 5));

  gameData.myCars.forEach(car => {
    car.durability = Math.min(100, (car.durability || 100) + repairAmount);
  });
  alert(`🛠️ Tim Mekanik (${gameData.myMechanics.length} Orang) memulihkan durabilitas mobil sebesar +${repairAmount}%.`);
}

// ==========================================
// 4. BURSA KONTRAK DRIVER & MEKANIK (SLIDER NEGO)
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
            <div class="stat-row"><span>Konsistensi:</span><span>${drv.consistency}</span></div>
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
      alert(`✅ Negosiasi Sukses!\n${drv.name} resmi dikontrak selama ${raceCount} balapan dengan total biaya Rp ${totalPayment.toLocaleString('id-ID')}.`);
      updateFinancialUI();
      renderDriverCards();
    } else {
      alert(`❌ Modal kas tidak cukup! Butuh Rp ${totalPayment.toLocaleString('id-ID')}`);
    }
  } else {
    alert(`❌ Negosiasi Ditolak!\n${drv.name}: "Tawaran gaji Rp ${offerPerRace.toLocaleString('id-ID')}/balap terlalu rendah!"`);
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
      alert(`❌ Modal kas tidak cukup! Butuh Rp ${totalPayment.toLocaleString('id-ID')}`);
    }
  } else {
    alert(`❌ ${mech.name} menolak tawaran gaji tersebut!`);
  }
}

function updateNegoCalc(type, id) {
  const salaryVal = parseInt(document.getElementById(`slider-salary-${type}-${id}`).value);
  const raceVal = parseInt(document.getElementById(`slider-races-${type}-${id}`).value);

  document.getElementById(`val-salary-${type}-${id}`).innerText = `Rp ${(salaryVal / 1000000).toFixed(1)} Jt`;
  document.getElementById(`val-races-${type}-${id}`).innerText = `${raceVal} Balapan`;
  document.getElementById(`total-pay-${type}-${id}`).innerText = `Rp ${(salaryVal * raceVal).toLocaleString('id-ID')}`;
}

// ==========================================
// 5. TOKO MOBIL & GARASI MODIFIKASI
// ==========================================
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
    gameData.myCars.push({ ...car, instanceId: 'car_' + Date.now(), durability: 100 });
    alert(`🎉 Berhasil membeli ${car.name}! Sisa modal: Rp ${gameData.cash.toLocaleString('id-ID')}`);
    updateFinancialUI();
    renderMarketCards();
    renderGarageCards();
  } else {
    alert("❌ Modal kas tidak cukup!");
  }
}

function renderGarageCards() {
  const container = document.getElementById("garage-cards-container");
  if (!container) return;

  if (gameData.myCars.length === 0) {
    container.innerHTML = `<p style="color:#e74c3c; grid-column:1/-1;">⚠️ Garasi masih kosong! Belilah unit mobil di menu Toko Mobil Awal terlebih dahulu.</p>`;
    return;
  }

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
  if (gameData.myCars.length === 0) return;
  const allMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
  const mod = allMods.find(m => m.id === modId);

  if (gameData.cash >= mod.cost) {
    gameData.cash -= mod.cost;
    let targetCar = gameData.myCars[0];
    if (mod.speedBonus) targetCar.baseSpeed += mod.speedBonus;
    if (mod.handlingBonus) targetCar.baseHandling += mod.handlingBonus;
    
    alert(`✅ Modifikasi ${mod.name} berhasil dipasang pada ${targetCar.name}!`);
    updateFinancialUI();
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

// ==========================================
// 6. UTILITY & KALENDER
// ==========================================
function generateRandomCalendar() {
  if (typeof TRACKS_DATA === "undefined") return;
  const shuffledTracks = [...TRACKS_DATA].sort(() => 0.5 - Math.random());
  const startDate = new Date(2026, 5, 1);

  let schedule = [];
  for (let i = 1; i <= 20; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (i * 7));
    const isRaceDay = (i % 2 === 0);
    const track = isRaceDay ? shuffledTracks.pop() : null;

    schedule.push({
      day: i,
      dateStr: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      isRace: isRaceDay,
      track: track
    });
  }

  gameData.calendarSchedule = schedule;
  renderCalendarUI();
}

function renderCalendarUI() {
  const container = document.getElementById("calendar-container");
  if (!container) return;

  container.innerHTML = gameData.calendarSchedule.map((s, idx) => `
    <div class="calendar-day ${s.isRace ? 'race-day' : ''} ${idx === gameData.currentCalendarIndex ? 'active-day' : ''}">
      <div>
        <span class="date-num">📅 ${s.dateStr}</span>
        <div class="event-title">${s.isRace ? '🏁 GP: ' + s.track.name : '🛠️ Hari Persiapan'}</div>
      </div>
      ${s.isRace ? `<div style="font-size:10px; color:#f39c12; margin-top:4px;">${s.track.type} (${s.track.lengthKm} KM)</div>` : ''}
    </div>
  `).join('');
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
