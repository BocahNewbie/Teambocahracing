const LEAGUE_TIERS = {
    1: { name: "Liga 1 (Proliga Indonesia)", short: "Liga 1" },
    2: { name: "Liga 2 (Divisi Utama Voli)", short: "Liga 2" },
    3: { name: "Liga 3 (Divisi Satu Nasional)", short: "Liga 3" },
    4: { name: "Liga 4 (Liga Voli Wilayah)", short: "Liga 4" },
    5: { name: "Liga 5 (Liga Voli Amatir)", short: "Liga 5" }
};

const AI_TEAM_POOL = [
    'Surabaya Samator', 'Jakarta Bhayangkara', 'Bandung BJB', 'Palembang Bank Sumsel',
    'Jakarta Stin BIN', 'Kudus Sukun Badak', 'Bogor LavAni', 'Jakarta Pertamina',
    'Yogyakarta Yuso', 'Semarang Bank Jateng', 'Bali Volleyball Club', 'Medan Hawks VC',
    'Makassar Spike Club', 'Surakarta Spikers', 'Malang Blitz VC', 'Tangerang Volley',
    'Pontianak Spikers', 'Manado Waves', 'Padang Smashers', 'Denpasar VC',
    'Balikpapan Spikers', 'Batam Island VC', 'Samarinda Thunder', 'Bandarlampung Blitz',
    'Palestina VC', 'Pekanbaru Heroes', 'Mataram Spikers', 'Kupang Waves VC',
    'Jayapura Black Pearls', 'Ambon Bay VC'
];

function generateLeagueStructure(userTeamName) {
    const leagues = {};
    let poolCopy = [...AI_TEAM_POOL];

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
