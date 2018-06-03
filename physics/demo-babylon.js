var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Purple();

    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -20), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
    light.position = new BABYLON.Vector3(0, 80, 0);

  // Material
    var materialAmiga = new BABYLON.StandardMaterial("amiga", scene);
    materialAmiga.diffuseTexture = new BABYLON.Texture("textures/adidas.png", scene);
    materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

     // Shadows
     var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 32;

    // Physics
    //scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

    // Spheres
    var y = 0;
    var balls = [];
    for (var index = 0; index < 100; index++) {
        var sphere = BABYLON.Mesh.CreateSphere("Sphere"+index, 16, 3, scene);
       
        sphere.material = materialAmiga;

        sphere.position = new BABYLON.Vector3(Math.random() * 10, y, Math.random() * 10);

        shadowGenerator.addShadowCaster(sphere);

        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere
                                                            , BABYLON.PhysicsImpostor.SphereImpostor
                                                            , { mass: 1 }, scene);
 
        y += 2;

        balls.push(sphere);
        
    }

     window.addEventListener("click", function (evt) {
        // We try to pick an object
            var pickResult = scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit) {
                currentMesh = pickResult.pickedMesh;
                 // Calculate the direction using the picked point and the ball's position. 
                //var direction = pickResult.pickedPoint.subtract(currentMesh.position).normalize();
                // Give it a bit more power (scale the normalized direction).
                //var impulse = direction.scale(-20);
                currentMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 100)//impulse
                                                        , currentMesh.getAbsolutePosition());
        
            }
        });

    // Playground
    var ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
    ground.scaling = new BABYLON.Vector3(100, 1, 100);
    ground.position.y = -5.0;

    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
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


    var paredDerecha = BABYLON.Mesh.CreateBox("paredDerecha", 1, scene);
    paredDerecha.scaling = new BABYLON.Vector3(1, 100, 100);
    paredDerecha.position.y = -5.0;
    paredDerecha.position.x = 50.0;
    paredDerecha.checkCollisions = true;
    paredDerecha.material = groundMat;
    paredDerecha.physicsImpostor = new BABYLON.PhysicsImpostor(paredDerecha
                                                        , BABYLON.PhysicsImpostor.BoxImpostor
                                                        , { mass: 0 }
                                                        , scene);

    var paredIzquierda = BABYLON.Mesh.CreateBox("paredIzquierda", 1, scene);
    paredIzquierda.scaling = new BABYLON.Vector3(1, 100, 100);
    paredIzquierda.position.y = -5.0;
    paredIzquierda.position.x = -50.0;
    paredIzquierda.checkCollisions = true;
    paredIzquierda.material = groundMat;
    paredIzquierda.physicsImpostor = new BABYLON.PhysicsImpostor(paredIzquierda
                                                        , BABYLON.PhysicsImpostor.BoxImpostor
                                                        , { mass: 0 }
                                                        , scene);


    var materialPorterial = new BABYLON.StandardMaterial("materialPorterial", scene);
    materialPorterial.diffuseTexture = new BABYLON.Texture("textures/cuadrados.jpg", scene);
    materialPorterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    materialPorterial.diffuseTexture.uScale = 50;
    materialPorterial.diffuseTexture.vScale = 50;
    materialPorterial.alpha = 0.5;

    var porteria = BABYLON.Mesh.CreateBox("porteria", 1, scene);
    porteria.scaling = new BABYLON.Vector3(60, 40, 1);
    porteria.position.y = -5.0;
    porteria.position.x = 0.0;
    porteria.position.z = 50.0;
    porteria.checkCollisions = true;
    porteria.material = materialPorterial;
    porteria.physicsImpostor = new BABYLON.PhysicsImpostor(porteria
                                                        , BABYLON.PhysicsImpostor.BoxImpostor
                                                        , { mass: 0 }
                                                        , scene);

    var materialCollision = materialAmiga.clone('materialCollision');
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
            if (porteria.intersectsMesh(balls[i])){
                    balls[i].material= materialCollision;
                    //ballsToRemove.push(balls[i]);
                    /*goles++;
                    balls.remove(ball[i]);
                    textureScore.clear();
                    textureScore.drawText(goles, 10, 50, "bold 30px Arial", "green", "white", true, true);*/
                }
            }
        });
            

    var marcador = BABYLON.Mesh.CreateBox("porteria", 1, scene);
    marcador.scaling = new BABYLON.Vector3(50, 10, 1);
    marcador.position.y = 20.0;
    marcador.position.x = 0.0;
    marcador.position.z = 50.0;

    //Create dynamic texture
    var textureScore = new BABYLON.DynamicTexture("dynamic texture", {width:100, height:100}, scene);   
    var materialScore = new BABYLON.StandardMaterial("Mat", scene);   
    materialScore.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5); 				
    materialScore.diffuseTexture = textureScore;
    marcador.material = materialScore;
    textureScore.drawText(0, 10, 50, "bold 30px Arial", "green", "white", true, true);
                
    //scene.debugLayer.show();

    return scene;
}


var scene = createScene()

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

window.addEventListener("resize", function () {
    engine.resize();
});