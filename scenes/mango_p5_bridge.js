// =============================================================
// MANGO P5 BRIDGE - Guyanese genre scenes
// =============================================================

let currentP5Scene = null;
let currentGenre = null;

function startMangoP5Scene(genre) {
  currentGenre = genre;
  const overlay = document.getElementById('p5-overlay');
  overlay.classList.add('active');
  document.getElementById('exit-scene-btn').classList.add('visible');

  if (currentP5Scene) currentP5Scene.remove();

  currentP5Scene = new p5((p) => {
    let startTime;

    p.setup = () => {
      const cnv = p.createCanvas(window.innerWidth, window.innerHeight);
      cnv.parent('p5-overlay');
      startTime = p.millis();
    };

    p.draw = () => {
      const t = (p.millis() - startTime) / 1000;
      const bass = Math.max(0, Math.sin(t * 4) * 0.5 + 0.3 + Math.sin(t * 0.3) * 0.2);
      drawGenreScene(p, genre, t, bass);
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  });

  document.addEventListener('keydown', exitOnEsc);
}

function exitMangoP5Scene() {
  if (currentP5Scene) {
    currentP5Scene.remove();
    currentP5Scene = null;
  }
  document.getElementById('p5-overlay').classList.remove('active');
  document.getElementById('exit-scene-btn').classList.remove('visible');
  document.removeEventListener('keydown', exitOnEsc);
  returnFromMangoScene();
}

function exitOnEsc(e) {
  if (e.key === 'Escape') exitMangoP5Scene();
}

function drawGenreScene(p, genre, time, bass) {
  drawGenreBackground(p, genre, time, bass);

  switch (genre.id) {
    case 'folk': drawFolkElements(p, time, bass); break;
    case 'calypso': drawCalypsoElements(p, time, bass); break;
    case 'chutney': drawChutneyElements(p, time, bass); break;
    case 'chutney_soca': drawChutneySocaElements(p, time, bass); break;
    case 'soca': drawSocaElements(p, time, bass); break;
    case 'reggae': drawReggaeElements(p, time, bass); break;
  }

  drawGenreText(p, genre, bass);
}

function drawGenreBackground(p, genre, time, bass) {
  const baseR = (genre.color >> 16) & 0xff;
  const baseG = (genre.color >> 8) & 0xff;
  const baseB = genre.color & 0xff;
  const steps = 40;
  const bandH = p.height / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const r = p.lerp(30, baseR * 0.5, t) + bass * 10;
    const g = p.lerp(20, baseG * 0.5, t);
    const b = p.lerp(40, baseB * 0.5, t);
    p.fill(r, g, b);
    p.noStroke();
    p.rect(0, i * bandH, p.width, bandH + 2);
  }
}

function drawFolkElements(p, time, bass) {
  drawHangingLanterns(p, time, bass);
  drawDriftingPetals(p, time, bass, [p.color(255, 220, 130), p.color(255, 180, 100)]);
  drawCaneSilhouettes(p, p.color(60, 80, 50));
}

function drawCalypsoElements(p, time, bass) {
  drawPixelSun(p, p.width * 0.7, p.height * 0.3, 60, p.color(255, 200, 100), bass);
  drawHangingLanterns(p, time, bass);
  drawFloatingNotes(p, time, bass, p.color(255, 220, 130));
}

function drawChutneyElements(p, time, bass) {
  drawMandala(p, p.width / 2, p.height * 0.35, 120 + bass * 20, time * 0.2);
  drawDriftingPetals(p, time, bass, [p.color(255, 140, 40), p.color(255, 200, 60), p.color(220, 50, 80)]);
  drawDiyaGlow(p, p.width * 0.15, p.height * 0.7, bass);
  drawDiyaGlow(p, p.width * 0.85, p.height * 0.7, bass);
}

