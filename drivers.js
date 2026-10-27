// Bank nama dan generator 30 Pembalap (2 per tim)
const DRIVER_FIRST_NAMES = ["Asep", "Cecep", "Ujang", "Dadang", "Iwan", "Eza", "Agus", "Budi", "Dede", "Eko", "Ferry", "Ginanjar", "Hery", "Iman", "Joko"];
const DRIVER_LAST_NAMES = ["Supardi", "Hidayat", "Santoso", "Kurnia", "Pratama", "Ramdani", "Setiawan", "Suryana", "Wijaya", "Firmansyah", "Nugraha", "Saputra"];

function generateDriverRoster() {
  const drivers = [];
  let driverId = 1;

  TEAMS_DATA.forEach(team => {
    for (let carNum = 1; carNum <= 2; carNum++) {
      const fname = DRIVER_FIRST_NAMES[Math.floor(Math.random() * DRIVER_FIRST_NAMES.length)];
      const lname = DRIVER_LAST_NAMES[Math.floor(Math.random() * DRIVER_LAST_NAMES.length)];
      
      drivers.push({
        id: `drv_${driverId}`,
        name: `${fname} ${lname}`,
        teamId: team.id,
        carNumber: (driverId * 2) - (2 - carNum),
        aggression: Math.floor(Math.random() * 30) + 70, // 70-100
        tireCare: Math.floor(Math.random() * 30) + 70,
        consistency: Math.floor(Math.random() * 30) + 70,
        salaryPerRace: 15000000 + Math.floor(Math.random() * 10) * 1000000,
        contractPatience: 3
      });
      driverId++;
    }
  });

  return drivers;
}

const INITIAL_DRIVERS = generateDriverRoster();
