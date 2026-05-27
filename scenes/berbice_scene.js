// =============================================================
// BERBICE SCENE - the Guyanese homestead
// =============================================================
// A bottom-house in Berbice, near the river. Sugar cane fields
// in the distance, mango tree in the yard, jhandi flags, the
// brown Berbice River winding past with a moored boat.
// =============================================================

class BerbiceScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BerbiceScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.physics.world.setBounds(0, 0, W, H);

    // === BUILD THE WORLD (back to front) ===
    this.createSky();
    this.createSugarCaneFields();
    this.createDistantTreeline();
    this.createRiver();
    this.createGround();
    this.createNeighborHouse(W * 0.85, H * 0.4);
    this.createTrench(W * 0.5, H * 0.78);
    this.createBottomHouse(W * 0.25, H * 0.55);
    this.createJhandiFlag(W * 0.32, H * 0.7);
    this.tree = this.createMangoTree(W * 0.55, H * 0.6);
    this.mangos = this.createMangos();
    this.createGoat(W * 0.7, H * 0.78);
    this.createJetty(W * 0.92, H * 0.85);
    this.grandpa = this.createGrandpa(W * 0.25, H * 0.68);
    this.mailbox = this.createMailbox(W * 0.12, H * 0.85);
    this.player = this.createPlayer(W * 0.45, H * 0.85);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, W, H);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC,J');

    this.nearMango = null;
    this.nearGrandpa = false;
    this.nearMailbox = false;

    document.getElementById('loading').classList.add('hidden');
    if (gameState.firstVisit) {
      document.getElementById('title-card').classList.remove('hidden');
    } else {
      this.showFirstDialogAfterLoad();
    }

    // Idle grandpa lines every 35 seconds
    this.time.addEvent({
      delay: 35000,
      callback: () => {
        if (!this.nearGrandpa && Math.random() < 0.4 && !document.getElementById('dialog-box').classList.contains('visible')) {
          const line = GRANDPA_IDLE_LINES[Math.floor(Math.random() * GRANDPA_IDLE_LINES.length)];
          showDialog("GRANDPA", line, 5000);
        }
      },
      loop: true,
    });
  }

  showFirstDialogAfterLoad() {
    if (gameState.discovered.length === 0) {
      this.time.delayedCall(800, () => {
        showDialog("GRANDPA", "You're back. Pick a mango — listen to its story.", 4000);
      });
    }
  }

  // ============================================================
  // SKY - bright vibrant tropical Guyanese sky
  // ============================================================
  createSky() {
    const W = this.scale.width;
    const H = this.scale.height;
    const sky = this.add.graphics();
    // Bright saturated tropical sky - pink-orange sunset gradient at top, vibrant blue below
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      let r, g, b;
      if (t < 0.3) {
        // Top - pink/peach
        const tt = t / 0.3;
        r = Phaser.Math.Linear(255, 255, tt);
        g = Phaser.Math.Linear(180, 200, tt);
        b = Phaser.Math.Linear(150, 180, tt);
      } else if (t < 0.7) {
        // Middle - warm golden
        const tt = (t - 0.3) / 0.4;
        r = Phaser.Math.Linear(255, 255, tt);
        g = Phaser.Math.Linear(200, 220, tt);
        b = Phaser.Math.Linear(180, 200, tt);
      } else {
        // Lower sky - bright sky blue
        const tt = (t - 0.7) / 0.3;
        r = Phaser.Math.Linear(255, 180, tt);
        g = Phaser.Math.Linear(220, 220, tt);
        b = Phaser.Math.Linear(200, 240, tt);
      }
      sky.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      sky.fillRect(0, i * (H / 2) / 60, W, (H / 2) / 60 + 2);
    }

    // Fluffy clouds
    sky.fillStyle(0xffffff, 0.85);
    sky.fillCircle(W * 0.15, H * 0.12, 22);
    sky.fillCircle(W * 0.18, H * 0.11, 18);
    sky.fillCircle(W * 0.12, H * 0.13, 16);
    sky.fillCircle(W * 0.65, H * 0.08, 18);
    sky.fillCircle(W * 0.68, H * 0.09, 22);
    sky.fillCircle(W * 0.62, H * 0.10, 14);
    sky.fillStyle(0xffffff, 0.6);
    sky.fillCircle(W * 0.4, H * 0.18, 14);
    sky.fillCircle(W * 0.43, H * 0.17, 18);

    // A bright sun in the sky
    const sun = this.add.graphics();
    sun.fillStyle(0xffe88a, 0.4);
    sun.fillCircle(W * 0.78, H * 0.18, 55);
    sun.fillStyle(0xffe88a, 0.6);
    sun.fillCircle(W * 0.78, H * 0.18, 40);
    sun.fillStyle(0xfff4c8);
    sun.fillCircle(W * 0.78, H * 0.18, 28);
    sun.fillStyle(0xffffff);
    sun.fillCircle(W * 0.78, H * 0.18, 18);
  }

  // ============================================================
  // SUGAR CANE FIELDS - the labor history, in the background
  // ============================================================
  createSugarCaneFields() {
    const W = this.scale.width;
    const H = this.scale.height;
    const fields = this.add.graphics();

    // Far cane (lush bright yellow-green)
    fields.fillStyle(0xc8e060);
    fields.fillRect(0, H * 0.35, W, H * 0.1);

    // Mid cane - vibrant lime
    fields.fillStyle(0xa8d048);
    fields.fillRect(0, H * 0.42, W, H * 0.08);

    // Cane stalks
    fields.fillStyle(0x8ab838, 0.7);
    for (let x = 0; x < W; x += 3) {
      const h = 4 + Math.sin(x * 0.5) * 2;
      fields.fillRect(x, H * 0.38, 1, h);
    }
    fields.fillStyle(0x70a030);
    for (let x = 1; x < W; x += 5) {
      const h = 6 + Math.sin(x * 0.3) * 3;
      fields.fillRect(x, H * 0.43, 1, h);
    }
    // Cane top flowers - bright yellow-white tops
    fields.fillStyle(0xfff088);
    for (let x = 0; x < W; x += 8) {
      fields.fillRect(x, H * 0.36, 1, 2);
    }
  }

  // ============================================================
  // DISTANT TREELINE - lush vibrant rainforest border
  // ============================================================
  createDistantTreeline() {
    const W = this.scale.width;
    const H = this.scale.height;
    const trees = this.add.graphics();
    // Lush vibrant rainforest - bright tropical green
    trees.fillStyle(0x4a9a4a);
    trees.beginPath();
    trees.moveTo(0, H * 0.45);
    for (let x = 0; x <= W; x += 6) {
      const h = Math.sin(x * 0.04) * 18 + Math.sin(x * 0.09) * 8 + 35;
      trees.lineTo(x, H * 0.45 - h);
    }
    trees.lineTo(W, H * 0.45);
    trees.closePath();
    trees.fillPath();

    // Treetop highlights - brighter green
    trees.fillStyle(0x70c060);
    for (let x = 5; x < W; x += 15) {
      const h = Math.sin(x * 0.04) * 18 + 25;
      trees.fillCircle(x, H * 0.45 - h + 5, 4);
    }
    // Even brighter highlights
    trees.fillStyle(0x90d870);
    for (let x = 10; x < W; x += 30) {
      const h = Math.sin(x * 0.04) * 18 + 22;
      trees.fillCircle(x, H * 0.45 - h + 3, 2);
    }
    // Scattered tropical flowers in the treeline (red/orange specks)
    trees.fillStyle(0xff6048);
    for (let x = 20; x < W; x += 80) {
      const h = Math.sin(x * 0.04) * 18 + 15;
      trees.fillCircle(x, H * 0.45 - h, 2);
    }
    trees.fillStyle(0xffa840);
    for (let x = 50; x < W; x += 120) {
      const h = Math.sin(x * 0.04) * 18 + 18;
      trees.fillCircle(x, H * 0.45 - h, 2);
    }
  }

  // ============================================================
  // BERBICE RIVER - still brown (geographically accurate) but with bright reflections
  // ============================================================
  createRiver() {
    const W = this.scale.width;
    const H = this.scale.height;
    const river = this.add.graphics();

    // Berbice rivers are warm brown but with sunlight reflections
    river.fillStyle(0xa07040);  // warmer, more saturated brown
    river.fillRect(0, H * 0.45, W, H * 0.15);

    // Sunlight reflection band
    river.fillStyle(0xffd070, 0.5);
    river.fillRect(0, H * 0.48, W, 8);

    // Current sparkles
    river.fillStyle(0xfff088, 0.6);
    for (let i = 0; i < 60; i++) {
      const x = (i * 47) % W;
      const y = H * 0.46 + (i * 11) % (H * 0.12);
      river.fillRect(x, y, 3, 1);
    }

    // Lighter current lines
    river.fillStyle(0xc88858, 0.7);
    for (let y = H * 0.47; y < H * 0.58; y += 4) {
      for (let x = 0; x < W; x += 30) {
        const off = (y * 0.5) % 30;
        river.fillRect(x + off, y, 8, 1);
      }
    }

    // Brighter ripple highlights
    river.fillStyle(0xfff4d8, 0.5);
    for (let i = 0; i < 30; i++) {
      const x = (i * 73) % W;
      const y = H * 0.49 + (i * 7) % (H * 0.08);
      river.fillRect(x, y, 12, 1);
    }

    // Far bank - brighter green
    river.fillStyle(0x70a050);
    river.fillRect(0, H * 0.45, W, 3);
  }

  // ============================================================
  // GROUND - vibrant yard with lots of grass and flowers
  // ============================================================
  createGround() {
    const W = this.scale.width;
    const H = this.scale.height;
    const ground = this.add.graphics();

    // Warm earth - more saturated and golden
    ground.fillStyle(0xc89860);
    ground.fillRect(0, H * 0.6, W, H * 0.4);

    // Lush grass patches - bright green
    ground.fillStyle(0x70b048);
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * W;
      const y = H * 0.62 + Math.random() * (H * 0.35);
      ground.fillRect(x, y, 3, 3);
    }
    // Brighter grass highlights
    ground.fillStyle(0x98d860);
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * W;
      const y = H * 0.62 + Math.random() * (H * 0.35);
      ground.fillRect(x, y, 2, 2);
    }
    // Dirt highlights
    ground.fillStyle(0xe0b878);
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * W;
      const y = H * 0.62 + Math.random() * (H * 0.35);
      ground.fillRect(x, y, 4, 2);
    }

    // Wild flowers scattered around the yard - bright colors!
    const flowerColors = [0xff5080, 0xffd040, 0xff8030, 0xc858d8, 0xff80a0];
    for (let i = 0; i < 35; i++) {
      const x = Math.random() * W;
      const y = H * 0.65 + Math.random() * (H * 0.3);
      const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      // Flower petals
      ground.fillStyle(c);
      ground.fillRect(x, y, 2, 2);
      ground.fillRect(x - 2, y, 2, 2);
      ground.fillRect(x + 2, y, 2, 2);
      ground.fillRect(x, y - 2, 2, 2);
      ground.fillRect(x, y + 2, 2, 2);
      // Flower center
      ground.fillStyle(0xffff60);
      ground.fillRect(x, y, 2, 2);
    }
  }

  // ============================================================
  // BOTTOM-HOUSE - the iconic Guyanese stilt house
  // ============================================================
  createBottomHouse(cx, cy) {
    const container = this.add.container(cx, cy);

    // The defining feature: wooden stilts holding up the house,
    // with an open area underneath where life happens

    // Stilts (visible columns)
    const stilts = this.add.graphics();
    stilts.fillStyle(0x6a4828);
    // Four front stilts visible
    stilts.fillRect(-70, 0, 8, 60);
    stilts.fillRect(-30, 0, 8, 60);
    stilts.fillRect(20, 0, 8, 60);
    stilts.fillRect(60, 0, 8, 60);
    // Shading
    stilts.fillStyle(0x4a3018);
    stilts.fillRect(-66, 0, 4, 60);
    stilts.fillRect(-26, 0, 4, 60);
    stilts.fillRect(24, 0, 4, 60);
    stilts.fillRect(64, 0, 4, 60);
    container.add(stilts);

    // Bottom-house shadow (the shaded area under the house)
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillRect(-78, 8, 156, 50);
    container.add(shadow);

    // The house body sitting on the stilts
    const houseW = 170;
    const houseH = 80;
    const body = this.add.graphics();
    // Bright turquoise/teal painted wood - vibrant Guyanese tradition
    body.fillStyle(0x50c0b8);  // bright teal
    body.fillRect(-houseW / 2, -houseH, houseW, houseH);
    // Side shading
    body.fillStyle(0x308880);
    body.fillRect(houseW / 2 - 16, -houseH, 16, houseH);
    // Horizontal plank lines
    body.fillStyle(0x206068, 0.6);
    for (let y = -houseH + 10; y < 0; y += 12) {
      body.fillRect(-houseW / 2, y, houseW, 1);
    }
    // White trim along top
    body.fillStyle(0xf8e8c8);
    body.fillRect(-houseW / 2, -houseH, houseW, 3);
    container.add(body);

    // Window (with frame)
    const window = this.add.graphics();
    window.fillStyle(0xff6840);  // bright coral/orange trim
    window.fillRect(-50, -65, 30, 30);
    // Window panes (warm glow inside)
    window.fillStyle(0xffe888, 0.9);
    window.fillRect(-47, -62, 12, 24);
    window.fillRect(-33, -62, 12, 24);
    // Cross frame
    window.fillStyle(0xff6840);
    window.fillRect(-37, -62, 2, 24);
    window.fillRect(-50, -52, 30, 2);
    container.add(window);

    // Window 2
    const window2 = this.add.graphics();
    window2.fillStyle(0xff6840);
    window2.fillRect(20, -65, 30, 30);
    window2.fillStyle(0xffe888, 0.9);
    window2.fillRect(23, -62, 12, 24);
    window2.fillRect(37, -62, 12, 24);
    window2.fillStyle(0xff6840);
    window2.fillRect(33, -62, 2, 24);
    window2.fillRect(20, -52, 30, 2);
    container.add(window2);

    // Front door (bright color)
    const door = this.add.graphics();
    door.fillStyle(0xb04068);  // bright fuchsia
    door.fillRect(-10, -50, 20, 50);
    door.fillStyle(0x802848);
    door.fillRect(5, -50, 5, 50);
    // Door knob
    door.fillStyle(0xffd068);
    door.fillRect(-2, -28, 2, 2);
    container.add(door);

    // Pitched roof (galvanized zinc - classic Guyanese)
    const roof = this.add.graphics();
    // Roof - silver-grey corrugated zinc
    roof.fillStyle(0x8a8a92);
    roof.beginPath();
    roof.moveTo(-houseW / 2 - 8, -houseH);
    roof.lineTo(0, -houseH - 36);
    roof.lineTo(houseW / 2 + 8, -houseH);
    roof.closePath();
    roof.fillPath();
    // Corrugated lines
    roof.fillStyle(0x6a6a72);
    for (let dx = -houseW / 2; dx < houseW / 2; dx += 6) {
      const t = (dx + houseW / 2) / houseW;
      const y1 = -houseH - 36 * Math.min(t * 2, (1 - t) * 2);
      roof.fillRect(dx, y1, 1, -houseH - y1);
    }
    // Roof shading on right side
    roof.fillStyle(0x6a6a72, 0.4);
    roof.beginPath();
    roof.moveTo(0, -houseH - 36);
    roof.lineTo(houseW / 2 + 8, -houseH);
    roof.lineTo(houseW / 2 - 4, -houseH);
    roof.closePath();
    roof.fillPath();
    container.add(roof);

    // External stairs going up to the door
    const stairs = this.add.graphics();
    stairs.fillStyle(0x7a5838);
    for (let i = 0; i < 5; i++) {
      stairs.fillRect(-houseW / 4 - 10 - i * 4, -10 - i * 12, 20, 12);
    }
    container.add(stairs);

    // Maybe a small wooden chair or bench in the bottom-house area
    const chair = this.add.graphics();
    chair.fillStyle(0x5a3818);
    chair.fillRect(30, 35, 18, 4);  // seat
    chair.fillRect(30, 39, 2, 12);  // legs
    chair.fillRect(46, 39, 2, 12);
    chair.fillRect(30, 25, 2, 10);  // back
    container.add(chair);

    return container;
  }

  // ============================================================
  // JHANDI FLAG - Hindu prayer flag, gentle marker of culture
  // ============================================================
  createJhandiFlag(x, y) {
    const flag = this.add.container(x, y);

    // Bamboo pole
    const pole = this.add.graphics();
    pole.fillStyle(0xc4a878);
    pole.fillRect(-1, 0, 2, 80);
    pole.fillStyle(0x9c8458);
    pole.fillRect(0, 0, 1, 80);
    flag.add(pole);

    // The flag itself - typically white, red, yellow, or orange
    const flagGraphic = this.add.graphics();
    flagGraphic.fillStyle(0xff9040);  // orange/saffron
    flagGraphic.fillTriangle(2, 8, 28, 12, 2, 18);
    flag.add(flagGraphic);

    // Gentle sway
    this.tweens.add({
      targets: flagGraphic,
      scaleX: 0.92,
      duration: 1800,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // A second flag below in white
    const flag2 = this.add.graphics();
    flag2.fillStyle(0xf0e8d8);
    flag2.fillTriangle(2, 28, 22, 32, 2, 36);
    flag.add(flag2);

    this.tweens.add({
      targets: flag2,
      scaleX: 0.92,
      duration: 2200,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return flag;
  }

  // ============================================================
  // MANGO TREE - the centerpiece (same logic as before)
  // ============================================================
  createMangoTree(cx, cy) {
    const container = this.add.container(cx, cy);

    // Trunk
    const trunk = this.add.graphics();
    trunk.fillStyle(0x5a3820);
    trunk.fillRect(-14, -20, 28, 90);
    trunk.fillStyle(0x402810);
    trunk.fillRect(8, -20, 6, 90);
    trunk.fillStyle(0x3a2510);
    trunk.fillRect(-12, 0, 4, 2);
    trunk.fillRect(-4, 20, 4, 2);
    trunk.fillRect(-10, 40, 6, 2);
    container.add(trunk);

    // Branches
    const branches = this.add.graphics();
    branches.lineStyle(10, 0x5a3820);
    branches.beginPath();
    branches.moveTo(0, -20);
    branches.lineTo(-60, -100);
    branches.moveTo(0, -20);
    branches.lineTo(60, -100);
    branches.moveTo(0, -20);
    branches.lineTo(-110, -180);
    branches.moveTo(0, -20);
    branches.lineTo(110, -180);
    branches.moveTo(0, -20);
    branches.lineTo(0, -260);
    branches.strokePath();
    container.add(branches);

    // Canopy - lush vibrant green
    const canopyColors = [0x3a8a40, 0x4ea050, 0x60c060, 0x80d870];
    const canopyOffsets = [
      { x: -130, y: -180, r: 95 },
      { x: 130, y: -180, r: 95 },
      { x: 0, y: -250, r: 95 },
      { x: -60, y: -220, r: 75 },
      { x: 60, y: -220, r: 75 },
      { x: 0, y: -150, r: 80 },
    ];

    canopyOffsets.forEach(c => {
      const leaves = this.add.graphics();
      leaves.fillStyle(canopyColors[0]);
      leaves.fillCircle(c.x, c.y, c.r);
      leaves.fillStyle(canopyColors[1]);
      leaves.fillCircle(c.x - c.r * 0.3, c.y - c.r * 0.2, c.r * 0.6);
      leaves.fillStyle(canopyColors[2]);
      leaves.fillCircle(c.x + c.r * 0.2, c.y - c.r * 0.3, c.r * 0.4);
      leaves.fillStyle(canopyColors[3]);
      leaves.fillCircle(c.x + c.r * 0.3, c.y - c.r * 0.4, c.r * 0.2);
      container.add(leaves);
    });

    // Gentle sway
    this.tweens.add({
      targets: container,
      angle: 1.2,
      duration: 4000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return container;
  }

  // ============================================================
  // MANGOS - clickable fruit
  // ============================================================
  createMangos() {
    const mangos = [];
    const treePos = { x: this.tree.x, y: this.tree.y };

    GUYANESE_GENRES.forEach((genre, idx) => {
      const x = treePos.x + genre.treePos.x;
      const y = treePos.y + genre.treePos.y;
      const isDiscovered = gameState.discovered.includes(genre.id);

      const mango = this.add.container(x, y);

      const stem = this.add.graphics();
      stem.lineStyle(2, 0x5a3820);
      stem.beginPath();
      stem.moveTo(0, -12);
      stem.lineTo(0, -18);
      stem.strokePath();
      mango.add(stem);

      const body = this.add.graphics();
      const baseColor = isDiscovered ? genre.color : 0x6b5440;

      body.fillStyle(baseColor);
      body.fillEllipse(0, 0, 30, 34);
      const darkColor = Phaser.Display.Color.GetColor(
        ((baseColor >> 16) & 0xff) * 0.7,
        ((baseColor >> 8) & 0xff) * 0.7,
        (baseColor & 0xff) * 0.7,
      );
      body.fillStyle(darkColor);
      body.fillEllipse(5, 5, 20, 26);
      const lightColor = Phaser.Display.Color.GetColor(
        Math.min(255, ((baseColor >> 16) & 0xff) * 1.3),
        Math.min(255, ((baseColor >> 8) & 0xff) * 1.3),
        Math.min(255, (baseColor & 0xff) * 1.3),
      );
      body.fillStyle(lightColor);
      body.fillEllipse(-6, -7, 10, 11);
      mango.add(body);

      const glow = this.add.graphics();
      glow.fillStyle(baseColor, 0.4);
      glow.fillCircle(0, 0, 32);
      glow.setVisible(false);
      mango.add(glow);

      const label = this.add.text(0, -40, genre.name.toUpperCase(), {
        fontFamily: 'Georgia',
        fontSize: '14px',
        color: '#ffd97a',
        backgroundColor: 'rgba(40, 25, 15, 0.9)',
        padding: { x: 6, y: 3 },
      });
      label.setOrigin(0.5);
      label.setVisible(false);
      mango.add(label);

      this.tweens.add({
        targets: mango,
        y: y + 3,
        duration: 2000 + idx * 200,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      mango.genreData = genre;
      mango.glowGraphic = glow;
      mango.labelText = label;
      mango.bodyGraphic = body;
      mango.isDiscovered = isDiscovered;
      mango.worldX = x;
      mango.worldY = y;

      mangos.push(mango);
    });

    return mangos;
  }

  // ============================================================
  // NEIGHBOR HOUSE - small house in the distance
  // ============================================================
  createNeighborHouse(cx, cy) {
    const house = this.add.container(cx, cy);

    // Small house on stilts (smaller scale - more distant)
    const stilts = this.add.graphics();
    stilts.fillStyle(0x5a3820);
    stilts.fillRect(-30, 0, 4, 20);
    stilts.fillRect(-10, 0, 4, 20);
    stilts.fillRect(10, 0, 4, 20);
    stilts.fillRect(30, 0, 4, 20);
    house.add(stilts);

    const body = this.add.graphics();
    body.fillStyle(0xffb050);  // bright orange-yellow
    body.fillRect(-40, -35, 80, 35);
    body.fillStyle(0xc88030);
    body.fillRect(30, -35, 10, 35);
    house.add(body);

    // Window
    body.fillStyle(0xffe888, 0.9);
    body.fillRect(-25, -28, 15, 15);
    body.fillRect(10, -28, 15, 15);
    // Window trim
    body.fillStyle(0xc04060);
    body.fillRect(-25, -28, 15, 2);
    body.fillRect(10, -28, 15, 2);

    // Roof
    const roof = this.add.graphics();
    roof.fillStyle(0x7a7a82);
    roof.beginPath();
    roof.moveTo(-44, -35);
    roof.lineTo(0, -55);
    roof.lineTo(44, -35);
    roof.closePath();
    roof.fillPath();
    house.add(roof);

    return house;
  }

  // ============================================================
  // TRENCH - the drainage canal that runs along every Guyanese road
  // ============================================================
  createTrench(cx, cy) {
    const trench = this.add.graphics();
    // Long thin canal of standing water
    trench.fillStyle(0x4a5840);
    trench.fillRect(cx - 200, cy - 4, 400, 8);
    trench.fillStyle(0x6a7a55);
    trench.fillRect(cx - 200, cy - 4, 400, 1);
    // Lily pads (Guyana's famous Victoria amazonica)
    trench.fillStyle(0x3a5a30);
    for (let i = 0; i < 5; i++) {
      const x = cx - 180 + i * 80;
      trench.fillCircle(x, cy, 6);
    }
    return trench;
  }

  // ============================================================
  // GOAT - a yard animal
  // ============================================================
  createGoat(cx, cy) {
    const goat = this.add.container(cx, cy);

    const body = this.add.graphics();
    // Body
    body.fillStyle(0xc4a878);
    body.fillRect(-12, -6, 22, 10);
    body.fillStyle(0xa48858);
    body.fillRect(-12, -2, 22, 4);
    // Head
    body.fillStyle(0xc4a878);
    body.fillRect(8, -10, 8, 8);
    body.fillStyle(0xa48858);
    body.fillRect(14, -10, 2, 8);
    // Horns
    body.fillStyle(0x5a4828);
    body.fillRect(10, -14, 2, 4);
    body.fillRect(14, -14, 2, 4);
    // Legs
    body.fillRect(-10, 4, 2, 6);
    body.fillRect(-4, 4, 2, 6);
    body.fillRect(4, 4, 2, 6);
    body.fillRect(8, 4, 2, 6);
    // Eye
    body.fillStyle(0x1a1010);
    body.fillRect(12, -7, 1, 1);
    goat.add(body);

    // Tiny head wobble
    this.tweens.add({
      targets: body,
      x: 1,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return goat;
  }

  // ============================================================
  // JETTY - wooden pier with the boat
  // ============================================================
  createJetty(cx, cy) {
    const jetty = this.add.container(cx, cy);

    // Wooden planks extending out into the river
    const planks = this.add.graphics();
    planks.fillStyle(0x6a4828);
    planks.fillRect(-60, -8, 70, 12);
    // Plank lines
    planks.fillStyle(0x4a3018);
    for (let x = -55; x < 10; x += 8) {
      planks.fillRect(x, -8, 1, 12);
    }
    // Posts at the end (sticking up)
    planks.fillRect(-58, -16, 4, 12);
    planks.fillRect(-30, -16, 4, 12);
    planks.fillRect(-2, -16, 4, 12);
    jetty.add(planks);

    // The boat - small wooden river boat
    const boat = this.add.graphics();
    // Hull
    boat.fillStyle(0x8a5838);
    boat.fillRect(-90, -20, 36, 8);
    boat.fillStyle(0x6a3818);
    boat.fillRect(-90, -14, 36, 2);
    // Curved bow/stern
    boat.fillTriangle(-94, -14, -90, -20, -90, -12);
    boat.fillTriangle(-50, -14, -54, -20, -54, -12);
    // Interior
    boat.fillStyle(0xa86848);
    boat.fillRect(-86, -18, 28, 4);
    jetty.add(boat);

    // Subtle bobbing
    this.tweens.add({
      targets: boat,
      y: -2,
      duration: 2000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Hint label
    const label = this.add.text(-30, -40, "(boat — not yet)", {
      fontFamily: 'Georgia',
      fontSize: '11px',
      color: '#a89878',
      fontStyle: 'italic',
    });
    label.setOrigin(0.5);
    jetty.add(label);

    return jetty;
  }

  // ============================================================
  // GRANDPA - sitting in the bottom-house
  // Younger man, salt-and-pepper hair, blue jeans, fun graphic tee
  // ============================================================
  createGrandpa(x, y) {
    const grandpa = this.add.container(x, y);

    const body = this.add.graphics();

    // Shadow
    body.fillStyle(0x000000, 0.3);
    body.fillEllipse(0, 18, 28, 6);

    // Blue jeans - sitting cross-legged
    body.fillStyle(0x3a5a8a);  // classic denim blue
    body.fillRect(-12, 4, 24, 14);
    // Denim shading
    body.fillStyle(0x2a4068);
    body.fillRect(8, 4, 4, 14);
    // Denim seam highlights
    body.fillStyle(0x5878a8);
    body.fillRect(-12, 4, 24, 1);
    body.fillRect(0, 4, 1, 14);

    // Graphic T-shirt - bright red with a yellow design
    body.fillStyle(0xd83048);  // vibrant red
    body.fillRect(-10, -8, 20, 14);
    body.fillStyle(0xa82038);  // shading
    body.fillRect(6, -8, 4, 14);
    // Yellow graphic on the shirt (abstract sun/burst design)
    body.fillStyle(0xffc830);
    body.fillRect(-4, -3, 8, 5);
    body.fillRect(-3, -5, 6, 2);
    body.fillRect(-2, 2, 4, 2);
    body.fillStyle(0xff8040);
    body.fillRect(-2, -2, 4, 3);

    // Sleeves visible at top of arms
    body.fillStyle(0xd83048);
    body.fillRect(-11, -8, 2, 5);
    body.fillRect(9, -8, 2, 5);

    // Head - Indo-Guyanese skin tone, younger face
    body.fillStyle(0xb47840);
    body.fillRect(-7, -22, 14, 14);
    body.fillStyle(0x946028);
    body.fillRect(4, -22, 3, 14);

    // Hair - salt-and-pepper (dark base with gray streaks)
    // Base dark brown/black
    body.fillStyle(0x2a1810);
    body.fillRect(-7, -23, 14, 4);
    body.fillRect(-7, -19, 2, 2);
    body.fillRect(5, -19, 2, 2);
    // Gray streaks mixed in (salt-and-pepper effect)
    body.fillStyle(0x9ca0a8);
    body.fillRect(-5, -22, 1, 2);
    body.fillRect(-2, -23, 1, 2);
    body.fillRect(1, -22, 1, 1);
    body.fillRect(3, -23, 1, 2);
    body.fillRect(-6, -19, 1, 1);

    // Eyes - bright, alert (younger man)
    body.fillStyle(0x1a1008);
    body.fillRect(-4, -16, 2, 2);
    body.fillRect(2, -16, 2, 2);

    // Subtle stubble/light beard along jawline
    body.fillStyle(0x6a4828, 0.5);
    body.fillRect(-5, -10, 10, 1);

    // Mouth - relaxed smile
    body.fillStyle(0x6c3820);
    body.fillRect(-2, -11, 4, 1);

    grandpa.add(body);

    // Gentle breathing animation
    this.tweens.add({
      targets: body,
      scaleY: 1.04,
      duration: 2500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return grandpa;
  }

  // ============================================================
  // MAILBOX
  // ============================================================
  createMailbox(x, y) {
    const mailbox = this.add.container(x, y);

    const post = this.add.graphics();
    post.fillStyle(0x5a3820);
    post.fillRect(-3, 0, 6, 30);
    mailbox.add(post);

    const box = this.add.graphics();
    box.fillStyle(0xc44a4a);
    box.fillRect(-15, -18, 30, 18);
    box.fillStyle(0xa43838);
    box.fillRect(10, -18, 5, 18);
    box.fillCircle(0, -18, 15);
    box.fillStyle(0xa43838);
    box.fillCircle(8, -22, 8);
    box.fillStyle(0x2a1010);
    box.fillRect(-10, -10, 20, 2);
    box.fillStyle(0xfff4d8);
    box.fillRect(-3, -6, 1, 4);
    box.fillRect(-1, -5, 1, 2);
    box.fillRect(1, -5, 1, 2);
    box.fillRect(2, -6, 1, 4);
    mailbox.add(box);

    const label = this.add.text(0, -55, "📬 Suggest a song", {
      fontFamily: 'Georgia',
      fontSize: '11px',
      color: '#c4a878',
    });
    label.setOrigin(0.5);
    mailbox.add(label);

    return mailbox;
  }

  // ============================================================
  // GRANDDAUGHTER (PLAYER)
  // ============================================================
  createPlayer(x, y) {
    const player = this.add.container(x, y);
    player.setSize(20, 24);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillEllipse(0, 14, 18, 5);
    player.add(shadow);

    const sprite = this.add.graphics();

    // Skirt
    sprite.fillStyle(0xc4407a);  // deeper pink/rose
    sprite.fillRect(-8, 0, 16, 12);
    sprite.fillStyle(0x9c305c);
    sprite.fillRect(5, 0, 3, 12);

    // Top
    sprite.fillStyle(0xf4d8a8);  // cream
    sprite.fillRect(-7, -8, 14, 10);
    sprite.fillStyle(0xc4a878);
    sprite.fillRect(4, -8, 3, 10);

    // Head - Indo-Guyanese skin tone
    sprite.fillStyle(0xb47840);
    sprite.fillRect(-6, -20, 12, 12);
    sprite.fillStyle(0x946028);
    sprite.fillRect(3, -20, 3, 12);

    // Hair - long black braided
    sprite.fillStyle(0x1a0808);
    sprite.fillRect(-7, -22, 14, 4);
    sprite.fillRect(-8, -18, 2, 8);  // left side
    sprite.fillRect(6, -18, 2, 8);   // right side

    // Single braid down the back
    sprite.fillRect(-1, -10, 2, 10);

    // Eyes
    sprite.fillStyle(0x1a0808);
    sprite.fillRect(-3, -14, 2, 2);
    sprite.fillRect(2, -14, 2, 2);

    // Small bindi (subtle)
    sprite.fillStyle(0xb02838);
    sprite.fillRect(0, -17, 1, 1);

    // Mouth
    sprite.fillStyle(0x6c3820);
    sprite.fillRect(-1, -10, 2, 1);

    player.add(sprite);
    player.sprite = sprite;

    this.physics.add.existing(player);
    player.body.setSize(18, 24);
    player.body.setOffset(-9, -20);
    player.body.setCollideWorldBounds(true);

    player.facing = 'down';
    player.speed = 130;

    return player;
  }

  // ============================================================
  // UPDATE LOOP
  // ============================================================
  update(time, delta) {
    if (!this.player) return;

    // Don't allow movement during title card
    if (!document.getElementById('title-card').classList.contains('hidden')) {
      this.player.body.setVelocity(0, 0);
      return;
    }

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    let vx = 0, vy = 0;
    if (left) vx = -this.player.speed;
    if (right) vx = this.player.speed;
    if (up) vy = -this.player.speed;
    if (down) vy = this.player.speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
    this.player.body.setVelocity(vx, vy);

    if (Math.abs(vx) > Math.abs(vy)) {
      this.player.facing = vx > 0 ? 'right' : 'left';
    } else if (vy !== 0) {
      this.player.facing = vy > 0 ? 'down' : 'up';
    }

    if (vx !== 0 || vy !== 0) {
      this.player.sprite.y = Math.sin(time * 0.012) * 1;
    } else {
      this.player.sprite.y = 0;
    }

    // Proximity
    let closest = null;
    let closestDist = 90;
    for (const mango of this.mangos) {
      const dx = mango.worldX - this.player.x;
      const dy = mango.worldY - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closest = mango;
        closestDist = dist;
      }
    }

    for (const mango of this.mangos) {
      const isNear = mango === closest;
      mango.glowGraphic.setVisible(isNear);
      mango.labelText.setVisible(isNear);
      if (isNear) {
        mango.glowGraphic.alpha = 0.4 + Math.sin(time * 0.005) * 0.2;
      }
    }
    this.nearMango = closest;

    const grandpaDist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.grandpa.x, this.grandpa.y
    );
    this.nearGrandpa = grandpaDist < 70;

    const mailboxDist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.mailbox.x, this.mailbox.y
    );
    this.nearMailbox = mailboxDist < 60;

    if (Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)) {
      if (this.nearMango) {
        this.enterMangoScene(this.nearMango.genreData);
      } else if (this.nearMailbox) {
        openSuggestModal();
      } else if (this.nearGrandpa) {
        const line = GRANDPA_IDLE_LINES[Math.floor(Math.random() * GRANDPA_IDLE_LINES.length)];
        showDialog("GRANDPA", line, 5000);
      }
    }

    // J key for journal
    if (Phaser.Input.Keyboard.JustDown(this.wasd.J)) {
      toggleJournal();
    }
  }

  enterMangoScene(genre) {
    showDialog("GRANDPA", genre.grandpaDialog, 4500);
    this.time.delayedCall(1000, () => {
      if (!gameState.discovered.includes(genre.id)) {
        gameState.discovered.push(genre.id);
        saveProgress(gameState);
      }
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(700, () => {
        startMangoP5Scene(genre);
      });
    });
  }
}

function returnFromMangoScene() {
  const scene = window.phaserGame.scene.getScene('BerbiceScene');
  if (scene) {
    scene.cameras.main.fadeIn(600, 0, 0, 0);
    scene.scene.restart();
  }
}

function closeTitle() {
  document.getElementById('title-card').classList.add('hidden');
  gameState.firstVisit = false;
  saveProgress(gameState);

  // Trigger the intro dialog sequence
  const scene = window.phaserGame.scene.getScene('BerbiceScene');
  if (scene) {
    let step = 0;
    function nextLine() {
      if (step < INTRO_DIALOG.length) {
        const line = INTRO_DIALOG[step];
        showDialog(line.speaker, line.text, 4000);
        step++;
        setTimeout(nextLine, 4500);
      }
    }
    setTimeout(nextLine, 600);
  }
}
