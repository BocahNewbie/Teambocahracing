// Global Game State
const gameState = {
    gold: 10000000,
    myHorses: [],
    selectedHorseId: null,
    shopHorses: [],
    hasClaimedStarter: false,
    exhibition: { league: 'beginner', distance: 750, opponents: [] },
    league: { division: 'beginner', distance: 750, opponents: [], isRegistered: false },
    activeRaceMode: 'exhibition',
    allocPoints: { spd: 0, acc: 0, agi: 0, end: 0, sta: 0, lck: 0, tmp: 0, grt: 0, fin: 0 },
    unallocatedPool: 0,
    time: { minute: 0, hour: 8, day: 1, month: 0, year: 2000 },
    season: { number: 1, currentMatch: 1, standings: [] },
    sponsors: { offers: [], active: [], trustLevel: 50 }
};

// Array Hari & Bulan
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Audio Engine
let audioCtx = null;
function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'click') {
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'buy') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'win') {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        }
    } catch(e) {}
}

// Global Core Helpers
function formatRupiah(number) { 
    return 'Rp ' + (number || 0).toLocaleString('id-ID'); 
}

function getRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function calculateOVR(stats) {
    if (!stats) return 0;
    // Kunci stat bawaan jika STAT_KEYS belum termuat
    const keys = (typeof STAT_KEYS !== 'undefined') ? STAT_KEYS.map(k => k.id) : ['spd', 'acc', 'agi', 'end', 'sta', 'lck', 'tmp', 'grt', 'fin'];
    let sum = 0; 
    keys.forEach(k => sum += (stats[k] || 0)); 
    return Math.round(sum / keys.length); 
}

function getTierByOvr(ovr) {
    if (typeof TIERS !== 'undefined') {
        for (let i = TIERS.length - 1; i >= 0; i--) {
            if (ovr >= TIERS[i].minOvr) return TIERS[i]; 
        } 
    }
    return { name: 'F', priceMult: 1 }; 
}

function generateRandomHorse(targetMinOvr = 50, targetMaxOvr = 2500, gender = null) {
    const firstName = (typeof HORSE_NAMES_FIRST !== 'undefined') ? HORSE_NAMES_FIRST[getRandomInt(0, HORSE_NAMES_FIRST.length - 1)] : "Kuda";
    const lastName = (typeof HORSE_NAMES_LAST !== 'undefined') ? HORSE_NAMES_LAST[getRandomInt(0, HORSE_NAMES_LAST.length - 1)] : "Balap";
    const name = firstName + " " + lastName; 

    const stats = {}; 
    const baseTarget = getRandomInt(targetMinOvr, targetMaxOvr); 
    const keys = (typeof STAT_KEYS !== 'undefined') ? STAT_KEYS.map(k => k.id) : ['spd', 'acc', 'agi', 'end', 'sta', 'lck', 'tmp', 'grt', 'fin'];
    
    keys.forEach(k => {
        let val = baseTarget + getRandomInt(-10, 10); 
        stats[k] = Math.max(1, Math.min(2500, val)); 
    }); 
    
    const ovr = calculateOVR(stats); 
    const tierObj = getTierByOvr(ovr); 
    return {
        id: 'horse_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4), 
        name: name, 
        gender: gender || (Math.random() > 0.5 ? 'Jantan' : 'Betina'), 
        stats: stats, 
        ovr: ovr, 
        tier: tierObj.name, 
        price: Math.round((ovr * 100000) * (tierObj.priceMult || 1)), 
        energy: 100, 
        isPregnant: false, 
        pregnancyDaysLeft: 0 
    }; 
}

// Time & UI Engine
function updateInGameTimeUI() {
    const timeElem = document.getElementById('ingame-time');
    if (!timeElem) return;

    const { minute, hour, day, month, year } = gameState.time;
    const dateObj = new Date(year, month, day);
    const dayName = DAYS[dateObj.getDay()] || DAYS[1];
    const monthName = MONTHS[month] || MONTHS[0];

    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');

    timeElem.innerText = `${dayName}, ${day} ${monthName} ${year} | ${formattedHour}:${formattedMinute} WIB`;
}

function startInGameClock() {
    updateInGameTimeUI();
    setInterval(() => {
        gameState.time.minute += 10;
        if (gameState.time.minute >= 60) {
            gameState.time.minute = 0;
            gameState.time.hour += 1;
            if (gameState.time.hour >= 24) {
                gameState.time.hour = 0;
                gameState.time.day += 1;
                
                if (gameState.time.day > 30) {
                    gameState.time.day = 1;
                    gameState.time.month += 1;
                    if (gameState.time.month >= 12) {
                        gameState.time.month = 0;
                        gameState.time.year += 1;
                    }
                }
            }
        }
        updateInGameTimeUI();
    }, 10000);
}

// Tab Switcher
function switchTab(tabId) {
    playSound('click'); 
    document.querySelectorAll('.tab-content').forEach(c => { 
        c.classList.remove('active'); 
        c.style.display = 'none'; 
    }); 
    
    const targetTab = document.getElementById('tab-' + tabId); 
    if (targetTab) { 
        targetTab.classList.add('active'); 
        targetTab.style.display = 'block'; 
    } 

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active')); 
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active'); 
    }
    updateUI(); 
}

function updateUI() {
    const goldDisplay = document.getElementById('player-gold'); 
    if (goldDisplay) goldDisplay.innerText = formatRupiah(gameState.gold); 
    
    if (typeof renderStable === 'function') renderStable(); 
    if (typeof renderShop === 'function') renderShop(); 
    if (typeof renderTraining === 'function') renderTraining(); 
    if (typeof renderBreedingTab === 'function') renderBreedingTab(); 
    if (typeof renderSponsorTab === 'function') renderSponsorTab(); 
    if (typeof renderExhibitionLobby === 'function') renderExhibitionLobby(); 
    if (typeof renderLeagueLobby === 'function') renderLeagueLobby(); 
}

function initGame() {
    if (typeof refreshShopData === 'function') refreshShopData(); 
    if (typeof generateSponsorOffers === 'function') generateSponsorOffers(); 
    if (typeof generateExhibitionOpponents === 'function') generateExhibitionOpponents(); 
    if (typeof initLeagueSeason === 'function') initLeagueSeason(); 
    if (typeof startInGameClock === 'function') startInGameClock(); 
    updateUI(); 
}

window.onload = initGame;
