const SPONSOR_BRANDS = [
    'Bank Mandiri Pro', 'Specs Sports', 'Hydro Coco', 'Indomaret VC',
    'Gillette Power', 'Red Bull Volleyball', 'Mizuno Indonesia', 'Mikasa Sports',
    'Telkomsel Halo', 'Pertamina Turbo', 'Kratingdaesh', 'Pocari Sweat'
];

const OBJECTIVE_POOL = [
    { desc: 'Finis 3 Besar Liga', evaluate: (rank, wins, sets) => rank <= 3 },
    { desc: 'Finis 5 Besar Liga', evaluate: (rank, wins, sets) => rank <= 5 },
    { desc: 'Menangkan 7 Match', evaluate: (rank, wins, sets) => wins >= 7 },
    { desc: 'Menangkan 10 Match', evaluate: (rank, wins, sets) => wins >= 10 },
    { desc: 'Raih Min. 20 Set Menang', evaluate: (rank, wins, sets) => sets >= 20 },
    { desc: 'Hindari Degradasi', evaluate: (rank, wins, sets) => rank < 14 }
];

function generateRandomSponsor(type) {
    const brand = SPONSOR_BRANDS[Math.floor(Math.random() * SPONSOR_BRANDS.length)];
    const objective = OBJECTIVE_POOL[Math.floor(Math.random() * OBJECTIVE_POOL.length)];

    let fee = 500000;
    if (type === 'primary') fee = 1500000 + Math.floor(Math.random() * 500000);
    if (type === 'secondary') fee = 800000 + Math.floor(Math.random() * 300000);
    if (type === 'extra') fee = 400000 + Math.floor(Math.random() * 200000);

    return {
        type: type,
        name: brand,
        fee: fee,
        goal: objective.desc,
        evaluator: objective.evaluate,
        claimed: false
    };
}

function generateAllSponsors() {
    return {
        primary: generateRandomSponsor('primary'),
        secondary: generateRandomSponsor('secondary'),
        extra: generateRandomSponsor('extra')
    };
}
