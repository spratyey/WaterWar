import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();
import * as THREE from "three";
import { activated } from "./inputs";


// make the ebull class
export default class Ebull
{
	// object constructor, initializes velo and rot to 0
	constructor(scene, x, z, rot, boatobj)
	{
		loader.load("../myassets/models/ebullet/scene.gltf", (gltf) =>
		{
			scene.add(gltf.scene);
			gltf.scene.scale.set(0.1, 0.1, 0.1);
			gltf.scene.position.set(x, -2, z);
			this.ebullobj = gltf.scene;
			this.spatial = {
				vel: 400
			};
			this.initialpositioning(boatobj);
			
		});
	}

	initialpositioning(boatobj)
	{
		this.ebullobj.lookAt(boatobj.position);

	}

	// updating rotation of the ebull based on received inputs
	update(time)
	{
		if (this.ebullobj && activated)
		{
			const direction = new THREE.Vector3();
			this.ebullobj.children[0].getWorldDirection(direction);
			this.ebullobj.position.add(direction.normalize().multiplyScalar(this.spatial.vel));
			this.ebullobj.position.y = 0.5 * Math.sin(2 * time) + 0;
		}
	}

	

}
