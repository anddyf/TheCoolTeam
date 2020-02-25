import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import playGame from './phaser/scene';

//console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 750,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: playGame
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
);
