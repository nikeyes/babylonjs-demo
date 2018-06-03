var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

function getScene() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Purple();
    scene.collisionsEnabled = true;
    return scene;
}

function createCameras(scene) {
    //var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -20), scene);
    //var camera = new BABYLON.VRDeviceOrientationFreeCamera("vr-camera", new BABYLON.Vector3(0, 0, -20), scene);
    var camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, -20), scene);
    //camera.angularSensibility = 10;
    //camera.moveSensibility = 10;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    camera.checkCollisions = true;
    camera.attachControl(canvas, true);

    camera.onCollide = function (colMesh) {
		if (colMesh.name.includes("Sphere")) {
			colMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 100) //impulse
                , currentMesh.getAbsolutePosition());
		}
	}

    
/*
    let button = document.getElementById('vrButton');

    function attachWebVR() {
        camera.attachControl(canvas, true);
        window.removeEventListener('click', attachWebVR, false);
    }

    button.addEventListener('click', attachWebVR, false );
    */

    /*
        if (navigator.getVRDisplays) {
            camera = new BABYLON.WebVRFreeCamera("WebVRCamera", 
                        new BABYLON.Vector3(0, 2, 0), scene);
        }
        else {
            camera = new BABYLON.VRDeviceOrientationFreeCamera("WebVRFallbackCamera", 
                        new BABYLON.Vector3(0, 2, 0), scene);
        }
    */

}

function createLights(scene) {
    var light = new BABYLON.DirectionalLight("dir-light-01", new BABYLON.Vector3(0.2, -1, 0), scene);
    light.position = new BABYLON.Vector3(0, 80, 0);
    return light;
}

function createShadowGenerator(light) {
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 32;
    return shadowGenerator;
}

function createBallMaterial(scene) {
    var ballMaterial = new BABYLON.StandardMaterial("ball-material", scene);
    ballMaterial.diffuseTexture = new BABYLON.Texture("textures/adidas.png", scene);
    ballMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    return ballMaterial;
}

function enablePhysics(scene) {
    //scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
}

function createBalls(scene, ballMaterial, shadowGenerator) {
    var balls = [];
    for (var index = 0; index < 100; index++) {
        createBall(index, scene, ballMaterial, shadowGenerator, balls);
    }
    return balls;
}

function createBall(name, scene, ballMaterial, shadowGenerator, balls) {
    var sphere = BABYLON.Mesh.CreateSphere("Sphere" + name, 16, 3, scene);
    sphere.material = ballMaterial;
    sphere.position = new BABYLON.Vector3(Math.random() * 10, Math.random() * 250, Math.random() * 10);
    shadowGenerator.addShadowCaster(sphere);
    sphere.checkCollisions = true;
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
    balls.push(sphere);
}

function createFootballField(scene) {
    var groundMat = createFloor(scene);
    createFootballStands(scene);
    var marcador = createScore(scene);
    var goal = createGoal(scene);
    //createGoalKeeper(scene);
    return goal;
}

function createGoalKeeper(scene) {
    var goalKeeper = BABYLON.MeshBuilder.CreateBox("goal-keeper", {}, scene);

    goalKeeper.scaling = new BABYLON.Vector3(5, 20, 1);

    goalKeeper.position.y = 0.0;
    goalKeeper.position.x = 2.0;
    goalKeeper.position.z = 40.0;
    goalKeeper.checkCollisions = true;
    goalKeeper.physicsImpostor = new BABYLON.PhysicsImpostor(goalKeeper
        , BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0 }
        , scene);
   
    
    var frameRate = 10;
    var xSlide = new BABYLON.Animation("xSlide"
                                        , "position.x"
                                        , frameRate
                                        , BABYLON.Animation.ANIMATIONTYPE_FLOAT
                                        , BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFrames = []; 

    keyFrames.push({
        frame: 0,
        value: 30
    });

    keyFrames.push({
        frame: frameRate,
        value: -30
    });

    keyFrames.push({
        frame: 2 * frameRate,
        value: 30
    });

    xSlide.setKeys(keyFrames);

    scene.beginDirectAnimation(goalKeeper, [xSlide], 0, 2 * frameRate, true);
}
function createGoal(scene) {
    var goalMaterial = new BABYLON.StandardMaterial("goal-material", scene);
    goalMaterial.diffuseTexture = new BABYLON.Texture("textures/cuadrados.jpg", scene);
    goalMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    goalMaterial.diffuseTexture.uScale = 50;
    goalMaterial.diffuseTexture.vScale = 50;
    goalMaterial.alpha = 0.5;

    var goal = BABYLON.Mesh.CreateBox("goal", 1, scene);
    goal.scaling = new BABYLON.Vector3(60, 40, 1);
    goal.position.y = -5.0;
    goal.position.x = 0.0;
    goal.position.z = 50.0;
    goal.checkCollisions = true;
    goal.material = goalMaterial;
    goal.physicsImpostor = new BABYLON.PhysicsImpostor(goal
                                    , BABYLON.PhysicsImpostor.BoxImpostor
                                    , { mass: 0 }
                                    , scene);
    return goal;
}

