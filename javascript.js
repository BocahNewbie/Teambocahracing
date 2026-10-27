let gameState = {
  playerTeam: null,
  cash: 200000000, // Modal awal 200 Juta
  myCar: null,
  myDriver: null,
  driverRaceContract: 0,
  myMechanic: null,
  mechanicRaceContract: 0,
  calendarSchedule: []
};

document.addEventListener("DOMContentLoaded", () => {
  initTeamSelection();
  generateRandomCalendar();
});

// 1. TIM SELECTION MODAL
function initTeamSelection() {
  const container = document.getElementById("team-select-container");
  if (typeof TEAMS_DATA !== "undefined") {
    container.innerHTML = TEAMS_DATA.map(t => `
      <div class="team-card-select" onclick="selectTeam('${t.id}')">
        <div class="team-badge" style="background: ${t.color}"></div>
        <div>
          <div style="font-weight:bold; color:#fff; font-size:13px;">${t.name}</div>
          <div style="font-size:10px; color:#8b949e;">Pilih Tim Ini</div>
        </div>
      </div>
    `).join('');
  }
}

function selectTeam(teamId) {
  const selected = TEAMS_DATA.find(t => t.id === teamId);
  gameState.playerTeam = selected;

  // Sembunyikan Modal
  document.getElementById("welcome-modal").style.display = "none";
  document.getElementById("player-team-name").innerText = selected.name;

  // Tampilkan Pesan Sambutan Hangat
  renderWelcomeBanner();
  updateUI();
}

function renderWelcomeBanner() {
  const container = document.getElementById("welcome-banner-container");
  container.innerHTML = `
    <div class="welcome-banner">
      <h2 style="color: var(--accent-gold); margin-bottom: 5px;">🎉 Selamat Bergabung di Tim ${gameState.playerTeam.name}!</h2>
      <p style="color: #fff; font-size: 15px; font-weight:600; font-style: italic;">
        "Selamat bergabung di tim, semoga kita berhasil menjuarai Grand Prix ini!"
      </p>
      <p style="color: var(--text-muted); font-size: 12px; margin-top: 10px;">
        ⚠️ <strong>Status Tim Awal:</strong> Seluruh inventaris tim (Mobil, Driver, Mekanik, & Aksesoris) masih <strong>KOSONG</strong>. 
        Anda dibekali modal awal sebesar <strong>Rp 200.000.000</strong>. Silakan masuk ke tab <strong>🏬 Beli Mobil Awal</strong> dan <strong>🏎️ Kontrak Driver</strong> untuk melengkapi tim.
      </p>
    </div>
  `;
}

