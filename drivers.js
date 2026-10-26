/**
 * DRIVERS GENERATOR
 */

const DRIVER_FIRST_NAMES = [
  'Rizky', 'Budi', 'Agus', 'Cecep', 'Ujang', 'Dadan', 'Eko', 'Asep',
  'Doni', 'Fajar', 'Galih', 'Hendrik', 'Indra', 'Joko', 'Kevin', 'Lukman',
  'Maman', 'Niko', 'Oki', 'Pratama', 'Rendy', 'Sutisna', 'Taufik', 'Yudi',
  'Adzka', 'Gilang', 'Rian', 'Fahmi', 'Aris', 'Bayu', 'Dian', 'Hendra'
];

const DRIVER_LAST_NAMES = [
  'Pratama', 'Santoso', 'Hidayat', 'Kurniawan', 'Saputra', 'Wijaya', 'Sutrisno',
  'Nugraha', 'Setiawan', 'Ramadhan', 'Firmansyah', 'Budiman', 'Suherman',
  'Gunawan', 'Permana', 'Suryana', 'Kusuma', 'Hardianto', 'Subagja', 'Wibowo'
];

const DRIVER_SKILLS = [
  { name: 'Late Braker', desc: 'Agresif di tikungan tajam.' },
  { name: 'Tire Whisperer', desc: 'Ban awet 25% lebih lama.' },
  { name: 'Drafting Master', desc: 'Boost top speed saat mengekor lawan.' },
  { name: 'Clutch God', desc: 'Akselerasi cepat dari gigi rendah.' },
  { name: 'Apex Hunter', desc: 'Kecepatan keluar tikungan tinggi.' },
  { name: 'Smooth Operator', desc: 'Suhu mesin lebih dingin.' }
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDriver(id) {
  const firstName = getRandomElement(DRIVER_FIRST_NAMES);
  const lastName = getRandomElement(DRIVER_LAST_NAMES);
  const skill = getRandomElement(DRIVER_SKILLS);

  return {
    id: id || 'drv_' + Math.random().toString(36).substr(2, 9),
    name: `${firstName} "${skill.name}" ${lastName}`,
    shortName: firstName,
    skillName: skill.name,
    skillDesc: skill.desc
  };
}

window.generateRandomDriver = generateRandomDriver;
