/**
 * TEAMS GENERATOR (12 TEAMS x 2 CARS = 24 CARS TOTAL)
 */

const TEAM_PREFIXES = [
  'Garuda', 'Maju Jaya', 'Siamar', 'Pasundan', 'Priangan', 'Nusantara',
  'Speed', 'Apex', 'Turbo', 'Overdrive', 'Velocity', 'Sleeper', 'Redline',
  'Padjadjaran', 'Bumi Siliwangi', 'Priangan Timur', 'Galuh', 'Siliwangi'
];

const TEAM_LOCATIONS = [
  'Bandung', 'Ciamis', 'Tasikmalaya', 'Garut', 'Sukabumi', 'Jakarta',
  'Surabaya', 'Semarang', 'Jogja', 'Majalengka', 'Sumedang', 'Bogor'
];

const TEAM_SUFFIXES = [
  'Racing Team', 'Motorsport', 'Speedworks', 'Garage', 'Tuning Lab',
  'Engineering', 'Project', 'Performance', 'Squad', 'Racing Club'
];

const LIVERY_COLORS = [
  '#00f0ff', '#ff2a5f', '#ffb703', '#10b981', '#a855f7', '#ec4899',
  '#3b82f6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16', '#eab308'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomTeamName() {
  const prefix = getRandomElement(TEAM_PREFIXES);
  const location = getRandomElement(TEAM_LOCATIONS);
  const suffix = getRandomElement(TEAM_SUFFIXES);
  return `${prefix} ${location} ${suffix}`;
}

// Generate 12 Tim Balap, Masing-Masing Membawa 2 Mobil & 2 Joki
function generate12Teams() {
  const teams = [];
  const carCatalog = window.CAR_MARKET || [];

  for (let i = 0; i < 12; i++) {
    const teamName = generateRandomTeamName();
    const color = LIVERY_COLORS[i % LIVERY_COLORS.length];

    // Setiap tim punya 2 mobil dan 2 joki
    const carTypeA = getRandomElement(carCatalog);
    const carTypeB = getRandomElement(carCatalog);

    const driverA = window.generateRandomDriver(`d_${i + 1}_1`);
    const driverB = window.generateRandomDriver(`d_${i + 1}_2`);

    teams.push({
      id: `team_${i + 1}`,
      teamName: teamName,
      liveryColor: color,
      cars: [
        {
          carNumber: (i + 1) * 2 - 1,
          model: carTypeA ? carTypeA.name : 'Toyota Avanza Veloz',
          topSpeed: carTypeA ? carTypeA.baseSpeed : 140,
          driver: driverA
        },
        {
          carNumber: (i + 1) * 2,
          model: carTypeB ? carTypeB.name : 'Honda Civic Type R',
          topSpeed: carTypeB ? carTypeB.baseSpeed : 235,
          driver: driverB
        }
      ]
    });
  }
  return teams;
}

window.generate12Teams = generate12Teams;
