import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/* STEP 1: Create a scene.
To render something i need:
  - Scene
  - Camera
  - Render engine */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), // Eventualmente sostituire con jquery
});

// TODO: da vedere cosa fanno questi comandi
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

/* STEP 2: Add objects to the scene
Every object is composed by:
  - Geometry 
  - Material
  - Mesh 
*/
const textureLoader = new THREE.TextureLoader()

// Background
const spaceTexture = textureLoader.load('./img/space.jpg');
scene.background = spaceTexture;

// *** Planets ***
function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}
// Sun //
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshStandardMaterial({
	map: textureLoader.load('./img/sun.jpg')
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
scene.add(sunMesh);

// Mercury //
const mercury = createPlanete(3.2, './img/mercury.jpg', 28);
console.log(mercury);


// *** Stars ***
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  // Define random coordinate for the star 
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
// Generate random stars
const starNumber = 3;
Array(starNumber).fill().forEach(addStar);



/* STEP 3: Define light scene */

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/* HELPERS
Hilight the position of the light or show the grid of thle plane z = 0 
Activathe mouse rotation
*/

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


/* STEP FINAL: Start infinite loop to start the animation 
*/
function animate() {
  requestAnimationFrame(animate);

  //Self-rotation
  sunMesh.rotateY(0.005); 
  mercury.mesh.rotateY(0.004);
  
  //Around-sun-rotation
  mercury.obj.rotateY(0.04);

  // Activathe when mouse rotation is active
  controls.update();

  renderer.render(scene, camera);
}
/* --- START THE ANIMATION ---  */
animate()
