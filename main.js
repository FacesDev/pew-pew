var game = new Phaser.Game(800, 600, Phaser.CANVAS, "gameDiv");

var treeBackground;
var backgroundSpeed;
var player;
var cursors;
var bullets;
var bulletTime = 0;
var fireButton;
var enemies;

var score = 0;
var scoreText;
var winText;



var gameState = {

    preload: () => {
        game.load.image('treeBackground', 'assets/tree.jpg');
        game.load.image('player', 'assets/bird.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('enemy', 'assets/enemy.png');

    },

    create: () => {
        treeBackground = game.add.tileSprite(0, 0, 800, 600, 'treeBackground');

        backgroundSpeed = -2;

        player = game.add.sprite(game.world.centerX + -400, game.world.centerY + 100, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();

        bullets = game.add.group();
        bullets.enableBody= true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(8, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        createEnemies();

        scoreText = game.add.text(0,550,"Score: ",{font: '32px Arial', fill : '#fff'});
        winText = game.add.text(game.world.centerX,game.world.centerY, "You Win!",{font: '32px Arial',fill: '#fff'});
        winText.visible = false;

    },

    update: () => {

        game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
      

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;


        treeBackground.tilePosition.x += backgroundSpeed;

        if (cursors.left.isDown) {
            player.body.velocity.x = -350;
        }
        else if(cursors.right.isDown)
        {
            player.body.velocity.x = 350;
        }
        else if(cursors.up.isDown)
        {
            player.body.velocity.y = -400;
        }
        else if(cursors.down.isDown)
        {
            player.body.velocity.y = 400;
        }


        if(fireButton.isDown){
            fireBullet();
        }
        scoreText.text = "Score: " + score;

        if(score == 160){
            winText.visible = true;
            scoreText.visible = false;
        }
     
    },

    render: () => {

        // game.debug.spriteInfo(sprite, 32, 32);

    }

};

function fireBullet(){
    if(game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet){
            bullet.reset(player.x + 60,player.y + 150);
            bullet.body.velocity.x = 700;
            bulletTime = game.time.now + 200;
        }
    }
};

function createEnemies() {
    for( var y = 0; y< 4; y++){
        for(var x =0; x< 4; x++ ){
            var enemy = enemies.create(x*100,y*100, 'enemy');
            enemy.anchor.setTo(0.5,0.5);
        }
    }
    enemies.x = 850;
    enemies.y = 250;

    var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true);
    
    tween.onLoop.add(descend,this);

    
};
function descend(){
    enemies.y += 2;
};

function collisionHandler(bullet, enemy){
    bullet.kill();
    enemy.kill();
    score += 10;

}

game.state.add('gameState', gameState);

game.state.start('gameState');