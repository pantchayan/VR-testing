import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import {VRButton} from "./VRButton.js";
let dimension = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".c");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(dimension.width, dimension.height);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

// Camera
let fov = 75;
let aspect = dimension.width / dimension.height;
let near = 0.1;
let far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 25, 50);
// camera.lookAt(0, 0, 0)
// Scene
const scene = new THREE.Scene();
scene.add(camera);

// Light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(10, 10, 10);
directionLight.lookAt(0, 0, 0);
scene.add(ambientLight);
scene.add(directionLight);

// FUNCTION TO CREATE A CUBE
let createBush = () => {
  // Simple cube -> geometry + material => Mesh
  // geometry
  let bushGeometry = new THREE.BoxGeometry(1, 1, 1);

  // material
  let bushMaterial = new THREE.MeshPhongMaterial();
  bushMaterial.color = new THREE.Color("green");

  let bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);

  return bushMesh;
};

let createTrunk = () => {
  let trunkGeometry = new THREE.BoxGeometry(0.25, 1.5, 0.25);

  let trunkMaterial = new THREE.MeshPhongMaterial();
  trunkMaterial.color = new THREE.Color("brown");

  let trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);

  return trunkMesh;
};

let createTree = () => {
  const tree = new THREE.Group();

  let bush = createBush();
  bush.position.set(0, 0.5, 0);
  tree.add(bush);

  let trunk = createTrunk();
  tree.add(trunk);

  return tree;
};

let trees = [];
let treesNum = 1000;
for (let i = 0; i < treesNum; i++) {
  trees[i] = createTree();
  trees[i].position.set(
    Math.random() * 250 * (i % 2 == 0 ? -1 : 1),
    0,
    Math.random() * 250 * (Math.floor(Math.random() * 10) % 2 == 0 ? 1 : -1)
  );
  scene.add(trees[i]);
}

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const planeGeometry = new THREE.PlaneGeometry(500, 500);
planeGeometry.wireframe = true;
const planeMaterial = new THREE.MeshPhongMaterial();
planeMaterial.color = new THREE.Color("#8FBC8F");
planeMaterial.side = THREE.DoubleSide;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -0.75, 0);
plane.rotation.x = THREE.Math.degToRad(90);
scene.add(plane);

renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);

// controls.update();

let animate = (time) => {
  trees.forEach((tree) => {
    tree.rotation.y = time * 0.001;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  dimension.width = window.innerWidth;
  dimension.height = window.innerHeight;
  // Update camera
  camera.aspect = dimension.width / dimension.height;
  camera.updateProjectionMatrix();

  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();
  // Update renderer
  renderer.setSize(dimension.width, dimension.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
