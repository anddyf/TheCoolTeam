import Phaser from 'phaser';
let arr = []
let player = []
let music;
let toggle = true
let boom;
let kaboom;
let uppercut;
let battle = [{
		id: 0,
		Q: `XXX is an in-memory representation of Real DOM,\nIt’s a step that happens between the \nrender function being called and the \ndisplaying of elements on the screen \n What is XXX?`,
		S: 'VDOM',
		A: 20
	},
	{
		id: 1,
		Q: 'These components allows you to use \nadditional features such as local state and \nlifecycle hooks. Also, to enable your component to have \ndirect access to your store and thus \nholds state.',
		S: 'Class Components',
		A: 8
	},
	{
		id: 2,
		Q: `What gets passed to the component similar to \nfunction parameters?`,
		S: 'Props',
		A: 8
	},
	{
		id: 3,
		Q: `What is managed within the component similar to \nvariables declared within a function.`,
		S: 'State',
		A: 8
	},
	{
		id: 4,
		Q: `XXX is a function that takes a component \nand returns a new component.What is XXX here?`,
		S: 'HOC',
		A: 8
	},
	{
		id: 5,
		Q: 'A child class constructor cannot make use of "this" \nreference until XXX method has been called. The main \nreason of passing props parameter to XXX call \nis to access this.props in your child constructors.\nWhat is XXX here?',
		S: 'super()',
		A: 8
	},
	{
		id: 6,
		Q: 'XXX let you use state and other React features \nwithout writing a class. With XXX,\nyou can extract stateful logic from a \ncomponent so it can be tested independently and reused.\nWhat is XXX here?',
		S: 'React Hooks',
		A: 8
	} ]
var BattleSceneRussell = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function BattleScene() {
			Phaser.Scene.call(this, {
				key: 'BattleSceneRussell'
			});
		},
	init: function (data) {
		this.player = data
	},
	create: function () {
        // change the background to green now
		this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
		this.add.tileSprite(0, 0, 750, 600, 'russellBattle').setOrigin(0);
		this.startBattle();
		music = this.sound.add('russellSong', {
			loop: true
		});
		music.play();
		uppercut = this.sound.add('upperAttack', {
			loop: false
		});
		// on wake event we call startBattle too
		this.sys.events.on('wake', this.startBattle, this);
		var config = {
			key: 'explode',
			frames: this.anims.generateFrameNumbers('boom', {
				start: 0,
				end: 23,
				first: 23
			}),
			frameRate: 20,
		};
		boom = this.add.sprite(600, 250, 'boom');
		kaboom = this.add.sprite(150, 250, 'boom');
		this.anims.create(config);
	},
	startBattle: function () {
		// player character - warrior
		var main = new PlayerCharacter(this, 600, 250, this.player.texture, this.player.frame, this.player.name, this.player.health, battle);
		this.add.existing(main);

		var russell = new Enemy(this, 150, 250, 'russell', 2, 'Russell', 1000, battle);
		this.add.existing(russell);

		// array with heroes
		this.heroes = [main];
		// array with enemies
		this.enemies = [russell];
		// array with both parties, who will attack
		this.units = this.heroes.concat(this.enemies);

		this.index = -1; // currently active unit

		this.scene.run('UISceneRussell');
	},
	nextTurn: function () {
		// if we have victory or game over
		if (this.checkEndBattle().victory) {
			return this.endVictory()
		} else if (this.checkEndBattle().gameOver) {
			return this.endGameOver()
		}
		do {
			// currently active unit
			this.index++;
			// if there are no more units, we start again from the first one
			if (this.index >= this.units.length) {
				this.index = 0;
			}
		} while (!this.units[this.index].living);
		// if its player hero
		if (this.units[this.index] instanceof PlayerCharacter) {
			this.units[this.index].attack('attack', this.heroes[0]);
			this.events.emit('PlayerSelect', this.index);
			// we need the player to select action and then enemy
			// pick random living hero to be attacked
			// call the enemy's attack function
			this.time.addEvent({
				delay: 2000,
				callback: this.nextTurn,
				callbackScope: this
			});
			// add timer for the next turn, so will have smooth gameplay
		}
		else {
			// helpful
		}
	},
	// check for game over or victory
	checkEndBattle: function () {
		var victory = true;
		// if all enemies are dead we have victory
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].living) {
				victory = false;
			}
		}
		var gameOver = true;
		// if all heroes are dead we have game over
		for (var i = 0; i < this.heroes.length; i++) {
			if (this.heroes[i].living) {
				gameOver = false;
			}
		}
		let result = {
			victory,
			gameOver
		}
		return result
	},
	// when the player have selected the enemy to be attacked
	receivePlayerSelection: function (action, target) {
		if (action === 'VDOM') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Class Components') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Props') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'State') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'HOC') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'super()') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'React Hooks') {
			this.units[this.index].attack(action, this.enemies[target]);
		}
		// next turn in 3 seconds
		this.time.addEvent({
			delay: 2000,
			callback: this.nextTurn,
			callbackScope: this
		});
	},
	endVictory: function () {
		// clear state, remove sprites
		this.heroes.length = 0;
		this.enemies.length = 0;
		for (var i = 0; i < this.units.length; i++) {
			// link item
			this.units[i].destroy();
		}
		this.units.length = 0;
		// sleep the UI
		this.scene.sleep('UISceneRussell');
		// return to WorldScene and sleep current BattleScene
		arr = []
        music.stop();
		this.scene.start('scene6', {
			x: this.player.x,
			y: this.player.y,
			texture: this.player.texture,
			frame: this.player.frame,
			name: this.player.name,
            health: player.pop().data.hp += 100,
            maxHP: 100,
            points: this.player.points += 200,
            badge: this.player.badge,
            level: 'NPC'
		});

	},
	endGameOver: function () {
		// clear state, remove sprites
		this.heroes.length = 0;
		this.enemies.length = 0;
		for (var i = 0; i < this.units.length; i++) {
			// link item
			this.units[i].destroy();
		}
		this.units.length = 0;
		// sleep the UI
		this.scene.sleep('UISceneRussell');
		// // return to WorldScene and sleep current BattleScene
		arr = []
		music.stop();
		this.scene.start('scene5', {
			x: this.player.x,
			y: this.player.y,
			texture: this.player.texture,
			frame: this.player.frame,
			name: this.player.name,
            health: 0,
            maxHP: 100,
            points: this.player.points,
            badge: this.player.badge,
            level: 'scene5'
		});
	}
});


