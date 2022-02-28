import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

let sun, water, sky;

function createbg()
{
	// sun
	sun = new THREE.Vector3();

	// water
	const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
	water = new Water(waterGeometry, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load(
			"myassets/textures/waternormals.jpg",
			function (texture)
			{
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}
		),
		sunDirection: new THREE.Vector3(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 3.7,
	});
	water.rotation.x = -Math.PI / 2;

	// sky
	sky = new Sky();
	sky.scale.setScalar(10000);
	const skyUniforms = sky.material.uniforms;
	skyUniforms["turbidity"].value = 10;
	skyUniforms["rayleigh"].value = 2;
	skyUniforms["mieCoefficient"].value = 0.005;
	skyUniforms["mieDirectionalG"].value = 0.8;
	const parameters =
	{
		elevation: 2,
		azimuth: 180,
	};

	// set up the sun in the sky
	const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
	const theta = THREE.MathUtils.degToRad(parameters.azimuth);
	sun.setFromSphericalCoords(1, phi, theta);
	sky.material.uniforms["sunPosition"].value.copy(sun);
	water.material.uniforms["sunDirection"].value.copy(sun).normalize();
}

createbg();
export { sky, water };
