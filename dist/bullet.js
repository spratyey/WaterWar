import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();
import * as THREE from "https://cdn.skypack.dev/three";

// make the bullet class
export default class Bullet
{
	// object constructor, initializes velo and rot to 0
	constructor(scene, x, z, rot)
	{
		loader.load("./assets/models/treasure/scene.gltf", (gltf) =>
		{
			scene.add(gltf.scene);
			gltf.scene.scale.set(0.5, 0.5, 0.5);
			gltf.scene.rotation.x = Math.PI /2;
			gltf.scene.rotation.z = -rot;
			gltf.scene.position.set(x, 6.5, z);
			this.bulletobj = gltf.scene;
			this.spatial = {
				vel: 30
			};
			this.initialpositioning();
			
		});
	}

	initialpositioning()
	{
		const direction = new THREE.Vector3();
		this.bulletobj.children[0].getWorldDirection(direction);
		this.bulletobj.position.add(direction.multiplyScalar(this.spatial.vel));
	}

	// updating rotation of the bullet based on received inputs
	update(time)
	{
		if (this.bulletobj)
		{
			const direction = new THREE.Vector3();
			this.bulletobj.children[0].getWorldDirection(direction);
			this.bulletobj.position.add(direction.multiplyScalar(this.spatial.vel));
			this.bulletobj.position.y = 0.5 * Math.sin(2 * time) + 6.5;
		}
	}

	

}
