const MECHANICS_DATA = [
  // --- TIER 1: BENKEL KAMPUNG & JALANAN (Entry Level & Budget) ---
  {
    id: "mech_1",
    name: "Mang Endang",
    specialty: "Spesialis Porting Polish & Karburator",
    engineRating: 88,
    chassisRating: 82,
    errorRate: 2,
    salaryPerRace: 20000000,
    reqMinRdBudget: 50000000
  },
  {
    id: "mech_2",
    name: "Kang Yayan",
    specialty: "Tuning Engine Drag & Sirkuit",
    engineRating: 92,
    chassisRating: 75,
    errorRate: 5,
    salaryPerRace: 25000000,
    reqMinRdBudget: 75000000
  },
  {
    id: "mech_3",
    name: "Pak Toto",
    specialty: "Ahli Kaki-kaki & Per Daun",
    engineRating: 78,
    chassisRating: 90,
    errorRate: 1,
    salaryPerRace: 18000000,
    reqMinRdBudget: 40000000
  },
  {
    id: "mech_4",
    name: "Bah Oded",
    specialty: "Penyetelan Suspensi & Kestabilan Muatan",
    engineRating: 80,
    chassisRating: 80,
    errorRate: 0,
    salaryPerRace: 22000000,
    reqMinRdBudget: 60000000
  },
  {
    id: "mech_5",
    name: "Mang Asep Bobok",
    specialty: "Custom Knalpot & Exhaust Header",
    engineRating: 81,
    chassisRating: 72,
    errorRate: 3,
    salaryPerRace: 15000000,
    reqMinRdBudget: 30000000
  },
  {
    id: "mech_6",
    name: "Kang Cecep Las",
    specialty: "Penguatan Sasis & Rollbar Custom",
    engineRating: 68,
    chassisRating: 87,
    errorRate: 2,
    salaryPerRace: 16000000,
    reqMinRdBudget: 35000000
  },
  {
    id: "mech_7",
    name: "Pak Ujang Dinamo",
    specialty: "Kelistrikan & Pengapian Racing",
    engineRating: 84,
    chassisRating: 70,
    errorRate: 4,
    salaryPerRace: 19000000,
    reqMinRdBudget: 45000000
  },
  {
    id: "mech_8",
    name: "Bah Dadang Sol",
    specialty: "Rem Tromol & Big Brake System",
    engineRating: 72,
    chassisRating: 86,
    errorRate: 1,
    salaryPerRace: 17000000,
    reqMinRdBudget: 38000000
  },
  {
    id: "mech_9",
    name: "Mang Iwan Radiator",
    specialty: "Sistem Pendingin & Intercooler",
    engineRating: 85,
    chassisRating: 76,
    errorRate: 2,
    salaryPerRace: 21000000,
    reqMinRdBudget: 50000000
  },
  {
    id: "mech_10",
    name: "Kang Eza Ceper",
    specialty: "Setup Ceper Extreme & Lowering Kit",
    engineRating: 70,
    chassisRating: 89,
    errorRate: 3,
    salaryPerRace: 18500000,
    reqMinRdBudget: 42000000
  },

  // --- TIER 2: MEKANIK PANTURA & LINTAS PROVINSI (Daya Tahan & Kecepatan) ---
  {
    id: "mech_11",
    name: "Pak Agus Solar",
    specialty: "Tuning Mesin Diesel & Turbo Cumi",
    engineRating: 90,
    chassisRating: 81,
    errorRate: 3,
    salaryPerRace: 28000000,
    reqMinRdBudget: 80000000
  },
  {
    id: "mech_12",
    name: "Bang Budi Gearbox",
    specialty: "Modifikasi Transmisi & Close Ratio",
    engineRating: 86,
    chassisRating: 84,
    errorRate: 2,
    salaryPerRace: 26000000,
    reqMinRdBudget: 70000000
  },
  {
    id: "mech_13",
    name: "Mas Dede Injection",
    specialty: "Remap ECU & Injeksi Bahan Bakar",
    engineRating: 93,
    chassisRating: 78,
    errorRate: 4,
    salaryPerRace: 30000000,
    reqMinRdBudget: 90000000
  },
  {
    id: "mech_14",
    name: "Pak Eko Ban",
    specialty: "Manajemen Ban & Wheel Alignment",
    engineRating: 75,
    chassisRating: 91,
    errorRate: 1,
    salaryPerRace: 24000000,
    reqMinRdBudget: 65000000
  },
  {
    id: "mech_15",
    name: "Koh Ferry Turbo",
    specialty: "Spesialis Force Induction & Twin Turbo",
    engineRating: 95,
    chassisRating: 79,
    errorRate: 5,
    salaryPerRace: 35000000,
    reqMinRdBudget: 110000000
  },
  {
    id: "mech_16",
    name: "Om Ginanjar Audio",
    specialty: "Optimalisasi Aerodinamika & Weight Balance",
    engineRating: 79,
    chassisRating: 88,
    errorRate: 2,
    salaryPerRace: 23000000,
    reqMinRdBudget: 60000000
  },
  {
    id: "mech_17",
    name: "Pak Hery Kopling",
    specialty: "Modifikasi Kopling Gantung & LSD",
    engineRating: 87,
    chassisRating: 83,
    errorRate: 2,
    salaryPerRace: 27000000,
    reqMinRdBudget: 75000000
  },
  {
    id: "mech_18",
    name: "Kang Iman Camshaft",
    specialty: "Noken As Custom & Valve Timing",
    engineRating: 91,
    chassisRating: 77,
    errorRate: 3,
    salaryPerRace: 29000000,
    reqMinRdBudget: 85000000
  },
  {
    id: "mech_19",
    name: "Mas Joko Airsus",
    specialty: "Penyetelan Air Suspension 4-Point",
    engineRating: 76,
    chassisRating: 93,
    errorRate: 1,
    salaryPerRace: 31000000,
    reqMinRdBudget: 95000000
  },
  {
    id: "mech_20",
    name: "Bang Lukman Overhaul",
    specialty: "Restorasi Blok Mesin & Ketahanan",
    engineRating: 89,
    chassisRating: 85,
    errorRate: 1,
    salaryPerRace: 28000000,
    reqMinRdBudget: 80000000
  },

  // --- TIER 3: TEKNISI PRO SIRKUIT & DRIFT (Performa Tinggi) ---
  {
    id: "mech_21",
    name: "Master Maman NOS",
    specialty: "Instalasi Nitrous Oxide (NOS) System",
    engineRating: 96,
    chassisRating: 80,
    errorRate: 6,
    salaryPerRace: 42000000,
    reqMinRdBudget: 130000000
  },
  {
    id: "mech_22",
    name: "Pak Nanang Carbon",
    specialty: "Bodi Serat Karbon & Ringan Sasis",
    engineRating: 77,
    chassisRating: 94,
    errorRate: 1,
    salaryPerRace: 33000000,
    reqMinRdBudget: 100000000
  },
  {
    id: "mech_23",
    name: "Kang Oji Dyno",
    specialty: "Dyno Tuning & Pemetaan Horsepower",
    engineRating: 94,
    chassisRating: 82,
    errorRate: 2,
    salaryPerRace: 38000000,
    reqMinRdBudget: 120000000
  },
  {
    id: "mech_24",
    name: "Bang Paimin Drift",
    specialty: "Geometri Kemudi & Angle Kit Drift",
    engineRating: 83,
    chassisRating: 95,
    errorRate: 2,
    salaryPerRace: 36000000,
    reqMinRdBudget: 115000000
  },
  {
    id: "mech_25",
    name: "Pak Qomar Radiator",
    specialty: "Manajemen Panas & Anti-Overheat",
    engineRating: 88,
    chassisRating: 88,
    errorRate: 0,
    salaryPerRace: 34000000,
    reqMinRdBudget: 105000000
  },
  {
    id: "mech_26",
    name: "Mas Rian Swap",
    specialty: "Engine Swap Engine Monster 2JZ",
    engineRating: 97,
    chassisRating: 84,
    errorRate: 4,
    salaryPerRace: 45000000,
    reqMinRdBudget: 150000000
  },
  {
    id: "mech_27",
    name: "Bah Saepul Supercharger",
    specialty: "Instalasi Supercharger Twin-Screw",
    engineRating: 95,
    chassisRating: 81,
    errorRate: 3,
    salaryPerRace: 41000000,
    reqMinRdBudget: 135000000
  },
  {
    id: "mech_28",
    name: "Om Taufik Telemetri",
    specialty: "Analisis Sensor Data & Telemetri Balap",
    engineRating: 86,
    chassisRating: 92,
    errorRate: 1,
    salaryPerRace: 37000000,
    reqMinRdBudget: 120000000
  },
  {
    id: "mech_29",
    name: "Kang Utap Ceramic",
    specialty: "Sistem Pengereman Carbon Ceramic",
    engineRating: 80,
    chassisRating: 96,
    errorRate: 1,
    salaryPerRace: 39000000,
    reqMinRdBudget: 125000000
  },
  {
    id: "mech_30",
    name: "Pak Vance Racing",
    specialty: "Tuning Bahan Bakar Racing High Octane",
    engineRating: 93,
    chassisRating: 83,
    errorRate: 2,
    salaryPerRace: 37500000,
    reqMinRdBudget: 118000000
  },

  // --- TIER 4: MEKANIK MAESTRO & LEGENDARIS (Top-End Performance) ---
  {
    id: "mech_31",
    name: "Bah Wawan Karbu",
    specialty: "Spesialis Porting Polish & Karburator",
    engineRating: 92,
    chassisRating: 89,
    errorRate: 0,
    salaryPerRace: 48000000,
    reqMinRdBudget: 160000000
  },
  {
    id: "mech_32",
    name: "Koh Xavier Coilover",
    specialty: "Penyetelan Suspensi & Kestabilan Muatan",
    engineRating: 85,
    chassisRating: 97,
    errorRate: 1,
    salaryPerRace: 46000000,
    reqMinRdBudget: 155000000
  },
  {
    id: "mech_33",
    name: "Pak Yudi Header",
    specialty: "Custom Knalpot & Exhaust Header",
    engineRating: 91,
    chassisRating: 90,
    errorRate: 1,
    salaryPerRace: 44000000,
    reqMinRdBudget: 145000000
  },
  {
    id: "mech_34",
    name: "Bang Zainal Wire",
    specialty: "Kelistrikan & Pengapian Racing",
    engineRating: 94,
    chassisRating: 87,
    errorRate: 2,
    salaryPerRace: 47000000,
    reqMinRdBudget: 150000000
  },
  {
    id: "mech_35",
    name: "Master Anton Garasi",
    specialty: "Tuning Engine Drag & Sirkuit",
    engineRating: 98,
    chassisRating: 86,
    errorRate: 3,
    salaryPerRace: 55000000,
    reqMinRdBudget: 180000000
  },
  {
    id: "mech_36",
    name: "Om Bambang Rollcage",
    specialty: "Penguatan Sasis & Rollbar Custom",
    engineRating: 82,
    chassisRating: 98,
    errorRate: 0,
    salaryPerRace: 50000000,
    reqMinRdBudget: 170000000
  },
  {
    id: "mech_37",
    name: "Pak Candra BBK",
    specialty: "Rem Tromol & Big Brake System",
    engineRating: 86,
    chassisRating: 96,
    errorRate: 1,
    salaryPerRace: 49000000,
    reqMinRdBudget: 165000000
  },
  {
    id: "mech_38",
    name: "Kang Deni Cooler",
    specialty: "Sistem Pendingin & Intercooler",
    engineRating: 93,
    chassisRating: 91,
    errorRate: 1,
    salaryPerRace: 52000000,
    reqMinRdBudget: 175000000
  },
  {
    id: "mech_39",
    name: "Mas Erik Stance",
    specialty: "Setup Ceper Extreme & Lowering Kit",
    engineRating: 84,
    chassisRating: 97,
    errorRate: 2,
    salaryPerRace: 51000000,
    reqMinRdBudget: 168000000
  },
  {
    id: "mech_40",
    name: "Prof. Firman Mastermind",
    specialty: "Remap ECU & Injeksi Bahan Bakar",
    engineRating: 99,
    chassisRating: 95,
    errorRate: 1,
    salaryPerRace: 65000000,
    reqMinRdBudget: 200000000
  }
];
