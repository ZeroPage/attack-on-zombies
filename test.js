

var container, scene, renderer, camera, light, cube;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

container = document.querySelector('.viewport');

WIDTH = window.innerWidth,
HEIGHT = window.innerHeight;

VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 1,
FAR = 10000;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMapType = THREE.PCFShadowMap;
renderer.shadowMapAutoUpdate = true;

container.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.set(6, 4, 10);
camera.lookAt(scene.position);

scene.add(camera);

light = new THREE.DirectionalLight(0xffffff);

light.position.set(0, 100, 60);
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 1;
light.shadowCameraFar = 1000;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 1024;
light.shadowDarkness = .7;

scene.add(light);

var loader = new THREE.JSONLoader();
var animation;

// load the model and create everything
loader.load('models/test.js', function (geometry, materials) {
  var mesh, material;

  // create a mesh
  mesh = new THREE.SkinnedMesh(
    geometry,
    new THREE.MeshFaceMaterial(materials)
  );

  // define materials collection
  material = mesh.material.materials;

  // enable skinning
  for (var i = 0; i < materials.length; i++) {
    var mat = materials[i];

    mat.skinning = true;
  }

  scene.add(mesh);

  //what's problem
  mesh.geometry.animation = mesh.geometry.animations[0];
  
  // add animation data to the animation handler
  THREE.AnimationHandler.add(mesh.geometry.animation);

  // create animation
  animation = new THREE.Animation(
    mesh,
    'PlayerArmatureAction',
    THREE.AnimationHandler.CATMULLROM
  );

  // play the anim
  animation.play();

  render();
});

function render() {
  animation.update(.1);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}