// base class for heroes and enemies
var Unit = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

	initialize:

		function Unit(scene, x, y, texture, _frame, type, hp, damage) {
			Phaser.GameObjects.Sprite.call(this, scene, x, y, texture)
			this.type = type;
			this.maxHp = this.hp = hp;
			this.damage = damage; // default damage
			this.living = true;
			this.menuItem = null;
		},
	// we will use this to notify the menu item when the unit is dead
	setMenuItem: function (item) {
		this.menuItem = item;
	},
	// attack the target unit is real to use
	attack: function (action, target) {
		let random = Math.floor(Math.random() * 7)
		console.log(this, target)
		if (target.living) {
			if (target.type === 'Russell') {
				player.push({
					data: {
						hp: this.hp
					}
				})
				if (arr.length > 0 && action === arr.pop().S) {
					target.takeDamage(20)
					target.tint = 0xFF6347
					target.frame = target.texture.frames['russell-front']
					setTimeout(() => {
						target.clearTint()
						target.frame = target.texture.frames['russell-left']
					}, 2000)
					uppercut.play();
					this.scene.events.emit('Message', 'You: ' + action + '!!!  \n' + target.type + ' with 20 point damage')
					kaboom.anims.play('explode');
				} else {
					target.takeDamage(random)
					target.tint = 0xFF6347
					target.frame = target.texture.frames['russell-front']
					setTimeout(() => {
						target.clearTint()
						target.frame = target.texture.frames['russell-left']
					}, 2000)
					this.scene.events.emit('Message', 'You: ' + action + '!!!  \n' + target.type + ' with ' + random + ' point damage')
					uppercut.play();
					kaboom.anims.play('explode');
				}
			} else if (toggle){
                toggle = false
                let damage = this.damage[random];
				target.takeDamage(0)
				uppercut.play();
				this.scene.events.emit('Message', 'Russell: \n' + damage.Q + ' !!!')
				arr.push(damage)
                }
                else {
				let damage = this.damage[random];
				target.takeDamage(50)
				uppercut.play();
				target.tint = 0xFF6347;
				target.frame = target.texture.frames['student-front']
				setTimeout(() => {
					target.clearTint()
					target.frame = target.texture.frames['student-right']
				}, 2000)
				this.scene.events.emit('Message', 'Russell: \n' + damage.Q + ' !!!')
				arr.push(damage)
                boom.anims.play('explode');
             }
		}
	},
	takeDamage: function (damage) {
		this.hp -= damage;
		if (this.hp <= 0) {
			this.hp = 0;
			this.menuItem.unitKilled();
			this.living = false;
			this.visible = false;
			this.menuItem = null;
		}
	}
});

