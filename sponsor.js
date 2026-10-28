const SPONSOR_BRANDS = [
  // Produk Olahraga & Peralatan
  'Specs Sports', 'Mizuno Indonesia', 'Mikasa Sports', 'Molten Official', 'Asics Pro', 
  'Nike Performance', 'Adidas Volleyball', 'Puma Athletic', 'Yonex Court', 'Li-Ning Sports',
  
  // Minuman & Otomotif / Energi
  'Hydro Coco', 'Pocari Sweat', 'Red Bull Volleyball', 'Kratingdaesh', 'Torabika Extra',
  'Extra Joss Energy', 'Pertamina Turbo', 'Shell V-Power', 'Yamaha Racing', 'Honda One Heart',
  
  // Perbankan & Fintek
  'Bank Mandiri Pro', 'Bank BCA Premier', 'Bank BRI Simpedes', 'Bank BNI Taplus', 'Bank BTN',
  'GoPay PayLater', 'OVO Digital', 'Dana Premium', 'ShopeePay', 'LinkAja',
  
  // Telekomunikasi & Teknologi
  'Telkomsel Halo', 'Indosat Ooredoo', 'XL Axiata', 'Smartfren Unlimited', 'By.U',
  'ASUS ROG', 'Lenovo Legion', 'Samsung Galaxy', 'Xiaomi Tech', 'Acer Predator',
  
  // Retail & Minimarket
  'Indomaret VC', 'Alfamart Pro', 'Yogya Group', 'Transmart Hyper', 'Super Indo',
  
  // Perawatan Diri & Consumer Goods
  'Gillette Power', 'Gatsby Styling', 'Clear Men', 'Rexona Men', 'Kahf Everyday',
  'Head & Shoulders', 'Nivea Men', 'Men’s Biore', 'Lifebuoy Sports', 'Vaseline Men',
  
  // Makanan & Lain-Lain
  'Indomie Goreng', 'Kopi Kapal Api', 'Teh Pucuk Harum', 'AeroX Express', 'J&T Cargo'
];

const OBJECTIVE_POOL = [
  // --- TARGET TUNGGAL ---
  { desc: 'Finis 3 Besar Liga', type: 'RANK', targetVal: 3, evaluate: (rank, wins, sets) => rank <= 3 },
  { desc: 'Finis 5 Besar Liga', type: 'RANK', targetVal: 5, evaluate: (rank, wins, sets) => rank <= 5 },
  { desc: 'Juara Liga (Peringkat 1)', type: 'RANK', targetVal: 1, evaluate: (rank, wins, sets) => rank === 1 },
  { desc: 'Hindari Degradasi', type: 'RANK', targetVal: 13, evaluate: (rank, wins, sets) => rank < 14 },

  { desc: 'Menangkan Min. 5 Match', type: 'WINS', targetVal: 5, evaluate: (rank, wins, sets) => wins >= 5 },
  { desc: 'Menangkan Min. 8 Match', type: 'WINS', targetVal: 8, evaluate: (rank, wins, sets) => wins >= 8 },
  { desc: 'Menangkan Min. 10 Match', type: 'WINS', targetVal: 10, evaluate: (rank, wins, sets) => wins >= 10 },

  { desc: 'Raih Min. 20 Set Menang', type: 'SETS', targetVal: 20, evaluate: (rank, wins, sets) => sets >= 20 },
  { desc: 'Raih Min. 25 Set Menang', type: 'SETS', targetVal: 25, evaluate: (rank, wins, sets) => sets >= 25 },

  // --- TARGET CAMPURAN / HYBRID ---
  { 
    desc: 'Finis 4 Besar & Min. 8 Menang', 
    type: 'HYBRID', 
    targetVal: 8, 
    evaluate: (rank, wins, sets) => rank <= 4 && wins >= 8 
  },
  { 
    desc: 'Finis 6 Besar & Min. 20 Set', 
    type: 'HYBRID', 
    targetVal: 6, 
    evaluate: (rank, wins, sets) => rank <= 6 && sets >= 20 
  },
  { 
    desc: 'Min. 9 Menang & 25 Set Menang', 
    type: 'HYBRID', 
    targetVal: 9, 
    evaluate: (rank, wins, sets) => wins >= 9 && sets >= 25 
  },
  { 
    desc: 'Finis 3 Besar & Min. 22 Set Menang', 
    type: 'HYBRID', 
    targetVal: 3, 
    evaluate: (rank, wins, sets) => rank <= 3 && sets >= 22 
  }
];

function generateRandomSponsor(type) {
  const brand = SPONSOR_BRANDS[Math.floor(Math.random() * SPONSOR_BRANDS.length)];
  const objective = OBJECTIVE_POOL[Math.floor(Math.random() * OBJECTIVE_POOL.length)];

  let fee = 500000;
  if (type === 'primary') fee = 800000 + Math.floor(Math.random() * 300000);
  if (type === 'secondary') fee = 400000 + Math.floor(Math.random() * 200000);
  if (type === 'extra') fee = 200000 + Math.floor(Math.random() * 100000);

  // Jika ada syarat jumlah kemenangan (WINS atau HYBRID yang butuh jumlah menang)
  const isInstallment = objective.type === 'WINS' || (objective.type === 'HYBRID' && objective.desc.includes('Menang'));
  const targetWins = isInstallment ? (objective.targetVal || 6) : 0;
  const perWinFee = isInstallment ? Math.round((fee * 0.7) / targetWins) : 0; // 70% dana diangsur per match, 30% cair saat bonus/selesai

  return {
    id: `sp_${type}_${Math.random().toString(36).substr(2, 6)}`,
    type: type,
    name: brand,
    fee: fee,
    goal: objective.desc,
    goalType: objective.type,
    targetVal: targetWins,
    evaluator: objective.evaluate,
    isInstallment: isInstallment, 
    perWinFee: perWinFee,
    paidWins: 0,                 
    receivedTotal: isInstallment ? 0 : fee, 
    completed: false,
    bonusPaid: false
  };
}

function generateSponsorOptions(countPerType = 5) {
  const options = {
    primary: [],
    secondary: [],
    extra: []
  };

  ['primary', 'secondary', 'extra'].forEach(type => {
    const usedBrands = new Set();
    while (options[type].length < countPerType) {
      const sponsor = generateRandomSponsor(type);
      if (!usedBrands.has(sponsor.name)) {
        usedBrands.add(sponsor.name);
        options[type].push(sponsor);
      }
    }
  });

  return options;
}
