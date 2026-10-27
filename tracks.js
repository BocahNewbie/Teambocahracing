const TRACKS_DATA = [
  // --- SENTUL & BODEBEK (Sirkuit Balap & Perkotaan) ---
  {
    id: "sentul_oval",
    name: "Sentul Super Tri-Oval",
    type: "Tri-Oval",
    lengthKm: 2.4,
    lapsDefault: 30,
    topSpeedFactor: 1.3,
    tireWearFactor: 0.9,
    description: "Sirkuit oval cepat berkecepatan tinggi, membutuhkan racikan rasio gigi panjang."
  },
  {
    id: "sentul_karting_extreme",
    name: "Sentul Technical Loop",
    type: "Technical Circuit",
    lengthKm: 1.2,
    lapsDefault: 35,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.3,
    description: "Lintasan teknis dengan kombinasi chicanes ketat yang menguji kelincahan kemudi."
  },
  {
    id: "depok_margonda_street",
    name: "Margonda Night Street Circuit",
    type: "Street Circuit",
    lengthKm: 3.5,
    lapsDefault: 20,
    topSpeedFactor: 1.15,
    tireWearFactor: 1.1,
    description: "Trek lurus panjang antarkota dengan U-turn tajam dan permukaan aspal mulus."
  },
  {
    id: "bogor_kebun_raya_loop",
    name: "Buitenzorg Botanical Ring",
    type: "Street Circuit",
    lengthKm: 4.2,
    lapsDefault: 18,
    topSpeedFactor: 1.05,
    tireWearFactor: 1.2,
    description: "Lintasan mengelilingi area bersejarah dengan perubahan elevasi tipis dan kelembapan tinggi."
  },
  {
    id: "cibinong_pakansari_ring",
    name: "Pakansari Stadium Outer Ring",
    type: "Oval",
    lengthKm: 2.1,
    lapsDefault: 30,
    topSpeedFactor: 1.25,
    tireWearFactor: 1.0,
    description: "Sirkuit lingkar stadion yang lebar dengan sudut apron ideal untuk overtaking."
  },
  {
    id: "bekasi_kalimalang_sprint",
    name: "Kalimalang Canal Sprint",
    type: "Sprint Circuit",
    lengthKm: 2.8,
    lapsDefault: 22,
    topSpeedFactor: 1.2,
    tireWearFactor: 1.15,
    description: "Jalur lurus bergelombang paralel saluran air, menguji stabilitas suspensi."
  },
  {
    id: "cikarang_industrial_grid",
    name: "Jababeka Techno Grid",
    type: "Street Circuit",
    lengthKm: 3.8,
    lapsDefault: 20,
    topSpeedFactor: 1.1,
    tireWearFactor: 1.25,
    description: "Sirkuit kotak khas kawasan industri dengan sudut 90 derajat yang tajam."
  },
  {
    id: "sawangan_highway_drift",
    name: "Sawangan Ridge Flyover",
    type: "Technical Circuit",
    lengthKm: 2.3,
    lapsDefault: 25,
    topSpeedFactor: 1.0,
    tireWearFactor: 1.35,
    description: "Kombinasi tanjakan curam dan turunan cepat di perbatasan perkotaan."
  },

  // --- BANDUNG RAYA & GUNUNG PEGUNUNGAN ---
  {
    id: "bandung_street",
    name: "Gedung Sate Loop Street Circuit",
    type: "Street Circuit",
    lengthKm: 1.8,
    lapsDefault: 25,
    topSpeedFactor: 0.95,
    tireWearFactor: 1.4,
    description: "Sirkuit jalan raya sempit dengan banyak tikungan tajam, menguji handling dan pengereman."
  },
  {
    id: "dago_pakar_downhill",
    name: "Dago Peak Downhill Touge",
    type: "Touge / Mountain",
    lengthKm: 4.5,
    lapsDefault: 12,
    topSpeedFactor: 0.8,
    tireWearFactor: 1.6,
    description: "Turunan tajam berkelok dengan jurang mematikan dan tantangan rem memanas."
  },
  {
    id: "lembang_tangkuban_climb",
    name: "Tangkuban Perahu Hillclimb",
    type: "Hillclimb",
    lengthKm: 5.2,
    lapsDefault: 10,
    topSpeedFactor: 0.75,
    tireWearFactor: 1.5,
    description: "Tanjakan ekstrim berkabut tebal yang menguras tenaga mesin dan torsi roda."
  },
  {
    id: "ciwidey_tea_garden",
    name: "Rancabali Tea Estate Pass",
    type: "Technical Circuit",
    lengthKm: 3.6,
    lapsDefault: 18,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.3,
    description: "Lintasan berliku menyusuri perkebunan teh dengan pemandangan terbuka dan angin kencang."
  },
  {
    id: "soreang_stadium_sprint",
    name: "Jalak Harupat Ring Circuit",
    type: "Sprint Circuit",
    lengthKm: 2.0,
    lapsDefault: 28,
    topSpeedFactor: 1.15,
    tireWearFactor: 1.05,
    description: "Sirkuit cepat flat-out mengelilingi kompleks olahraga dengan permukaan mulus."
  },
  {
    id: "padalarang_stone_quarry",
    name: "Citatah Limestone Quarry Track",
    type: "Rallycross",
    lengthKm: 2.5,
    lapsDefault: 22,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.7,
    description: "Sirkuit bertanah berbatu kapur dengan debu tebal dan traksi yang sangat minim."
  },
  {
    id: "cimahi_military_loop",
    name: "Cimahi Velodrome Street Track",
    type: "Street Circuit",
    lengthKm: 2.2,
    lapsDefault: 26,
    topSpeedFactor: 1.0,
    tireWearFactor: 1.2,
    description: "Sirkuit perkotaan militer dengan aspal rigid beton dan sudut pengereman tajam."
  },
  {
    id: "cileunyi_toll_junction",
    name: "Cileunyi Interchange Flyover",
    type: "High-Speed Oval",
    lengthKm: 3.0,
    lapsDefault: 22,
    topSpeedFactor: 1.35,
    tireWearFactor: 1.1,
    description: "Trek dengan tikungan ber-bank tinggi memanfaatkan ramp simpang susun jalan tol."
  },
  {
    id: "kopo_expressway_night",
    name: "Kopo Midnight Expressway",
    type: "Sprint Circuit",
    lengthKm: 4.0,
    lapsDefault: 15,
    topSpeedFactor: 1.3,
    tireWearFactor: 1.0,
    description: "Sirkuit lurus panjang malam hari untuk pertarungan top speed murni."
  },
  {
    id: "ujungberung_foothills",
    name: "Manglayang Foothill Touge",
    type: "Touge / Mountain",
    lengthKm: 3.2,
    lapsDefault: 20,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.45,
    description: "Jalur pegunungan sempit bergelombang dengan sudut blind spot di tiap tikungan."
  },

  // --- JALUR EXTREME NAGREG & PRIANGAN TENGAH ---
  {
    id: "nagreg_hairpin_pass",
    name: "Nagreg Monster Hairpin Pass",
    type: "Touge / Mountain",
    lengthKm: 3.8,
    lapsDefault: 15,
    topSpeedFactor: 0.7,
    tireWearFactor: 1.8,
    description: "Jalur legendaris dengan tikungan tusuk konde ekstrim dan perbedaan elevasi tajam."
  },
  {
    id: "sumedang_cadas_pangeran",
    name: "Cadas Pangeran Cliff Run",
    type: "Touge / Mountain",
    lengthKm: 4.1,
    lapsDefault: 14,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.5,
    description: "Lintasan sempit di tepi tebing batu cadas dengan risiko benturan dinding tinggi."
  },
  {
    id: "sumedang_cimalaka_bypass",
    name: "Tampomas Bypass Speedway",
    type: "Sprint Circuit",
    lengthKm: 3.3,
    lapsDefault: 20,
    topSpeedFactor: 1.25,
    tireWearFactor: 1.05,
    description: "Jalur lingkar beraspal lebar di kaki Gunung Tampomas."
  },
  {
    id: "tanjungsari_pass_circuit",
    name: "Tanjungsari Valley Circuit",
    type: "Technical Circuit",
    lengthKm: 2.7,
    lapsDefault: 24,
    topSpeedFactor: 0.95,
    tireWearFactor: 1.25,
    description: "Lintasan naik turun bergelombang yang menyusuri perbukitan perkebunan."
  },

  // --- PRIANGAN TIMUR (TASIKMALAYA, CIAMIS, BANJAR, PANGANDARAN, GARUT) ---
  {
    id: "pangandaran_speedway",
    name: "Pangandaran Coastal Speedway",
    type: "Oval",
    lengthKm: 3.1,
    lapsDefault: 40,
    topSpeedFactor: 1.4,
    tireWearFactor: 1.1,
    description: "Sirkuit oval panjang di tepi pantai, efek slipstream sangat berpengaruh."
  },
  {
    id: "tasik_gebuhan_circuit",
    name: "Bukit Peusar International Track",
    type: "Technical Circuit",
    lengthKm: 1.4,
    lapsDefault: 30,
    topSpeedFactor: 0.8,
    tireWearFactor: 1.35,
    description: "Sirkuit teknis resmi penuh tikungan flowing mendaki dan menurun."
  },
  {
    id: "ciamis_galuh_ring",
    name: "Galuh Park Circuit",
    type: "Street Circuit",
    lengthKm: 2.3,
    lapsDefault: 25,
    topSpeedFactor: 1.05,
    tireWearFactor: 1.15,
    description: "Lintasan semi-perkotaan melingkari kawasan hijau kota Ciamis."
  },
  {
    id: "banjar_patroman_street",
    name: "Patroman Border Ring",
    type: "Street Circuit",
    lengthKm: 2.6,
    lapsDefault: 22,
    topSpeedFactor: 1.1,
    tireWearFactor: 1.2,
    description: "Sirkuit perkotaan perbatasan provinsi dengan straight melengkung panjang."
  },
  {
    id: "garut_bagendit_lake",
    name: "Situ Bagendit Lakeside Oval",
    type: "Oval",
    lengthKm: 2.0,
    lapsDefault: 32,
    topSpeedFactor: 1.25,
    tireWearFactor: 0.95,
    description: "Oval cepat mengelilingi danau dengan angin samping yang berhembus kuat."
  },
  {
    id: "garut_cikajang_highland",
    name: "Cikajang Tea Highland Run",
    type: "Touge / Mountain",
    lengthKm: 5.0,
    lapsDefault: 10,
    topSpeedFactor: 0.8,
    tireWearFactor: 1.55,
    description: "Jalur dataran tinggi dingin beraspal halus tetapi berleuk-lekuk tajam."
  },
  {
    id: "singaparna_galunggung_climb",
    name: "Galunggung Volcano Hillclimb",
    type: "Hillclimb",
    lengthKm: 4.8,
    lapsDefault: 12,
    topSpeedFactor: 0.75,
    tireWearFactor: 1.65,
    description: "Tanjakan ekstrem menuju puncak kawah gunung berapi dengan pasir halus di bahu jalan."
  },
  {
    id: "pameungpeuk_ocean_strip",
    name: "Santolo Ocean Drag Strip",
    type: "Sprint Circuit",
    lengthKm: 1.6,
    lapsDefault: 35,
    topSpeedFactor: 1.45,
    tireWearFactor: 0.9,
    description: "Trek lurus persis di pesisir laut selatan untuk adu akselerasi murni."
  },
  {
    id: "rancah_hills_stage",
    name: "Rancah Forest Rallystage",
    type: "Rallycross",
    lengthKm: 3.4,
    lapsDefault: 16,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.6,
    description: "Lintasan tanah keras dan kerikil melintasi hutan perbukitan."
  },
  {
    id: "batukaras_surf_loop",
    name: "Batu Karas Bay Circuit",
    type: "Street Circuit",
    lengthKm: 2.1,
    lapsDefault: 26,
    topSpeedFactor: 1.0,
    tireWearFactor: 1.1,
    description: "Lintasan pantai santai namun menjebak dengan tikungan blind apex."
  },
  {
    id: "salopa_river_canyon",
    name: "Salopa Canyon Touge",
    type: "Touge / Mountain",
    lengthKm: 4.3,
    lapsDefault: 14,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.4,
    description: "Menyusuri celah ngarai sungai dengan tikungan s-curve berturut-turut."
  },
  {
    id: "karangnunggal_south_track",
    name: "Karangnunggal Highway Loop",
    type: "Sprint Circuit",
    lengthKm: 3.7,
    lapsDefault: 18,
    topSpeedFactor: 1.2,
    tireWearFactor: 1.15,
    description: "Trek lurus panjang mendatar khas jalur lingkar selatan."
  },

  // --- SUKABUMI & CIANJUR (JALUR SELATAN BARAT) ---
  {
    id: "sukabumi_cibaraja_loop",
    name: "Cibaraja Angkot Speedway",
    type: "Technical Circuit",
    lengthKm: 1.9,
    lapsDefault: 28,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.3,
    description: "Trek favorit sopir lokal dengan manuver zig-zag yang memeras kestabilan sasis."
  },
  {
    id: "pelabuhan_ratu_coast",
    name: "Pelabuhan Ratu Cliffside Pass",
    type: "Touge / Mountain",
    lengthKm: 4.7,
    lapsDefault: 12,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.5,
    description: "Jalur samudera tebing pantai dengan angin laut kencang dan tikungan patah."
  },
  {
    id: "cianjur_pandan_ring",
    name: "Pandan Wangi Agro Ring",
    type: "Oval",
    lengthKm: 2.3,
    lapsDefault: 30,
    topSpeedFactor: 1.2,
    tireWearFactor: 1.0,
    description: "Sirkuit flat melingkari persawahan terbuka, visibilitas sangat tinggi."
  },
  {
    id: "cipanas_puncak_downhill",
    name: "Puncak Pass Downhill Battle",
    type: "Touge / Mountain",
    lengthKm: 6.0,
    lapsDefault: 8,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.7,
    description: "Turunan paling terkenal di Jawa Barat dengan kemiringan ekstrem dan kabut tebal."
  },
  {
    id: "cisaat_market_street",
    name: "Cisaat Urban Sprint",
    type: "Street Circuit",
    lengthKm: 1.7,
    lapsDefault: 30,
    topSpeedFactor: 0.95,
    tireWearFactor: 1.35,
    description: "Sirkuit pasar padat dengan permukaan aspal berbintik dan traksi tidak merata."
  },
  {
    id: "cirata_dam_bridge",
    name: "Cirata Reservoir Dam Circuit",
    type: "Technical Circuit",
    lengthKm: 3.5,
    lapsDefault: 18,
    topSpeedFactor: 1.1,
    tireWearFactor: 1.2,
    description: "Melintasi jembatan waduk raksasa dengan jalur straight sempit berkisi besi."
  },
  {
    id: "jampang_savanna_run",
    name: "Jampanggulung Savanna Track",
    type: "Rallycross",
    lengthKm: 3.9,
    lapsDefault: 16,
    topSpeedFactor: 1.05,
    tireWearFactor: 1.5,
    description: "Trek tanah padat bercampur batu lepas melintasi kawasan tegalan luas."
  },
  {
    id: "ciletuh_geopark_descent",
    name: "Ciletuh Geopark Grand Descent",
    type: "Touge / Mountain",
    lengthKm: 5.5,
    lapsDefault: 10,
    topSpeedFactor: 0.95,
    tireWearFactor: 1.6,
    description: "Turunan megah menghadap Teluk Ciletuh dengan pemandangan spektakuler dan tikungan tajam."
  },

  // --- CIREBON, INDRAMAYU, MAJALENGKA, KUNINGAN (CIAYUMAJAKUNING) ---
  {
    id: "cirebon_port_circuit",
    name: "Tanjung Emas Cirebon Docks",
    type: "Street Circuit",
    lengthKm: 2.8,
    lapsDefault: 22,
    topSpeedFactor: 1.15,
    tireWearFactor: 1.25,
    description: "Lintasan pelabuhan panas beralas beton dengan aroma garam dan debu industri."
  },
  {
    id: "indramayu_mango_oval",
    name: "Indramayu Coastal Oval",
    type: "Oval",
    lengthKm: 2.9,
    lapsDefault: 32,
    topSpeedFactor: 1.35,
    tireWearFactor: 0.95,
    description: "Oval super mendatar dengan suhu lintasan sangat tinggi yang mempercepat keausan ban."
  },
  {
    id: "majalengka_biert_wind",
    name: "Kertajati Wind Tunnel Track",
    type: "Sprint Circuit",
    lengthKm: 4.5,
    lapsDefault: 14,
    topSpeedFactor: 1.4,
    tireWearFactor: 1.0,
    description: "Trek lurus sangat panjang di sekitar area bandara dengan terpaan angin crosswind kuat."
  },
  {
    id: "kuningan_ciremai_hillclimb",
    name: "Palutungan Ciremai Pass",
    type: "Hillclimb",
    lengthKm: 4.0,
    lapsDefault: 15,
    topSpeedFactor: 0.8,
    tireWearFactor: 1.45,
    description: "Tanjakan dingin menyusuri kaki Gunung Ciremai dengan kemiringan konstan."
  },
  {
    id: "losari_border_line",
    name: "Losari Cisanggarung Sprint",
    type: "Sprint Circuit",
    lengthKm: 3.1,
    lapsDefault: 22,
    topSpeedFactor: 1.25,
    tireWearFactor: 1.0,
    description: "Jalur lurus di perbatasan Jawa Tengah-Jawa Barat."
  },
  {
    id: "jatibarang_rail_side",
    name: "Jatibarang Junction Track",
    type: "Street Circuit",
    lengthKm: 2.4,
    lapsDefault: 25,
    topSpeedFactor: 1.1,
    tireWearFactor: 1.2,
    description: "Sirkuit menyusuri rel kereta api dengan karakter stop-and-go."
  },
  {
    id: "jatiwangi_clay_ring",
    name: "Jatiwangi Brickworks Oval",
    type: "Rallycross",
    lengthKm: 1.8,
    lapsDefault: 30,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.75,
    description: "Oval tanah liat merah keras, menjadi berlumpur licin saat hujan turun."
  },
  {
    id: "linggarjati_peace_loop",
    name: "Linggarjati Park Circuit",
    type: "Technical Circuit",
    lengthKm: 2.1,
    lapsDefault: 26,
    topSpeedFactor: 0.9,
    tireWearFactor: 1.2,
    description: "Sirkuit sejarah sejuk dengan banyak sudut melengkung halus (flowing corners)."
  },
  {
    id: "sumber_cirebon_complex",
    name: "Sumber Civic Center Ring",
    type: "Street Circuit",
    lengthKm: 2.5,
    lapsDefault: 24,
    topSpeedFactor: 1.05,
    tireWearFactor: 1.15,
    description: "Sirkuit mengelilingi pusat pemerintahan Cirebon dengan aspal halus."
  },

  // --- PURWASUKA (PURWAKARTA, SUBANG, KARAWANG) ---
  {
    id: "purwakarta_sate_maranggi",
    name: "Cikopo Junction Circuit",
    type: "Street Circuit",
    lengthKm: 2.7,
    lapsDefault: 22,
    topSpeedFactor: 1.15,
    tireWearFactor: 1.2,
    description: "Sirkuit simpang jalan nasional dengan chicane ketat di titik temu jalur."
  },
  {
    id: "subang_ciater_pass",
    name: "Ciater Hot Spring Touge",
    type: "Touge / Mountain",
    lengthKm: 4.4,
    lapsDefault: 12,
    topSpeedFactor: 0.85,
    tireWearFactor: 1.5,
    description: "Jalur meliuk indah di tengah kebun teh dan uap air panas alami."
  },
  {
    id: "karawang_industrial_ring",
    name: "KIIC Drag & Oval Circuit",
    type: "Tri-Oval",
    lengthKm: 3.2,
    lapsDefault: 25,
    topSpeedFactor: 1.35,
    tireWearFactor: 1.05,
    description: "Oval industri modern dengan kualitas permukaan jalan standar internasional."
  },
  {
    id: "cikampek_toll_sprint",
    name: "Cikampek Utama Sprint Strip",
    type: "Sprint Circuit",
    lengthKm: 3.0,
    lapsDefault: 24,
    topSpeedFactor: 1.4,
    tireWearFactor: 0.95,
    description: "Trek lurus multi-lajur untuk menguji akselerasi kecepatan maksimum."
  },
  {
    id: "pamanukan_coastal_road",
    name: "Pamanukan Pantura Strip",
    type: "Sprint Circuit",
    lengthKm: 3.6,
    lapsDefault: 20,
    topSpeedFactor: 1.3,
    tireWearFactor: 1.1,
    description: "Jalur lurus jalur utara yang panas dan bergelombang bekas lintasan kendaraan berat."
  },
  {
    id: "jatiluhur_dam_loop",
    name: "Jatiluhur Hydro Ring",
    type: "Technical Circuit",
    lengthKm: 3.1,
    lapsDefault: 20,
    topSpeedFactor: 1.05,
    tireWearFactor: 1.25,
    description: "Sirkuit berkelok-kelok di pinggir waduk Jatiluhur dengan elevasi bervariasi."
  },
  {
    id: "rengasdengklok_flat",
    name: "Rengasdengklok Historic Oval",
    type: "Oval",
    lengthKm: 1.9,
    lapsDefault: 32,
    topSpeedFactor: 1.2,
    tireWearFactor: 1.0,
    description: "Sirkuit oval datar sederhana mengelilingi situs bersejarah nasional."
  },
  {
    id: "wanayasa_lake_pass",
    name: "Wanayasa Mountain Lake Pass",
    type: "Touge / Mountain",
    lengthKm: 3.7,
    lapsDefault: 16,
    topSpeedFactor: 0.88,
    tireWearFactor: 1.4,
    description: "Jalur pegunungan sejuk yang melingkari danau alami Wanayasa."
  },

  // --- JALUR UTARA & PESISIR PANTURA ---
  {
    id: "patimban_port_speedway",
    name: "Patimban Deepsea Speedway",
    type: "High-Speed Oval",
    lengthKm: 3.4,
    lapsDefault: 25,
    topSpeedFactor: 1.38,
    tireWearFactor: 1.0,
    description: "Sirkuit pelabuhan internasional terbaru dengan trek lurus panjang mengular."
  },
  {
    id: "karangampel_coast_run",
    name: "Karangampel Flat Circuit",
    type: "Sprint Circuit",
    lengthKm: 2.6,
    lapsDefault: 24,
    topSpeedFactor: 1.22,
    tireWearFactor: 1.05,
    description: "Jalur datar pesisir dengan hembusan angin laut konstan."
  },
  {
    id: "kandanghaur_line",
    name: "Kandanghaur Pantura Drag",
    type: "Sprint Circuit",
    lengthKm: 2.2,
    lapsDefault: 28,
    topSpeedFactor: 1.32,
    tireWearFactor: 1.1,
    description: "Jalur lurus legendaris Pantura yang menguji ketahanan suhu mesin."
  },
  {
    id: "sukra_border_track",
    name: "Sukra Boundary Ring",
    type: "Oval",
    lengthKm: 2.1,
    lapsDefault: 30,
    topSpeedFactor: 1.25,
    tireWearFactor: 0.98,
    description: "Oval cepat perbatasan Subang-Indramayu."
  },

  // --- LINTASAN KHUSUS & RALLY SPECIAL STAGES ---
  {
    id: "cikole_pine_dirt",
    name: "Cikole Pine Forest Rallystage",
    type: "Rallycross",
    lengthKm: 2.8,
    lapsDefault: 18,
    topSpeedFactor: 0.75,
    tireWearFactor: 1.85,
    description: "Trek tanah gembur melintasi hutan pinus lembab, licin dan berbatu."
  },
  {
    id: "kamojang_geothermal_climb",
    name: "Kamojang Geothermal Ascent",
    type: "Hillclimb",
    lengthKm: 5.1,
    lapsDefault: 10,
    topSpeedFactor: 0.82,
    tireWearFactor: 1.5,
    description: "Tanjakan ekstrim melewati uap geotermal dengan kelembapan aspal bervariasi."
  },
  {
    id: "wayang_windu_ridge",
    name: "Wayang Windu Sky Touge",
    type: "Touge / Mountain",
    lengthKm: 4.6,
    lapsDefault: 12,
    topSpeedFactor: 0.88,
    tireWearFactor: 1.45,
    description: "Lintasan puncak bukit kebun teh Pangalengan di atas awan."
  },
  {
    id: "cikembang_mountain_dirt",
    name: "Cikembang Offroad Arena",
    type: "Rallycross",
    lengthKm: 2.3,
    lapsDefault: 20,
    topSpeedFactor: 0.8,
    tireWearFactor: 1.75,
    description: "Lintasan tanah merah keras berdebu dengan lompatan (jumps) alami."
  },
  {
    id: "cisarua_safari_loop",
    name: "Cisarua Hills Ring",
    type: "Technical Circuit",
    lengthKm: 3.3,
    lapsDefault: 18,
    topSpeedFactor: 0.92,
    tireWearFactor: 1.3,
    description: "Sirkuit berbukit-bukit dengan sudut tikungan yang berubah-ubah (blind hairpin)."
  }
];