var Enemy = new Phaser.Class({
	Extends: Unit,

	initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.flipX = true;
		this.setScale(2);
		this.frame = this.texture.frames['russell-left']
	}
});

var PlayerCharacter = new Phaser.Class({
	Extends: Unit,

	initialize: function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.flipX = true;
		this.setScale(2);
		this.frame = this.texture.frames['student-right']
	}
});

var MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize:

		function MenuItem(x, y, text, scene) {
			Phaser.GameObjects.Text.call(this, scene, x, y, text, {
				color: '#000000',
				align: 'left',
				fontSize: 15
			});
		},
	select: function () {
		this.setColor('#fc0303');
	},
	deselect: function () {
		this.setColor('#000000');
	},
	unitKilled: function () {
		this.active = false;
		this.visible = false;
	}

});
var Menu = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize:

		function Menu(x, y, scene, heroes) {
			Phaser.GameObjects.Container.call(this, scene, x, y);
			this.menuItems = [];
			this.menuItemIndex = 0;
			this.x = x;
			this.y = y;
			this.selected = false;
		},
	addMenuItem: function (unit) {
		var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
		this.menuItems.push(menuItem);
		this.add(menuItem);
		return menuItem;
	},
	moveSelectionUp: function () {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex--;
			if (this.menuItemIndex < 0) {
				this.menuItemIndex = this.menuItems.length - 1;
			}
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	moveSelectionDown: function () {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) {
				this.menuItemIndex = 0;
			}
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	select: function (index) {
		if (!index) {
			index = 0;
		}
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = index;
		while (!this.menuItems[this.menuItemIndex].active) {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) {
				this.menuItemIndex = 0;
			}
			if (this.menuItemIndex == index) {
				return;
			}
		}
		this.menuItems[this.menuItemIndex].select();
		this.menuItems[this.menuItemIndex].select()
		this.selected = true;
	},
	// deselect this menu
	deselect: function () {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = 0;
		this.selected = false;
	},
	confirm: function () {},
	clear: function () {
		for (var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].destroy();
		}
		this.menuItems.length = 0;
		this.menuItemIndex = 0;
	},
	remap: function (units) {
		this.clear();
		for (var i = 0; i < units.length; i++) {
			var unit = units[i];
			unit.setMenuItem(this.addMenuItem(unit.type));
		}
		this.menuItemIndex = 0;
	}
});

var HeroesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function HeroesMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
		}
});

var ActionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function ActionsMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
			this.addMenuItem('VDOM');
			this.addMenuItem('Class Components');
			this.addMenuItem('Props');
			this.addMenuItem('State');
			this.addMenuItem('HOC');
			this.addMenuItem('super()');
			this.addMenuItem('React Hooks');
		},
	confirm: function () {
		// we select an action and go to the next menu and choose from the enemies to apply the action\
		this.scene.events.emit('SelectedAction', this.menuItems[this.menuItemIndex]._text);
	}

});

var EnemiesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function EnemiesMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
		},
	confirm: function (index) {
		// the player has selected the enemy and we send its id with the event
		this.scene.events.emit('Enemy', this.menuItemIndex, index);
	}
});

