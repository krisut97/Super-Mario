'use strict';

var levelLength;
var groundFriction = 5;
var bonusGeometry, bonusTexture, bonusMaterial,
    pipeMaterial, pipeGeometry, pipeTopGeometry,
    enemyGeometry, enemyTexture, enemyMaterial,
    platformGeometry, platformTexture, platformMaterial,
    scoreObjectGeometry, scoreObjectMaterial;

var loader = new THREE.FontLoader();

function buildLevel(level){

    levelLength = level[1][1];

    createGeometriesAndMaterials();

    addBackground();
    addGround();
    addWalls();
    addMario();
    addFinish();

    for (let i = 0; i < level.length; i++){
        switch (level[i][0]){
            case "pipe":
                addPipe(level[i][1], level[i][2]);
                break;
            case "bonus":
                addBonus(level[i][1], level[i][2]);
                break;
            case "enemy":
                addEnemy(level[i][1]);
                break;
            case "platform":
                addPlatform(level[i][1], level[i][2], level[i][3]);
                break;
            default:
                break;
        }
    }
}

function createGeometriesAndMaterials(){
    bonusGeometry = new THREE.BoxGeometry(8, 8, 8);
    bonusTexture = new THREE.ImageUtils.loadTexture("texture/bonus.png");
    bonusMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: bonusTexture } ), groundFriction, 0);

    pipeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(0,255,0)"} ), groundFriction, 0);
    pipeTopGeometry = new THREE.CylinderGeometry(6, 6, 2, 40);

    // enemyGeometry = new THREE.SphereGeometry(4,60,60);
    enemyGeometry = new THREE.CylinderGeometry(0.001,0.001,8);
    enemyTexture = new THREE.ImageUtils.loadTexture("texture/carbon.png");
    enemyMaterial = Physijs.createMaterial(
        new THREE.MeshPhongMaterial( {map: enemyTexture} ), 0, 0);

    platformTexture = new THREE.ImageUtils.loadTexture("texture/box.jpg");
    platformMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: platformTexture } ), groundFriction, 0);

    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
        scoreObjectGeometry = new THREE.TextGeometry( '+100', {
            font: font,
            size: 4,
            height: 0.5,
            curveSegments: 5,
        } );
        scoreObjectGeometry.center();
        scoreObjectMaterial = new THREE.MeshNormalMaterial({color: 0x00ff00});
        scoreObject = new THREE.Mesh(scoreObjectGeometry, scoreObjectMaterial);
        scoreObject.name = "scoreText";
    } );
}

function addBackground(){
    var backgroundGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var backgroundTexture = new THREE.ImageUtils.loadTexture("texture/desert.jpg");
    var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture, side: THREE.BackSide} );
    background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.set(0, 0, 0);
    background.name = "background";
    objectList.push(background);
    scene.add(background);
}

function addGround(){
    var groundGeometry = new THREE.BoxGeometry(levelLength, 8, 8);
    var groundTexture = new THREE.ImageUtils.loadTexture("texture/box.jpg");
    var groundMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: groundTexture } ), groundFriction, 0);
    ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
    ground.position.set(levelLength/2-4, -4, 0);
    ground.name = "ground";
    objectList.push(ground);
    scene.add(ground);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(levelLength/8,1);
}

function addWalls(){
    var wallGeometry;
    var wallMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial( {transparent: true, opacity: 0} ), 0, 0);

    wallGeometry = new THREE.PlaneGeometry( 8, 150, 1);
    wall = new Physijs.PlaneMesh(wallGeometry, wallMaterial, 0);
    wall.position.set(-4.5, 75, 0);
    wall.rotation.y = Math.PI / 2;
    wall.name = "wall";
    objectList.push(wall);
    scene.add(wall);

    wallGeometry = new THREE.PlaneGeometry( levelLength, 8, 1);
    wall = new Physijs.PlaneMesh(wallGeometry, wallMaterial, 0);
    wall.position.set(196, 150, 0);
    wall.rotation.x = Math.PI / 2;
    wall.name = "wall";
    objectList.push(wall);
    scene.add(wall);
}

