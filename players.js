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

// Database Bendera dan Negara
const COUNTRIES = [
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'USA', flag: '🇺🇸' }
];

// Daftar Posisi Pemain Voli
const POSITIONS = ['Outside Hitter', 'Opposite Hitter', 'Middle Blocker', 'Setter', 'Libero'];

// Database Nama Lengkap: 150 First Name & 150 Last Name (Indonesia & WNA)
const NAMES_DATABASE = {
  indonesia: {
    firstNames: [
      "Rivan", "Farhan", "Doni", "Nizar", "Yuda", "Dio", "Asep", "Agus", "Bagas", "Fahmi",
      "Sam", "Fairuz", "Gagan", "Dimas", "Rizky", "Adit", "Aris", "Bayu", "Candra", "Dwi",
      "Eko", "Fajar", "Gilang", "Hendra", "Irfan", "Joko", "Kiki", "Lukman", "Mahendra", "Nugroho",
      "Oki", "Pandu", "Pratama", "Rahmat", "Satria", "Taufik", "Utama", "Vicky", "Wahyu", "Yoga", "Zainal",
      "Andi", "Budi", "Dede", "Eka", "Ferry", "Gita", "Hafiz", "Iwan", "Januar", "Kusuma",
      "Lutfi", "Miftah", "Noval", "Okta", "Putra", "Rama", "Sandi", "Tito", "Vito", "Wawan",
      "Yayan", "Zaki", "Agung", "Bambang", "Deni", "Edi", "Fauzi", "Guntur", "Hary", "Indra",
      "Jaya", "Kurniadi", "Leo", "Maulana", "Nanda", "Ovan", "Panji", "Rian", "Setya", "Tri",
      "Usman", "Varel", "Wibowo", "Yudi", "Zul", "Aldi", "Bagus", "Dicky", "Endra", "Firman",
      "Galih", "Hardi", "Iqbal", "Jamal", "Kurnia", "Luki", "Marwan", "Naufal", "Orlando", "Perdana",
      "Rangga", "Syafiq", "Tegar", "Umar", "Veri", "Willy", "Yosua", "Zaky", "Alfin", "Bima",
      "Danang", "Erik", "Faisal", "Gaza", "Hasan", "Ibrahim", "Jefri", "Karisma", "Luki", "Muhamad",
      "Niko", "Oza", "Pasha", "Rafi", "Surya", "Tommy", "Ubaid", "Vino", "Wisnu", "Yudha",
      "Zulfan", "Amir", "Bowo", "Dion", "Erlangga", "Fajar", "Gery", "Hadi", "Ilham", "Johan"
    ],
    lastNames: [
      "Nurmulki", "Halim", "Haryono", "Zulfikar", "Mardyansyah", "Zulfigar", "Saputra", "Pratama", "Hidayat", "Setiawan",
      "Wibowo", "Kusuma", "Santoso", "Laksana", "Permana", "Prasetya", "Utomo", "Nugroho", "Ramadhan", "Firmansyah",
      "Gunawan", "Suryadi", "Kurniawan", "Suharto", "Wijaya", "Subagja", "Wahyudi", "Riyadi", "Siregar", "Nasution",
      "Lubis", "Harahap", "Panjaitan", "Simanjuntak", "Situmorang", "Ginting", "Tarigan", "Sembiring", "Sinaga", "Hasibuan",
      "Sutrisno", "Irawan", "Budiman", "Lesmana", "Sujono", "Syaifullah", "Arifin", "Syahputra", "Supriadi", "Effendi",
      "Suhendar", "Purnomo", "Wicaksono", "Anggoro", "Kartiko", "Sudrajat", "Sujatnam", "Setyawan", "Pradipta", "Adiputra",
      "Wardana", "Prakoso", "Hardiansyah", "Rusli", "Prabowo", "Mulyadi", "Basri", "Mustofa", "Subekti", "Ariyanto",
      "Sugiarto", "Baskoro", "Hermansyah", "Iskandar", "Rizal", "Supriyadi", "Kristianto", "Widodo", "Setiadi", "Surya",
      "Pamungkas", "Adriansyah", "Fadillah", "Chaniago", "Koto", "Tanjung", "Paniago", "Lani", "Mansur", "Hambali",
      "Ahmad", "Solihin", "Saepullah", "Baharuddin", "Ginanjar", "Fathurrahman", "Khoiruddin", "Syafi'i", "Rabbani", "Zuhri",
      "Syihab", "Mahendra", "Mukhlas", "Natsir", "Rosyid", "Fuadi", "Munandar", "Maarif", "Syuja", "Bustami",
      "Chaidir", "Fahrizal", "Ghazali", "Habibi", "Husaini", "Khaeruddin", "Mahfud", "Nizamuddin", "Qosim", "Ridwan",
      "Rofi'i", "Shaleh", "Suhaimi", "Thohir", "Wahid", "Yasin", "Zainuddin", "Zakaria", "Zamzami", "Zarkasyi"
    ]
  },
  foreign: {
    firstNames: [
      "Marko", "Dmitry", "Carlos", "John", "Stefan", "Lucas", "Ivan", "Mateusz", "Bruno", "Earvin",
      "Micah", "Uros", "Saeid", "Yuji", "Ran", "Yuki", "Wilfredo", "Yoandy", "Yoan", "Osmany",
      "Alexandre", "Antoine", "Barthélémy", "Benjamin", "Clément", "Daryl", "Earvin", "Jenia", "Kevin", "Nicolas",
      "Stephen", "TJ", "Thomas", "Torey", "Aaron", "David", "Erik", "Garrett", "Jeffrey", "Kawika",
      "Taylor", "Aleksandar", "Drazen", "Goran", "Luka", "Marko", "Milos", "Nikola", "Petar", "Slobodan",
      "Srecko", "Uros", "Vuk", "Zoran", "Adis", "Atanas", "Cvetan", "Dimitar", "Georgi", "Martin",
      "Nikolay", "Plamen", "Todor", "Tsvetan", "Vencislav", "Yordan", "Aleksandr", "Artem", "Dmitriy", "Egor", "Maxim",
      "Pavel", "Sergey", "Stanislav", "Tsvetan", "Vadim", "Victor", "Yury", "Giacomo", "Gianluca", "Ivan",
      "Luigi", "Marco", "Matteo", "Michele", "Paolo", "Simone", "Tommaso", "Alan", "Arthur", "Douglas",
      "Eder", "Fernando", "Gabriel", "Isac", "Lucas", "Lucarelli", "Mauricio", "Ricardo", "Thales", "Wallace",
      "Facundo", "Federico", "Gonzalo", "Jan", "Luciano", "Matías", "Maximiliano", "Nicolas", "Pablo", "Santiago",
      "Barosz", "Fabian", "Grzegorz", "Jakub", "Jan", "Karol", "Kamil", "Lukasz", "Maciej", "Michal",
      "Paweł", "Piotr", "Tomasz", "Wilfredo", "Bartosz", "Mateusz", "Damian", "Krzysztof", "Marcin", "Szymon"
    ],
    lastNames: [
      "Ivonovic", "Muserskiy", "Silva", "Smith", "Kovacevic", "Gomez", "Zaytsev", "Bieniek", "Rezende", "Ngapeth",
      "Christenson", "Atanasijevic", "Marouf", "Nishida", "Takahashi", "Ishikawa", "Leon", "Leal", "Lopez", "Juantorena",
      "Ferreira", "Tillie", "Chinenyeze", "Toniutti", "Grebennikov", "Brizard", "Patry", "Clavenot", "Jia", "Lyu",
      "Shoji", "DeFalco", "Jaeschke", "Sunder", "Russell", "Averill", "Holt", "Muagututia", "Smith", "Jendryk",
      "Giannelli", "Michieletto", "Lavia", "Anzani", "Balaso", "Galassi", "Romanò", "Bottolo", "Sbertoli", "Rychlicki",
      "Podrascanin", "Lisinac", "Luburic", "Ivovic", "Katic", "Petric", "Majstorovic", "Pekovic", "Batak", "Todorovic",
      "Sokolov", "Nikolov", "Gotsev", "Skrimov", "Grozdanov", "Seganov", "Ivanov", "Karakashev", "Yosifov", "Bratoev",
      "Volkov", "Mikhaylov", "Kliuka", "Pankov", "Yakovlev", "Poletaev", "Kurkaev", "Semyshev", "Kobzar", "Eremin",
      "Lucarelli", "Bruninho", "Isac", "Thales", "Mauricio", "Flavio", "Maique", "Fernando", "Alan", "Roque",
      "De Cecco", "Conte", "Sole", "Poglajen", "Mendez", "Danani", "Loser", "Lima", "Sanchez", "Ramos",
      "Kurek", "Kubiak", "Sliwka", "Semeniuk", "Zatorski", "Drzyzga", "Lomacz", "Kochanowski", "Huber", "Kaczmarek",
      "Muzaj", "Bednorz", "Fornal", "Nowakowski", "Konarski", "Szalpuk", "Kwolek", "Janusz", "Popiwczak", "Usowicz"
    ]
  }
};

