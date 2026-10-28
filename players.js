// CONFIGURATION TIERS (Tier H to Tier SSS, Max OVR 110)
const TIERS = {
    'H':   { min: 25,  max: 34,  color: 'bg-slate-800/60 border-slate-600 text-slate-400' },
    'G':   { min: 35,  max: 44,  color: 'bg-slate-700/50 border-slate-500 text-slate-300' },
    'F':   { min: 45,  max: 54,  color: 'bg-zinc-700/50 border-zinc-500 text-zinc-300' },
    'E':   { min: 55,  max: 62,  color: 'bg-stone-700/50 border-stone-400 text-stone-200' },
    'D':   { min: 63,  max: 69,  color: 'bg-emerald-800/40 border-emerald-500 text-emerald-300' },
    'C':   { min: 70,  max: 76,  color: 'bg-cyan-800/40 border-cyan-400 text-cyan-300' },
    'B':   { min: 77,  max: 83,  color: 'bg-blue-800/40 border-blue-400 text-blue-300' },
    'A':   { min: 84,  max: 89,  color: 'bg-purple-800/40 border-purple-400 text-purple-300' },
    'S':   { min: 90,  max: 95,  color: 'bg-amber-800/40 border-amber-400 text-amber-300' },
    'SS':  { min: 96,  max: 102, color: 'bg-rose-800/40 border-rose-400 text-rose-300' },
    'SSS': { min: 103, max: 110, color: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold border-amber-300' }
};

const POSITIONS = ['Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero'];

const COUNTRIES = [
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Serbia', flag: '🇷🇸' },
    { name: 'USA', flag: '🇺🇸' }
];

// Comprehensive Name Pools for Generating Unique Full Names
const FIRST_NAMES = [
    'Rivan', 'Farhan', 'Nizar', 'Yuda', 'Doni', 'Dimas', 'Alfin', 'Agil', 'Hernanda', 'Fahry',
    'Kenji', 'Yuji', 'Lucas', 'Bartosz', 'Mateusz', 'Tatsunori', 'Ran', 'Wilfredo', 'Earvin', 'Simone',
    'Ivan', 'Micah', 'Tine', 'Uros', 'Bruno', 'Yoandy', 'Ricardo', 'Aleksandar', 'Gabi', 'Karch',
    'Reza', 'Ghafour', 'Mourad', 'Saeid', 'Marouf', 'Sada'
];

const LAST_NAMES = [
    'Nurmulki', 'Halim', 'Zulvikri', 'Mardiansyah', 'Haryono', 'Saputra', 'Daniel', 'Anggara', 'Zulfi', 'Septian',
    'Takahashi', 'Nishida', 'Santamaria', 'Kurek', 'Bieniek', 'Ishikawa', 'Leon', 'Ngapeth', 'Giannelli', 'Zaytsev',
    'Christenson', 'Sattrov', 'Kovac', 'Rezende', 'Leal', 'Lucarelli', 'Atanasijevic', 'Garcia', 'Kiraly', 'Seyed'
];

// Set tracking active player names to guarantee no duplicates
const generatedPlayerNames = new Set();

function generateUniqueName() {
    let attempts = 0;
    while (attempts < 1000) {
        const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const fullName = `${fn} ${ln}`;
        if (!generatedPlayerNames.has(fullName)) {
            generatedPlayerNames.add(fullName);
            return fullName;
        }
        attempts++;
    }
    const fallback = `Player ${generatedPlayerNames.size + 1}`;
    generatedPlayerNames.add(fallback);
    return fallback;
}

function createRandomPlayer(idPrefix, allowedTiers = null, fixedCountry = null, position = null) {
    const fullName = generateUniqueName();
    const pos = position || POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    
    let countryObj;
    if (fixedCountry) {
        countryObj = COUNTRIES.find(c => c.name === fixedCountry) || COUNTRIES[0];
    } else {
        countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    }

    const tierKeys = allowedTiers || Object.keys(TIERS);
    const tier = tierKeys[Math.floor(Math.random() * tierKeys.length)];
    const tierInfo = TIERS[tier];

    // Generate random OVR within tier bounds
    const ovr = Math.floor(Math.random() * (tierInfo.max - tierInfo.min + 1)) + tierInfo.min;

    // Generate randomized skills anchored around the base OVR
    const skills = {
        spike: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
        block: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
        serve: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
        receive: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4)))
    };

    return {
        id: `${idPrefix}_${Math.random().toString(36).substr(2, 9)}`,
        name: fullName,
        position: pos,
        country: countryObj.name,
        flag: countryObj.flag,
        tier: tier,
        ovr: ovr,
        stamina: 100,
        salary: Math.round((ovr * 450) + (Math.random() * 3000)),
        value: Math.round((ovr * 8000) + (Math.random() * 30000)),
        clubName: null,
        contractMatches: 14,
        lockoutMatches: 0,
        skills: skills
    };
}
