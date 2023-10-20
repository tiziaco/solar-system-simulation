import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {Planet} from "./planet.js";

// Import the data here
import planetsData from './src/planets_info.json';

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

/* STEP 2: Add objects to the scene */
const textureLoader = new THREE.TextureLoader()

// *** Background ***
const spaceTexture = textureLoader.load('./img/space.jpg');
scene.background = spaceTexture;

// *** Planets ***
const planets = ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn"];
const planetsObj = [];

planets.forEach(planetName => {
	// Define planet data
	if (planetName == "sun") {
		var radius = 20;
	} else {
		var radius = (planetsData[planetName].radius * 4) / planetsData["earth"].radius;}
	const distance = planetsData[planetName].distanceFromSunAU;
	const mass = planetsData[planetName].mass;
	
	const planet = new Planet(distance, 0, radius, `./img/${planetName}.jpg`, mass);
	planetsObj.push(planet);
	planet.createPlanet();
	scene.add(planet.obj);
})
console.log(planetsObj);

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
const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100, 300);
scene.add(pointLight);

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
	planetsObj.forEach(planet => {
		planet.mesh.rotateY(0.005);
	})
	
	// //Around-sun-rotation
	// mercury.obj.rotateY(0.04);

	// Activathe when mouse rotation is active
	controls.update();

	renderer.render(scene, camera);
}
/* --- START THE ANIMATION ---  */
animate()
