// ==========================================
// GAME STATE & SYSTEM DATA (NASCAR SPEC)
// ==========================================
let gameData = {
  cash: 200000000, // Modal awal Rp 200 Juta
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
  myCars: [],       // Maksimal 2 Mobil
  myDrivers: [],    // Maksimal 2 Pembalap
  myMechanics: [],  // Minimal 1 Mekanik
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

function initDashboard() {
  updateFinancialUI();
}

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
        ⚠️ <strong>Status Garasi Tim:</strong> Garasi masih <strong>KOSONG</strong>. 
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
  
  let upgradeCost = gameData.workshopLevel * 75000000;
  if (gameData.cash >= upgradeCost) {
    gameData.cash -= upgradeCost;
    gameData.workshopLevel++;
    alert(`🎉 Bengkel berhasil di-upgrade ke Level ${gameData.workshopLevel}!\nKecepatan perbaikan durabilitas meningkat.`);
    updateFinancialUI();
    renderGarageCards();
  } else {
    alert(`Modal tidak mencukupi! Butuh Rp ${upgradeCost.toLocaleString('id-ID')} untuk upgrade ke Level ${gameData.workshopLevel + 1}.`);
  }
}

// ==========================================
// 3. BURSA KONTRAK DRIVER (SLIDER INTERAKTIF)
// ==========================================
function renderDriverCards() {
  const container = document.getElementById("driver-cards-container");
  if (!container || typeof INITIAL_DRIVERS === "undefined") return;

  container.innerHTML = INITIAL_DRIVERS.slice(0, 10).map(drv => {
    const isHired = gameData.myDrivers.some(d => d.id === drv.id);
    const minOffer = Math.floor(drv.salaryPerRace * 0.5);
    const maxOffer = Math.floor(drv.salaryPerRace * 1.5);
    const defaultOffer = drv.salaryPerRace;

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
            <div class="stat-row"><span>Ekspektasi Gaji:</span><span>Rp ${(drv.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container">
          <!-- Slider Gaji Per Balap -->
          <div class="slider-group">
            <div class="slider-label">
              <span>Gaji Per Balap:</span>
              <strong id="val-salary-drv-${drv.id}" style="color:#2ecc71;">Rp ${(defaultOffer / 1000000).toFixed(1)} Jt</strong>
            </div>
            <input type="range" class="custom-slider" id="slider-salary-drv-${drv.id}" 
                   min="${minOffer}" max="${maxOffer}" step="500000" value="${defaultOffer}"
                   oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>

          <!-- Slider Durasi Kontrak (Min 7 Balap) -->
          <div class="slider-group" style="margin-top: 10px;">
            <div class="slider-label">
              <span>Durasi Kontrak:</span>
              <strong id="val-races-drv-${drv.id}" style="color:#f39c12;">7 Balapan</strong>
            </div>
            <input type="range" class="custom-slider" id="slider-races-drv-${drv.id}" 
                   min="7" max="20" step="1" value="7"
                   oninput="updateNegoCalc('drv', '${drv.id}')">
          </div>

          <div class="total-contract-display">
            Total Kontrak: <span id="total-pay-drv-${drv.id}">Rp ${(defaultOffer * 7).toLocaleString('id-ID')}</span>
          </div>

          <button class="btn-action" style="margin-top:10px;" ${isHired || gameData.myDrivers.length >= 2 ? 'disabled' : ''} onclick="negoDriver('${drv.id}')">
            ${isHired ? 'Sudah Dikontrak' : (gameData.myDrivers.length >= 2 ? 'Slot Driver Full (2/2)' : 'Ajukan Kontrak')}
          </button>
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
      gameData.myDrivers.push({
        ...drv,
        salaryPerRace: offerPerRace,
        remainingRaces: raceCount
      });
      alert(`✅ Negosiasi Sukses!\n${drv.name} resmi dikontrak selama ${raceCount} balapan dengan gaji Rp ${offerPerRace.toLocaleString('id-ID')}/balap.\nTotal Bayar: Rp ${totalPayment.toLocaleString('id-ID')}`);
      updateFinancialUI();
      renderDriverCards();
    } else {
      alert(`❌ Modal kas tidak cukup! Butuh Rp ${totalPayment.toLocaleString('id-ID')}`);
    }
  } else {
    alert(`❌ Negosiasi Ditolak!\n${drv.name}: "Tawaran gaji Rp ${offerPerRace.toLocaleString('id-ID')}/balap terlalu rendah dari standar ekspektasi saya!"`);
  }
}

// ==========================================
// 4. BURSA KONTRAK MEKANIK (SLIDER INTERAKTIF)
// ==========================================
function renderMechanicCards() {
  const container = document.getElementById("mechanic-cards-container");
  if (!container || typeof MECHANICS_DATA === "undefined") return;

  container.innerHTML = MECHANICS_DATA.slice(0, 10).map(mech => {
    const isHired = gameData.myMechanics.some(m => m.id === mech.id);
    const minOffer = Math.floor(mech.salaryPerRace * 0.5);
    const maxOffer = Math.floor(mech.salaryPerRace * 1.5);
    const defaultOffer = mech.salaryPerRace;

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
            <div class="stat-row"><span>Ekspektasi Gaji:</span><span>Rp ${(mech.salaryPerRace / 1000000).toFixed(1)} Jt / Balap</span></div>
          </div>
        </div>
        
        <div class="slider-nego-container">
          <div class="slider-group">
            <div class="slider-label">
              <span>Gaji Per Balap:</span>
              <strong id="val-salary-mech-${mech.id}" style="color:#2ecc71;">Rp ${(defaultOffer / 1000000).toFixed(1)} Jt</strong>
            </div>
            <input type="range" class="custom-slider" id="slider-salary-mech-${mech.id}" 
                   min="${minOffer}" max="${maxOffer}" step="500000" value="${defaultOffer}"
                   oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>

          <div class="slider-group" style="margin-top: 10px;">
            <div class="slider-label">
              <span>Durasi Kontrak:</span>
              <strong id="val-races-mech-${mech.id}" style="color:#f39c12;">7 Balapan</strong>
            </div>
            <input type="range" class="custom-slider" id="slider-races-mech-${mech.id}" 
                   min="7" max="20" step="1" value="7"
                   oninput="updateNegoCalc('mech', '${mech.id}')">
          </div>

          <div class="total-contract-display">
            Total Kontrak: <span id="total-pay-mech-${mech.id}">Rp ${(defaultOffer * 7).toLocaleString('id-ID')}</span>
          </div>

          <button class="btn-action" style="margin-top:10px;" ${isHired ? 'disabled' : ''} onclick="negoMechanic('${mech.id}')">
            ${isHired ? 'Sudah Dikontrak' : 'Ajukan Kontrak'}
          </button>
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
      gameData.myMechanics.push({
        ...mech,
        salaryPerRace: offerPerRace,
        remainingRaces: raceCount
      });
      alert(`✅ Negosiasi Sukses!\nKepala Mekanik ${mech.name} resmi dikontrak selama ${raceCount} balapan.`);
      updateFinancialUI();
      renderMechanicCards();
    } else {
      alert(`❌ Modal tidak cukup! Butuh Rp ${totalPayment.toLocaleString('id-ID')}`);
    }
  } else {
    alert(`❌ ${mech.name} menolak penawaran gaji tersebut!`);
  }
}

// HELPER UPDATE SLIDER TEXT & CALCULATOR
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
    gameData.myCars.push({
      ...car,
      instanceId: 'car_' + Date.now(),
      durability: 100
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

// ==========================================
// 6. KALENDER BALAP RANDOM & UTILITY
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
