'use strict';

var level1 = [
    [length, 320],
    ["pipe", 20, 16],
    ["pipe", 100, 36],
    ["pipe", 180, 16],
    ["pipe", 250, 16],
    ["bonus", 150, 30],
    ["bonus", 150, 60],
    ["enemy", 50],
    ["enemy", 130],
    ["platform", 30, 35, 48]
]

var levelLength;

var groundFriction = 1;

var bonusGeometry, bonusTexture, bonusMaterial,
    pipeMaterial, pipeGeometry, pipeTopGeometry,
    enemyGeometry, enemyTexture, enemyMaterial,
    platformGeometry, platformTexture, platformMaterial;

function buildLevel(level){

    levelLength = level[0][1];

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
        new THREE.MeshLambertMaterial( {map: bonusTexture } ), 0, 0);

    pipeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(0,255,0)"} ), groundFriction, 0);
    pipeTopGeometry = new THREE.CylinderGeometry(6, 6, 2, 40);

    enemyGeometry = new THREE.SphereGeometry(4,10,10);
    enemyTexture = new THREE.ImageUtils.loadTexture("texture/carbon.png");
    enemyMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: enemyTexture} ), 0, 0);

    platformTexture = new THREE.ImageUtils.loadTexture("texture/box.jpg");
    platformMaterial = new Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {map: platformTexture } ), groundFriction, 0);
}

function addBackground(){
    var backgroundGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var backgroundTexture = new THREE.ImageUtils.loadTexture("texture/desert.jpg");
    var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture, side: THREE.BackSide} );
    background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    background.position.set(0, 0, 0);
    background.name = "background";
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
    scene.add(ground);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(levelLength/8,1);
}

function addWalls(){
    var wallGeometry;
    var wallMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial( {transparent: true, opacity: 0} ), 0, 0);

    wallGeometry = new THREE.PlaneGeometry( 8, 70, 1);
    wall = new Physijs.PlaneMesh(wallGeometry, wallMaterial, 0);
    wall.position.set(-4.5, 35, 0);
    wall.rotation.y = Math.PI / 2;
    wall.name = "wall";
    scene.add(wall);

    wallGeometry = new THREE.PlaneGeometry( levelLength, 8, 1);
    wall = new Physijs.PlaneMesh(wallGeometry, wallMaterial, 0);
    wall.position.set(196, 70, 0);
    wall.rotation.x = Math.PI / 2;
    wall.name = "wall";
    scene.add(wall);
}

function addMario(){
    var marioGeometry = new THREE.BoxGeometry(8, 8, 8);
    var marioMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(255,0,0)"} ), 1, 0);
    mario = new Physijs.BoxMesh(marioGeometry, marioMaterial, 1);
    mario.position.set(0, 4.1, 0);
    mario.name = "mario";
    scene.add(mario);
    mario.setAngularFactor(new THREE.Vector3(0, 0, 0));
}

function addFinish(){
    var mastGeometry = new THREE.CylinderGeometry(0.5,0.5,24,8);
    var mastMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(28,28,28)"} ), 0, 0);
    var mast = new Physijs.CylinderMesh(mastGeometry, mastMaterial, 0);
    mast.position.set(levelLength-10,12,0);

    var flagGeometry = new THREE.BoxGeometry(10,6,0.5);
    var flagMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "rgb(255,255,0)"} ), 0, 0);
    var flag = new Physijs.BoxMesh(flagGeometry, flagMaterial, 0);
    flag.position.set(5,9,0);

    mast.add(flag);
    mast.name = "finish";
    scene.add(mast);
}

function addBonus(x, y){
    bonus = new Physijs.BoxMesh(bonusGeometry, bonusMaterial, 0);
    bonus.position.set(x+4, y, 0);
    bonus.name = "bonus";
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
    scene.add(pipe);
}

function addEnemy(x){
    enemy = new Physijs.SphereMesh(enemyGeometry, enemyMaterial, 1);
    enemy.position.set(x, 4.2, 0);
    enemy.name = "enemy";
    enemyList.push(enemy);
    scene.add(enemy);
}

function addPlatform(x, y, length){
    platformGeometry = new THREE.BoxGeometry(length, 8, 8);
    platform = new Physijs.BoxMesh(platformGeometry, platformMaterial, 0);
    platform.position.set(x+length/2, y, 0);
    platform.name = "platform";
    scene.add(platform);
    platformTexture.wrapS = THREE.RepeatWrapping;
    platformTexture.wrapT = THREE.RepeatWrapping;
    platformTexture.repeat.set(length/8,1);

}