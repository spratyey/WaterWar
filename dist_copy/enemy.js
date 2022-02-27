import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "https://cdn.skypack.dev/three";
import { activated } from "./inputs";


const loader = new GLTFLoader();

// make the enemy class
export default class Enemy
{
	// object constructor, initializes velo and rot to 0
	constructor(scene, x, z)
	{
		loader.load("./assets/models/enemy/scene.gltf", (gltf) =>
		{
			scene.add(gltf.scene);
			gltf.scene.scale.set(8, 8, 8);
			gltf.scene.position.set(x, 5, z);
			this.enemyobj = gltf.scene;
			this.spatial = {
				velocity: 4,
				rot: 0,
			};
		});
	}

	// updating speed and velocity of the enemy based on received inputs
	update(boatobj, time)
	{
		if (this.enemyobj && boatobj)
		{
			this.enemyobj.lookAt(boatobj.position);
			if (activated)
			{
				const direction = new THREE.Vector3();
				this.enemyobj.children[0].getWorldDirection(direction);
				this.enemyobj.position.add(direction.multiplyScalar(this.spatial.velocity));
			}
			this.enemyobj.position.y = 0.5 * Math.sin(2 * time) + 2;
				
		}
	}
}
