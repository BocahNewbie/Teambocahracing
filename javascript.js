// Game State Core
const gameState = {
  cash: 500000000,
  teams: TEAMS_DATA,
  drivers: INITIAL_DRIVERS,
  mechanics: MECHANICS_DATA,
  playerTeamId: "team_1",
  currentRace: null
};

// DOM Tab Switcher
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Render Standings Table
function renderStandings() {
  const tbodyTeams = document.querySelector('#table-team-standings tbody');
  tbodyTeams.innerHTML = '';
  gameState.teams.forEach((t, idx) => {
    tbodyTeams.innerHTML += `<tr><td>${idx + 1}</td><td><strong style="color:${t.color}">${t.name}</strong></td><td>0 PTS</td></tr>`;
  });

  const tbodyDrivers = document.querySelector('#table-driver-standings tbody');
  tbodyDrivers.innerHTML = '';
  gameState.drivers.slice(0, 10).forEach((d, idx) => {
    const team = gameState.teams.find(t => t.id === d.teamId);
    tbodyDrivers.innerHTML += `<tr><td>${idx + 1}</td><td>${d.name} (#${d.carNumber})</td><td>${team ? team.name : '-'}</td><td>0 PTS</td></tr>`;
  });
}

// Negosiasi Kontrak (Contoh Logika Tawar Menawar)
function negotiateContract(driverId, offeredSalary) {
  const driver = gameState.drivers.find(d => d.id === driverId);
  if (!driver) return;

  if (offeredSalary >= driver.salaryPerRace) {
    alert(`Kontrak Disetujui! ${driver.name} bergabung dengan tim kamu.`);
  } else {
    driver.contractPatience--;
    if (driver.contractPatience <= 0) {
      alert(`Negosiasi Gagal! ${driver.name} menolak tawaran dan memutus komunikasi.`);
    } else {
      alert(`Tawaran terlalu rendah! Sisa kesabaran ${driver.name}: ${driver.contractPatience} kesempatan.`);
    }
  }
}

// Top-Down Canvas Racing Render Engine Simpel
const canvas = document.getElementById('raceCanvas');
const ctx = canvas.getContext('2d');

function drawOvalTrack() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Outer Asphalt
  ctx.beginPath();
  ctx.ellipse(425, 260, 360, 200, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();

  // Infield Grass
  ctx.beginPath();
  ctx.ellipse(425, 260, 260, 100, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e3a1e';
  ctx.fill();

  // Pit Lane Area
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Initializing Game
window.onload = () => {
  renderStandings();
  drawOvalTrack();
  
  // Populate Tracks Select
  const trackSelect = document.getElementById('select-track');
  TRACKS_DATA.forEach(tr => {
    trackSelect.innerHTML += `<option value="${tr.id}">${tr.name} (${tr.type})</option>`;
  });
};

function setStrategy(carNum, strat) {
  console.log(`Mobil #${carNum} mengubah strategi menjadi: ${strat}`);
}

function callPitStop(carNum) {
  console.log(`Mobil #${carNum} dipanggil ke Pit Stop!`);
}
