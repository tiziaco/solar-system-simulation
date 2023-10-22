import * as THREE from 'three';

THREE.ColorManagement.legacyMode = false;


const textureLoader = new THREE.TextureLoader()

export class Planet {
	static AU = 149.6e6 * 1000; // Astronomic unit: distance sun-earth[m]
	static G = 6.67428e-11;		// Attraction gravity
	static SCALE = 100 / Planet.AU;  // 1AU = 100 pixels
	static ROT_SCALE = 10e1;
	static TIMESTEP = 3600 * 24; // 1 day

	constructor(x, y, radius, mass, rot, texture, ring = null) {
		this.x = this._scaleDistance(x); // Distance in AU from the sun alonx x
		this.y = this._scaleDistance(y); // Distance in AU from the sun alonx x
		this.radius = radius;
		this.mass = mass;
		this.rot = this._scaleRot(rot);
		this.texture = texture;
		this.ring = ring;

		this.mesh = null;
		this.obj = null;

		this.orbit = [];
		this.sun = false;
		this.distance_to_sun = 0;

		this.x_vel = 0;
		this.y_vel = 0;
	}
	_scaleRot(rot) {
		return rot * Planet.ROT_SCALE;
	}
	_scaleDistance(au) {
		return Planet.SCALE * Planet.AU * au;
	}

	createPlanet() {
		const geo = new THREE.SphereGeometry(this.radius, 30, 30);
		const mat = new THREE.MeshStandardMaterial({
			map: textureLoader.load(this.texture)
		});
		const mesh = new THREE.Mesh(geo, mat);
		const obj = new THREE.Object3D();
		obj.add(mesh);
		mesh.position.x = this.x;
		mesh.position.y = this.y;

		this.mesh = mesh;
		this.obj = obj;
	}

	createRing() {
		if(this.ring) {
			const ringGeo = new THREE.RingGeometry(
				ring.innerRadius,
				ring.outerRadius,
				32);
			const ringMat = new THREE.MeshBasicMaterial({
				map: textureLoader.load(ring.texture),
				side: THREE.DoubleSide
			});
			const mesh = new THREE.Mesh(ringGeo, ringMat);
			obj.add(mesh);
			mesh.position.x = this.x;
			mesh.rotation.x = -0.5 * Math.PI;
			return {mesh, obj}
		}
	}
}

// Example usage:
// import fs from 'fs';

// // Read the JSON file
// const rawData = fs.readFileSync('planets_info.json', 'utf8');
// const data = JSON.parse(rawData);

// // Access the data here
// console.log(data['Earth']);


// const earth = new Planet(0, 0, 6371, './img/earth.jpg', 5.972e24);
// console.log(earth);