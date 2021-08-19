const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

var tower,ground,cannon,cannonBall;
var engine, world;
var balls=[];
var boats = [];
var boat;
var boatAnimation = [];
var boatSpriteData,boatSpriteSheet
var bbAnimation = [];
var bbSpriteSheet,bbJSON;
var waterSplashAnimation =  [];
var waterSplashJSON,waterSplashSpriteSheet;
var score = 0;
var bgdMusic
var cannonShot
var cannonWater
var laugh
var isLaughing = false;

function preload(){
    bgd = loadImage("/assets/background.gif");

    boatSpriteData =loadJSON("/assets/boat/boat.json"); 
    boatSpriteSheet = loadImage("/assets/boat/boat.png");

    bbJSON =loadJSON("/assets/BrokenBoat/sinkingBoat.json"); 
    bbSpriteSheet = loadImage("/assets/BrokenBoat/sinkingBoat.png");

    waterSplashJSON =loadJSON("/assets/water_splash/water_splash.json"); 
    waterSplashSpriteSheet = loadImage("/assets/water_splash/water_splash.png");

    bgdMusic = loadSound("/assets/background_music.mp3")
    cannonShot = loadSound("/assets/cannon_explosion.mp3")
    cannonWater = loadSound("/assets/cannon_water.mp3")
    laugh = loadSound("/assets/pirate_laugh.mp3")
}

function setup(){
    var canvas = createCanvas(1200,600);
    engine = Engine.create();
    world = engine.world;

    angle = -PI/4

    tower = new Tower(150, 350, 160, 310);
    ground = new Ground(600,580,1200,20)
    cannon = new Cannon(180, 110, 100, 50, angle);

    var boatFrames = boatSpriteData.frames;
    
    for(var i=0; i<boatFrames.length; i++){
        var pos = boatFrames[i].position;
        var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
        boatAnimation.push(img);
    }

    var bbFrames = boatSpriteData.frames;
    
    for(var i=0; i<bbFrames.length; i++){
        var pos = bbFrames[i].position;
        var img = bbSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
        bbAnimation.push(img);
    }

    var WSFrames =waterSplashJSON.frames;
    
    for(var i=0; i<WSFrames.length; i++){
        var pos = WSFrames[i].position;
        var img = waterSplashSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
        waterSplashAnimation.push(img);
    }
    
   
}

function draw(){
    background(220);
    imageMode(CENTER);
    image(bgd,600,300,1200,600);
    //image(boatAnimation,200,200,200,200);
    Engine.update(engine);
   
    tower.display();
    cannon.display();
    showBoats();

    if (!bgdMusic.isPlaying()){
        bgdMusic.play();
        bgdMusic.setVolume(0.1)
    }

    for(var i=0; i< balls.length; i++){
        showCannonBalls(balls[i],i);
        for(var j=0 ; j<boats.length ; j++){
            if(balls[i]!== undefined && boats[i]!== undefined){
                var collision = Matter.SAT.collides(balls[i].body,boats[j].body);
                //console.log(collision);
                if(collision.collided){
                    if (!boats[j].isBroken && !balls[i].isSink){
                        score = score + 5
                        boats[j].remove(j);
                        j--;
                    }
                        
                   
                        Matter.World.remove(world,balls[i].body);
                        balls.splice(i,1);
                        i--;
                    
                console.log("Inside If");
                }
            }
        }
    }
    fill("black")
    textSize(20)
    text("Score:" + score,width-120,60);
    
}


function keyReleased(){
    if(keyCode === DOWN_ARROW){
        balls[balls.length-1].shoot();
        cannonShot.play()
    }
   
}

function keyPressed(){
    if(keyCode === DOWN_ARROW){
        cannonBall = new CannonBall(cannon.x,cannon.y);
        balls.push(cannonBall);
    }
}

function showCannonBalls(ball,index){
    ball.display();
    if(ball.body.position.x >= width || ball.body.position.y>= height-150){
        if(!ball.isSink){
            cannonBall.remove(index);
            cannonWater.play()
        }
    
    }
}

function showBoats(){
    
    if(boats.length > 0){
        if(boats.length < 4 && boats[boats.length-1].body.position.x  < width-300){
            var positions = [-50,-20,-10,-40];
            var pos = random(positions);
            boat = new Boat(width,height-100,200,200,pos,boatAnimation);
            boats.push(boat);
        }
        for(var i = 0; i< boats.length; i++){
            boats[i].display();
            boats[i].animate();
            Matter.Body.setVelocity(boats[i].body, {x: -0.9,y:0});
            var collision = Matter.SAT.collides(tower.body,boats[i].body)
            if (collision.collided && !boats[i].isBroken){
               
                if(!isLaughing && !laugh.isPlaying()){
                    laugh.play()
                    isLaughing = true;
                }
                gameOver();
                
            }
        }    
    }
    else{
        
        boat = new Boat(width,height-100,200,200,-10,boatAnimation);
        boats.push(boat);
    }
}

function gameOver(){
    swal({
        title:"Game Over",
        text:"thanks for playing",
        imageURL:'https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png',
        imageSize:"150x150",
        confirmButtonText:"Play Again"
    },
    function (isConfirm){
        if (isConfirm){
            location.reload()
        }
    })
}