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
  // Target Klasemen & Pencapaian
  { desc: 'Finis 3 Besar Liga', evaluate: (rank, wins, sets) => rank <= 3 },
  { desc: 'Finis 5 Besar Liga', evaluate: (rank, wins, sets) => rank <= 5 },
  { desc: 'Finis 8 Besar Liga', evaluate: (rank, wins, sets) => rank <= 8 },
  { desc: 'Juara Liga (Peringkat 1)', evaluate: (rank, wins, sets) => rank === 1 },
  { desc: 'Hindari Degradasi', evaluate: (rank, wins, sets) => rank < 14 },

  // Target Jumlah Kemenangan (Match)
  { desc: 'Menangkan Min. 5 Match', evaluate: (rank, wins, sets) => wins >= 5 },
  { desc: 'Menangkan Min. 7 Match', evaluate: (rank, wins, sets) => wins >= 7 },
  { desc: 'Menangkan Min. 10 Match', evaluate: (rank, wins, sets) => wins >= 10 },
  { desc: 'Menangkan Min. 12 Match', evaluate: (rank, wins, sets) => wins >= 12 },

  // Target Jumlah Set Kemenangan
  { desc: 'Raih Min. 15 Set Menang', evaluate: (rank, wins, sets) => sets >= 15 },
  { desc: 'Raih Min. 20 Set Menang', evaluate: (rank, wins, sets) => sets >= 20 },
  { desc: 'Raih Min. 25 Set Menang', evaluate: (rank, wins, sets) => sets >= 25 },
  { desc: 'Raih Min. 30 Set Menang', evaluate: (rank, wins, sets) => sets >= 30 },

  // Kombinasi & Konsistensi
  { desc: 'Finis 4 Besar & Min. 8 Menang', evaluate: (rank, wins, sets) => rank <= 4 && wins >= 8 },
  { desc: 'Finis 6 Besar & Min. 20 Set', evaluate: (rank, wins, sets) => rank <= 6 && sets >= 20 },
  { desc: 'Min. 9 Menang & 25 Set', evaluate: (rank, wins, sets) => wins >= 9 && sets >= 25 }
];

function generateRandomSponsor(type) {
  const brand = SPONSOR_BRANDS[Math.floor(Math.random() * SPONSOR_BRANDS.length)];
  const objective = OBJECTIVE_POOL[Math.floor(Math.random() * OBJECTIVE_POOL.length)];

  let fee = 500000;
  if (type === 'primary') fee = 1500000 + Math.floor(Math.random() * 500000);
  if (type === 'secondary') fee = 800000 + Math.floor(Math.random() * 300000);
  if (type === 'extra') fee = 400000 + Math.floor(Math.random() * 200000);

  return {
    id: `sp_${type}_${Math.random().toString(36).substr(2, 6)}`,
    type: type,
    name: brand,
    fee: fee,
    goal: objective.desc,
    evaluator: objective.evaluate,
    claimed: false
  };
}

// Menghasilkan 5 pilihan sponsor untuk masing-masing tipe
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
      // Memastikan brand tidak duplikat dalam satu opsi tipe
      if (!usedBrands.has(sponsor.name)) {
        usedBrands.add(sponsor.name);
        options[type].push(sponsor);
      }
    }
  });

  return options;
}
