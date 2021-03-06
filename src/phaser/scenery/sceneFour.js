import React from 'react';
import Phaser from 'phaser';
import { thisExpression } from '@babel/types';

let controls;
let cursors;
let player;
let music;
let tile;
let yesOrNo = '(Y/N)';
const showDebug = false;

class SceneFour extends Phaser.Scene {
  constructor() {
    super('scene4');
  }
  init(data){
    if (data.level === 'NPC'){
      this.player = data;
    }
    else {
      data.x = 660.740655987795
      data.y = 621.623188405797
      this.player = data
    }
  }
  create() {
    const createNPC = (x, y, spriteName, spriteFrame, text, reference, battleScene, url) => {
      let npc = this.NPCs.create(x, y, spriteName, spriteFrame)
          .setSize(0, 38)
          .setOffset(0, 23);
      npc.text = text || '';
      npc.reference = reference;
      npc.battleScene = battleScene;
      npc.url = url
      return npc;
  };

  this.speech = this.add.text(16, 16, `HP: ${this.player.health} Badge: ${this.player.badge}`, {
    wordWrap: {
        width: 500
    },
    padding: {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
    },
    align: 'left',
    backgroundColor: '#c90000',
    color: '#ffffff',
})
.setScrollFactor(0)
.setDepth(30);

    const map = this.make.tilemap({ key: 'shop' });
    const tileset = map.addTilesetImage('shop', 'shopLevel');
    const shopLayer = map.createStaticLayer('shop', tileset, 0, 0);

    music = this.sound.add('shop', { loop: true });

    music.play();

    tile = map.setTileIndexCallback(434, () => {
      this.player.level = '';
      music.stop();
      this.scene.start('PlayGame', this.player);
    }, this);

    shopLayer.setCollisionByProperty({ collides: true });
    player = this.physics.add
      .sprite(this.player.x, this.player.y, 'atlas', 'student-back')
      .setSize(30, 40)
      .setOffset(0, 24);
    this.physics.add.collider(player, shopLayer);

    const camera = this.cameras.main;
    camera.startFollow(player);
    cursors = this.input.keyboard.createCursorKeys();
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.NPCs = this.physics.add.staticGroup();

      this.npcOne = createNPC(
          540, 410, 'greenman', 'greenman-right', "You want some Pothos man? It's pretty good", 'npcOne', 'BattleScene', 'https://pothos.herokuapp.com/'
      );
      this.npcTwo = createNPC(
          980, 410, 'baggie', 'baggie-left', 'Hey man, I can hook you up with some Juuls', 'npcTwo', 'BattleSceneKevin', 'https://http.cat/fksfdj'
      );
      this.npcThree = createNPC(
          600, 500, 'gin', 'gin-right', 'We have that nice art you want?', 'npcThree', 'BattleSceneMark', 'https://fakers.herokuapp.com/'
      );
      this.npcFour = createNPC(
        940, 550, 'steve', 'steve-left', 'Go read the docs!', 'npcFour', 'BattleSceneRussell', 'https://developer.mozilla.org/en-US/'
    );

      this.physics.add.collider(player, this.NPCs, (player, spriteNPC) => {
          let _spriteNPC = spriteNPC;
          let directionObj = spriteNPC.body.touching;
          let direction = null;
          for (let key in directionObj) {
              if (directionObj[key]) {
                  if (key === 'down') {
                      direction = 'front';
                  } else if (key === 'up') {
                      direction = 'back';
                  } else {
                      direction = key;
                  }
              }
          }
          spriteNPC.destroy();
          this[_spriteNPC.reference] = createNPC(
              _spriteNPC.x, _spriteNPC.y, _spriteNPC.texture.key, `${_spriteNPC.texture.key}-${direction}`, _spriteNPC.text, _spriteNPC.reference, _spriteNPC.battleScene, _spriteNPC.url
          );
          this.physics.pause();
          this.anims.pauseAll();
          this.physics.paused = false;
          this.dialogue = this.add
              .text(130, 500, `${_spriteNPC.text} ${yesOrNo}`, {
                  wordWrap: {
                      width: 500
                  },
                  padding: {
                      top: 15,
                      right: 15,
                      bottom: 15,
                      left: 15
                  },
                  align: 'left',
                  backgroundColor: '#ffffff',
                  color: '#ff0000',
              })
              .setScrollFactor(0)
              .setDepth(30);
              this.input.keyboard.on('keydown_Y', () => {
                this.player.level = 'NPC';
                this.player.x = player.x;
                this.player.y = player.y;
                window.open(spriteNPC.url, '_new')
                setTimeout(() => {
                this.scene.start('scene4', this.player);
                music.stop();
                }, 2000)
                this.dialogue.destroy();
                this[_spriteNPC.reference].destroy();
                this[_spriteNPC.reference] = createNPC(
                  _spriteNPC.x,
                  _spriteNPC.y,
                  _spriteNPC.texture.key,
                  _spriteNPC.frame.name,
                  _spriteNPC.text
                );
                this.physics.resume();
                this.anims.resumeAll();
                this.physics.paused = false;
              })

          this.input.keyboard.on('keydown_N', () => {
            this.player.level = 'NPC';
            this.player.x = player.x;
            this.player.y = player.y;
            this.scene.start('scene4', this.player);
            music.stop();
            this.dialogue.destroy();
            this[_spriteNPC.reference].destroy();
            this[_spriteNPC.reference] = createNPC(
              _spriteNPC.x,
              _spriteNPC.y,
              _spriteNPC.texture.key,
              _spriteNPC.frame.name,
              _spriteNPC.text
            );
            this.physics.resume();
            this.anims.resumeAll();
            this.physics.paused = false;
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
    if (cursors.left.isDown) { player.anims.play('student-left-walk', true); } else if (cursors.right.isDown) { player.anims.play('student-right-walk', true); } else if (cursors.up.isDown) { player.anims.play('student-back-walk', true); } else if (cursors.down.isDown) { player.anims.play('student-front-walk', true); } else {
      player.anims.stop();
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture('atlas', 'student-left');
      else if (prevVelocity.x > 0) player.setTexture('atlas', 'student-right');
      else if (prevVelocity.y < 0) player.setTexture('atlas', 'student-back');
      else if (prevVelocity.y > 0) player.setTexture('atlas', 'student-front');
    }
  }
}

export default SceneFour;