// User Interface scene
var UISceneRussell = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function UIScene() {
			Phaser.Scene.call(this, {
				key: 'UISceneRussell'
			});
		},

	create: function () {
		// draw some background for the menu
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(3, 0x000000);
		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.strokeRect(15, 400, 255, 190);
		this.graphics.fillRect(15, 400, 255, 190);
		this.graphics.strokeRect(255, 400, 240, 190);
		this.graphics.fillRect(255, 400, 240, 190);
		this.graphics.strokeRect(495, 400, 240, 190);
		this.graphics.fillRect(495, 400, 240, 190);
		// basic container to hold all menus
		this.menus = this.add.container();

		this.heroesMenu = new HeroesMenu(520, 420, this);
		this.actionsMenu = new ActionsMenu(280, 420, this);
		this.enemiesMenu = new EnemiesMenu(35, 420, this);

		// the currently selected menu
		this.currentMenu = this.actionsMenu;

		// add menus to the container
		this.menus.add(this.heroesMenu);
		this.menus.add(this.actionsMenu);
		this.menus.add(this.enemiesMenu);

		this.battleScene = this.scene.get('BattleSceneRussell');

		// listen for keyboard events
		this.input.keyboard.on('keydown', this.onKeyInput, this);

		// when its player cunit turn to move
		this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

		// when the action on the menu is selected
		// for now we have only one action so we dont send an action id
		this.events.on('SelectedAction', this.onSelectedAction, this);

		// an enemy is selected
		this.events.on('Enemy', this.onEnemy, this);

		// when the scene receives wake event
		this.sys.events.on('wake', this.createMenu, this);

		// the message describing the current action
		this.message = new Message(this, this.battleScene.events);
		this.add.existing(this.message);

		this.createMenu();
	},
	createMenu: function () {
		// map hero menu items to heroes
		this.remapHeroes();
		// map enemies menu items to enemies
		this.remapEnemies();
		// first move
		this.battleScene.nextTurn();
	},
	onEnemy: function (index, id) {
		// when the enemy is selected, we deselect all menus and send event with the enemy id
		this.heroesMenu.deselect();
		this.actionsMenu.deselect();
		this.enemiesMenu.deselect();
		this.currentMenu = null;
		this.battleScene.receivePlayerSelection(id, index);
	},
	onPlayerSelect: function (id) {
		this.heroesMenu.select(id);
		this.actionsMenu.select(0);
		this.currentMenu = this.actionsMenu;
	},
	onSelectedAction: function (index) {
		this.currentMenu = this.enemiesMenu
		this.currentMenu.confirm(index)
		// this.enemiesMenu.select(0);
	},
	remapHeroes: function () {
		var heroes = this.battleScene.heroes;
		this.heroesMenu.remap(heroes);
	},
	remapEnemies: function () {
		var enemies = this.battleScene.enemies;
		console.log(enemies)
		this.enemiesMenu.remap(enemies);
	},
	onKeyInput: function (event) {
		if (this.currentMenu && this.currentMenu.selected) {
			if (event.code === 'ArrowUp') {
				this.currentMenu.moveSelectionUp();
			} else if (event.code === 'ArrowDown') {
				this.currentMenu.moveSelectionDown();
			} else if (event.code === 'Space' || event.code === 'ArrowLeft') {
				this.currentMenu.confirm();
			}
		}
	},
	wake: function () {
		this.cursors.left.reset();
		this.cursors.right.reset();
		this.cursors.up.reset();
		this.cursors.down.reset();
	},
});
var Message = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize: function Message(scene, events) {
		Phaser.GameObjects.Container.call(this, scene, 160, 30);
		var graphics = this.scene.add.graphics();
		this.add(graphics);
		graphics.lineStyle(2, 0xffffff, 0.8);
		graphics.fillStyle(0x000000, 0.8);
		graphics.strokeRect(-60, -15, 500, 150);
		graphics.fillRect(-60, -15, 500, 150);
		this.text = new Phaser.GameObjects.Text(scene, 200, 40, '', {
			color: '#ffffff',
			align: 'center',
			fontSize: 15,
			padding: {
				top: 60
			},
			wordWrap: {
				width: 400,
				useAdvancedWrap: true
			}
		})
		this.add(this.text);
		this.text.setOrigin(0.5);
		events.on('Message', this.showMessage, this);
		this.visible = false;
	},
	showMessage: function (text) {
		this.text.setText(text);
		this.visible = true;
		if (this.hideEvent) {
			this.hideEvent.remove(false);
		}
		this.hideEvent = this.scene.time.addEvent({
			delay: 5000,
			callback: this.hideMessage,
			callbackScope: this
		});
	},
	hideMessage: function () {
		this.hideEvent = null;
		this.visible = false;
	}
});
export {
	BattleSceneRussell,
	UISceneRussell
};
