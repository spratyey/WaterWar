import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

// make the boat class
export default class Boat
{
	// object constructor, initializes velo and rot to 0
	constructor(scene)
	{
		loader.load("/../myassets/models/watercraft/scene.gltf", (gltf) =>
		{
			scene.add(gltf.scene);
			gltf.scene.scale.set(0.5, 0.5, 0.5);
			gltf.scene.position.set(0, -5, 0);
			this.boatobj = gltf.scene;
			this.spatial = {
				velocity: 0,
				rot: 0,
			};
		});
	}

	// updating speed and velocity of the boat based on received inputs
	update(time)
	{
		if (this.boatobj)
		{
			this.boatobj.rotation.y += this.spatial.rot;
			this.boatobj.translateZ(this.spatial.velocity);
			this.boatobj.position.y = 0.5*Math.sin(2*time)-3.5;
		}
	}
}
