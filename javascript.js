let gameState = {
    teamName: '',
    managerName: '',
    budget: 500000, // Budget awal disesuaikan ke Rp 500.000
    currentWeek: 1,
    maxWeeks: 14,
    userLeagueTier: 5,
    roster: [],
    startingLineupIds: [],
    marketPlayers: [],
    leagues: {},
    schedules: [],
    inboxMessages: [],
    transferNews: [],
    sponsors: {
        available: generateSponsorOptions(5),
        active: { primary: null, secondary: null, extra: null }
    }
};

let currentNego = null;
let matchSimTimer = null;
let activeMatchEvents = [];
let currentEventIdx = 0;
let currentSwapStarterId = null;

// HELPER UTILITIES
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function showAlert(title, message, icon = 'fa-circle-info') {
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    document.getElementById('alert-icon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
    document.getElementById('modal-alert').classList.remove('hidden');
}

function countForeignPlayers(playersArr) {
    return playersArr.filter(p => p.country !== 'Indonesia').length;
}

function getEffectiveOvr(p) {
    const staminaMultiplier = 0.6 + (0.4 * (p.stamina / 100));
    return Math.round(p.ovr * staminaMultiplier);
}

function getAverageLineupOvr() {
    if (!gameState.startingLineupIds || gameState.startingLineupIds.length === 0) return 0;
    const starters = gameState.roster.filter(p => gameState.startingLineupIds.includes(p.id));
    if (starters.length === 0) return 0;
    const sum = starters.reduce((acc, p) => acc + getEffectiveOvr(p), 0);
    return Math.round(sum / starters.length);
}

// REGISTRATION HANDLER
function handleRegistration(e) {
    e.preventDefault();
    const teamName = document.getElementById('input-team-name').value.trim();
    const managerName = document.getElementById('input-manager-name').value.trim();

    if (!teamName || !managerName) {
        showAlert('Form Tidak Lengkap', 'Silakan isi Nama Tim dan Nama Manager.');
        return;
    }

    gameState.teamName = teamName;
    gameState.managerName = managerName;
    gameState.budget = 500000;
    gameState.currentWeek = 1;
    gameState.userLeagueTier = 5;

    // Reset Sponsor Pool
    gameState.sponsors = {
        available: generateSponsorOptions(5),
        active: { primary: null, secondary: null, extra: null }
    };

    // Generate Default Roster: 9 players (8 local, 1 foreign) Tier H - F
    gameState.roster = [];
    const posAssignments = ['Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter'];

    for (let i = 0; i < 9; i++) {
        const isForeign = (i === 8);
        const p = createRandomPlayer('user_p', ['H', 'G', 'F'], isForeign ? null : 'Indonesia', posAssignments[i]);
        gameState.roster.push(p);
    }

    gameState.startingLineupIds = gameState.roster.slice(0, 6).map(p => p.id);

    gameState.leagues = generateLeagueStructure(gameState.teamName);

    generateMarketPool();
    generateLeagueSchedules();

    gameState.inboxMessages.push({
        id: 'msg_welcome',
        type: 'SAMBUTAN LIGA',
        time: '1',
        message: `Selamat datang Manager ${gameState.managerName}! Tim Anda (${gameState.teamName}) telah terdaftar di kasta dasar **Liga 5 (Liga Voli Amatir)** dengan modal awal ${formatRupiah(gameState.budget)}. Berjuanglah untuk promosi ke Liga 1!`,
        handled: true
    });

    document.getElementById('screen-setup').classList.add('hidden');
    document.getElementById('top-header').classList.remove('hidden');
    document.getElementById('screen-dashboard').classList.remove('hidden');

    const selectEl = document.getElementById('select-league-tier');
    if (selectEl) selectEl.value = "5";

    updateHeaderUI();
    renderSquadUI();
    renderSponsorsUI();
    renderStandingsUI();
    renderMatchUI();
    renderTransferMarket();
    renderInboxUI();
    renderNewsUI();
}

function generateLeagueSchedules() {
    gameState.schedules = [];
    const userLeagueTeams = gameState.leagues[gameState.userLeagueTier];
    const otherTeams = userLeagueTeams.filter(t => !t.isUser);

    for (let w = 1; w <= gameState.maxWeeks; w++) {
        const opponent = otherTeams[(w - 1) % otherTeams.length];
        const matches = [
            { home: userLeagueTeams.find(t => t.isUser), away: opponent, played: false, homeSets: 0, awaySets: 0 }
        ];

        const remaining = otherTeams.filter(t => t.id !== opponent.id);
        for (let i = 0; i < remaining.length; i += 2) {
            if (remaining[i + 1]) {
                matches.push({
                    home: remaining[i],
                    away: remaining[i + 1],
                    played: false, homeSets: 0, awaySets: 0
                });
            }
        }

        gameState.schedules.push({ week: w, matches });
    }
}

function generateMarketPool() {
  gameState.marketPlayers = [];
  
  // Ambil semua nama klub dari seluruh kasta liga (Liga 1 - Liga 5)
  let allClubs = [];
  if (gameState.leagues) {
    Object.values(gameState.leagues).forEach(tierTeams => {
      tierTeams.forEach(team => {
        // Abaikan tim milik user
        if (!team.isUser) {
          allClubs.push(team.name);
        }
      });
    });
  }

  // Jika daftar klub liga belum terbentuk, gunakan AI_TEAM_POOL sebagai cadangan
  if (allClubs.length === 0 && typeof AI_TEAM_POOL !== 'undefined') {
    allClubs = AI_TEAM_POOL;
  }

  const tiers = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS'];
  const totalPlayers = 300;

  for (let i = 0; i < totalPlayers; i++) {
    const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
    
    // Distribusi Kebangsaan: ~70% Indonesia, ~30% Pemain Asing
    const isLocal = Math.random() < 0.7;
    const country = isLocal ? 'Indonesia' : null;

    const p = createRandomPlayer(`mkt_p_${i}`, [randomTier], country);

    // Distribusi Status: ~40% Free Agent (Tanpa Klub), ~60% Memiliki Klub dari Liga
    const isFreeAgent = Math.random() < 0.4;

    if (!isFreeAgent && allClubs.length > 0) {
      p.clubName = allClubs[Math.floor(Math.random() * allClubs.length)];
    } else {
      p.clubName = null; // Status Free Agent
    }

    gameState.marketPlayers.push(p);
  }
}

// HEADER UI UPDATES
function updateHeaderUI() {
    document.getElementById('header-team-name').innerText = gameState.teamName;
    document.getElementById('header-team-logo').innerText = gameState.teamName.charAt(0).toUpperCase();
    document.getElementById('header-manager-name').innerText = `Manager: ${gameState.managerName}`;
    document.getElementById('header-week').innerText = `${gameState.currentWeek} / ${gameState.maxWeeks}`;
    document.getElementById('header-budget').innerText = formatRupiah(gameState.budget);

    const tierInfo = LEAGUE_TIERS[gameState.userLeagueTier];
    document.getElementById('header-tier-name').innerText = tierInfo ? tierInfo.short : `Liga ${gameState.userLeagueTier}`;

    const foreignCount = countForeignPlayers(gameState.roster);
    document.getElementById('header-foreign-count').innerText = `${foreignCount} / 2`;

    const currentTierTeams = gameState.leagues[gameState.userLeagueTier] || [];
    const sortedTeams = [...currentTierTeams].sort((a, b) => b.points - a.points || (b.setW - b.setL) - (a.setW - a.setL));
    const userRank = sortedTeams.findIndex(t => t.isUser) + 1;
    document.getElementById('header-rank').innerText = `#${userRank || 1}`;

    const unhandled = gameState.inboxMessages.filter(m => !m.handled).length;
    const badge = document.getElementById('inbox-badge-count');
    if (unhandled > 0) {
        badge.innerText = unhandled;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// TAB SWITCHING
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-800', 'text-slate-400');
    });
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-800', 'text-slate-400');
        activeBtn.classList.add('bg-blue-600', 'text-white');
    }

    const tabs = ['squad', 'sponsor', 'standings', 'match', 'market', 'inbox', 'news'];
    tabs.forEach(t => {
        const content = document.getElementById(`tab-content-${t}`);
        if (content) content.classList.add('hidden');
    });

    const activeContent = document.getElementById(`tab-content-${tabName}`);
    if (activeContent) activeContent.classList.remove('hidden');

    if (tabName === 'squad') renderSquadUI();
    if (tabName === 'sponsor') renderSponsorsUI();
    if (tabName === 'standings') renderStandingsUI();
    if (tabName === 'match') renderMatchUI();
    if (tabName === 'market') renderTransferMarket();
    if (tabName === 'inbox') renderInboxUI();
    if (tabName === 'news') renderNewsUI();
}

