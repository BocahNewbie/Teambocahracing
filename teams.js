const LEAGUE_TIERS = {
    1: { name: "Liga 1 (Proliga Indonesia)", short: "Liga 1" },
    2: { name: "Liga 2 (Divisi Utama Voli)", short: "Liga 2" },
    3: { name: "Liga 3 (Divisi Satu Nasional)", short: "Liga 3" },
    4: { name: "Liga 4 (Liga Voli Wilayah)", short: "Liga 4" },
    5: { name: "Liga 5 (Liga Voli Amatir)", short: "Liga 5" }
};

// Database 125 Nama Tim Voli Indonesia & Daerah
const AI_TEAM_POOL = [
    // Jawa Barat & Banten
    'Bandung BJB Pakuan', 'Bogor LavAni', 'Tangerang Volley Club', 'Ciamis Galuh Spikers', 'Tasikmalaya Resik VC',
    'Cirebon Sunan Spike', 'Garut Intan Volley', 'Sukabumi Wave VC', 'Depok City Spikers', 'Bekasi Patriot VC',
    'Indramayu Mango VC', 'Sumedang Manglayang', 'Kunangan Windu VC', 'Majalengka Spikers', 'Subang Jaya VC',
    'Cianjur Tirta VC', 'Purwakarta Istimewa', 'Karawang Spikers', 'Pangandaran Ocean VC', 'Banten Titan VC',
    'Serang Royal Volleyball', 'Cilegon Steel VC', 'Pandeglang Peak VC', 'Lebak Wild Spikers', 'Rancaekek Volley',

    // DKI Jakarta & Jawa Tengah
    'Jakarta Bhayangkara Presisi', 'Jakarta STIN BIN', 'Jakarta Pertamina Fastron', 'Jakarta Garuda Jaya', 'Jakarta Popivo',
    'Kudus Sukun Badak', 'Semarang Bank Jateng', 'Surakarta Spikers', 'Yogyakarta Yuso', 'Sleman Sembada VC',
    'Magelang Tidar VC', 'Banyumas Satria VC', 'Purwokerto Crown', 'Pekalongan Batik VC', 'Tegal Brebes Spikers',
    'Pati Muria Volleyball', 'Jepara Ukir VC', 'Cilacap Ocean Spike', 'Wonogiri Mountain VC', 'Klaten Shining Spikers',

    // Jawa Timur & Bali
    'Surabaya Samator', 'Malang Blitz VC', 'Gresik Petrokimia', 'Sidoarjo Delta Volley', 'Banyuwangi Blambangan',
    'Kediri Simpang Lima', 'Jember Fashion Spikers', 'Madiun Wilis VC', 'Probolinggo Bromo VC', 'Pasuruan Bromo Spikers',
    'Blitar Patria VC', 'Tuban Coast Volleyball', 'Lamongan Sunan Spike', 'Mojokerto Mojopahit VC', 'Bojonegoro Angling Dharma',
    'Bali Volleyball Club', 'Denpasar Spikers', 'Singaraja Waves VC', 'Gianyar Dewata VC', 'Tabanan Tanah Lot VC',

    // Sumatera
    'Palembang Bank Sumsel Babel', 'Medan Hawks VC', 'Padang Smashers', 'Bandarlampung Blitz', 'Pekanbaru Heroes',
    'Batam Island VC', 'Acheh Rencong VC', 'Jambi Angso Duo', 'Bengkulu Rafflesia VC', 'Bangka Belitung Spikers',
    'Palembang Musi Spike', 'Duri Oil Spikers', 'Pematangsiantar VC', 'Bukittinggi Singgalang', 'Pangkalpinang Wave',

    // Kalimantan & Sulawesi
    'Pontianak Spikers', 'Samarinda Thunder', 'Balikpapan Spikers', 'Banjarmasin Borneo VC', 'Palangkaraya Kahayan',
    'Tarakan Sebatik VC', 'Singkawang Tiger VC', 'Makassar Spike Club', 'Manado Waves VC', 'Palu Tadulako VC',
    'Kendari Phinisi VC', 'Gorontalo Limboto', 'Mamuju Western VC', 'Bitung Port Spikers', 'Tomohon Flower VC',

    // Nusa Tenggara, Maluku & Papua
    'Mataram Spikers', 'Kupang Waves VC', 'Jayapura Black Pearls', 'Ambon Bay VC', 'Ternate Spice VC',
    'Sorong Bird Head VC', 'Merauke East Spikers', 'Timika Gold Spikers', 'Labuan Bajo Dragon VC', 'Ende Flores VC',
    'Biak Island Volleyball', 'Manokwari Arfak VC', 'Sumbawa Eagle VC', 'Sumba Pasola Spikers', 'Banda Neira VC',

    // Instansi, BUMN & Klub Klasik
    'Gadjah Mada Volleyball', 'Siliwangi Spike Club', 'Diponegoro Spikers', 'Padjadjaran Volley', 'Airlangga Spikers',
    'Brawijaya VC', 'Udayana Spikers', 'Kaltim Prima VC', 'Freeport Spikers', 'Bukit Asam VC',
    'Inalum Volley Club', 'Pindad Volley Club', 'PUPR Spikers Club', 'PLN Electric VC', 'Telkom Indonesia VC',
    'Pos Indonesia Volley', 'Kereta Api Spikers', 'Angkasa Pura VC', 'Semen Indonesia VC', 'Pupuk Kaltim VC'
];

function generateLeagueStructure(userTeamName) {
    const leagues = {};
    let poolCopy = [...AI_TEAM_POOL];

    // Acak urutan tim agar variatif setiap kali main game baru
    poolCopy.sort(() => Math.random() - 0.5);

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
            const name = poolCopy.shift() || `Klub Voli ${tier}-${i + 1}`;
            const baseOvrByTier = 110 - (tier * 12);
            teamsInLeague.push({
                id: `ai_team_t${tier}_${i}`,
                name: name,
                isUser: false,
                played: 0, won: 0, lost: 0, setW: 0, setL: 0, points: 0,
                avgOvr: Math.max(30, Math.floor(Math.random() * 15) + baseOvrByTier)
            });
        }

        leagues[tier] = teamsInLeague;
    }

    return leagues;
}
