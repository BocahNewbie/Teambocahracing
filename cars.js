// Aset Mobil Angkot dan Katalog Upgrade Modifikasi
const CAR_PRESETS = [
  // Tier 1: Entry Level & Classic Angkot (Base Spek Standar)
  { id: "angkot_suzuki_carry", name: "Angkot Carry 1.0", baseSpeed: 140, baseHandling: 70, baseDurability: 85, price: 80000000 },
  { id: "angkot_daihatsu_zebra", name: "Angkot Zebra Espass", baseSpeed: 142, baseHandling: 68, baseDurability: 83, price: 85000000 },
  { id: "angkot_t120ss", name: "Angkot Mitsubishi T120SS", baseSpeed: 145, baseHandling: 72, baseDurability: 86, price: 90000000 },
  { id: "angkot_hijet_1000", name: "Angkot Hijet 1000", baseSpeed: 135, baseHandling: 65, baseDurability: 80, price: 75000000 },
  { id: "angkot_kijang_kotak", name: "Angkot Kijang Buaya", baseSpeed: 138, baseHandling: 67, baseDurability: 90, price: 78000000 },
  { id: "angkot_kijang_doyok", name: "Angkot Kijang Doyok", baseSpeed: 140, baseHandling: 69, baseDurability: 92, price: 82000000 },
  { id: "angkot_suzuki_st20", name: "Angkot Suzuki Truntung", baseSpeed: 130, baseHandling: 75, baseDurability: 78, price: 70000000 },
  { id: "angkot_daihatsu_s75", name: "Angkot Daihatsu S75", baseSpeed: 136, baseHandling: 66, baseDurability: 82, price: 76000000 },

  // Tier 2: Mid-Range & Modern Standard Angkot (Agak lincah)
  { id: "angkot_daihatsu_granmax", name: "Angkot GranMax 1.3", baseSpeed: 150, baseHandling: 74, baseDurability: 88, price: 110000000 },
  { id: "angkot_granmax_15", name: "Angkot GranMax 1.5", baseSpeed: 155, baseHandling: 75, baseDurability: 90, price: 120000000 },
  { id: "angkot_futura_13", name: "Angkot Carry Futura 1.3", baseSpeed: 148, baseHandling: 71, baseDurability: 87, price: 105000000 },
  { id: "angkot_futura_15", name: "Angkot Carry Futura 1.5", baseSpeed: 153, baseHandling: 73, baseDurability: 89, price: 115000000 },
  { id: "angkot_kijang_super", name: "Angkot Kijang Super", baseSpeed: 150, baseHandling: 70, baseDurability: 94, price: 108000000 },
  { id: "angkot_kijang_kapsul", name: "Angkot Kijang Kapsul", baseSpeed: 158, baseHandling: 72, baseDurability: 95, price: 125000000 },
  { id: "angkot_panther_23", name: "Angkot Panther 2.3 Direct", baseSpeed: 152, baseHandling: 69, baseDurability: 97, price: 118000000 },
  { id: "angkot_panther_25", name: "Angkot Panther 2.5 Hi-Grade", baseSpeed: 157, baseHandling: 70, baseDurability: 98, price: 130000000 },

  // Tier 3: Heavy Duty & Long Route Angkot (Torsi besar, awet)
  { id: "angkot_mitsubishi_l300", name: "Angkot L300 Standard", baseSpeed: 160, baseHandling: 66, baseDurability: 95, price: 140000000 },
  { id: "angkot_l300_starwagon", name: "Angkot L300 Starwagon", baseSpeed: 162, baseHandling: 65, baseDurability: 96, price: 145000000 },
  { id: "angkot_l300_monster", name: "Angkot L300 Monster", baseSpeed: 165, baseHandling: 65, baseDurability: 95, price: 150000000 },
  { id: "angkot_isuzu_elf_short", name: "Angkot Elf Short Chassis", baseSpeed: 158, baseHandling: 60, baseDurability: 98, price: 160000000 },
  { id: "angkot_isuzu_elf_long", name: "Angkot Elf Long Chassis", baseSpeed: 155, baseHandling: 58, baseDurability: 100, price: 175000000 },
  { id: "angkot_toyota_hiace_old", name: "Angkot HiAce Classic", baseSpeed: 156, baseHandling: 63, baseDurability: 96, price: 155000000 },
  { id: "angkot_nissan_evalia", name: "Angkot Evalia Spec", baseSpeed: 160, baseHandling: 76, baseDurability: 88, price: 140000000 },
  { id: "angkot_luxio", name: "Angkot Luxio Executive", baseSpeed: 162, baseHandling: 77, baseDurability: 89, price: 150000000 },

  // Tier 4: Regional & Iconic Angkot Variants (Stat seimbang)
  { id: "angkot_bandung_ciroyom", name: "Angkot Bandung Green", baseSpeed: 154, baseHandling: 76, baseDurability: 88, price: 122000000 },
  { id: "angkot_bogor_center", name: "Angkot Bogor City", baseSpeed: 150, baseHandling: 80, baseDurability: 86, price: 119000000 },
  { id: "angkot_padang_style", name: "Angkot Padang Ceper", baseSpeed: 164, baseHandling: 78, baseDurability: 84, price: 135000000 },
  { id: "angkot_medan_pariwisata", name: "Angkot Medan Express", baseSpeed: 166, baseHandling: 72, baseDurability: 92, price: 138000000 },
  { id: "angkot_malang_mikrolet", name: "Angkot Mikrolet Malang", baseSpeed: 152, baseHandling: 75, baseDurability: 87, price: 116000000 },
  { id: "angkot_surabaya_lyn", name: "Angkot Lyn Surabaya", baseSpeed: 155, baseHandling: 73, baseDurability: 89, price: 120000000 },
  { id: "angkot_sukabumi_red", name: "Angkot Sukabumi Line", baseSpeed: 151, baseHandling: 74, baseDurability: 88, price: 114000000 },
  { id: "angkot_tasik_juara", name: "Angkot Tasik Runner", baseSpeed: 153, baseHandling: 75, baseDurability: 89, price: 117000000 },

  // Tier 5: Modern & High-Capacity Angkot
  { id: "angkot_wuling_formo", name: "Angkot Formo Max", baseSpeed: 163, baseHandling: 78, baseDurability: 87, price: 142000000 },
  { id: "angkot_suzuki_new_carry", name: "Angkot New Carry 2023", baseSpeed: 160, baseHandling: 76, baseDurability: 91, price: 138000000 },
  { id: "angkot_traga_pickup", name: "Angkot Traga Micro", baseSpeed: 158, baseHandling: 68, baseDurability: 97, price: 165000000 }
];

