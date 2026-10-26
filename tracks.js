const TRACKS_DATA = {
  sentul: {
    name: "Sirkuit Sentul",
    // Titik koordinat (x, y) yang membentuk jalur lintasan
    waypoints: [
      { x: 100, y: 400 }, // Straight line
      { x: 600, y: 400 },
      { x: 720, y: 350 }, // Tikungan 1 (Right turn)
      { x: 720, y: 150 },
      { x: 650, y: 100 }, // Chicane / Infield
      { x: 500, y: 250 },
      { x: 350, y: 100 },
      { x: 100, y: 100 }, // Hairpin back to start
    ]
  },
  mandalika: {
    name: "Sirkuit Mandalika",
    waypoints: [
      { x: 100, y: 420 },
      { x: 500, y: 420 },
      { x: 650, y: 300 }, // S-Curves / Flowing turns
      { x: 730, y: 400 },
      { x: 750, y: 150 },
      { x: 400, y: 80 },
      { x: 250, y: 220 },
      { x: 100, y: 150 }
    ]
  },
  bandung: {
    name: "Street Circuit Bandung",
    waypoints: [
      { x: 150, y: 400 },
      { x: 650, y: 400 }, // Main straight
      { x: 650, y: 250 }, // 90-degree street turn
      { x: 450, y: 250 },
      { x: 450, y: 100 }, // Roundabout / Square loop
      { x: 150, y: 100 }
    ]
  }
};
