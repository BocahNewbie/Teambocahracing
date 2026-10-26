/**
 * DRIVERS GENERATOR
 */

const DRIVER_FIRST_NAMES = [
  'Rizky', 'Budi', 'Agus', 'Cecep', 'Ujang', 'Dadan', 'Eko', 'Asep',
  'Doni', 'Fajar', 'Galih', 'Hendrik', 'Indra', 'Joko', 'Kevin', 'Lukman',
  'Maman', 'Niko', 'Oki', 'Pratama', 'Rendy', 'Sutisna', 'Taufik', 'Yudi'
];

const DRIVER_LAST_NAMES = [
  'Pratama', 'Santoso', 'Hidayat', 'Kurniawan', 'Saputra', 'Wijaya', 'Sutrisno',
  'Nugraha', 'Setiawan', 'Ramadhan', 'Firmansyah', 'Budiman', 'Suherman',
  'Gunawan', 'Permana', 'Suryana', 'Kusuma', 'Hardianto', 'Subagja', 'Wibowo'
];

const DRIVER_SKILLS = [
  { name: 'Late Braker', desc: 'Sangat agresif di tikungan tajam.' },
  { name: 'Tire Whisperer', desc: 'Mengurangi keausan ban sebesar 25%.' },
  { name: 'Drafting Master', desc: 'Mendapat boost kecepatan saat mengekor lawan.' },
  { name: 'Clutch God', desc: 'Akselerasi perpindahan gigi lebih cepat.' },
  { name: 'Apex Hunter', desc: 'Kecepatan keluar tikungan lebih optimal.' },
  { name: 'Smooth Operator', desc: 'Suhu mesin lebih stabil dan minim resiko overheat.' }
];

// Helper fungsi acak array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fungsi membuat 1 driver acak
function generateRandomDriver(id) {
  const firstName = getRandomElement(DRIVER_FIRST_NAMES);
  const lastName = getRandomElement(DRIVER_LAST_NAMES);
  const skill = getRandomElement(DRIVER_SKILLS);

  return {
    id: id || 'drv_' + Math.random().toString(36).substr(2, 9),
    name: `${firstName} "${skill.name}" ${lastName}`,
    shortName: firstName,
    skillName: skill.name,
    skillDesc: skill.desc,
    aggression: (Math.random() * 0.4 + 0.6).toFixed(2), // 0.60 - 1.00
    consistency: (Math.random() * 0.3 + 0.7).toFixed(2)  // 0.70 - 1.00
  };
}

// Fungsi generate sekumpulan kandidat driver
function generateDriverCandidates(count = 5) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(generateRandomDriver(`d_${i + 1}`));
  }
  return list;
}

window.generateRandomDriver = generateRandomDriver;
window.generateDriverCandidates = generateDriverCandidates;
