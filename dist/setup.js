import * as THREE from "https://unpkg.com/three@0.138.0/build/three.module.js";

let camera, scene, renderer;

// configure threejs basics for the game
function setup()
{
	renderer = new THREE.WebGLRenderer(	{ antialias: true } );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	document.body.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera (55,window.innerWidth / window.innerHeight,1,2000);
	camera.position.set(30, 30, 100);
}

setup();
export { camera, scene, renderer };