function drawChutneySocaElements(p, time, bass) {
  drawSunRays(p, p.width / 2, p.height * 0.25, time, bass);
  drawMandala(p, p.width / 2, p.height * 0.25, 90 + bass * 15, time * 0.2);
  drawDriftingPetals(p, time, bass, [p.color(255, 100, 150), p.color(255, 200, 80), p.color(220, 50, 100)]);
  drawConfettiPieces(p, time, bass);
}

function drawSocaElements(p, time, bass) {
  drawSunRays(p, p.width / 2, p.height * 0.25, time, bass);
  drawPixelSun(p, p.width / 2, p.height * 0.25, 70, p.color(255, 240, 150), bass);
  drawConfettiPieces(p, time, bass);
  drawFloatingNotes(p, time, bass, p.color(255, 100, 150));
}

function drawReggaeElements(p, time, bass) {
  drawPixelSun(p, p.width * 0.6, p.height * 0.35, 80, p.color(255, 240, 170), bass);
  drawMountainSilhouette(p, p.height * 0.65, p.color(40, 75, 50));
  drawMountainSilhouette(p, p.height * 0.7, p.color(25, 55, 35));
  drawTriColorParticles(p, time, bass);
}

function drawPixelSun(p, x, y, r, baseColor, bass) {
  p.noStroke();
  for (let i = 5; i > 0; i--) {
    p.fill(p.red(baseColor), p.green(baseColor), p.blue(baseColor), 20 + bass * 10);
    p.circle(x, y, (r + i * 15 + bass * 8) * 2);
  }
  p.fill(baseColor);
  p.circle(x, y, r * 2);
  p.fill(255, 255, 230);
  p.circle(x, y, r * 1.4);
}

function drawSunRays(p, cx, cy, time, bass) {
  p.push();
  p.blendMode(p.ADD);
  p.noStroke();
  for (let i = 0; i < 14; i++) {
    const angle = time * 0.1 + (i * p.TWO_PI) / 14;
    const len = 380 + bass * 150;
    p.fill(255, 220, 130, 25 + bass * 30);
    p.push();
    p.translate(cx, cy);
    p.rotate(angle);
    p.triangle(0, 0, len, -25, len, 25);
    p.pop();
  }
  p.blendMode(p.BLEND);
  p.pop();
}

function drawMandala(p, cx, cy, radius, angle) {
  p.push();
  p.blendMode(p.ADD);
  p.noFill();
  p.translate(cx, cy);
  p.rotate(angle);
  for (let ring = 0; ring < 3; ring++) {
    const r = radius * (0.6 + ring * 0.25);
    const petals = 8 + ring * 4;
    p.stroke(255, 180, 60, 60);
    p.strokeWeight(1.5);
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * p.TWO_PI;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      p.beginShape();
      p.vertex(px, py - 15);
      p.vertex(px + 8, py);
      p.vertex(px, py + 15);
      p.vertex(px - 8, py);
      p.endShape(p.CLOSE);
    }
  }
  p.blendMode(p.BLEND);
  p.pop();
}

function drawDiyaGlow(p, x, y, bass) {
  p.noStroke();
  for (let i = 5; i > 0; i--) {
    p.fill(255, 180, 60, 25 + bass * 15);
    p.circle(x, y, 40 + i * 15);
  }
  p.fill(255, 230, 120);
  p.circle(x, y, 14);
}

function drawHangingLanterns(p, time, bass) {
  for (let i = 0; i < 5; i++) {
    const x = (p.width / 6) * (i + 1);
    const y = 80 + Math.sin(time * 0.5 + i) * 5;
    p.stroke(40);
    p.strokeWeight(1);
    p.line(x, 0, x, y - 10);
    p.noStroke();
    for (let j = 4; j > 0; j--) {
      p.fill(255, 180, 100, 30 + bass * 30);
      p.circle(x, y, 25 + j * 10 + bass * 10);
    }
    p.fill(255, 230, 160);
    p.circle(x, y, 16);
    p.fill(255, 255, 240);
    p.circle(x, y, 8);
  }
}

