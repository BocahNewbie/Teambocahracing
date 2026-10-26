/**
 * TEAMS GENERATOR
 */

const TEAM_PREFIXES = [
  'Garuda', 'Maju Jaya', 'Siamar', 'Pasundan', 'Priangan', 'Nusantara',
  'Speed', 'Apex', 'Turbo', 'Overdrive', 'Velocity', 'Sleeper', 'Redline'
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
  '#00f0ff', '#ff2a5f', '#ffb703', '#10b981', '#a855f7', '#ec4899', '#3b82f6', '#f97316'
];

function generateRandomTeamName() {
  const prefix = getRandomElement(TEAM_PREFIXES);
  const location = getRandomElement(TEAM_LOCATIONS);
  const suffix = getRandomElement(TEAM_SUFFIXES);
  
  // Format nama acak: Misal "Garuda Bandung Motorsport" atau "Pasundan Speedworks"
  const formats = [
    `${prefix} ${location} ${suffix}`,
    `${prefix} ${suffix}`,
    `${location} ${suffix}`
  ];
  
  return getRandomElement(formats);
}

// Fungsi generate daftar tim lawan balapan (Grid Rival)
function generateRivalTeams(count = 4) {
  const rivals = [];
  for (let i = 0; i < count; i++) {
    const randomCar = getRandomElement(window.CAR_MARKET || []);
    const randomDriver = window.generateRandomDriver(`rival_drv_${i}`);
    
    rivals.push({
      id: `rival_team_${i + 1}`,
      teamName: generateRandomTeamName(),
      liveryColor: LIVERY_COLORS[i % LIVERY_COLORS.length],
      car: randomCar ? { ...randomCar } : null,
      driver: randomDriver
    });
  }
  return rivals;
}

window.generateRandomTeamName = generateRandomTeamName;
window.generateRivalTeams = generateRivalTeams;
