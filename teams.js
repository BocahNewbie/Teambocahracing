// Database Tim NASCOT
const TEAMS_DATA = [
  // --- PRIANGAN TIMUR & SELATAN ---
  { id: "team_1", name: "Cicaheum Racing", color: "#2ecc71", secondaryColor: "#f1c40f", isPlayer: true },
  { id: "team_2", name: "Pangandaran Coastal", color: "#3498db", secondaryColor: "#ecf0f1", isPlayer: false },
  { id: "team_3", name: "Tasik Speed Project", color: "#e74c3c", secondaryColor: "#111111", isPlayer: false },
  { id: "team_4", name: "Garut Dodol Works", color: "#795548", secondaryColor: "#ffecb3", isPlayer: false },
  { id: "team_5", name: "Ciamis Galuh Racing", color: "#9c27b0", secondaryColor: "#ffd700", isPlayer: false },
  { id: "team_6", name: "Banjar Patroman Express", color: "#009688", secondaryColor: "#ffffff", isPlayer: false },
  { id: "team_7", name: "Singaparna Galunggung", color: "#4e342e", secondaryColor: "#ff9800", isPlayer: false },
  { id: "team_8", name: "Cilawu Tea Estate", color: "#1b5e20", secondaryColor: "#a5d6a7", isPlayer: false },
  { id: "team_9", name: "Pameungpeuk Wave Racing", color: "#0288d1", secondaryColor: "#e0f7fa", isPlayer: false },
  { id: "team_10", name: "Rancah Speed Syndicate", color: "#c2185b", secondaryColor: "#f8bbd0", isPlayer: false },

  // --- BANDUNG RAYA & SEKITARNYA ---
  { id: "team_11", name: "Dago Peak Performance", color: "#9b59b6", secondaryColor: "#34495e", isPlayer: false },
  { id: "team_12", name: "Lembang Alpine Works", color: "#2e7d32", secondaryColor: "#e8f5e9", isPlayer: false },
  { id: "team_13", name: "Cimahi Military Precision", color: "#37474f", secondaryColor: "#80d8ff", isPlayer: false },
  { id: "team_14", name: "Soreang Jalak Harupat", color: "#d84315", secondaryColor: "#ffcc80", isPlayer: false },
  { id: "team_15", name: "Ciwidey Crater Racing", color: "#00695c", secondaryColor: "#b2dfdb", isPlayer: false },
  { id: "team_16", name: "Cileunyi Junction Sport", color: "#ef6c00", secondaryColor: "#fff3e0", isPlayer: false },
  { id: "team_17", name: "Padalarang Limestone", color: "#78909c", secondaryColor: "#eceff1", isPlayer: false },
  { id: "team_18", name: "Ujungberung Underground", color: "#212121", secondaryColor: "#f44336", isPlayer: false },
  { id: "team_19", name: "Kopo Highway Tuners", color: "#b71c1c", secondaryColor: "#ff8a80", isPlayer: false },
  { id: "team_20", name: "Dayeuhkolot Flood Runners", color: "#1565c0", secondaryColor: "#90caf9", isPlayer: false },

  // --- BOGOR, DEPOK, BEKASI (BODEBEK) ---
  { id: "team_21", name: "Buitenzorg Motorsport", color: "#27ae60", secondaryColor: "#2c3e50", isPlayer: false },
  { id: "team_22", name: "Depok Margonda Speed", color: "#e91e63", secondaryColor: "#f48fb1", isPlayer: false },
  { id: "team_23", name: "Bekasi Patriot Works", color: "#1976d2", secondaryColor: "#bbdefb", isPlayer: false },
  { id: "team_24", name: "Cibinong Heavy Duty", color: "#558b2f", secondaryColor: "#ded2a9", isPlayer: false },
  { id: "team_25", name: "Sentul Circuit Spec", color: "#d50000", secondaryColor: "#ffffff", isPlayer: false },
  { id: "team_26", name: "Cikarang Industrial Force", color: "#424242", secondaryColor: "#ffeb3b", isPlayer: false },
  { id: "team_27", name: "Puncak Pass Downhill", color: "#1b5e20", secondaryColor: "#ffe082", isPlayer: false },
  { id: "team_28", name: "Tambun Express Racing", color: "#f57c00", secondaryColor: "#212121", isPlayer: false },
  { id: "team_29", name: "Sawangan Ridge Project", color: "#6a1b9a", secondaryColor: "#e1bee7", isPlayer: false },
  { id: "team_30", name: "Jababeka Techno Racing", color: "#00838f", secondaryColor: "#b2ebf2", isPlayer: false },

  // --- SUKABUMI & CIANJUR ---
  { id: "team_31", name: "Sukabumi Overland", color: "#8bc34a", secondaryColor: "#333333", isPlayer: false },
  { id: "team_32", name: "Cianjur Pandan Wangi", color: "#4caf50", secondaryColor: "#81c784", isPlayer: false },
  { id: "team_33", name: "Pelabuhan Ratu Surfer", color: "#00acc1", secondaryColor: "#ffb74d", isPlayer: false },
  { id: "team_34", name: "Cipanas Villa Racing", color: "#3f51b5", secondaryColor: "#c5cae9", isPlayer: false },
  { id: "team_35", name: "Cibaraja Angkot Club", color: "#fb8c00", secondaryColor: "#ffffff", isPlayer: false },
  { id: "team_36", name: "Cirata Hydro Speed", color: "#0277bd", secondaryColor: "#81d4fa", isPlayer: false },
  { id: "team_37", name: "Jampang Mountain Crew", color: "#3e2723", secondaryColor: "#d7ccc8", isPlayer: false },
  { id: "team_38", name: "Cisaat Track Demons", color: "#880e4f", secondaryColor: "#ff80ab", isPlayer: false },

  // --- CIREBON, INDRAMAYU, MAJALENGKA, KUNINGAN (CIAYUMAJAKUNING) ---
  { id: "team_39", name: "Cirebon Coast Line", color: "#00bcd4", secondaryColor: "#ffffff", isPlayer: false },
  { id: "team_40", name: "Indramayu Mango Speed", color: "#ff5722", secondaryColor: "#ffc107", isPlayer: false },
  { id: "team_41", name: "Majalengka Wind Force", color: "#607d8b", secondaryColor: "#cfd8dc", isPlayer: false },
  { id: "team_42", name: "Kuningan Ciremai Peak", color: "#2e7d32", secondaryColor: "#fff176", isPlayer: false },
  { id: "team_43", name: "Losari Border Runners", color: "#c62828", secondaryColor: "#ff8a80", isPlayer: false },
  { id: "team_44", name: "Jatibarang Railway Spec", color: "#455a64", secondaryColor: "#ff9800", isPlayer: false },
  { id: "team_45", name: "Jatiwangi Clay Works", color: "#a1887f", secondaryColor: "#3e2723", isPlayer: false },
  { id: "team_46", name: "Cingambul Ridge Racing", color: "#558b2f", secondaryColor: "#c0ca33", isPlayer: false },
  { id: "team_47", name: "Linggarjati Heritage", color: "#1565c0", secondaryColor: "#e0e0e0", isPlayer: false },
  { id: "team_48", name: "Sumber Red Sun Racing", color: "#d81b60", secondaryColor: "#f48fb1", isPlayer: false },

  // --- PURWASUKA (PURWAKARTA, SUBANG, KARAWANG) ---
  { id: "team_49", name: "Purwakarta Sate Racing", color: "#d32f2f", secondaryColor: "#757575", isPlayer: false },
  { id: "team_50", name: "Subang Pineapple GP", color: "#ffeb3b", secondaryColor: "#388e3c", isPlayer: false },
  { id: "team_51", name: "Karawang Rice Field", color: "#7cb342", secondaryColor: "#fff59d", isPlayer: false },
  { id: "team_52", name: "Cikampek Junction", color: "#f4511e", secondaryColor: "#212121", isPlayer: false },
  { id: "team_53", name: "Pamanukan Coastal Express", color: "#00838f", secondaryColor: "#ffe082", isPlayer: false },
  { id: "team_54", name: "Jatiluhur Hydro Racing", color: "#0097a7", secondaryColor: "#b2ebf2", isPlayer: false },
  { id: "team_55", name: "Rengasdengklok Pioneer", color: "#b71c1c", secondaryColor: "#ffffff", isPlayer: false },

  // --- PRIANGAN TENGAH & JALUR UTARA-SELATAN ---
  { id: "team_56", name: "Sumedang Tahu Sport", color: "#ff9800", secondaryColor: "#5d4037", isPlayer: false },
  { id: "team_57", name: "Kalapa Express Racing", color: "#e67e22", secondaryColor: "#ffffff", isPlayer: false },
  { id: "team_58", name: "Nagreg Slope Racers", color: "#ad1457", secondaryColor: "#ff80ab", isPlayer: false },
  { id: "team_59", name: "Tanjungsari Pass", color: "#689f38", secondaryColor: "#dc8d85", isPlayer: false },
  { id: "team_60", name: "Kadipaten Speed Club", color: "#00695c", secondaryColor: "#ffb300", isPlayer: false }
];