function createScore(scene) {
     //Create dynamic texture
     var textureScore = new BABYLON.DynamicTexture("dynamic-texture", {width:100, height:100}, scene);   
     var materialScore = new BABYLON.StandardMaterial("score-material", scene);   
     materialScore.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5); 				
     materialScore.diffuseTexture = textureScore;
     textureScore.drawText(0, 10, 50, "bold 30px Arial", "green", "white", true, true);

    var score = BABYLON.Mesh.CreateBox("score", 1, scene);
    score.scaling = new BABYLON.Vector3(50, 10, 1);
    score.position.y = 20.0;
    score.position.x = 0.0;
    score.position.z = 50.0;
    score.material = materialScore;
}

function createFloor(scene) {
    var ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
    ground.scaling = new BABYLON.Vector3(100, 1, 100);
    ground.position.y = -5.0;
    var groundMat = new BABYLON.StandardMaterial("ground-material", scene);
    groundMat.diffuseTexture = new BABYLON.Texture("textures/field.jpg", scene);
    //groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    //groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    groundMat.backFaceCulling = false;
    ground.material = groundMat;
    ground.receiveShadows = true;
    // Physics
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground
                                                        , BABYLON.PhysicsImpostor.BoxImpostor
                                                        , { mass: 0, friction: 0.5, restitution: 0.7 }
                                                        , scene);
}


function createFootballStands(scene) {
    var standsMaterial = new BABYLON.StandardMaterial("stands-material", scene);
    //standsMaterial.diffuseTexture = new BABYLON.Texture("textures/field.jpg", scene);
    standsMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    standsMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    standsMaterial.backFaceCulling = false;

    var paredDerecha = BABYLON.Mesh.CreateBox("paredDerecha", 1, scene);
    paredDerecha.scaling = new BABYLON.Vector3(1, 100, 100);
    paredDerecha.position.y = -5.0;
    paredDerecha.position.x = 50.0;
    paredDerecha.checkCollisions = true;

    
    paredDerecha.material = standsMaterial;
    paredDerecha.physicsImpostor = new BABYLON.PhysicsImpostor(paredDerecha
                                                                , BABYLON.PhysicsImpostor.BoxImpostor
                                                                , { mass: 0 }
                                                                , scene);

    var paredIzquierda = BABYLON.Mesh.CreateBox("paredIzquierda", 1, scene);
    paredIzquierda.scaling = new BABYLON.Vector3(1, 100, 100);
    paredIzquierda.position.y = -5.0;
    paredIzquierda.position.x = -50.0;
    paredIzquierda.checkCollisions = true;
    paredIzquierda.material = standsMaterial;
    paredIzquierda.physicsImpostor = new BABYLON.PhysicsImpostor(paredIzquierda
                                                                    , BABYLON.PhysicsImpostor.BoxImpostor
                                                                    , { mass: 0 }
                                                                    , scene);
}



function registerEvents(scene, goal, ballMaterial, balls) {
    window.addEventListener("click", function (evt) {
        // We try to pick an object
        var pickResult = scene.pick(evt.clientX, evt.clientY);
        if (pickResult.hit) {
            currentMesh = pickResult.pickedMesh;
            // Calculate the direction using the picked point and the ball's position. 
            //var direction = pickResult.pickedPoint.subtract(currentMesh.position).normalize();
            // Give it a bit more power (scale the normalized direction).
            //var impulse = direction.scale(-20);
            currentMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 100) //impulse
                , currentMesh.getAbsolutePosition());
        }
    });


    var materialCollision = ballMaterial.clone('materialCollision');
    materialCollision.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);

    var goles = 0;
    //var ballsToRemove = ballsToRemove ||[];
    scene.registerBeforeRender(function() {
        /*for (var i = 0; i < ballsToRemove.length; i++) {
            var index = balls.indexOf(ballsToRemove[i]);
            if(index != -1) {
                balls.splice(index, 1);
                ballsToRemove[i].dispose();
            }
        }*/
        for (var i = 0; i < balls.length; i++) {
            if (goal.intersectsMesh(balls[i])){
                    balls[i].material= materialCollision;
                    //ballsToRemove.push(balls[i]);
                    /*goles++;
                    balls.remove(ball[i]);
                    textureScore.clear();
                    textureScore.drawText(goles, 10, 50, "bold 30px Arial", "green", "white", true, true);*/
                }
            }
        });

        engine.runRenderLoop(function () {
            if (game) {
                game.render();
            }
        });
        
        window.addEventListener("resize", function () {
            engine.resize();
        });
}


var startGame = function () {
    var scene = getScene();
    createCameras(scene);
    var light = createLights(scene);
    var shadowGenerator = createShadowGenerator(light);
    var ballMaterial = createBallMaterial(scene);
    enablePhysics(scene);

    var balls = createBalls(scene, ballMaterial, shadowGenerator);

    var goal = createFootballField(scene);

    registerEvents(scene, goal, ballMaterial, balls);


    
    //scene.debugLayer.show();    
    return scene;
}

var game = startGame()

