// SQUAD RENDER & SWAP
function renderSquadUI() {
    document.getElementById('lineup-avg-ovr').innerText = getAverageLineupOvr();

    const courtPositions = [4, 3, 2, 5, 6, 1];
    const starters = gameState.roster.filter(p => gameState.startingLineupIds.includes(p.id));

    courtPositions.forEach((posNum, idx) => {
        const el = document.getElementById(`court-pos-${posNum}`);
        if (!el) return;
        const p = starters[idx];

        if (p) {
            el.innerHTML = `
                <div class="text-[10px] font-bold text-amber-400 uppercase">Pos ${posNum}</div>
                <p class="font-bold text-xs text-white truncate mt-0.5">${p.flag} ${p.name}</p>
                <p class="text-[10px] text-slate-300">${p.position}</p>
                <span class="text-[10px] font-bold text-emerald-400 mt-1">OVR ${getEffectiveOvr(p)}</span>
            `;
        } else {
            el.innerHTML = `<span class="text-xs text-slate-500 italic">Kosong</span>`;
        }
    });

    const tbody = document.getElementById('squad-roster-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const sortedRoster = [...gameState.roster].sort((a, b) => {
        const aIsStarter = gameState.startingLineupIds.includes(a.id) ? 1 : 0;
        const bIsStarter = gameState.startingLineupIds.includes(b.id) ? 1 : 0;
        return bIsStarter - aIsStarter;
    });

    sortedRoster.forEach(p => {
        const isStarter = gameState.startingLineupIds.includes(p.id);
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/50 transition cursor-pointer';
        tr.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') openPlayerModal(p.id);
        };

        tr.innerHTML = `
            <td class="p-3">
                ${isStarter ? '<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">UTAMA</span>' : '<span class="bg-slate-700 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">CADANGAN</span>'}
            </td>
            <td class="p-3 font-bold text-white">${p.flag} ${p.name}</td>
            <td class="p-3 text-slate-300">${p.position}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold border ${TIERS[p.tier].color}">${p.tier}</span></td>
            <td class="p-3 text-center font-bold text-amber-400">${getEffectiveOvr(p)} <span class="text-[10px] text-slate-500">(${p.ovr})</span></td>
            <td class="p-3 text-center font-bold text-emerald-400">${p.stamina}%</td>
            <td class="p-3 font-mono text-emerald-300">${formatRupiah(p.salary)}</td>
            <td class="p-3 font-bold ${p.contractMatches <= 2 ? 'text-rose-400' : 'text-slate-200'}">${p.contractMatches} Match</td>
            <td class="p-3 font-mono text-amber-300">${formatRupiah(p.value)}</td>
            <td class="p-3 text-center">
                <button onclick="event.stopPropagation(); toggleStarter('${p.id}')" class="px-2.5 py-1 ${isStarter ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'bg-blue-600 text-white'} rounded text-[11px] font-bold hover:opacity-90 transition">
                    ${isStarter ? 'Bangku Cadangan' : 'Jadikan Starter'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleStarter(playerId) {
    const isStarter = gameState.startingLineupIds.includes(playerId);
    if (isStarter) {
        openSwapModal(playerId);
    } else {
        if (gameState.startingLineupIds.length >= 6) {
            openSwapModal(gameState.startingLineupIds[0]);
            return;
        }
        gameState.startingLineupIds.push(playerId);
        renderSquadUI();
    }
}

function openSwapModal(starterId) {
  const starter = gameState.roster.find(p => p.id === starterId);
  if (!starter) return;
  currentSwapStarterId = starterId;

  const starterCard = document.getElementById('swap-starter-card');
  starterCard.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded">PEMAIN UTAMA KELUAR</span>
      <span class="text-xs font-bold text-emerald-400 font-mono">OVR ${getEffectiveOvr(starter)} (${starter.ovr})</span>
    </div>
    <div class="flex items-center justify-between mt-1">
      <div>
        <h4 class="font-bold text-white text-sm">${starter.flag} ${starter.name}</h4>
        <p class="text-xs text-slate-400">${starter.position} • Stamina: ${starter.stamina}%</p>
      </div>
      <div class="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
        <div class="bg-slate-900 px-1.5 py-1 rounded"><span class="text-slate-500 block">SPK</span><b>${starter.skills.spike}</b></div>
        <div class="bg-slate-900 px-1.5 py-1 rounded"><span class="text-slate-500 block">BLK</span><b>${starter.skills.block}</b></div>
        <div class="bg-slate-900 px-1.5 py-1 rounded"><span class="text-slate-500 block">SRV</span><b>${starter.skills.serve}</b></div>
        <div class="bg-slate-900 px-1.5 py-1 rounded"><span class="text-slate-500 block">RCV</span><b>${starter.skills.receive}</b></div>
      </div>
    </div>
  `;

  const benched = gameState.roster.filter(p => !gameState.startingLineupIds.includes(p.id));
  const listEl = document.getElementById('swap-candidates-list');
  listEl.innerHTML = '';

  if (benched.length === 0) {
    listEl.innerHTML = `<p class="text-center text-xs text-slate-500 py-4 italic">Tidak ada pemain cadangan yang tersedia.</p>`;
  } else {
    // Urutkan kandidat: Utamakan yang posisinya cocok lebih dulu
    benched.sort((a, b) => {
      const aMatch = a.position === starter.position ? 1 : 0;
      const bMatch = b.position === starter.position ? 1 : 0;
      return bMatch - aMatch;
    });

    benched.forEach(benchP => {
      const diffOvr = getEffectiveOvr(benchP) - getEffectiveOvr(starter);
      const isPosMatch = benchP.position === starter.position;

      // Label Posisi Cocok / Beda
      const posBadge = isPosMatch 
        ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">COCOK</span>`
        : `<span class="bg-slate-700 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">BEDA POSISI</span>`;

      const card = document.createElement('div');
      card.className = `bg-slate-800 border ${isPosMatch ? 'border-emerald-500/40' : 'border-slate-700'} p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-blue-500 transition`;
      card.innerHTML = `
        <div>
          <h5 class="font-bold text-white text-xs flex items-center gap-1">
            ${benchP.flag} ${benchP.name} 
            <span class="text-[10px] font-normal border px-1 rounded ${TIERS[benchP.tier].color}">${benchP.tier}</span>
            ${posBadge}
          </h5>
          <p class="text-[11px] text-slate-400 mt-0.5">${benchP.position} • Stamina: <b class="text-emerald-400">${benchP.stamina}%</b></p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="font-bold ${diffOvr >= 0 ? 'text-emerald-400' : 'text-rose-400'}">OVR ${getEffectiveOvr(benchP)} (${diffOvr >= 0 ? '+' + diffOvr : diffOvr})</span>
          <button onclick="executeSwap('${benchP.id}')" class="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs">Tukar</button>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  document.getElementById('modal-swap-player').classList.remove('hidden');
}

function executeSwap(candidateId) {
    if (!currentSwapStarterId) return;

    const idx = gameState.startingLineupIds.indexOf(currentSwapStarterId);
    if (idx !== -1) {
        gameState.startingLineupIds[idx] = candidateId;
    }

    closeModal('modal-swap-player');
    currentSwapStarterId = null;
    renderSquadUI();
}

// SPONSOR SYSTEM
function renderSponsorsUI() {
    const types = ['primary', 'secondary', 'extra'];

    types.forEach(type => {
        const cardEl = document.getElementById(`sponsor-card-${type}`);
        if (!cardEl) return;

        const active = gameState.sponsors.active[type];
        if (active) {
            const isFinished = active.completed;
            cardEl.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">${type} SPONSOR</span>
                    <span class="text-xs font-bold ${isFinished ? 'text-cyan-400' : 'text-emerald-400'}">
                        ${isFinished ? 'SELESAI ✅' : 'AKTIF'}
                    </span>
                </div>
                <div>
                    <h4 class="font-bold text-white text-base">${active.name}</h4>
                    <p class="text-xs text-slate-400 mt-1"><i class="fa-solid fa-bullseye text-amber-400 mr-1"></i> Target: ${active.goal}</p>
                    ${active.isInstallment ? 
                        `<p class="text-[11px] text-cyan-300 mt-1"><i class="fa-solid fa-coins mr-1"></i> Angsuran: ${formatRupiah(active.perWinFee)} / match menang (${active.paidWins}/${active.targetVal})</p>` : 
                        `<p class="text-[11px] text-emerald-300 mt-1"><i class="fa-solid fa-vault mr-1"></i> Dana Awal Diterima: ${formatRupiah(active.receivedTotal)}</p>`
                    }
                </div>
                <div class="bg-slate-950 p-3 rounded-xl flex justify-between items-center text-xs">
                    <span class="text-slate-400">Total Cair:</span>
                    <b class="text-emerald-400 font-mono">${formatRupiah(active.receivedTotal)}</b>
                </div>
                ${!isFinished ? `
                    <button onclick="terminateSponsorContract('${type}')" class="w-full py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 font-bold rounded-xl text-xs transition">
                        <i class="fa-solid fa-ban mr-1"></i> Putus Kontrak (Penalti 85%)
                    </button>
                ` : '<div class="text-[10px] text-center text-cyan-400 font-bold py-1">Objektif Terpenuhi + Bonus 15%</div>'}
            `;
        } else {
            const options = gameState.sponsors.available[type] || [];
            let optionsHTML = options.map(s => `
                <div class="bg-slate-950 p-3 rounded-xl space-y-2 border border-slate-800 hover:border-slate-700 transition">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-white text-xs">${s.name}</span>
                        <span class="text-emerald-400 font-mono text-xs font-bold">${formatRupiah(s.fee)}</span>
                    </div>
                    <p class="text-[11px] text-slate-400"><i class="fa-solid fa-bullseye text-amber-400 mr-1"></i> ${s.goal}</p>
                    <p class="text-[10px] text-slate-500">${s.isInstallment ? 'Sistem: Angsuran per Kemenangan Match' : 'Sistem: Diterima Penuh di Awal'}</p>
                    <button onclick="signSponsorContract('${type}', '${s.id}')" class="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] transition">
                        Tanda Tangan Kontrak
                    </button>
                </div>
            `).join('');

            cardEl.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">${type} SPONSOR</span>
                    <span class="text-xs font-bold text-slate-500">Pilih Kontrak</span>
                </div>
                <div class="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    ${optionsHTML}
                </div>
            `;
        }
    });
}

function signSponsorContract(type, sponsorId) {
    const selected = gameState.sponsors.available[type].find(s => s.id === sponsorId);
    if (selected) {
        gameState.sponsors.active[type] = selected;

        // Jika bukan sistem angsuran, dana awal langsung masuk ke Kas
        if (!selected.isInstallment) {
            gameState.budget += selected.fee;
            showAlert('Sponsor Ditandatangani!', `Klub Anda menerima dana sponsor awal sebesar ${formatRupiah(selected.fee)} dari ${selected.name}.`, 'fa-handshake');
        } else {
            showAlert('Sponsor Ditandatangani!', `Sponsor ${selected.name} akan mencairkan ${formatRupiah(selected.perWinFee)} setiap kali tim Anda memenangkan pertandingan!`, 'fa-handshake');
        }

        updateHeaderUI();
        renderSponsorsUI();
    }
}

// Fitur Putus / Batal Kontrak (Pengembalian 70% + Penalti Denda 15% = Total 85%)
function terminateSponsorContract(type) {
    const active = gameState.sponsors.active[type];
    if (!active) return;

    const refundAmount = Math.round(active.receivedTotal * 0.70);
    const penaltyAmount = Math.round(active.fee * 0.15);
    const totalDeduction = refundAmount + penaltyAmount;

    if (gameState.budget < totalDeduction) {
        showAlert('Kas Tidak Cukup', `Kas klub Anda (${formatRupiah(gameState.budget)}) tidak cukup untuk membayar penalti pembatalan sebesar ${formatRupiah(totalDeduction)}!`);
        return;
    }

    gameState.budget -= totalDeduction;
    gameState.sponsors.active[type] = null;

    showAlert(
        'Kontrak Dibatalkan', 
        `Kontrak dengan ${active.name} resmi diputus.\n\nKas dipotong sebesar ${formatRupiah(totalDeduction)} (Pengembalian 70%: ${formatRupiah(refundAmount)} + Penalti Denda 15%: ${formatRupiah(penaltyAmount)}).`,
        'fa-ban'
    );

    updateHeaderUI();
    renderSponsorsUI();
}

// STANDINGS RENDER
function renderStandingsUI() {
    const tbody = document.getElementById('standings-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const selectEl = document.getElementById('select-league-tier');
    const selectedTier = selectEl ? parseInt(selectEl.value) : gameState.userLeagueTier;

    const titleEl = document.getElementById('standings-league-title');
    if (titleEl) titleEl.innerText = LEAGUE_TIERS[selectedTier] ? LEAGUE_TIERS[selectedTier].name : `Liga ${selectedTier}`;

    const currentTierTeams = gameState.leagues[selectedTier] || [];
    const sortedTeams = [...currentTierTeams].sort((a, b) => b.points - a.points || (b.setW - b.setL) - (a.setW - a.setL));

    sortedTeams.forEach((t, idx) => {
        const rank = idx + 1;
        let zoneBadge = '';
        let bgClass = t.isUser ? 'bg-blue-900/30 border-l-4 border-blue-500' : 'hover:bg-slate-800/50';

        if (rank <= 2 && selectedTier > 1) {
            zoneBadge = '<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Promosi Otomatis</span>';
        } else if (rank <= 2 && selectedTier === 1) {
            zoneBadge = '<span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Zona Juara</span>';
        } else if (rank === 3 && selectedTier > 1) {
            zoneBadge = '<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Playoff Promosi</span>';
        } else if (rank === 13 && selectedTier < 5) {
            zoneBadge = '<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Playoff Degradasi</span>';
        } else if (rank >= 14 && selectedTier < 5) {
            zoneBadge = '<span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">Degradasi Otomatis</span>';
        } else {
            zoneBadge = '<span class="text-slate-500 text-[10px]">-</span>';
        }

        const tr = document.createElement('tr');
        tr.className = `${bgClass} transition`;
        tr.innerHTML = `
            <td class="p-3 text-center font-bold ${rank <= 3 ? 'text-amber-400' : 'text-slate-400'}">${rank}</td>
            <td class="p-3 font-bold ${t.isUser ? 'text-blue-300' : 'text-white'}">${t.name} ${t.isUser ? '(Anda)' : ''}</td>
            <td class="p-3 text-center">${t.played}</td>
            <td class="p-3 text-center font-bold text-emerald-400">${t.won}</td>
            <td class="p-3 text-center font-bold text-rose-400">${t.lost}</td>
            <td class="p-3 text-center font-mono text-slate-300">${t.setW} - ${t.setL}</td>
            <td class="p-3 text-center font-extrabold text-amber-400">${t.points}</td>
            <td class="p-3 text-center">${zoneBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

// MATCH SIMULATION ENGINE
function renderMatchUI() {
    const currentSchedule = gameState.schedules.find(s => s.week === gameState.currentWeek);
    if (!currentSchedule) return;

    document.getElementById('match-schedule-title').innerText = `Pekan ke-${gameState.currentWeek} dari ${gameState.maxWeeks}`;

    const userMatch = currentSchedule.matches.find(m => m.home.isUser || m.away.isUser);
    if (userMatch) {
        document.getElementById('match-home-name').innerText = userMatch.home.name;
        document.getElementById('match-away-name').innerText = userMatch.away.name;

        if (userMatch.played) {
            document.getElementById('match-score-display').innerText = `${userMatch.homeSets} - ${userMatch.awaySets}`;
            document.getElementById('match-sets-display').innerText = `SELESAI (Set)`;
        } else {
            document.getElementById('match-score-display').innerText = `0 - 0`;
            document.getElementById('match-sets-display').innerText = `Belum Bertanding`;
        }
    }

    const otherList = document.getElementById('other-matches-list');
    otherList.innerHTML = '';

    currentSchedule.matches.filter(m => !m.home.isUser && !m.away.isUser).forEach(m => {
        const card = document.createElement('div');
        card.className = 'bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs';
        card.innerHTML = `
            <span class="font-bold text-slate-200 truncate w-2/5">${m.home.name}</span>
            <span class="font-bold text-amber-400 font-mono">${m.played ? `${m.homeSets} - ${m.awaySets}` : 'VS'}</span>
            <span class="font-bold text-slate-200 truncate w-2/5 text-right">${m.away.name}</span>
        `;
        otherList.appendChild(card);
    });

    const btnStart = document.getElementById('btn-start-match');
    if (currentSchedule.matches[0].played) {
        btnStart.innerHTML = `<i class="fa-solid fa-arrow-right mr-2"></i> Lanjut ke Pekan ${gameState.currentWeek + 1}`;
    } else {
        btnStart.innerHTML = `<i class="fa-solid fa-play mr-2"></i> Simulasi Semua Pertandingan`;
    }
}

function handleMatchButtonClick() {
    const currentSchedule = gameState.schedules.find(s => s.week === gameState.currentWeek);
    if (currentSchedule && currentSchedule.matches[0].played) {
        if (gameState.currentWeek < gameState.maxWeeks) {
            gameState.currentWeek++;
            
            const logEl = document.getElementById('match-commentary-log');
            if (logEl) logEl.innerHTML = '<p class="text-slate-500 italic text-center py-10">Klik "Simulasi Semua Pertandingan" untuk memulai laga pekan ini.</p>';

            updateHeaderUI();
            renderMatchUI();
        } else {
            processEndOfWeekAndSeason();
        }
    } else {
        startMatchSimulation();
    }
}

function startMatchSimulation() {
    const currentSchedule = gameState.schedules.find(s => s.week === gameState.currentWeek);
    if (!currentSchedule || currentSchedule.matches[0].played) {
        showAlert('Pekan Selesai', 'Pertandingan pekan ini sudah disimulasikan.');
        return;
    }

    const userMatch = currentSchedule.matches.find(m => m.home.isUser || m.away.isUser);
    const userIsHome = userMatch.home.isUser;
    const logEl = document.getElementById('match-commentary-log');
    logEl.innerHTML = '';

    const btnStart = document.getElementById('btn-start-match');
    btnStart.disabled = true;
    btnStart.classList.add('opacity-50', 'cursor-not-allowed');

    const btnSkip = document.getElementById('btn-skip-match');
    if (btnSkip) btnSkip.classList.remove('hidden');

    const startingPlayers = gameState.roster.filter(p => gameState.startingLineupIds.includes(p.id));
    const getRandomUserPlayer = () => startingPlayers[Math.floor(Math.random() * startingPlayers.length)] || { name: "Pemain Utama", flag: "🇮🇩" };

    const userLineupOvr = getAverageLineupOvr();
    const opponentTeam = userIsHome ? userMatch.away : userMatch.home;
    const opponentOvr = opponentTeam.avgOvr || 65;

    activeMatchEvents = [];
    let homeSets = 0;
    let awaySets = 0;
    let setIndex = 1;

    const highlightActions = [
        (p) => `🚀 <b>SERVE ACE!</b> Servis deras ${p.flag} <b>${p.name}</b> mematikan lawan!`,
        (p) => `💥 <b>MONSTER SMASH!</b> Umpan manis disambar deras oleh ${p.flag} <b>${p.name}</b>!`,
        (p) => `🧱 <b>MONSTER BLOCK!</b> Tembok kokoh ${p.flag} <b>${p.name}</b> mematikan spike lawan!`,
        (p) => `🛡️ <b>SUPER DIG!</b> Penyelamatan spektakuler oleh ${p.flag} <b>${p.name}</b>!`,
        (p) => `📐 <b>QUICK ATTACK!</b> Bola cepat diselesaikan dingin oleh ${p.flag} <b>${p.name}</b>!`
    ];

    while (homeSets < 3 && awaySets < 3) {
        let homePoints = 0;
        let awayPoints = 0;
        const setTarget = (setIndex === 5) ? 15 : 25;

        activeMatchEvents.push({ type: 'SET_START', setIndex, homeSets, awaySets });

        while ((homePoints < setTarget && awayPoints < setTarget) || Math.abs(homePoints - awayPoints) < 2) {
            const winProbability = userLineupOvr / (userLineupOvr + opponentOvr || 100);
            const userPoint = Math.random() < (userIsHome ? winProbability : 1 - winProbability);

            if (userPoint) {
                if (userIsHome) homePoints++; else awayPoints++;
            } else {
                if (userIsHome) awayPoints++; else homePoints++;
            }

            if ((homePoints + awayPoints) % 2 === 0 || homePoints >= setTarget - 2 || awayPoints >= setTarget - 2) {
                const player = getRandomUserPlayer();
                const actionFn = highlightActions[Math.floor(Math.random() * highlightActions.length)];
                const pointWinner = (userPoint && userIsHome) || (!userPoint && !userIsHome) ? (userIsHome ? gameState.teamName : opponentTeam.name) : (userIsHome ? opponentTeam.name : gameState.teamName);

                activeMatchEvents.push({
                    type: 'POINT_ACTION',
                    homePoints, awayPoints, homeSets, awaySets,
                    text: `${actionFn(player)} <span class="text-amber-400 font-bold">(Poin untuk ${pointWinner})</span>`
                });
            }
        }

        if (homePoints > awayPoints) homeSets++; else awaySets++;

        activeMatchEvents.push({
            type: 'SET_END', setIndex, homePoints, awayPoints, homeSets, awaySets,
            winner: homePoints > awayPoints ? userMatch.home.name : userMatch.away.name
        });

        setIndex++;
    }

    userMatch.homeSets = homeSets;
    userMatch.awaySets = awaySets;
    userMatch.played = true;

    currentEventIdx = 0;
    if (matchSimTimer) clearInterval(matchSimTimer);

    matchSimTimer = setInterval(() => {
        if (currentEventIdx >= activeMatchEvents.length) {
            finishMatchSimulationUI(userMatch);
            return;
        }
        renderSingleMatchEvent(activeMatchEvents[currentEventIdx]);
        currentEventIdx++;
    }, 500);
}

function renderSingleMatchEvent(event) {
    const logEl = document.getElementById('match-commentary-log');
    if (!logEl) return;

    if (event.type === 'SET_START') {
        logEl.innerHTML += `
            <div class="text-amber-400 font-bold border-t border-slate-800 pt-2 mt-2 flex justify-between items-center text-xs">
                <span>🏐 SET KE-${event.setIndex} DIMULAI</span>
                <span class="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[11px]">Set: ${event.homeSets} - ${event.awaySets}</span>
            </div>
        `;
    } else if (event.type === 'POINT_ACTION') {
        document.getElementById('match-score-display').innerText = `${event.homePoints} - ${event.awayPoints}`;
        document.getElementById('match-sets-display').innerText = `Set: (${event.homeSets} - ${event.awaySets})`;
        logEl.innerHTML += `<p class="text-slate-300 py-0.5 font-sans leading-relaxed text-[11px]">${event.text}</p>`;
    } else if (event.type === 'SET_END') {
        logEl.innerHTML += `
            <p class="text-emerald-400 font-bold py-1 font-sans text-xs bg-emerald-950/40 px-2 rounded border border-emerald-500/20 my-1">
                🏁 Set ke-${event.setIndex} Berakhir! Skor: ${event.homePoints} - ${event.awayPoints} (${event.winner} Memenangkan Set)
            </p>
        `;
    }

    logEl.scrollTop = logEl.scrollHeight;
}

function skipMatchAnimation() {
    if (matchSimTimer) clearInterval(matchSimTimer);
    for (let i = currentEventIdx; i < activeMatchEvents.length; i++) {
        renderSingleMatchEvent(activeMatchEvents[i]);
    }
    const currentSchedule = gameState.schedules.find(s => s.week === gameState.currentWeek);
    const userMatch = currentSchedule.matches.find(m => m.home.isUser || m.away.isUser);
    finishMatchSimulationUI(userMatch);
}

function finishMatchSimulationUI(userMatch) {
    if (matchSimTimer) clearInterval(matchSimTimer);

    document.getElementById('match-score-display').innerText = `${userMatch.homeSets} - ${userMatch.awaySets}`;
    document.getElementById('match-sets-display').innerText = `SELESAI (Set)`;

    const btnStart = document.getElementById('btn-start-match');
    btnStart.disabled = false;
    btnStart.classList.remove('opacity-50', 'cursor-not-allowed');

    const btnSkip = document.getElementById('btn-skip-match');
    if (btnSkip) btnSkip.classList.add('hidden');

    const logEl = document.getElementById('match-commentary-log');
    const matchWinner = userMatch.homeSets > userMatch.awaySets ? userMatch.home.name : userMatch.away.name;
    const matchLoser = userMatch.homeSets > userMatch.awaySets ? userMatch.away.name : userMatch.home.name;

    logEl.innerHTML += `
        <div class="bg-slate-900 border border-slate-800 p-3.5 rounded-xl mt-3 space-y-1 font-sans">
            <p class="text-amber-300 font-bold text-xs">📝 RANGKUMAN LAGA PEKAN ${gameState.currentWeek}:</p>
            <p class="text-slate-300 leading-relaxed text-xs">
                Kemenangan untuk <b class="text-white">${matchWinner}</b> atas <b class="text-slate-400">${matchLoser}</b> dengan skor set <b class="text-amber-400">${userMatch.homeSets} - ${userMatch.awaySets}</b>!
            </p>
        </div>
    `;
    logEl.scrollTop = logEl.scrollHeight;

    const currentSchedule = gameState.schedules.find(s => s.week === gameState.currentWeek);
    currentSchedule.matches.filter(m => !m.home.isUser && !m.away.isUser).forEach(m => {
        const homeWins = Math.random() > 0.48;
        if (homeWins) {
            m.homeSets = 3;
            m.awaySets = Math.floor(Math.random() * 3);
        } else {
            m.awaySets = 3;
            m.homeSets = Math.floor(Math.random() * 3);
        }
        m.played = true;
    });

    const currentTierTeams = gameState.leagues[gameState.userLeagueTier] || [];
    currentSchedule.matches.forEach(m => {
        const homeTeam = currentTierTeams.find(t => t.id === m.home.id);
        const awayTeam = currentTierTeams.find(t => t.id === m.away.id);

        if (homeTeam && awayTeam) {
            homeTeam.played++; awayTeam.played++;
            homeTeam.setW += m.homeSets; homeTeam.setL += m.awaySets;
            awayTeam.setW += m.awaySets; awayTeam.setL += m.homeSets;

            if (m.homeSets > m.awaySets) {
                homeTeam.won++; awayTeam.lost++;
                homeTeam.points += 3;
            } else {
                awayTeam.won++; homeTeam.lost++;
                awayTeam.points += 3;
            }
        }
    });

    // Process player stamina, salaries, and contract decay
    gameState.roster.forEach(p => {
        if (gameState.startingLineupIds.includes(p.id)) {
            p.stamina = Math.max(20, p.stamina - Math.floor(Math.random() * 15 + 10));
            p.contractMatches = Math.max(0, p.contractMatches - 1);
            gameState.budget -= p.salary;
        } else {
            p.stamina = Math.min(100, p.stamina + 15);
        }
    });

    gameState.roster.concat(gameState.marketPlayers).forEach(p => {
        if (p.lockoutMatches > 0) p.lockoutMatches--;
    });

    // ------------------- SPONSOR PAYMENT & BONUS CHECK -------------------
    const userWon = (userMatch.home.isUser && userMatch.homeSets > userMatch.awaySets) || 
                    (userMatch.away.isUser && userMatch.awaySets > userMatch.homeSets);

    if (userWon) {
        const userTeamData = currentTierTeams.find(t => t.isUser);

        ['primary', 'secondary', 'extra'].forEach(type => {
            const active = gameState.sponsors.active[type];
            if (active && !active.completed) {
                
                // Jika sponsor tipe angsuran per kemenangan match
                if (active.isInstallment && active.paidWins < active.targetVal) {
                    active.paidWins++;
                    active.receivedTotal += active.perWinFee;
                    gameState.budget += active.perWinFee;

                    addTransferNews(
                        'ANGSURAN SPONSOR',
                        `Sponsor <b>${active.name}</b> mencairkan angsuran kemenangan ke-${active.paidWins} sebesar <b>${formatRupiah(active.perWinFee)}</b> ke kas klub!`
                    );
                }

                // Cek pencapaian objektif & bonus 15%
                if (active.evaluator(0, userTeamData.won, userTeamData.setW)) {
                    active.completed = true;
                    if (!active.bonusPaid) {
                        const bonusFee = Math.round(active.fee * 0.15);
                        active.bonusPaid = true;
                        gameState.budget += bonusFee;

                        addTransferNews(
                            'BONUS SPONSOR',
                            `🎉 Target sponsor <b>${active.name}</b> TERPENUHI! Bonus keberhasilan 15% sebesar <b>${formatRupiah(bonusFee)}</b> dicairkan ke kas klub!`
                        );
                    }
                }
            }
        });
    }

    processCpuTransfers();
    updateHeaderUI();
    renderMatchUI();
    renderStandingsUI();
    renderSquadUI();
    renderTransferMarket();
    renderInboxUI();
}

function processEndOfWeekAndSeason() {
    const currentTierTeams = gameState.leagues[gameState.userLeagueTier];
    const sorted = [...currentTierTeams].sort((a, b) => b.points - a.points || (b.setW - b.setL) - (a.setW - a.setL));
    const userRank = sorted.findIndex(t => t.isUser) + 1;
    const userTeamData = sorted.find(t => t.isUser);

    let reportMessage = `Musim kompetisi berakhir! Tim Anda (${gameState.teamName}) finis di peringkat #${userRank} pada ${LEAGUE_TIERS[gameState.userLeagueTier].name}.\n\n`;

    // ------------------- EVALUASI SPONSOR & PENALTI AKHIR MUSIM -------------------
    let totalPenaltyDeducted = 0;
    
    ['primary', 'secondary', 'extra'].forEach(type => {
        const active = gameState.sponsors.active[type];
        if (active) {
            const isSuccess = active.evaluator(userRank, userTeamData.won, userTeamData.setW);

            if (isSuccess) {
                if (!active.completed) {
                    active.completed = true;
                    if (!active.bonusPaid) {
                        const bonusFee = Math.round(active.fee * 0.15);
                        active.bonusPaid = true;
                        gameState.budget += bonusFee;
                        reportMessage += `✅ **${active.name}**: Target Tercapai! Bonus 15% (${formatRupiah(bonusFee)}) dicairkan.\n`;
                    }
                }
            } else {
                // PENALTI AKHIR MUSIM: Potongan acak 45% hingga 70% dari nilai total sponsor
                const penaltyPercent = (Math.floor(Math.random() * 26) + 45) / 100;
                const penaltyFee = Math.round(active.fee * penaltyPercent);
                
                gameState.budget -= penaltyFee;
                totalPenaltyDeducted += penaltyFee;

                reportMessage += `❌ **${active.name}**: Target Gagal! Penalti (${Math.round(penaltyPercent * 100)}%): Kas dipotong ${formatRupiah(penaltyFee)}.\n`;
            }
        }
    });

    if (totalPenaltyDeducted > 0) {
        reportMessage += `\n⚠️ Total Penalti Sponsor Musim Ini: **${formatRupiah(totalPenaltyDeducted)}**\n\n`;
    }

    // Status Promosi / Degradasi Liga
    if (userRank <= 2 && gameState.userLeagueTier > 1) {
        gameState.userLeagueTier--;
        reportMessage += `🎉 **PROMOSI OTOMATIS!** Naik kasta ke **${LEAGUE_TIERS[gameState.userLeagueTier].name}**!`;
    } else if (userRank === 3 && gameState.userLeagueTier > 1) {
        const playoffWin = Math.random() > 0.45;
        if (playoffWin) {
            gameState.userLeagueTier--;
            reportMessage += `⚔️ **MENANG PLAYOFF:** **PROMOSI NAIK KASTA** ke **${LEAGUE_TIERS[gameState.userLeagueTier].name}**!`;
        } else {
            reportMessage += `⚔️ **KALAH PLAYOFF:** Bertahan di **${LEAGUE_TIERS[gameState.userLeagueTier].name}**.`;
        }
    } else if (userRank >= 14 && gameState.userLeagueTier < 5) {
        gameState.userLeagueTier++;
        reportMessage += `⚠️ **DEGRADASI!** Terlempar ke **${LEAGUE_TIERS[gameState.userLeagueTier].name}**.`;
    } else {
        reportMessage += `👍 Bertahan di **${LEAGUE_TIERS[gameState.userLeagueTier].name}**.`;
    }

    showAlert('Rangkuman Finansial & Akhir Musim!', reportMessage, 'fa-trophy');

    // Reset Musim Baru
    gameState.currentWeek = 1;
    gameState.sponsors = {
        available: generateSponsorOptions(5),
        active: { primary: null, secondary: null, extra: null }
    };

    for (let t = 1; t <= 5; t++) {
        if (gameState.leagues[t]) {
            gameState.leagues[t].forEach(team => {
                team.played = 0; team.won = 0; team.lost = 0; team.setW = 0; team.setL = 0; team.points = 0;
            });
        }
    }

    generateLeagueSchedules();
    updateHeaderUI();
    renderMatchUI();
    renderStandingsUI();
    renderSponsorsUI();
}

function processCpuTransfers() {
    if (Math.random() < 0.45 && gameState.marketPlayers.length > 0) {
        const available = gameState.marketPlayers.filter(p => !p.clubName);
        if (available.length > 0) {
            const playerToBuy = available[Math.floor(Math.random() * available.length)];
            const buyingTeam = AI_TEAM_POOL[Math.floor(Math.random() * AI_TEAM_POOL.length)];
            
            playerToBuy.clubName = buyingTeam;
            addTransferNews(
                'BURSA LIGA',
                `Klub <b>${buyingTeam}</b> merekrut <b>${playerToBuy.flag} ${playerToBuy.name}</b> (${playerToBuy.position}) senilai ${formatRupiah(playerToBuy.value)}.`
            );
        }
    }
}

// TRANSFER MARKET & NEWS
function renderTransferMarket() {
  const container = document.getElementById('market-players-grid');
  if (!container) return;
  container.innerHTML = '';

  // 1. Ambil nilai filter posisi dan filter pengurutan
  const posFilter = document.getElementById('market-pos-filter')?.value || 'ALL';
  const sortFilter = document.getElementById('market-sort-filter')?.value || 'none';

  // 2. Saring pemain berdasarkan posisi
  let filtered = gameState.marketPlayers.filter(p => {
    if (posFilter !== 'ALL' && p.position !== posFilter) return false;
    return true;
  });

  // 3. Urutkan hasil saringan berdasarkan opsi sort yang dipilih
  filtered.sort((a, b) => {
    switch (sortFilter) {
      case 'ovr-desc':
        return b.ovr - a.ovr;
      case 'ovr-asc':
        return a.ovr - b.ovr;
      case 'price-desc':
        return b.value - a.value;
      case 'price-asc':
        return a.value - b.value;
      case 'salary-desc':
        return b.salary - a.salary;
      case 'salary-asc':
        return a.salary - b.salary;
      default:
        return 0;
    }
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-slate-500 py-12">Tidak ada pemain yang sesuai dengan kriteria.</div>`;
    return;
  }

  // 4. Tampilkan kartu pemain
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-500 transition shadow-lg';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${TIERS[p.tier]?.color || 'bg-slate-700'}">${p.tier}</span>
          <span class="text-xs font-mono font-bold text-amber-400">OVR ${p.ovr}</span>
        </div>
        <div class="mt-2">
          <h4 class="font-bold text-white text-sm flex items-center gap-1.5">
            <span>${p.flag}</span>
            <span class="truncate">${p.name}</span>
          </h4>
          <p class="text-[11px] text-slate-400 mt-0.5">${p.position} • ${p.country}</p>
          <p class="text-[10px] text-slate-500 mt-0.5">${p.clubName ? 'Klub: ' + p.clubName : '<span class="text-emerald-400 font-semibold">Status: Free Agent</span>'}</p>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-700/50">
        <div class="flex justify-between items-center text-[11px] mb-1">
          <span class="text-slate-400">Gaji Ekspektasi:</span>
          <span class="font-mono text-emerald-400 font-bold">${formatRupiah(p.salary)}/m</span>
        </div>
        <div class="flex justify-between items-center text-[11px] mb-3">
          <span class="text-slate-400">Nilai Transfer:</span>
          <span class="font-mono text-amber-300 font-bold">${formatRupiah(p.value)}</span>
        </div>
        <button onclick="openNegoModal('${p.id}')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md">
          <i class="fa-solid fa-handshake"></i> Rekrut / Nego
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addTransferNews(type, newsText) {
    gameState.transferNews.unshift({
        id: 'news_' + Math.random().toString(36).substr(2, 9),
        type,
        text: newsText,
        time: `Pekan ${gameState.currentWeek}`
    });
    renderNewsUI();
}

function renderNewsUI() {
    const container = document.getElementById('transfer-news-feed');
    if (!container) return;
    container.innerHTML = '';

    gameState.transferNews.forEach(n => {
        const item = document.createElement('div');
        item.className = 'bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 text-xs';
        item.innerHTML = `
            <div class="flex justify-between items-center text-[10px]">
                <span class="font-bold text-blue-400 uppercase">[${n.type}]</span>
                <span class="text-slate-500">${n.time}</span>
            </div>
            <p class="text-slate-200 leading-relaxed">${n.text}</p>
        `;
        container.appendChild(item);
    });
}

// INBOX RENDER
function renderInboxUI() {
    const container = document.getElementById('inbox-messages-list');
    if (!container) return;
    container.innerHTML = '';

    gameState.inboxMessages.forEach(m => {
        const card = document.createElement('div');
        card.className = `p-4 rounded-2xl border ${m.handled ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-800 border-blue-500/40'} space-y-2 text-xs transition`;
        
        card.innerHTML = `
            <div class="flex justify-between items-center text-[10px]">
                <span class="font-bold uppercase ${m.handled ? 'text-slate-500' : 'text-amber-400'}">${m.type}</span>
                <span class="text-slate-500">Pekan ${m.time}</span>
            </div>
            <p class="text-slate-200">${m.message}</p>
        `;
        container.appendChild(card);
    });
}

// NEGOTIATION SYSTEM WITH CLUB & PLAYER
function startPlayerNegotiation(playerId, isRenewal = false) {
    let p = gameState.roster.find(x => x.id === playerId);
    if (!p) p = gameState.marketPlayers.find(x => x.id === playerId);
    if (!p) return;

    if (p.lockoutMatches > 0) {
        showAlert('Negosiasi Ditolak', `Pemain/klub menolak bernegosiasi selama ${p.lockoutMatches} pertandingan lagi.`);
        return;
    }

    if (!isRenewal && p.country !== 'Indonesia' && countForeignPlayers(gameState.roster) >= 2) {
        showAlert('Kuota Asing Penuh', 'Klub Anda sudah memiliki 2 pemain asing!');
        return;
    }

    const hasClub = !isRenewal && p.clubName;

    currentNego = {
        player: p,
        isRenewal,
        hasClub,
        step: hasClub ? 'club_fee' : 'salary',
        targetFee: p.value,
        offerFee: p.value,
        targetSalary: p.salary,
        offerSalary: p.salary,
        offerMatches: 14,
        patience: 3
    };

    const chatBox = document.getElementById('nego-chat-messages');
    chatBox.innerHTML = '';

    const controlsFee = document.getElementById('nego-controls-fee');
    const controlsSalary = document.getElementById('nego-controls-salary');
    const controlsMatches = document.getElementById('nego-controls-matches');

    if (hasClub) {
        document.getElementById('nego-target-name').innerText = p.clubName;
        document.getElementById('nego-target-subtitle').innerText = `Negosiasi Transfer: ${p.name}`;
        document.getElementById('nego-avatar').innerText = '💼';

        addChatMessage(p.clubName, `Halo Manager ${gameState.managerName}. Kami bersedia melepas ${p.name} jika tawaran biaya transfer Anda cocok. (Nilai Pasar: ${formatRupiah(p.value)})`, 'them');

        controlsFee.classList.remove('hidden');
        controlsSalary.classList.add('hidden');
        controlsMatches.classList.add('hidden');

        const sliderFee = document.getElementById('slider-offer-fee');
        sliderFee.min = Math.round(p.value * 0.4);
        sliderFee.max = Math.round(p.value * 2.5);
        sliderFee.step = 50000;
        sliderFee.value = p.value;

        syncOfferDisplay('fee');
    } else {
        document.getElementById('nego-target-name').innerText = p.name;
        document.getElementById('nego-target-subtitle').innerText = `${p.position} • ${p.tier}`;
        document.getElementById('nego-avatar').innerText = '😀';

        addChatMessage(p.name, `Halo Manager ${gameState.managerName}. Saya siap mendengarkan penawaran kontrak untuk tim Anda. (Ekspektasi: ${formatRupiah(p.salary)}/match)`, 'them');

        controlsFee.classList.add('hidden');
        controlsSalary.classList.remove('hidden');
        controlsMatches.classList.remove('hidden');

        const sliderSalary = document.getElementById('slider-offer-salary');
        sliderSalary.min = Math.round(p.salary * 0.4);
        sliderSalary.max = Math.round(p.salary * 2.5);
        sliderSalary.step = 500;
        sliderSalary.value = p.salary;

        syncOfferDisplay('salary');
        syncOfferDisplay('matches');
    }

    document.getElementById('modal-negotiation-chat').classList.remove('hidden');
}

function addChatMessage(sender, text, side) {
    const chatBox = document.getElementById('nego-chat-messages');
    if (!chatBox) return;

    const bubble = document.createElement('div');
    bubble.className = `flex flex-col ${side === 'me' ? 'items-end' : 'items-start'} my-1.5`;
    bubble.innerHTML = `
        <span class="text-[10px] text-slate-500 mb-0.5">${sender}</span>
        <div class="${side === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'} px-3.5 py-2 rounded-2xl max-w-[85%] leading-relaxed">
            ${text}
        </div>
    `;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function adjustOffer(type, amount) {
    const slider = document.getElementById(`slider-offer-${type}`);
    if (slider) {
        slider.value = parseInt(slider.value) + amount;
        syncOfferDisplay(type);
    }
}

function syncOfferDisplay(type) {
    const slider = document.getElementById(`slider-offer-${type}`);
    const display = document.getElementById(`display-offer-${type}`);
    if (!slider || !display || !currentNego) return;

    const val = parseInt(slider.value);
    if (type === 'fee') {
        currentNego.offerFee = val;
        display.innerText = formatRupiah(val);
    } else if (type === 'salary') {
        currentNego.offerSalary = val;
        display.innerText = `${formatRupiah(val)} / match`;
    } else if (type === 'matches') {
        currentNego.offerMatches = val;
        display.innerText = `${val} Match`;
    }
}

function submitNegotiationOffer() {
    if (!currentNego) return;
    const p = currentNego.player;

    if (currentNego.step === 'club_fee') {
        const offerFee = currentNego.offerFee;
        addChatMessage('Anda', `Kami menawarkan biaya transfer sebesar ${formatRupiah(offerFee)} untuk kepindahan ${p.name}.`, 'me');

        const minFee = Math.round(p.value * 0.92);

        if (offerFee >= minFee) {
            if (gameState.budget < offerFee) {
                showAlert('Kas Tidak Cukup', `Kas tim Anda (${formatRupiah(gameState.budget)}) tidak cukup untuk membayar biaya transfer ${formatRupiah(offerFee)}!`);
                return;
            }

            document.getElementById('nego-avatar').innerText = '🤝';
            addChatMessage(p.clubName, `Sepakat! Kami menyetujui biaya transfer ${formatRupiah(offerFee)}. Sekarang Anda dapat bernegosiasi gaji langsung dengan ${p.name}.`, 'them');

            gameState.budget -= offerFee;
            updateHeaderUI();

            setTimeout(() => {
                currentNego.step = 'salary';
                currentNego.patience = 3;

                document.getElementById('nego-target-name').innerText = p.name;
                document.getElementById('nego-target-subtitle').innerText = `${p.position} • ${p.tier}`;
                document.getElementById('nego-avatar').innerText = '😀';

                document.getElementById('nego-controls-fee').classList.add('hidden');
                document.getElementById('nego-controls-salary').classList.remove('hidden');
                document.getElementById('nego-controls-matches').classList.remove('hidden');

                addChatMessage(p.name, `Klub sudah sepakat! Sekarang giliran kita membahas gaji saya. Ekspektasi saya adalah ${formatRupiah(p.salary)}/match.`, 'them');

                const sliderSalary = document.getElementById('slider-offer-salary');
                sliderSalary.min = Math.round(p.salary * 0.4);
                sliderSalary.max = Math.round(p.salary * 2.5);
                sliderSalary.step = 500;
                sliderSalary.value = p.salary;

                syncOfferDisplay('salary');
                syncOfferDisplay('matches');
            }, 1200);
        } else {
            currentNego.patience--;
            if (currentNego.patience <= 0) {
                document.getElementById('nego-avatar').innerText = '🤬';
                addChatMessage(p.clubName, `Penawaran Anda tidak masuk akal! Transaksi ini resmi KAMI BATALKAN!`, 'them');
                p.lockoutMatches = 5;

                setTimeout(() => {
                    closeModal('modal-negotiation-chat');
                    currentNego = null;
                    showAlert('Transaksi Gagal!', `Klub ${p.clubName} menolak melepas ${p.name} karena tawaran biaya transfer terlalu murah! Transaksi dibatalkan.`, 'fa-circle-xmark');
                    renderTransferMarket();
                }, 1400);
            } else {
                document.getElementById('nego-avatar').innerText = '😠';
                addChatMessage(p.clubName, `Tawaran ${formatRupiah(offerFee)} terlalu jauh di bawah nilai pasar (${formatRupiah(p.value)}). Naikkan penawaran Anda!`, 'them');
            }
        }
        return;
    }

    const offerSal = currentNego.offerSalary;
    addChatMessage('Anda', `Saya menawarkan gaji ${formatRupiah(offerSal)} per pertandingan selama ${currentNego.offerMatches} pertandingan.`, 'me');

    const minAcceptable = Math.round(p.salary * 0.94);

    if (offerSal >= minAcceptable) {
        document.getElementById('nego-avatar').innerText = '😀';
        addChatMessage(p.name, `Penawaran luar biasa! Saya setuju dengan kesepakatan ini. Sampai jumpa di lapangan!`, 'them');

        setTimeout(() => {
            finalizeNegotiation(true);
            showAlert('Berhasil Bergabung!', `Pemain ${p.name} resmi bergabung dengan tim Anda!`, 'fa-circle-check');
        }, 1200);
    } else {
        currentNego.patience--;
        if (currentNego.patience <= 0) {
            document.getElementById('nego-avatar').innerText = '🤬';
            addChatMessage(p.name, `Penawaran Anda sangat rendah dan merendahkan! Saya batalkan negosiasi ini!`, 'them');
            p.lockoutMatches = 5;

            setTimeout(() => {
                finalizeNegotiation(false);
                showAlert('Negosiasi Gagal', `${p.name} merasa tersinggung dengan tawaran Anda dan menolak berbicara selama 5 pertandingan.`, 'fa-circle-xmark');
            }, 1400);
        } else if (offerSal < p.salary * 0.8) {
            document.getElementById('nego-avatar').innerText = '😡';
            addChatMessage(p.name, `Tawaran ini jauh sekali di bawah ekspektasi saya (${formatRupiah(p.salary)}). Naikkan lagi penawaran Anda!`, 'them');
        } else {
            document.getElementById('nego-avatar').innerText = '😒';
            addChatMessage(p.name, `Saya hanya bisa memberi potongan tipis. Angka ${formatRupiah(offerSal)} ini masih belum cukup.`, 'them');
        }
    }
}

function finalizeNegotiation(success) {
    if (!currentNego) return;
    const p = currentNego.player;

    if (success) {
        p.salary = currentNego.offerSalary;
        p.contractMatches = currentNego.offerMatches;

        if (!currentNego.isRenewal) {
            p.clubName = gameState.teamName;
            gameState.roster.push(p);
            gameState.marketPlayers = gameState.marketPlayers.filter(x => x.id !== p.id);

            addTransferNews('REKRUTAN BARU', `Klub <b>${gameState.teamName}</b> resmi mendatangkan <b>${p.flag} ${p.name}</b> (${p.position}) dengan gaji ${formatRupiah(p.salary)}/match.`);
        }
    }

    closeModal('modal-negotiation-chat');
    currentNego = null;

    updateHeaderUI();
    renderSquadUI();
    renderTransferMarket();
}

function openPlayerModal(playerId) {
    const p = gameState.roster.find(x => x.id === playerId);
    if (!p) return;

    const content = document.getElementById('modal-player-content');
    if (!content) return;

    content.innerHTML = `
        <div class="text-center mb-4">
            <span class="px-2.5 py-1 rounded text-xs font-bold border ${TIERS[p.tier].color}">${p.tier}</span>
            <h3 class="text-xl font-extrabold text-white mt-2">${p.flag} ${p.name}</h3>
            <p class="text-xs text-slate-400">${p.position} • ${p.country}</p>
        </div>

        <div class="bg-slate-900 border border-slate-700/80 p-4 rounded-2xl space-y-3 text-xs mb-4">
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-400">OVR Efektif:</span>
                <b class="text-amber-400 font-bold">${getEffectiveOvr(p)} (OVR Asli: ${p.ovr})</b>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-400">Gaji Saat Ini:</span>
                <b class="text-emerald-400">${formatRupiah(p.salary)} / Match</b>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-400">Sisa Kontrak:</span>
                <b class="text-slate-200">${p.contractMatches} Match</b>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Kondisi Stamina:</span>
                <b class="text-emerald-400">${p.stamina}%</b>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs mb-6">
            <div class="bg-slate-900 p-2 rounded-xl text-center"><span class="text-slate-500 block text-[10px]">Spike</span><b class="text-slate-200">${p.skills.spike}</b></div>
            <div class="bg-slate-900 p-2 rounded-xl text-center"><span class="text-slate-500 block text-[10px]">Block</span><b class="text-slate-200">${p.skills.block}</b></div>
            <div class="bg-slate-900 p-2 rounded-xl text-center"><span class="text-slate-500 block text-[10px]">Serve</span><b class="text-slate-200">${p.skills.serve}</b></div>
            <div class="bg-slate-900 p-2 rounded-xl text-center"><span class="text-slate-500 block text-[10px]">Receive</span><b class="text-slate-200">${p.skills.receive}</b></div>
        </div>

        <div class="space-y-2">
            <button onclick="closeModal('modal-player-detail'); startPlayerNegotiation('${p.id}', true)" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition">
                Perbarui Kontrak
            </button>
        </div>
    `;

    document.getElementById('modal-player-detail').classList.remove('hidden');
}
