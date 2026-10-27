// Bank nama dan generator 30 Pembalap (2 per tim) dengan Trait/Keahlian Unik
const DRIVER_FIRST_NAMES = `["Adam", "Alex", "Andrew", "Anthony", "Austin", "Benjamin", "Brian", "Bryan", "Charles", 
                            "Christian", "Christopher", "Daniel", "David", "Dylan", "Ethan", "Gabriel", "George", "Henry", 
                            "Jack", "Jacob", "James", "Jason", "John", "Jonathan", "Jordan", "Joseph", "Joshua", "Justin", 
                            "Kevin", "Liam", "Logan", "Lucas", "Matthew", "Michael", "Nathan", "Nicholas", "Noah", "Oliver", "Patrick", "Paul"]`;
const DRIVER_LAST_NAMES = `["Adams", "Anderson", "Baker", "Brown", "Campbell", "Carter", "Clark", "Collins", "Davis", "Evans", 
                            "Fisher", "Garcia", "Gibson", "Graham", "Green", "Hall", "Harris", "Hill", "Jackson", "Johnson", 
                            "Jones", "King", "Lee", "Lewis", "Lopez", "Martin", "Miller", "Mitchell", "Moore", "Nelson", "Parker", 
                            "Perez", "Phillips", "Roberts", "Robinson", "Rodriguez", "Scott", "Smith", "Stewart", "Taylor", "Thomas", 
                            "Thompson", "Turner", "Walker", "Ward", "Watson", "White", "Williams", "Wilson", "Wright"]`;

// Daftar Keahlian / Trait Unik Pembalap
const DRIVER_TRAITS = [
  { id: "overtaker", name: "Raja Overtake", desc: "Bonus kecepatan saat melakukan manuver menyalip" },
  { id: "tire_whisperer", name: "Penyayang Ban", desc: "Mengurangi tingkat kehausan ban saat push" },
  { id: "smooth_operator", name: "Manajemen Mesin", desc: "Menjaga suhu mesin dan efisiensi bahan bakar" },
  { id: "rain_master", name: "Ahli Lintasan Basah", desc: "Performa maksimal saat kondisi cuaca buruk" },
  { id: "defensive_wall", name: "Benteng Kokoh", desc: "Sangat sulit disalip oleh pembalap di belakangnya" },
  { id: "qualifying_hero", name: "Spesialis Single Lap", desc: "Mendapat bonus kecepatan ekstra di lap-lap awal" },
  { id: "consistent_king", name: "Raja Konsistensi", desc: "Jarang membuat kesalahan atau waktu lap meleset" }
];

function getRandomTrait() {
  const randomIndex = Math.floor(Math.random() * DRIVER_TRAITS.length);
  return DRIVER_TRAITS[randomIndex];
}

function generateDriverRoster() {
  const drivers = [];
  let driverId = 1;

  if (typeof TEAMS_DATA !== "undefined" && Array.isArray(TEAMS_DATA)) {
    TEAMS_DATA.forEach(team => {
      for (let carNum = 1; carNum <= 2; carNum++) {
        const fname = DRIVER_FIRST_NAMES[Math.floor(Math.random() * DRIVER_FIRST_NAMES.length)];
        const lname = DRIVER_LAST_NAMES[Math.floor(Math.random() * DRIVER_LAST_NAMES.length)];
        
        // Pilih trait unik acak untuk pembalap ini
        const specialTrait = getRandomTrait();

        drivers.push({
          id: `drv_${driverId}`,
          name: `${fname} ${lname}`,
          teamId: team.id,
          carNumber: (driverId * 2) - (2 - carNum),
          aggression: Math.floor(Math.random() * 30) + 70, // 70-100
          tireCare: Math.floor(Math.random() * 30) + 70,
          consistency: Math.floor(Math.random() * 30) + 70,
          salaryPerRace: 15000000 + Math.floor(Math.random() * 10) * 1000000,
          contractPatience: 3,
          trait: specialTrait // Keahlian unik yang sudah di-random
        });
        driverId++;
      }
    });
  }

  return drivers;
}

const INITIAL_DRIVERS = generateDriverRoster();
