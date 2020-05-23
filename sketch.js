var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage, gameState, PLAY, LOSE;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, reset, resetImg, gameOver, overImg, checkPoint, die, jump;

localStorage["HighestScore"] = 0;

function preload(){
  checkPoint = loadSound('checkPoint.mp3');
  die = loadSound('die.mp3');
  jump = loadSound('jump.mp3')
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  resetImg = loadImage("restart.png");
  overImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(600, 200);
  
  reset = createSprite(300, 100, 10, 10);
  reset.addImage("restart", resetImg);
  reset.scale = 0.5;
  
  gameOver = createSprite(300, 60, 10, 10);
  gameOver.addImage("overImg", overImg);
  gameOver.scale = 0.5;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  PLAY = 1;
  LOSE = 0;
  gameState = PLAY;
}

function draw() {
  background(250);
  
  text("Score: "+ score, 500,50);
 
  trex.collide(invisibleGround);
  
  if (gameState === PLAY) {
    reset.visible = false;
    gameOver.visible = false;
    
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space") && (trex.y >= 159)) {
      trex.velocityY = -14;
      jump.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
      
     }
     
    if (trex.isTouching (obstaclesGroup)) {
      gameState = LOSE;
      die.play();
    }
   
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();
    spawnObstacles();
    
    ground.velocityX = -4 -(score/100);
    
    if (score%100 === 0) {
      checkPoint.play();
    }
  }
  
  else if (gameState === LOSE) {
    obstaclesGroup.setVelocityXEach (0);
    cloudsGroup.setVelocityXEach (0);
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    obstaclesGroup.setLifetimeEach (-1);
    cloudsGroup.setLifetimeEach (-1);
  
    trex.changeAnimation("collided", trex_collided);
    
    reset.visible = true;
    gameOver.visible = true;
    
    if (mousePressedOver(reset)) {
      restart();
    }
  }
  
  drawSprites();
}

function restart() {
  gameState = PLAY;
  
  trex.changeAnimation("running", trex_running);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  
  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  
  console.log(localStorage["HighestScore"]);
}  

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3 -(score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4 -(score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
