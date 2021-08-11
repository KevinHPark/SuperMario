var game = new Phaser.Game(1000, 580, Phaser.AUTO, 'superMario', { preload: preload, create: create, update: update });

var player, arrowKeys, sky, mountain, floor, platformGroup, jump, coinGroup, score = 0, scoreTex, coinSong;

function preload() {
    game.load.spritesheet("mario", "assets/images/mario.png", 32, 48);
    game.load.image("sky", "assets/images/sky.png");
    game.load.image("mountain", "assets/images/mountain.png");
    game.load.image("floor", "assets/images/floor.png");
    game.load.audio("jump", "assets/sounds/Jump.mp3");
    game.load.audio("song", "assets/sounds/Song.mp3");
    game.load.image("platform-3", "assets/images/platform-3.png");
    game.load.image("platform-4", "assets/images/platform-4.png");
    game.load.image("platform-5", "assets/images/platform-5.png");
    game.load.spritesheet("coin", "assets/images/coin.png", 31, 31);
    game.load.audio("coinSound", "assets/sounds/Coin.mp3");
}

function create() {
    //sound
    jump = game.add.audio('jump', 0.05);
    song = game.add.audio('song', 0.1);
    coinSong = game.add.audio('coinSound', 0.05);

    //Background
    sky = game.add.tileSprite(0, 0, 1000, 600, 'sky');
    mountain = game.add.tileSprite(0, 0, 1000, 600, 'mountain');
    sky.fixedToCamera = true;
    mountain.fixedToCamera = true;
    // floor = game.add.sprite(-110, 0, 1912, 110, 'floor');

    //Coins
    coinGroup = game.add.group();
    coinGroup.enableBody = true;

    // Do NOT copy-and-paste again (same data)
    // JSON array listing coin positions
    var coinData = [
        { x:75, y:0 }, { x:150, y:0 }, { x:250, y:250 },
        { x:275, y:0 }, { x:350, y:0 }, { x:450, y:300 },
        { x:475, y:0 }, { x:537, y:0 }, { x:650, y:0 },
        { x:700, y:400 }, { x:850, y:0 }, { x:950, y:0 },
        { x:1050, y:0 }, { x:1175, y:0 }, { x:1375, y:0 }
        // no comma after last item in array
    ];

    for (var i = 0; i < coinData.length; i++) {
        var coin = coinGroup.create(coinData[i].x, coinData[i].y, 'coin');
        coin.body.gravity.y = 400;
        coin.anchor.set(0.5, 0.5);
        coin.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true);
        coin.animations.play('spin');
    }

    //Score
    scoreText = game.add.text(20,20, "Coins: " + score, { fontSize: '20px', fill: '#222222' })

    // PLATFORMS
    platformGroup = game.add.group();
    platformGroup.enableBody = true;

    platformGroup.create(200, 480, 'platform-3');
    platformGroup.create(400, 420, 'platform-4');
    platformGroup.create(600, 360, 'platform-5');

    //Song
    song.play();
    song.loop = true;

    // add ground platform
    var ground = platformGroup.create(0, game.world.height - 25, 'floor');

    platformGroup.setAll('body.immovable', true);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(25, 300, "mario");
    player.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;

    //camera
    game.world.setBounds(0, 0, 5000, 600);
    game.camera.follow(player);
    game.add.text(1000, 300, 'You got this!', { fill: 'white' });

    //input
    arrowKey = game.input.keyboard.createCursorKeys();

    //animation
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('turn', [4], 20, true);
}

function update() {
    game.physics.arcade.collide(player, platformGroup);
    game.physics.arcade.collide(coinGroup, platformGroup);

    game.physics.arcade.collide(player, coinGroup, collectCoin, null, this);

    function collectCoin(player, coin) {
        coin.kill();
        scoreText = (20,20, "Coins: " + score++, { fontSize: '20px', fill: '#222222' }); 
        coinSong.play();
    }

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
    if (arrowKey.up.isDown && player.body.touching.down) {
        // make player jump
        player.body.velocity.y = -300;
        jump.play();
    }

    //Follow Cam
    sky.tilePosition.x = game.camera.x * -0.2;
    mountain.tilePosition.x = game.camera.x * -0.3;
    scoreText.Position.x = game.camera.fixedToCamera;
}

// add custom functions (for collisions, etc.)