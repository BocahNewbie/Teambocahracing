const LEAGUE_TIERS = {
    1: { name: "Liga 1 (Proliga Indonesia)", short: "Liga 1" },
    2: { name: "Liga 2 (Divisi Utama Voli)", short: "Liga 2" },
    3: { name: "Liga 3 (Divisi Satu Nasional)", short: "Liga 3" },
    4: { name: "Liga 4 (Liga Voli Wilayah)", short: "Liga 4" },
    5: { name: "Liga 5 (Liga Voli Amatir)", short: "Liga 5" }
};

// Database Komponen Nama Tim: First Name (Kota/Wilayah/Entitas) & Last Name (Julukan/Identitas)
const TEAM_NAME_PARTS = {
    firstNames: [
        'Bandung', 'Bogor', 'Tangerang', 'Ciamis', 'Tasikmalaya', 'Cirebon', 'Garut', 'Sukabumi',
        'Depok', 'Bekasi', 'Indramayu', 'Sumedang', 'Majalengka', 'Subang', 'Cianjur', 'Purwakarta',
        'Karawang', 'Pangandaran', 'Serang', 'Cilegon', 'Pandeglang', 'Lebak', 'Jakarta', 'Kudus',
        'Semarang', 'Surakarta', 'Yogyakarta', 'Sleman', 'Magelang', 'Banyumas', 'Purwokerto', 'Pekalongan',
        'Tegal', 'Pati', 'Jepara', 'Cilacap', 'Wonogiri', 'Klaten', 'Surabaya', 'Malang',
        'Gresik', 'Sidoarjo', 'Banyuwangi', 'Kediri', 'Jember', 'Madiun', 'Probolinggo', 'Pasuruan',
        'Blitar', 'Tuban', 'Lamongan', 'Mojokerto', 'Bojonegoro', 'Denpasar', 'Singaraja', 'Gianyar',
        'Palembang', 'Medan', 'Padang', 'Lampung', 'Pekanbaru', 'Batam', 'Aceh', 'Jambi',
        'Pontianak', 'Samarinda', 'Balikpapan', 'Banjarmasin', 'Makassar', 'Manado', 'Palu', 'Jayapura',
        'Ambon', 'Mataram', 'Kupang', 'Siliwangi', 'Bhineka', 'Garuda', 'Patriot', 'Nusantara'
    ],
    lastNames: [
        'Spikers', 'Volley', 'Volley Club', 'Wave', 'Patriot', 'Titan', 'Steel', 'Peak',
        'Presisi', 'Fastron', 'Badak', 'Samator', 'Blitz', 'Delta', 'Hawks', 'Smashers',
        'Heroes', 'Thunder', 'Borneo', 'Tadulako', 'Phinisi', 'Pearls', 'Spices', 'Eagle',
        'Electric', 'Express', 'United', 'Force', 'Pioneers', 'Knights', 'Strikers', 'Storm',
        'Bank', 'Monster Energy', 'Block', 'Freeport', 'Kopi'
    ]
};

// Set untuk melacak agar nama tim yang dibuat tidak duplikat
const generatedTeamNames = new Set();

/**
 * Membuat nama tim unik dengan format First Name + Last Name
 */
function generateUniqueTeamName() {
    let attempts = 0;
    while (attempts < 1000) {
        const firstName = TEAM_NAME_PARTS.firstNames[Math.floor(Math.random() * TEAM_NAME_PARTS.firstNames.length)];
        const lastName = TEAM_NAME_PARTS.lastNames[Math.floor(Math.random() * TEAM_NAME_PARTS.lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        if (!generatedTeamNames.has(fullName)) {
            generatedTeamNames.add(fullName);
            return fullName;
        }
        attempts++;
    }
    
    // Fallback jika kombinasi acak habis
    const fallbackName = `Volley Team ${generatedTeamNames.size + 1}`;
    generatedTeamNames.add(fallbackName);
    return fallbackName;
}

/**
 * Membuat struktur liga dengan nama tim yang dijamin tidak duplikat
 */
function generateLeagueStructure(userTeamName) {
    const leagues = {};
    generatedTeamNames.clear(); // Reset nama tim saat membuat liga baru
    
    if (userTeamName) {
        generatedTeamNames.add(userTeamName); // Daftarkan nama tim user agar AI tidak menggunakan nama yang sama
    }

    for (let tier = 1; tier <= 5; tier++) {
        const teamsInLeague = [];

        if (tier === 5) {
            teamsInLeague.push({
                id: 'user_team',
                name: userTeamName,
                isUser: true,
                played: 0, won: 0, lost: 0, setW: 0, setL: 0, points: 0,
                avgOvr: 0
            });
        }

        const needed = tier === 5 ? 14 : 15;
        for (let i = 0; i < needed; i++) {
            const teamName = generateUniqueTeamName();
            const baseOvrByTier = 110 - (tier * 12);
            
            teamsInLeague.push({
                id: `ai_team_t${tier}_${i}`,
                name: teamName,
                isUser: false,
                played: 0, won: 0, lost: 0, setW: 0, setL: 0, points: 0,
                avgOvr: Math.max(30, Math.floor(Math.random() * 15) + baseOvrByTier)
            });
        }

        leagues[tier] = teamsInLeague;
    }

    return leagues;
}