const MODS_CATALOG = {
  // --- MESIN & PERFOMA (Menambah Speed / Akselerasi, Risiko Heat) ---
  engine: [
    { id: "eng_1", name: "Filter Udara Open Element", speedBonus: 5, heatRisk: 2, cost: 5000000 },
    { id: "eng_2", name: "Karburator Porting Polish", speedBonus: 10, heatRisk: 5, cost: 15000000 },
    { id: "eng_3", name: "Knalpot Racing Bobokan", speedBonus: 15, heatRisk: 8, cost: 22000000 },
    { id: "eng_4", name: "Noken As Racing + Injection Kit", speedBonus: 22, heatRisk: 12, cost: 35000000 },
    { id: "eng_5", name: "ECU Programmable Reconstitution", speedBonus: 30, heatRisk: 18, cost: 50000000 },
    { id: "eng_6", name: "Turbocharger Intercooler", speedBonus: 40, heatRisk: 25, cost: 75000000 },
    { id: "eng_7", name: "Supercharger Twin-Screw", speedBonus: 52, heatRisk: 32, cost: 110000000 },
    { id: "eng_8", name: "Swap Engine Monster 2JZ-GTE", speedBonus: 70, heatRisk: 40, cost: 180000000 }
  ],

  // --- BAN & GROUNDS (Mempengaruhi Handling/Grip vs Durabilitas) ---
  tires: [
    { id: "tire_hard", name: "Kompon Hard (Irit, Grip Sedang)", gripBonus: 5, durability: 100, cost: 5000000 },
    { id: "tire_medium", name: "Kompon Medium (Seimbang)", gripBonus: 12, durability: 75, cost: 6000000 },
    { id: "tire_soft", name: "Kompon Soft (Grip Maksimal, Aus Cepat)", gripBonus: 22, durability: 45, cost: 8000000 },
    { id: "tire_semi_slick", name: "Semi Slick Circuit Spec", gripBonus: 30, durability: 30, cost: 15000000 },
    { id: "tire_full_slick", name: "Full Slick Drag Spec", gripBonus: 40, durability: 15, cost: 25000000 }
  ],

  // --- SUSPENSI & KAKI-KAKI (Meningkatkan Handling & Kontrol Stabilitas) ---
  suspension: [
    { id: "susp_1", name: "Potong Per Custom (Ceper Harian)", handlingBonus: 8, speedBonus: 2, cost: 4000000 },
    { id: "susp_2", name: "Shockbreaker Heavy Duty", handlingBonus: 12, durabilityBonus: 15, cost: 10000000 },
    { id: "susp_3", name: "Coilover Kit Adjustable", handlingBonus: 20, speedBonus: 5, cost: 24000000 },
    { id: "susp_4", name: "Suspensi Air (Air Suspension) 4-Point", handlingBonus: 28, speedBonus: 3, cost: 45000000 }
  ],

  // --- TRANSMISI & TRANSMISSION (Mengoptimalkan Penyaluran Tenaga) ---
  transmission: [
    { id: "trans_1", name: "Kopling Gantung Racing", speedBonus: 8, handlingBonus: 3, cost: 8500000 },
    { id: "trans_2", name: "Short Shifter Kit", speedBonus: 14, handlingBonus: 5, cost: 18000000 },
    { id: "trans_3", name: "Rasio Gigi Close Ratio Custom", speedBonus: 22, handlingBonus: 8, cost: 32000000 },
    { id: "trans_4", name: "LSD (Limited Slip Differential) 2-Way", speedBonus: 18, handlingBonus: 20, cost: 48000000 }
  ],

  // --- REM & Pengereman (Keamanan & Ketahanan Saat Handling Tinggi) ---
  brakes: [
    { id: "brk_1", name: "Kampas Rem Ceramic Spec", heatReduction: 5, handlingBonus: 5, cost: 6000000 },
    { id: "brk_2", name: "Big Brake Kit (BBK) 4-Pot", heatReduction: 12, handlingBonus: 12, cost: 20000000 },
    { id: "brk_3", name: "Carbon Ceramic Brake System 6-Pot", heatReduction: 25, handlingBonus: 22, cost: 55000000 }
  ],

  // --- AERO & BODYKIT (Aerodinamis, Tampilan, & Efisiensi Speed) ---
  bodywork: [
    { id: "body_1", name: "Bumper Depan Custom Fiber", speedBonus: 3, handlingBonus: 5, cost: 7500000 },
    { id: "body_2", name: "Spoiler Atas Jalur Pantura", speedBonus: 6, handlingBonus: 10, cost: 12000000 },
    { id: "body_3", name: "Kap Mesin Carbon Fiber (Lightweight)", speedBonus: 15, handlingBonus: 12, cost: 28000000 },
    { id: "body_4", name: "Full Wide Bodykit Aerodynamic", speedBonus: 22, handlingBonus: 20, cost: 65000000 }
  ],

  // --- BOOST / SPECIAL MODS (Item Instan & Ekstrem) ---
  boosters: [
    { id: "boost_1", name: "Injeksi Nitrous Oxide (NOS) Single Shot", speedBonus: 45, heatRisk: 35, usesPerRace: 1, cost: 25000000 },
    { id: "boost_2", name: "Injeksi NOS Twin Bottle Direct Port", speedBonus: 80, heatRisk: 55, usesPerRace: 2, cost: 60000000 }
  ]
};
