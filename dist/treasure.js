import { GLTFLoader } from "https://unpkg.com/three@0.138.0/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

// make the treasure class
export default class Treasure
{
	// object constructor, initializes velo and rot to 0
	constructor(scene, x, z)
	{
		loader.load("./assets/models/treasure/scene.gltf", (gltf) =>
		{
			scene.add(gltf.scene);
			gltf.scene.scale.set(1, 1, 1);
			gltf.scene.position.set(x, 8, z);
			this.treasureobj = gltf.scene;
			this.spatial = {
				rot: 0.04,
			};
		});
	}

	// updating rotation of the treasure based on received inputs
	update(time)
	{
		if (this.treasureobj)
		{
			this.treasureobj.rotation.y += this.spatial.rot;
			this.treasureobj.position.y = 2* Math.sin(2 * time+1) +8;
		}
	}

	

}
