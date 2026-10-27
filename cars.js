// Aset Mobil Angkot dan Katalog Upgrade Modifikasi
const CAR_PRESETS = [
  { id: "angkot_suzuki", name: "Angkot Carry 1.0", baseSpeed: 140, baseHandling: 70, baseDurability: 85, price: 80000000 },
  { id: "angkot_daihatsu", name: "Angkot GranMax 1.5", baseSpeed: 155, baseHandling: 75, baseDurability: 90, price: 120000000 },
  { id: "angkot_mitsubishi", name: "Angkot L300 Monster", baseSpeed: 165, baseHandling: 65, baseDurability: 95, price: 150000000 }
];

const MODS_CATALOG = {
  engine: [
    { id: "eng_1", name: "Karburator Porting Polish", speedBonus: 10, heatRisk: 5, cost: 15000000 },
    { id: "eng_2", name: "Noken As Racing + Injection Kit", speedBonus: 22, heatRisk: 12, cost: 35000000 },
    { id: "eng_3", name: "Turbocharger Intercooler", speedBonus: 40, heatRisk: 25, cost: 75000000 }
  ],
  tires: [
    { id: "tire_soft", name: "Kompon Soft (Grip Maksimal, Aus Cepat)", grip: 95, durability: 40, cost: 8000000 },
    { id: "tire_medium", name: "Kompon Medium (Seimbang)", grip: 80, durability: 70, cost: 6000000 },
    { id: "tire_hard", name: "Kompon Hard (Irit, Grip Sedang)", grip: 68, durability: 100, cost: 5000000 }
  ]
};
