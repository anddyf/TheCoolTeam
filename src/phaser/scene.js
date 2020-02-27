import Phaser, { Game } from 'phaser';
import {
  houseOneImg,
  houseOneMap,
  pokeImg,
  pokeMap,
  pokeStudent,
  pokeStudentJSON,
  Home,
  Lounge
} from './assets'

let cursors;
let music;
let tile;
let player = { x: 100 , y: 360};
let showDebug = false;

class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  preload() {
    this.load.image('firstLevel', pokeImg);
    this.load.image('houseLevel', houseOneImg);
    this.load.tilemapTiledJSON('house', houseOneMap);
    this.load.tilemapTiledJSON('level', pokeMap);
    this.load.atlas('atlas', pokeStudent, pokeStudentJSON);
    this.load.audio('levelOne', [Home]);
    this.load.audio('lounge', [Lounge])
  }

  create() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage('poke', 'firstLevel');
    const belowLayer = map.createStaticLayer('Below', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });

      music = this.sound.add('levelOne', { loop: true });
      music.play();
    
    tile = map.setTileIndexCallback(154, () => {
      player.x = 170
      player.y = 370
      music.stop()
      this.scene.start('scene2')
  }, this);

// and the second one 
    const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
    
    player = this.physics.add
    .sprite(player.x, player.y, 'atlas', 'student-front')
    .setSize(30, 40)
    .setOffset(0, 24);

  const anims = this.anims;
  anims.create({
    key: 'student-left-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-left-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-right-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-right-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-front-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-front-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-back-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-back-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  player.touchesArea = false

  this.physics.add.collider(player, worldLayer);

  const camera = this.cameras.main;
  camera.startFollow(player);
  cursors = this.input.keyboard.createCursorKeys();
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
      font: '18px monospace',
      fill: '#000000',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff'
    })
    .setScrollFactor(0)
    .setDepth(30);

      this.input.keyboard.once('keydown_D', event => {this.input.keyboard.once('keydown_D', event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
        worldLayer.renderDebug(graphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
      });
  })
  

}

  update(time, delta) {

    // Runs once per frame for the duration of the scene
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) player.body.setVelocityX(-speed);
    else if (cursors.right.isDown) player.body.setVelocityX(speed);

    // Vertical movement
    if (cursors.up.isDown) player.body.setVelocityY(-speed);
    else if (cursors.down.isDown) player.body.setVelocityY(speed);

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {player.anims.play('student-left-walk', true);}
    else if (cursors.right.isDown) {player.anims.play('student-right-walk', true);}
    else if (cursors.up.isDown) {player.anims.play('student-back-walk', true);}
    else if (cursors.down.isDown) {player.anims.play('student-front-walk', true);}
    else {
      player.anims.stop();
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture('atlas', 'student-left');
      else if (prevVelocity.x > 0) player.setTexture('atlas', 'student-right');
      else if (prevVelocity.y < 0) player.setTexture('atlas', 'student-back');
      else if (prevVelocity.y > 0) player.setTexture('atlas', 'student-front');
    }
  }

}


export default playGame;