// Tracking nama unik agar tidak duplikat
const generatedPlayerNames = new Set();

function getRandomForeignCountry() {
  const foreignCountries = COUNTRIES.filter(c => c.name !== 'Indonesia');
  return foreignCountries[Math.floor(Math.random() * foreignCountries.length)];
}

function generateUniqueName(isForeign = false) {
  const db = isForeign ? NAMES_DATABASE.foreign : NAMES_DATABASE.indonesia;
  let attempts = 0;

  while (attempts < 1000) {
    const fn = db.firstNames[Math.floor(Math.random() * db.firstNames.length)];
    const ln = db.lastNames[Math.floor(Math.random() * db.lastNames.length)];
    const fullName = `${fn} ${ln}`;

    if (!generatedPlayerNames.has(fullName)) {
      generatedPlayerNames.add(fullName);
      return fullName;
    }
    attempts++;
  }

  const fallback = `${isForeign ? 'Foreign' : 'Lokal'} Player ${generatedPlayerNames.size + 1}`;
  generatedPlayerNames.add(fallback);
  return fallback;
}

function createRandomPlayer(idPrefix, allowedTiers = null, fixedCountry = null, position = null) {
  // 1. Tentukan Kebangsaan
  let countryObj;
  if (fixedCountry) {
    countryObj = COUNTRIES.find(c => c.name === fixedCountry) || COUNTRIES[0];
  } else {
    countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  }

  const isForeign = countryObj.name !== 'Indonesia';

  // 2. Buat nama unik berdasarkan status WNA/Lokal
  const playerName = generateUniqueName(isForeign);

  // 3. Tentukan Tier dan OVR
  const tierKeys = allowedTiers || Object.keys(TIERS);
  const tier = tierKeys[Math.floor(Math.random() * tierKeys.length)];
  const tierInfo = TIERS[tier];

  const ovr = Math.floor(Math.random() * (tierInfo.max - tierInfo.min + 1)) + tierInfo.min;
  const pos = position || POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

  // 4. Hitung Stat Skill
  const skills = {
    spike: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
    block: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
    serve: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4))),
    receive: Math.min(110, Math.max(20, ovr + Math.floor(Math.random() * 8 - 4)))
  };

  return {
    id: `${idPrefix}_${Math.random().toString(36).substr(2, 9)}`,
    name: playerName,
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
