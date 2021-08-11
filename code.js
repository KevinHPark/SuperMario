// const { Time } = require("phaser-ce");

var game = new Phaser.Game(1000, 580, Phaser.AUTO, 'superMario', { preload: preload, create: create, update: update });

var player, arrowKeys, sky, mountain, floor, platformGroup, jump, coinGroup, score = 0, scoreText, coinSong, enemy, Timer, Lives = 3, deathSong;

var TimeWhenLevelStarted = Date.now()

function preload() {
    //Background
    game.load.image("sky", "assets/images/sky.png");
    game.load.image("mountain", "assets/images/mountain.png");
    game.load.image("floor", "assets/images/floor.png");

    //Platform
    game.load.image("platform-3", "assets/images/platform-3.png");
    game.load.image("platform-4", "assets/images/platform-4.png");
    game.load.image("platform-5", "assets/images/platform-5.png");
    
    //Wall
    game.load.image("pipe", "assets/images/wall1.png");
    game.load.image("pipe2", "assets/images/wall2.png");

    //Sprite Sheet
    game.load.spritesheet("coin", "assets/images/coin.png", 31, 31);
    game.load.spritesheet("mario", "assets/images/mario.png", 32, 48);
    game.load.spritesheet("goom", "assets/images/enemy.png", 33, 33);

    //Audio
    game.load.audio("coinSound", "assets/sounds/Coin.mp3");
    game.load.audio("jump", "assets/sounds/Jump.mp3");
    game.load.audio("song", "assets/sounds/Song.mp3");
    game.load.audio("death", "assets/sounds/Death.mp3");
}

function create() {
    //sound
    jump = game.add.audio('jump', 0.05);
    song = game.add.audio('song', 0.1);
    coinSong = game.add.audio('coinSound', 0.05);
    deathSong = game.add.audio('death', 0.05);

    //Background
    sky = game.add.tileSprite(0, 0, 1000, 600, 'sky');
    mountain = game.add.tileSprite(0, 0, 1000, 600, 'mountain');
    sky.fixedToCamera = true;
    mountain.fixedToCamera = true;

    //Coins
    coinGroup = game.add.group();
    coinGroup.enableBody = true;

    var coinData = [
        { x: 220, y: 350 }, { x: 280, y: 350 }, { x: 420, y: 400 },
        { x: 465, y: 400 }, { x: 510, y: 400 },
        { x: 700, y: 400 }, { x: 850, y: 0 }, { x: 950, y: 0 },
        { x: 1050, y: 0 }, { x: 1175, y: 0 }, { x: 1375, y: 0 }
    ];

    for (var i = 0; i < coinData.length; i++) {
        var coin = coinGroup.create(coinData[i].x, coinData[i].y, 'coin');
        coin.body.gravity.y = 400;
        coin.anchor.set(0.5, 0.5);
        coin.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true);
        coin.animations.play('spin');
    }


    //enemy
    goomGroup = game.add.group()
    goomGroup.enableBody = true;

    var goomData = [
        { x: 250, y: 350 },
        { x: 250, y: 500 }, 
        { x: 480, y: 400 }, { x: 480, y: 500 }, 
        { x: 700, y: 400 }, { x: 850, y: 0 }, { x: 950, y: 0 },
        { x: 1050, y: 0 }, { x: 1175, y: 0 }, { x: 1375, y: 0 }
    ];

    for (var i = 0; i < goomData.length; i++) {
        var goom = goomGroup.create(goomData[i].x, goomData[i].y, 'goom');
        goom.body.gravity.y = 300;
        goom.anchor.set(0.5, 0.5);
        goom.body.collideWorldBounds = true;
        goom.animations.add('left', [0, 1], 10, true);
        goom.animations.add('right', [2, 3], 10, true);
        goom.body.velocity.x = Math.random() * 10 + 20; 
        if (Math.random() < 0.5) goom.body.velocity.x *= -1;
    }

    //Score
    scoreText = game.add.text(20, 20, "Coins: " + score, { font: '64px Courier', fontSize: '20px', fill: '#222222' })
    scoreText.setShadow(1, 1, '#000000', 2);
    Timer = game.add.text(500, 20, "Time : " + (Date.now() - TimeWhenLevelStarted), { font: '64px Courier', fontSize: '20px', fill: '#222222' })
    Timer.setShadow(1, 1, '#000000', 2);

    coin.body.gravity.y = 400;
    coin.anchor.set(0.5, 0.5);
    coin.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true);
    coin.animations.play('spin');

    // PLATFORMS
    platformGroup = game.add.group();
    platformGroup.enableBody = true;

    platformGroup.create(200, 480, 'platform-3');
    platformGroup.create(400, 420, 'platform-4');
    platformGroup.create(600, 360, 'platform-5');

    // Walls
    wallGroup = game.add.group();
    wallGroup.enableBody = true;

    wallGroup.create(20, 515, 'pipe2');
    wallGroup.create(450, 490, 'pipe2');

    //Song
    song.loop = true;
    song.play();

    // add ground platform
    var ground = platformGroup.create(0, game.world.height - 25, 'floor');

    platformGroup.setAll('body.immovable', true);
    wallGroup.setAll('body.immovable', true);

    //Player
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

function FormatInt(int) {
    let formattedNumber = int.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    return formattedNumber;
}

//Timer of DOom
function FormatTime(Seconds) {
    let Minutes = (Seconds - Seconds % 60) / 60;
    Seconds = Seconds - Minutes * 60;
    let Hours = (Minutes - Minutes % 60) / 60;
    Minutes = Minutes - Hours * 60;
    Hours = FormatInt(Hours)
    Minutes = FormatInt(Minutes)
    Seconds = FormatInt(Math.floor(Seconds))
    return {
        Hours,
        Minutes,
        Seconds,
    };
}

function update() {
    game.physics.arcade.collide(player, platformGroup);
    game.physics.arcade.collide(coinGroup, platformGroup);
    game.physics.arcade.collide(goomGroup, platformGroup, roamingPlatform, null, this);
    game.physics.arcade.collide(goomGroup, wallGroup);
    game.physics.arcade.collide(player, wallGroup);
    game.physics.arcade.collide(player, coinGroup, collectCoin, null, this);
    game.physics.arcade.collide(player, goomGroup, playerDeath, null, null);

    function playerDeath(player, goom){
        goom.kill();
        deathSong.play();
        game.camera.shake(0.02, 250);
        player.kill();
        song.stop();
    }

    //enemy
    goomGroup.forEach(function (goom) {
        if (goom.body.velocity.x < 0) goom.animations.play('left');
        else goom.animations.play('right');
    });
    function roamingPlatform(enemy, platform) {
        if (enemy.body.velocity.x > 0 && enemy.right > platform.right
            || enemy.body.velocity.x < 0 && enemy.left < platform.left) {
            enemy.body.velocity.x *= -1; 
        }
    }

    //Coin
    function collectCoin(player, coin) {
        coin.kill();
        scoreText.text = "Coins: " + score++
        coinSong.play();
    }


    //User input
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
    let FormattedTime = FormatTime((Date.now() - TimeWhenLevelStarted) / 1000);
    Timer.text = "Time : " + FormattedTime.Hours + ":" + FormattedTime.Minutes + ":" + FormattedTime.Seconds;
    scoreText.x = game.camera.x;
    Timer.x = (game.camera.x + 500) - (Timer.width / 2);
}