function drawDriftingPetals(p, time, bass, colors) {
  for (let i = 0; i < 25; i++) {
    const seed = i * 137;
    const x = (seed * 1.3 + time * 20 + Math.sin(time * 0.3 + i) * 30) % p.width;
    const y = ((seed * 0.7 + time * 40) % (p.height + 100)) - 50;
    p.fill(colors[i % colors.length]);
    p.noStroke();
    p.ellipse(x, y, 6, 10);
  }
}

function drawCaneSilhouettes(p, c) {
  p.fill(c);
  p.noStroke();
  for (let x = 0; x < p.width; x += 6) {
    const h = 50 + Math.sin(x * 0.3) * 10;
    p.rect(x, p.height - h, 2, h);
  }
}

function drawConfettiPieces(p, time, bass) {
  const colors = [p.color(255, 100, 150), p.color(255, 220, 50), p.color(80, 220, 255), p.color(200, 80, 240)];
  for (let i = 0; i < 30; i++) {
    const seed = i * 73;
    const x = (seed * 2.7 + time * 30) % p.width;
    const y = ((seed * 1.3 + time * 60) % (p.height + 100)) - 50;
    p.fill(colors[i % colors.length]);
    p.noStroke();
    p.push();
    p.translate(x, y);
    p.rotate(time * 2 + i);
    p.rect(-3, -2, 6, 4);
    p.pop();
  }
}

function drawMountainSilhouette(p, baseY, c) {
  p.fill(c);
  p.noStroke();
  p.beginShape();
  p.vertex(-10, p.height);
  for (let x = 0; x <= p.width; x += 5) {
    const h = p.sin(x * 0.005) * 40 + p.sin(x * 0.015) * 25 + 60;
    p.vertex(x, baseY - h);
  }
  p.vertex(p.width + 10, p.height);
  p.endShape(p.CLOSE);
}

function drawTriColorParticles(p, time, bass) {
  const colors = [p.color(220, 50, 50), p.color(255, 209, 0), p.color(0, 154, 68)];
  for (let i = 0; i < 30; i++) {
    const seed = i * 73;
    const x = (seed * 2.7 + time * 30) % p.width;
    const y = ((seed * 1.3 + time * 50) % (p.height + 100)) - 50;
    p.fill(colors[i % 3]);
    p.noStroke();
    p.rect(x, y, 6, 6);
  }
}

function drawFloatingNotes(p, time, bass, c) {
  p.textSize(28);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(c);
  p.textStyle(p.BOLD);
  for (let i = 0; i < 8; i++) {
    const seed = i * 211;
    const x = (seed * 1.7 + time * 25) % p.width;
    const y = ((seed * 0.9 + time * 50) % (p.height + 80)) - 40;
    p.text(i % 2 === 0 ? '♪' : '♫', x, y);
  }
}

function drawGenreText(p, genre, bass) {
  p.push();
  p.textAlign(p.CENTER, p.TOP);
  p.noStroke();
  p.textSize(82);
  p.textStyle(p.BOLD);
  p.textFont('Courier');
  p.fill(0, 200);
  p.text(genre.name.toUpperCase(), p.width / 2 + 3, 30 + 3);
  p.fill(255, 240, 200);
  p.text(genre.name.toUpperCase(), p.width / 2, 30);

  p.textSize(22);
  p.textStyle(p.NORMAL);
  p.textFont('Helvetica');
  p.fill(255, 230, 180);
  p.text(`Guyana · ${genre.era}`, p.width / 2, 120);
  p.pop();

  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.noStroke();
  p.textFont('Helvetica');
  p.fill(0, 0, 0, 180);
  p.rect(0, p.height / 2 - 70, p.width, 140);
  p.textSize(22);
  p.textStyle(p.ITALIC);
  p.fill(255, 240, 200, 230);
  const maxW = Math.min(p.width * 0.85, 1100);
  p.text(genre.journalNote, p.width / 2 - maxW / 2, p.height / 2 - 60, maxW, 120);
  p.pop();
}
