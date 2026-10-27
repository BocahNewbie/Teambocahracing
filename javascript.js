// ==========================================
// GAME STATE & SYSTEM DATA (NASCAR SPEC)
// ==========================================
let gameData = {
  cash: 200000000, // Modal awal 200 Juta
  sponsor: "Toko Sparepart Jaya",
  points: 0,
  currentTab: "tab-dashboard",
  selectedTrackId: null,
  isRacing: false,
  isPaused: false,
  raceInterval: null,
  simSpeed: 1.0,

  // Player Setup
  playerTeam: null,
  workshopLevel: 1, // Level Bengkel 1-5
  myCars: [],       // Max 2 Mobil
  myDrivers: [],    // Max 2 Pembalap
  myMechanics: [],  // Min 1 Mekanik
  calendarSchedule: []
};

let raceCars = [];
let totalLaps = 20;
let currentLapGlobal = 1;

// INITIALIZATION ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  initTeamSelectionModal();
  generateRandomCalendar();
  initDashboard();
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

  // Tutup Modal Popup
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
        ⚠️ <strong>Status Garasi Tim:</strong> Saat ini Mobil, Pembalap, Mekanik, dan Aksesoris masih <strong>KOSONG</strong>. 
        Gunakan modal awal <strong>Rp 200.000.000</strong> untuk melengkapi syarat tim: <strong>2 Mobil, 2 Pembalap, dan Minimal 1 Mekanik</strong>.
      </p>
    </div>
  `;
}

// ==========================================
// 2. BENGKEL LEVELING & DURABILITAS MEKANIK
// ==========================================
function upgradeWorkshop() {
  if (gameData.workshopLevel >= 5) {
    alert("Bengkel kamu sudah mencapai Level Maksimal (Level 5)!");
    return;
  }
  
  let upgradeCost = gameData.workshopLevel * 75000000; // Cost: 75jt, 150jt, 225jt...
  if (gameData.cash >= upgradeCost) {
    gameData.cash -= upgradeCost;
    gameData.workshopLevel++;
    alert(`🎉 Selamat! Bengkel berhasil di-upgrade ke Level ${gameData.workshopLevel}!\nEfisiensi perbaikan & batasan modifikasi meningkat.`);
    updateFinancialUI();
    renderGarageCards();
  } else {
    alert(`Modal tidak mencukupi! Butuh Rp ${upgradeCost.toLocaleString('id-ID')} untuk upgrade ke Level ${gameData.workshopLevel + 1}.`);
  }
}

// Perbaikan Otomatis Durabilitas Mobil Oleh Tim Mekanik Setelah Balapan
function repairCarsPostRace() {
  if (gameData.myCars.length === 0) return;
  if (gameData.myMechanics.length === 0) {
    alert("⚠️ Perhatian: Kamu tidak memiliki Mekanik! Mobil tidak diperbaiki otomatis setelah balapan.");
    return;
  }

  // Formula Perbaikan: (Jumlah Mekanik x 15%) + (Level Bengkel x 5%)
  let totalMechanicPower = gameData.myMechanics.reduce((acc, m) => acc + (m.engineRating / 10), 0);
  let repairAmount = Math.floor(totalMechanicPower + (gameData.myMechanics.length * 15) + (gameData.workshopLevel * 5));

  gameData.myCars.forEach(car => {
    let oldDurability = car.durability || 100;
    car.durability = Math.min(100, oldDurability + repairAmount);
  });

  alert(`🛠️ Tim Mekanik (${gameData.myMechanics.length} Orang, Bengkel Lv.${gameData.workshopLevel}) telah selesai merawat mobil.\nDurabilitas dipulihkan sebesar +${repairAmount}%.`);
}

// ==========================================
// 3. BURSA KONTRAK DRIVER & MEKANIK (WORK FIX)
// ==========================================
function renderDriverCards() {
  const container = document.getElementById("driver-cards-container");
  if (!container || typeof INITIAL_DRIVERS === "undefined") return;

  container.innerHTML = INITIAL_DRIVERS.slice(0, 10).map(drv => {
    const isHired = gameData.myDrivers.some(d => d.id === drv.id);
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
            <div class="stat-row"><span>Gaji Ekspektasi:</span><span>Rp ${(drv.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; color:#8b949e; margin-bottom:4px;">Tawar Gaji / Balap & Durasi (Min 7 Balap):</div>
          <div class="nego-box">
            <input type="number" id="offer-drv-${drv.id}" class="nego-input" value="${drv.salaryPerRace}" step="1000000">
            <input type="number" id="races-drv-${drv.id}" class="nego-input" style="width:35%" value="7" min="7">
          </div>
          <button class="btn-action" style="margin-top:8px;" ${isHired || gameData.myDrivers.length >= 2 ? 'disabled' : ''} onclick="negoDriver('${drv.id}')">
            ${isHired ? 'Sudah Dikontrak' : (gameData.myDrivers.length >= 2 ? 'Slot Driver Full (2/2)' : 'Tawar & Kontrak')}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function negoDriver(drvId) {
  const drv = INITIAL_DRIVERS.find(d => d.id === drvId);
  const offerPerRace = parseInt(document.getElementById(`offer-drv-${drvId}`).value);
  const raceCount = parseInt(document.getElementById(`races-drv-${drvId}`).value);

  if (raceCount < 7) {
    alert("❌ Durasi kontrak minimal adalah 7 kali balapan!");
    return;
  }

  // Toleransi tawar-menawar (Driver mau jika tawaran >= 85% dari gaji ekspektasi)
  if (offerPerRace >= drv.salaryPerRace * 0.85) {
    const totalContractPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalContractPayment) {
      gameData.cash -= totalContractPayment;
      gameData.myDrivers.push({
        ...drv,
        salaryPerRace: offerPerRace,
        remainingRaces: raceCount
      });
      alert(`✅ Negosiasi Sukses!\n${drv.name} dikontrak selama ${raceCount} balapan dengan gaji Rp ${offerPerRace.toLocaleString('id-ID')}/balap.\nTotal Dibayar di Awal: Rp ${totalContractPayment.toLocaleString('id-ID')}`);
      updateFinancialUI();
      renderDriverCards();
    } else {
      alert(`❌ Modal kas tidak cukup! Butuh Rp ${totalContractPayment.toLocaleString('id-ID')} untuk kontrak ini.`);
    }
  } else {
    alert(`❌ Negosiasi Ditolak!\n${drv.name}: "Tawaran gaji Rp ${offerPerRace.toLocaleString('id-ID')}/balap terlalu rendah dari standar saya!"`);
  }
}

function renderMechanicCards() {
  const container = document.getElementById("mechanic-cards-container");
  if (!container || typeof MECHANICS_DATA === "undefined") return;

  container.innerHTML = MECHANICS_DATA.slice(0, 10).map(mech => {
    const isHired = gameData.myMechanics.some(m => m.id === mech.id);
    return `
      <div class="card-item">
        <div>
          <div class="card-header">
            <span class="card-title">👨‍🔧 ${mech.name}</span>
            <span class="card-badge">Rating: ${mech.engineRating}</span>
          </div>
          <div class="card-stats">
            <div class="stat-row"><span>Spesialis:</span><span>${mech.specialty}</span></div>
            <div class="stat-row"><span>Chassis Rating:</span><span>${mech.chassisRating}</span></div>
            <div class="stat-row"><span>Gaji Ekspektasi:</span><span>Rp ${(mech.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; color:#8b949e; margin-bottom:4px;">Tawar Gaji / Balap & Durasi (Min 7 Balap):</div>
          <div class="nego-box">
            <input type="number" id="offer-mech-${mech.id}" class="nego-input" value="${mech.salaryPerRace}" step="1000000">
            <input type="number" id="races-mech-${mech.id}" class="nego-input" style="width:35%" value="7" min="7">
          </div>
          <button class="btn-action" style="margin-top:8px;" ${isHired ? 'disabled' : ''} onclick="negoMechanic('${mech.id}')">
            ${isHired ? 'Sudah Dikontrak' : 'Tawar & Kontrak'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function negoMechanic(mechId) {
  const mech = MECHANICS_DATA.find(m => m.id === mechId);
  const offerPerRace = parseInt(document.getElementById(`offer-mech-${mechId}`).value);
  const raceCount = parseInt(document.getElementById(`races-mech-${mechId}`).value);

  if (raceCount < 7) {
    alert("❌ Durasi kontrak minimal adalah 7 kali balapan!");
    return;
  }

  if (offerPerRace >= mech.salaryPerRace * 0.85) {
    const totalPayment = offerPerRace * raceCount;
    if (gameData.cash >= totalPayment) {
      gameData.cash -= totalPayment;
      gameData.myMechanics.push({
        ...mech,
        salaryPerRace: offerPerRace,
        remainingRaces: raceCount
      });
      alert(`✅ Negosiasi Sukses!\nKepala Mekanik ${mech.name} dikontrak selama ${raceCount} balapan.`);
      updateFinancialUI();
      renderMechanicCards();
    } else {
      alert(`❌ Modal tidak cukup! Butuh Rp ${totalPayment.toLocaleString('id-ID')}`);
    }
  } else {
    alert(`❌ ${mech.name} menolak penawaran gaji tersebut!`);
  }
}

// ==========================================
// 4. TOKO MOBIL & GARASI MODIFIKASI
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
    gameData.myCars.push({
      ...car,
      instanceId: 'car_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      durability: 100,
      installedMods: []
    });
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
          <div class="card-header">
            <span class="card-title">🔧 ${mod.name}</span>
            <span class="card-badge">Rp ${(mod.cost / 1000000).toFixed(1)} Jt</span>
          </div>
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
    alert("Tidak ada mobil di garasi!");
    return;
  }

  const allMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
  const mod = allMods.find(m => m.id === modId);

  if (gameData.cash >= mod.cost) {
    gameData.cash -= mod.cost;
    // Terapkan ke mobil pertama
    let targetCar = gameData.myCars[0];
    if (mod.speedBonus) targetCar.baseSpeed += mod.speedBonus;
    if (mod.handlingBonus) targetCar.baseHandling += mod.handlingBonus;
    
    alert(`✅ Modifikasi ${mod.name} berhasil dipasang pada ${targetCar.name}!`);
    updateFinancialUI();
  } else {
    alert("❌ Modal kas tidak cukup!");
  }
}

// ==========================================
// 5. KALENDER BALAP RANDOM
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
      dateStr: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
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

  container.innerHTML = gameData.calendarSchedule.map(s => `
    <div class="calendar-day ${s.isRace ? 'race-day' : ''}">
      <div>
        <span class="date-num">${s.dateStr}</span>
        <div class="event-title">${s.isRace ? '🏁 GP: ' + s.track.name : '🛠️ Hari Persiapan'}</div>
      </div>
      ${s.isRace ? `<div style="font-size:10px; color:#f39c12; margin-top:4px;">${s.track.type} (${s.track.lengthKm} KM)</div>` : ''}
    </div>
  `).join('');
}

// ==========================================
// 6. LIVE LEADERBOARD SIMULATOR (MODERN BADGE)
// ==========================================
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
