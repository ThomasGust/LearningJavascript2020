var canvasWidth = 640 * 1.4;
var canvasHeight = 600 * 1.4;

var player = 0;
var playerX = 300;
var playerY = 100;
var sprWidth = 64;
var sprHeight = 64;
var speed = 4;

var monster = 0;
var monsterX = 300;
var monsterY = 300;

var monster2 = 0;
var monster2X = 300;
var monster2Y = 200;


var ghost = 0;
var ghostX = 300;
var ghostY = 500;

var projectile = 0;

var direction = 90;

var score = 0;


var waves = 0;

var wave_num_enemies = 5;
var wave_interval = 10000;

var coins = 0;
var enemyCoins = 0;
var num_enemies_spawned = 0;

var song;

function preload() {
    playerImg = loadImage("images/Sap.png");
    bgImg = loadImage("images/First Level.png");
    projImg = loadImage("images/donut.png");
    projImg2 = loadImage("images/projectile.png");
    song = loadSound("music/DarkDnb_1.mp3", loaded);
    console.log("Preloaded song")

}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    player = createSprite(playerX, playerY, sprWidth, sprHeight);
    player.addImage(playerImg, "images/Sap.png");
    
    projectile = new Group();
    enemy = new Group();
    coin = new Group();
   
    player.setCollider("rectangle", 0, 0, 40, 40);

}

function loaded(){
    song.play();
    song.loop();
}

function playerControls() {
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        player.position.x += speed;
        if (player.position.x + sprWidth/2 > canvasWidth) {
            player.position.x = canvasWidth - sprWidth/2;
        }
    } else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        player.position.x -= speed;
        if (player.position.x < 0 + sprWidth/2) {
            player.position.x = 0 + sprWidth/2;
        }
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        player.position.y += speed;
        if (player.position.y + sprHeight/2 > canvasHeight) {
            player.position.y = canvasHeight - sprHeight/2;
        }
    } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        player.position.y -= speed;
        if (player.position.y < 0 + sprHeight/2) {
            player.position.y = 0 + sprHeight/2;
        }
    }
}



function collisions(){
    enemy.overlap(projectile, destroyOther);
    player.collide(enemy, gameOver);
    coin.overlap(player, collectCoin);
    coin.overlap(enemy, enemyCollectCoin);
}


function destroyOther (destroyed) {
    destroyed.remove();
    projectile.remove();
    score++
 }
 
 function collectCoin(coin){
     coin.remove();
     coins++
 }

 function enemyCollectCoin(coin){
     coin.remove();
     enemyCoins++
 }


function gameOver(){
    alert("GAME OVER. Total score: " + calculateTotalScore() + ". Waves: " + waves);
    score = 0;
    waves = 0;
    wave_num_enemies = 5;
    wave_interval = 10000;
    num_enemies_spawned = 0;
    enemyCoins = 0;
    window.location.reload();

}

function mousePressed(){
    projectile = createSprite(player.position.x, player.position.y);

    var random_num = Math.random();

    if(random_num > 0.5){
        projectile.addImage(projImg);
    }
    else{
        projectile.addImage(projImg2);
    }
    projectile.attractionPoint(10 + speed, mouseX, mouseY);
    projectile.setCollider("rectangle", 0, 0, 40, 40);
    
}

function randomNumber(min, max) {  
    return Math.random() * (max - min) + min;
} 


function createEnemy(x,y){
    var newEnemy = createSprite(x,y)
    var possibleTextures = ["enemy.png", "monster.png", "ghost.png"];

    var lenPossibleTextures = possibleTextures.length;
    var textureIndex = Math.floor(Math.random() * lenPossibleTextures);
    var attackImg = loadImage("images/" + possibleTextures[textureIndex]);

    speed = randomNumber(2, 3);

    newEnemy.addImage(attackImg);
    newEnemy.setSpeed(speed, random(360));
    newEnemy.setCollider("rectangle", 0, 0, 40, 40); 

    enemy.add(newEnemy);

    num_enemies_spawned++;
}

function createEnemyWave(numEnemy){

    for (var i = 0; i < numEnemy; i++) {
        var ang = random(360); 
        var px = canvasWidth/2 + 10000 * ang;
        var py = canvasHeight/2 + 10000 * ang;

        createEnemy(px, py);
    }
}

function createCoin(x,y){
    var newCoin = createSprite(x,y)
    var coinImage = loadImage("images/gold_coin.png");


    newCoin.addImage(coinImage);
    newCoin.setCollider("rectangle", 0, 0, 40, 40); 

    coin.add(newCoin);
}

function distributeCoins(numCoins){

    for (var i = 0; i < numCoins; i++){


        var centerWidth = canvasWidth/2;
        var centerHeight = canvasHeight/2;

        var widthAdditive = randomNumber(0, centerWidth);
        var widthNegator = randomNumber(0, centerWidth);

        var heightAdditive = randomNumber(0, centerHeight);
        var heightNegator = randomNumber(0, centerHeight);

        var px = (centerWidth + widthAdditive) - widthNegator;
        var py = (centerHeight + heightAdditive) - heightNegator;

        createCoin(px, py);

    }
}


function waveManager(){


    createEnemyWave(wave_num_enemies);

    var coinsToDistribute = Math.ceil(wave_num_enemies / 2);

    distributeCoins(coinsToDistribute);

    if(wave_num_enemies <= 50){
        wave_num_enemies++;
    }

    if(wave_interval >= 2000){
        wave_interval -= 5;
    }
    waves++
}

setInterval(waveManager, wave_interval);

function calculateTotalScore(){
    var waveScore = waves;
    var coinScore = coins * 2;

    var totalScore = (((score + waveScore) + coinScore) - calculateEnemyScore());

    return totalScore;
}

function calculateEnemyScore(){

    var enemyCoinScore = enemyCoins * 4;

    var enemyScore = Math.floor(enemyCoinScore + (num_enemies_spawned/3));

    return enemyScore;
}

function displayStatus(){

    fullScore = calculateTotalScore();

    scoreWithCoins = score + coins;

    document.getElementById("score").innerHTML = "Score: " + scoreWithCoins;
    document.getElementById("waves").innerHTML = "Waves: " + waves;
    document.getElementById("enemyCoins").innerHTML = "Enemy score: " + calculateEnemyScore();
    document.getElementById("totalScore").innerHTML = "Total score: " + fullScore;
}

function updateSpeed(){
    speed += 0.1
}

setInterval(updateSpeed, 5000)

function draw() {
    displayStatus();
    background(bgImg);
    playerControls();
    collisions();

    for (var i = 0; i < enemy.length; i++) {
        var s = enemy[i];
        if (s.position.x < -40) s.position.x = canvasWidth +40;
        if (s.position.x > canvasWidth + 40) s.position.x = -40;
        if (s.position.y < -40) s.position.y = canvasHeight +40; 
        if (s.position.y > canvasHeight + 40) s.position.y = -40;
    }

    drawSprites();

}

setInterval(draw, 10);