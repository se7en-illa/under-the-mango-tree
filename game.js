// =============================================================
// UNDER THE MANGO TREE - Main Game Init
// =============================================================

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

window.addEventListener('load', () => {
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1208',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BerbiceScene],
  };

  window.phaserGame = new Phaser.Game(config);
});