// 2. GENERATE RANDOM RACE CALENDAR
function generateRandomCalendar() {
  if (typeof TRACKS_DATA === "undefined") return;
  
  const shuffledTracks = [...TRACKS_DATA].sort(() => 0.5 - Math.random());
  const startDate = new Date(2026, 5, 1); // Dimulai 1 Juni 2026

  let schedule = [];
  for (let i = 1; i <= 24; i++) {
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

  gameState.calendarSchedule = schedule;
  renderCalendar();
}

function renderCalendar() {
  const container = document.getElementById("calendar-container");
  container.innerHTML = gameState.calendarSchedule.map(s => `
    <div class="calendar-day ${s.isRace ? 'race-day' : ''}">
      <div>
        <span class="date-num">📅 ${s.dateStr}</span>
        <div class="event-title">${s.isRace ? '🏁 GP: ' + s.track.name : '🛠️ Hari Persiapan & Testing'}</div>
      </div>
      ${s.isRace ? `
        <div style="font-size:10px; color:var(--accent-gold); margin-top:6px;">
          ${s.track.type} | ${s.track.lengthKm} KM (${s.track.lapsDefault} Laps)
        </div>` : ''}
    </div>
  `).join('');
}

// 3. TOKO MOBIL CARD MODEL
function renderMarketCards() {
  const container = document.getElementById("market-cards-container");
  if (typeof CAR_PRESETS === "undefined") return;

  container.innerHTML = CAR_PRESETS.map(car => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">${car.name}</span>
          <span class="card-badge">Rp ${(car.price / 1000000).toFixed(0)} Juta</span>
        </div>
        <div class="card-stats">
          <div class="stat-row"><span>Kecepatan Dasar:</span><span>${car.baseSpeed} KM/H</span></div>
          <div class="stat-row"><span>Handling:</span><span>${car.baseHandling} / 100</span></div>
          <div class="stat-row"><span>Daya Tahan:</span><span>${car.baseDurability} / 100</span></div>
        </div>
      </div>
      <button class="btn-action" ${gameState.myCar ? 'disabled' : ''} onclick="buyCar('${car.id}')">
        ${gameState.myCar ? 'Sudah Punya Mobil' : 'Beli Mobil Ini'}
      </button>
    </div>
  `).join('');
}

function buyCar(carId) {
  const car = CAR_PRESETS.find(c => c.id === carId);
  if (gameState.cash >= car.price) {
    gameState.cash -= car.price;
    gameState.myCar = { ...car, mods: [] };
    alert(`Berhasil membeli ${car.name}! Sisa Modal: Rp ${gameState.cash.toLocaleString('id-ID')}`);
    updateUI();
  } else {
    alert("Modal tidak mencukupi untuk membeli mobil ini!");
  }
}

// 4. BURSA DRIVER & TAWAR-MENAWAR KONTRAK (MIN 7 BALAPAN)
function renderDriverCards() {
  const container = document.getElementById("driver-cards-container");
  if (typeof INITIAL_DRIVERS === "undefined") return;

  container.innerHTML = INITIAL_DRIVERS.slice(0, 9).map(drv => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">🏎️ ${drv.name}</span>
          <span class="card-badge">${drv.trait.name}</span>
        </div>
        <div class="card-stats">
          <div class="stat-row"><span>Agresivitas:</span><span>${drv.aggression}</span></div>
          <div class="stat-row"><span>Konsistensi:</span><span>${drv.consistency}</span></div>
          <div class="stat-row"><span>Harga Ekspektasi / Balap:</span><span>Rp ${(drv.salaryPerRace / 1000000).toFixed(1)} Jt</span></div>
        </div>
      </div>
      <div>
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">Tawar Gaji / Balap & Durasi (Min 7 Balap):</div>
        <div class="nego-box">
          <input type="number" id="offer-drv-${drv.id}" class="nego-input" value="${drv.salaryPerRace}">
          <input type="number" id="laps-drv-${drv.id}" class="nego-input" style="width:35%" value="7" min="7">
        </div>
        <button class="btn-action" style="margin-top:8px;" ${gameState.myDriver ? 'disabled' : ''} onclick="negoDriver('${drv.id}')">
          ${gameState.myDriver ? 'Driver Aktif' : 'Tawar Kontrak'}
        </button>
      </div>
    </div>
  `).join('');
}

function negoDriver(drvId) {
  const drv = INITIAL_DRIVERS.find(d => d.id === drvId);
  const offer = parseInt(document.getElementById(`offer-drv-${drvId}`).value);
  const races = parseInt(document.getElementById(`laps-drv-${drvId}`).value);

  if (races < 7) {
    alert("Batas durasi kontrak minimal adalah 7 kali balapan!");
    return;
  }

  // Syarat nego diterima: minimal 85% dari ekspektasi
  if (offer >= drv.salaryPerRace * 0.85) {
    const totalCost = offer * races;
    if (gameState.cash >= totalCost) {
      gameState.cash -= totalCost;
      gameState.myDriver = drv;
      gameState.driverRaceContract = races;
      alert(`Negosiasi Sukses! ${drv.name} resmi di-kontrak selama ${races} balapan dengan total biaya Rp ${totalCost.toLocaleString('id-ID')}.`);
      updateUI();
    } else {
      alert("Kas modal tim tidak mencukupi untuk total biaya kontrak ini!");
    }
  } else {
    alert(`${drv.name} menolak penawaran Anda! Harga yang ditawarkan terlalu murah.`);
  }
}

// 5. BURSA MEKANIK & TAWAR-MENAWAR KONTRAK
function renderMechanicCards() {
  const container = document.getElementById("mechanic-cards-container");
  if (typeof MECHANICS_DATA === "undefined") return;

  container.innerHTML = MECHANICS_DATA.slice(0, 9).map(mech => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">👨‍🔧 ${mech.name}</span>
          <span class="card-badge">Engine Rating: ${mech.engineRating}</span>
        </div>
        <div class="card-stats">
          <div class="stat-row"><span>Spesialis:</span><span>${mech.specialty}</span></div>
          <div class="stat-row"><span>Chassis Rating:</span><span>${mech.chassisRating}</span></div>
          <div class="stat-row"><span>Gaji / Balap:</span><span>Rp ${(mech.salaryPerRace / 1000000).toFixed(1)} Jt</span></div>
        </div>
      </div>
      <div>
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">Tawar Gaji / Balap & Durasi (Min 7 Balap):</div>
        <div class="nego-box">
          <input type="number" id="offer-mech-${mech.id}" class="nego-input" value="${mech.salaryPerRace}">
          <input type="number" id="laps-mech-${mech.id}" class="nego-input" style="width:35%" value="7" min="7">
        </div>
        <button class="btn-action" style="margin-top:8px;" ${gameState.myMechanic ? 'disabled' : ''} onclick="negoMechanic('${mech.id}')">
          ${gameState.myMechanic ? 'Mekanik Aktif' : 'Tawar Kontrak'}
        </button>
      </div>
    </div>
  `).join('');
}

function negoMechanic(mechId) {
  const mech = MECHANICS_DATA.find(m => m.id === mechId);
  const offer = parseInt(document.getElementById(`offer-mech-${mechId}`).value);
  const races = parseInt(document.getElementById(`laps-mech-${mechId}`).value);

  if (races < 7) {
    alert("Batas durasi kontrak minimal adalah 7 kali balapan!");
    return;
  }

  if (offer >= mech.salaryPerRace * 0.85) {
    const totalCost = offer * races;
    if (gameState.cash >= totalCost) {
      gameState.cash -= totalCost;
      gameState.myMechanic = mech;
      gameState.mechanicRaceContract = races;
      alert(`Negosiasi Berhasil! Kepala Mekanik ${mech.name} sepakat bergabung selama ${races} balapan.`);
      updateUI();
    } else {
      alert("Modal kas tim tidak cukup!");
    }
  } else {
    alert(`${mech.name} menolak tawaran Anda!`);
  }
}

// 6. BENGKEL MODIFIKASI (CARD MODEL)
function renderGarageCards() {
  const container = document.getElementById("garage-cards-container");
  if (!gameState.myCar) {
    container.innerHTML = `<p style="color:var(--accent-red); grid-column: 1 / -1;">⚠️ Garasi masih kosong! Anda harus membeli mobil terlebih dahulu di menu <strong>🏬 Beli Mobil Awal</strong>.</p>`;
    return;
  }

  if (typeof MODS_CATALOG === "undefined") return;

  const availableMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
  container.innerHTML = availableMods.map(mod => `
    <div class="card-item">
      <div>
        <div class="card-header">
          <span class="card-title">🔧 ${mod.name}</span>
          <span class="card-badge">Rp ${(mod.cost / 1000000).toFixed(1)} Jt</span>
        </div>
        <div class="card-stats">
          ${mod.speedBonus ? `<div class="stat-row"><span>Bonus Speed:</span><span>+${mod.speedBonus} KM/H</span></div>` : ''}
          ${mod.handlingBonus ? `<div class="stat-row"><span>Bonus Handling:</span><span>+${mod.handlingBonus}</span></div>` : ''}
          ${mod.heatRisk ? `<div class="stat-row"><span>Risiko Mesin Panas:</span><span>+${mod.heatRisk}%</span></div>` : ''}
        </div>
      </div>
      <button class="btn-action" onclick="installMod('${mod.id}')">Pasang Komponen Ini</button>
    </div>
  `).join('');
}

function installMod(modId) {
  const availableMods = [...MODS_CATALOG.engine, ...MODS_CATALOG.suspension, ...MODS_CATALOG.transmission];
  const mod = availableMods.find(m => m.id === modId);

  if (gameState.cash >= mod.cost) {
    gameState.cash -= mod.cost;
    if (mod.speedBonus) gameState.myCar.baseSpeed += mod.speedBonus;
    if (mod.handlingBonus) gameState.myCar.baseHandling += mod.handlingBonus;
    alert(`Upgrade ${mod.name} berhasil dipasang! Performa ${gameState.myCar.name} meningkat.`);
    updateUI();
  } else {
    alert("Modal kas tim tidak mencukupi!");
  }
}

function updateUI() {
  document.getElementById("team-cash").innerText = `Rp ${gameState.cash.toLocaleString('id-ID')}`;
  renderMarketCards();
  renderDriverCards();
  renderMechanicCards();
  renderGarageCards();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  
  if (event && event.target) {
    event.target.classList.add('active');
  }
  document.getElementById(tabId).classList.add('active');
}