function addMario(){
    // var marioGeometry = new THREE.BoxGeometry(8, 8, 8);
    // var marioMaterial = Physijs.createMaterial(
    //     new THREE.MeshLambertMaterial( {color: "rgb(255,0,0)"} ), 1, 0);
    // mario = new Physijs.BoxMesh(marioGeometry, marioMaterial, 1);
    // mario.position.set(0, 4.2, 0);
    // mario.name = "mario";
    // objectList.push(mario);
    // scene.add(mario);
    // mario.setAngularFactor(new THREE.Vector3(0, 0, 0));

    var feet = new Physijs.BoxMesh( new THREE.CubeGeometry( 7, 0.7, 8 ), new THREE.MeshLambertMaterial({ color: "rgb(86,40,20)" }, 1, 0), 1 );
    var tips = new Physijs.BoxMesh( new THREE.CubeGeometry( 1, 0.7, 8 ), new THREE.MeshLambertMaterial({ color: "rgb(33,16,16)" }, 1, 0), 1 );
    var legs = new Physijs.BoxMesh( new THREE.CubeGeometry( 8, 3, 8 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,255)" }, 1, 0), 1 );
    mario = new Physijs.BoxMesh( new THREE.CubeGeometry( 7.9, 2.8, 7.8 ), new THREE.MeshLambertMaterial({ color: "rgb(255,0,0)" }, 1, 0), 1 );
    var rightArm = new Physijs.BoxMesh( new THREE.CubeGeometry( 2.5, 2, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,255)" }, 1, 0), 1 );
    var leftArm = new Physijs.BoxMesh( new THREE.CubeGeometry( 2.5, 2, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,255)" }, 1, 0), 1 );
    var rightHand = new Physijs.BoxMesh( new THREE.CubeGeometry( 2.2, 0.5, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(255,255,255)" }, 1, 0), 1 );
    var leftHand = new Physijs.BoxMesh( new THREE.CubeGeometry( 2.2, 0.5, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(255,255,255)" }, 1, 0), 1 );
    var rightStrip = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.1, 2.5, 0.5 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,255)" }, 1, 0), 1 );
    var leftStrip = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.1, 2.5, 0.5 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,255)" }, 1, 0), 1 );
    var rightButton = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.1, 0.5, 0.5 ), new THREE.MeshLambertMaterial({ color: "rgb(255,255,0)" }, 1, 0), 1 );
    var leftButton = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.1, 0.5, 0.5 ), new THREE.MeshLambertMaterial({ color: "rgb(255,255,0)" }, 1, 0), 1 );
    var head = new Physijs.BoxMesh( new THREE.CubeGeometry( 8, 1, 7.8 ), new THREE.MeshLambertMaterial({ color: "rgb(255,255,255)" }, 1, 0), 1 );
    var rightEye = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.8, 0.8, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,0)" }, 1, 0), 1 );
    var leftEye = new Physijs.BoxMesh( new THREE.CubeGeometry( 0.8, 0.8, 0.1 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,0)" }, 1, 0), 1 );
    var cap = new Physijs.BoxMesh( new THREE.CubeGeometry( 8, 0.5, 8 ), new THREE.MeshLambertMaterial({ color: "rgb(255,0,0)" }, 1, 0), 1 );

    feet.position.set(-0.5,-4.7,0);
    tips.position.set(3.5,-4.7,0);
    legs.position.set(0,-2.9,0);
    mario.position.set(0,5.5,0);
    rightArm.position.set(-0.8,0.2,4);
    leftArm.position.set(-0.8,0.2,-4);
    rightHand.position.set(-0.8,-1,4);
    leftHand.position.set(-0.8,-1,-4);
    rightStrip.position.set(4.05,-0.2,1.7);
    leftStrip.position.set(4.05,-0.2,-1.7);
    rightButton.position.set(4.1,0.5,1.7);
    leftButton.position.set(4.1,0.5,-1.7);
    head.position.set(0,1.9,0);
    rightEye.position.set(1.8,1.9,4);
    leftEye.position.set(1.8,1.9,-4);
    cap.position.set(0,2.6,0)

    mario.add( feet );
    mario.add( tips );
    mario.add( legs );
    mario.add( rightArm );
    mario.add( leftArm );
    mario.add( rightHand );
    mario.add( leftHand );
    mario.add( rightButton );
    mario.add( leftButton );
    mario.add( rightStrip );
    mario.add( leftStrip );
    mario.add( head );
    mario.add( rightEye );
    mario.add( leftEye );
    mario.add( cap );

    mario.name = "mario";
    objectList.push(mario);
    scene.add( mario );
    mario.setAngularFactor(new THREE.Vector3(0, 0, 0));
}

function addFinish(){
    var mastGeometry = new THREE.CylinderGeometry(0.5,0.5,24,8);
    var mastMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(28,28,28)"} ), 0, 0);
    mast = new Physijs.CylinderMesh(mastGeometry, mastMaterial, 0);
    mast.position.set(levelLength-10,12,0);

    var flagGeometry = new THREE.BoxGeometry(10,6,0.5);
    var flagMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(255,255,0)"} ), 0, 0);
    flag = new Physijs.BoxMesh(flagGeometry, flagMaterial, 0);
    flag.position.set(5,9,0);

    mast.add(flag);
    mast.name = "finish";
    objectList.push(mast);
    scene.add(mast);
}

function addBonus(x, y){
    bonus = new Physijs.BoxMesh(bonusGeometry, bonusMaterial, 0);
    bonus.position.set(x+4, y, 0);
    bonus.name = "bonus";
    objectList.push(bonus);
    scene.add(bonus);
}

function addPipe(x, height){
    pipeGeometry = new THREE.CylinderGeometry(4, 4, height, 40);
    pipe = new Physijs.CylinderMesh(pipeGeometry, pipeMaterial, 0);
    pipe.position.set(x,height/2, 0);

    pipeTop = new Physijs.CylinderMesh(pipeTopGeometry, pipeMaterial, 0);
    pipeTop.position.set(0,height/2+1,0);

    pipe.add(pipeTop);
    pipe.name = "pipe";
    objectList.push(pipe);
    scene.add(pipe);
}

function addEnemy(x){
    enemy = new Physijs.SphereMesh(enemyGeometry, enemyMaterial, 1);
    var rightFoot = new Physijs.SphereMesh( new THREE.SphereGeometry( 1, 60, 60 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,0)" }, 0, 0), 1 );
    var leftFoot = new Physijs.SphereMesh( new THREE.SphereGeometry( 1, 60, 60 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,0)" }, 0, 0), 1 );
    var torso = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 2, 4, 4 ), new THREE.MeshLambertMaterial({ color: "rgb(172,153,149)" }, 0, 0), 1 );
    var head = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 1.5, 5, 4 ), new THREE.MeshLambertMaterial({ color: "rgb(0,0,0)" }, 0, 0), 1 );
    var rightEye = new Physijs.SphereMesh( new THREE.SphereGeometry( 0.6, 60, 60 ), new THREE.MeshLambertMaterial({ color: "rgb(255,0,0)" }, 0, 0), 1 );
    var leftEye = new Physijs.SphereMesh( new THREE.SphereGeometry( 0.6, 60, 60 ), new THREE.MeshLambertMaterial({ color: "rgb(255,0,0)" }, 0, 0), 1 );

    enemy.position.set(x, 4.2, 0);
    rightFoot.position.set(2,-3,0);
    leftFoot.position.set(-2,-3,0);
    torso.position.set(0,0,0);
    head.position.set(0,3,0);
    rightEye.position.set(1.5,2.5,3);
    leftEye.position.set(-1.5,2.5,3);

    enemy.add(rightFoot);
    enemy.add(leftFoot);
    enemy.add(torso);
    enemy.add(head);
    enemy.add(rightEye);
    enemy.add(leftEye);

    enemy.name = "enemy";
    enemyList.push(enemy);
    objectList.push(enemy);
    scene.add(enemy);
    enemy.setAngularFactor(new THREE.Vector3(0, 0, 0));
}

function addPlatform(x, y, length){
    platformGeometry = new THREE.BoxGeometry(length, 8, 8);
    platform = new Physijs.BoxMesh(platformGeometry, platformMaterial, 0);
    platform.position.set(x+length/2, y, 0);
    platform.name = "platform";
    objectList.push(platform);
    scene.add(platform);
    platformTexture.wrapS = THREE.RepeatWrapping;
    platformTexture.wrapT = THREE.RepeatWrapping;
    platformTexture.repeat.set(length/8,1);
}