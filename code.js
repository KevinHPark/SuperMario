var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'superMario', { preload: preload, create: create, update: update });

var player, arrowKeys, sky, mountain, floor;

function preload() {
    game.load.spritesheet("mario", "assets/images/mario.png", 32, 48);
    game.load.image("sky", "assets/images/sky.png");
    game.load.image("mountain", "assets/images/mountain.png");
    // game.load.image("floor", "assets/images/floor.png");
}

function create() {
    //Background
    sky = game.add.tileSprite(0, 0, 1000, 600, 'sky');
    mountain = game.add.tileSprite(0, 0, 1000, 600, 'mountain');
    sky.fixedToCamera = true;
    // floor = game.add.sprite(-110, 0, 1912, 110, 'floor');
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(25, 300, "mario");
    player.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;

    //camera
    game.world.setBounds(0, 0, 5000, 600);
    game.camera.follow(player);
    game.add.text(1000, 300, '1000px', { fill: 'white' });
    game.add.text(2000, 300, '2000px', { fill: 'white' });
    game.add.text(3000, 300, '3000px', { fill: 'white' });
    game.add.text(4000, 300, '4000px', { fill: 'white' });

    //input
    arrowKey = game.input.keyboard.createCursorKeys();

    //animation
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('turn', [4], 20, true);
}

function update() {
    if (arrowKey.right.isDown) {
        player.body.velocity.x = 200;
        player.animations.play('right');
    }
    else if (arrowKey.left.isDown) {
        player.body.velocity.x = -200;
        player.animations.play('left');
    }
    else {
        player.body.velocity.x = 0;
        player.animations.play('turn');
    }

    if (arrowKey.up.isDown) {
        player.body.velocity.y = -400;
    }
    sky.tilePosition.x = game.camera.x * -0.2;
    mountains.tilePosition.x = game.camera.x * -0.3;
    // player.animations.stop();
    // player.frame = 1;
}

// add custom functions (for collisions, etc.)