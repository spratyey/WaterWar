// library imports
import * as THREE from "https://cdn.skypack.dev/three";

// imports from my files
import Boat from "./boat.js";
import { sky, water } from "./bg.js";
import { camera, scene, renderer } from "./setup.js";
import { timetoshoot, camtype, processInput } from "./inputs.js";
import { stats } from "./dev_ui.js";
import Treasure from "./treasure.js";
import Bullet from "./bullet.js";
import Enemy from "./enemy.js";
import Ebull from "./ebull.js";

// game data members
let time;
let boat = new Boat(scene);
let health = 100;
let treasures = [];
let bullets = [];
let shootflag = 0;
let enemies = [];
let ebulls = [];
let eshootflag = 0;
let score = 0;

let MAX_NUM_ENEMIES = 3;
let MAX_NUM_TREASURES = 4;
let BULLETCOUNT = 10;

const gameover = document.getElementById('gameover');
const mytext = document.getElementById('mytext');
const HUDtext = document.getElementById('HUDtext');

// function calls
init();
animate();

// init sets up the game, loading bg textures, and the initial objects
function init()
{
	scene.add(water);
	scene.add(sky);
	scene.environment = new THREE.PMREMGenerator(renderer).fromScene(sky).texture;
	processInput(boat);

	while (treasures.length < MAX_NUM_TREASURES)
	{
		treasures.push(new Treasure(scene, 100 + Math.random() * 100, 100 + Math.random() * 100));
		treasures.push(new Treasure(scene, -100 - Math.random() * 100, 100 + Math.random() * 100));
		treasures.push(new Treasure(scene, 100 + Math.random() * 100, -100 - Math.random() * 100));
		treasures.push(new Treasure(scene, -100 - Math.random() * 100, -100 - Math.random() * 100));
	}

	while (enemies.length < MAX_NUM_ENEMIES)
	{
		enemies.push(new Enemy(scene, 100 + Math.random() * 50, 100 + Math.random() * 30));
		enemies.push(new Enemy(scene, -100 - Math.random() * 50, 100 + Math.random() * 30));
		enemies.push(new Enemy(scene, 100 + Math.random() * 50, -100 - Math.random() * 30));
	}
}

// animate updates the game every frame
function animate()
{
	requestAnimationFrame(animate);
	water.material.uniforms["time"].value += 1.0 / 60.0;
	time = performance.now() * 0.001;
	update();
	renderer.render(scene, camera);
}

// per-frame object updates 
function update()
{
	stats.update();
	boat.update(time);

	// update treasures
	for (var treasure of treasures)
	{
		treasure.update(time);
	}
	while (treasures.length < MAX_NUM_TREASURES)
		treasures.push(new Treasure(scene, boat.boatobj.position.x + 70 + Math.random() * 200, boat.boatobj.position.z + 50 + Math.random() * 200));

	// update enemy opsition and orientation
	for (var enemy of enemies)
	{
		enemy.update(boat.boatobj, time);
	}
	while (enemies.length < MAX_NUM_ENEMIES)
		enemies.push(new Enemy(scene, boat.boatobj.position.x + 70 + Math.random() * 200, boat.boatobj.position.z + 50 + Math.random() * 200));

	// handle all collisions
	collisions();

	// cam movement, enemy updates
	if (boat.boatobj)
	{
		if (camtype == "follow")
		{
			var relativeCameraOffset = new THREE.Vector3(0, 30, -110);
			var cameraOffset = relativeCameraOffset.applyMatrix4(boat.boatobj.matrixWorld);
			camera.position.x = cameraOffset.x;
			camera.position.y = cameraOffset.y;
			camera.position.z = cameraOffset.z;
			camera.lookAt(new THREE.Vector3(boat.boatobj.position.x, boat.boatobj.position.y + 10, boat.boatobj.position.z));
		}
		else
		{
			var relativeCameraOffset = new THREE.Vector3(0, 500, -25);
			var cameraOffset = relativeCameraOffset.applyMatrix4(boat.boatobj.matrixWorld);
			camera.position.x = cameraOffset.x;
			camera.position.y = cameraOffset.y;
			camera.position.z = cameraOffset.z;
			camera.lookAt(new THREE.Vector3(boat.boatobj.position.x, boat.boatobj.position.y, boat.boatobj.position.z));
		}

	}

	//bulletshooting
	if (timetoshoot) shootflag++;
	else shootflag = 0;
	if (shootflag == 1 && boat.boatobj && BULLETCOUNT > 0)
	{
		console.log("shooting");
		BULLETCOUNT--;
		bullets.push(new Bullet(scene, boat.boatobj.position.x, boat.boatobj.position.z, boat.boatobj.rotation.y));
	}

	// bullet shooting
	for (var bullet of bullets)
	{
		bullet.update(time);

		// delete a bullet that travels more than 1000
		if (bullet.bulletobj && boat.boatobj)
		{
			let tempvar = new THREE.Vector3();
			tempvar.copy(bullet.bulletobj.position);
			if (tempvar.sub(boat.boatobj.position).length() > 1000)
			{
				scene.remove(bullet.bulletobj);
				bullets.splice(bullets.indexOf(bullet), 1);
			}
		}
	}

	// every 10s, make each enemy shoot one bullet
	if (Math.floor(time) % 10 == 0)
	{
		eshootflag++;
		if (eshootflag == 1)
		{
			//delete existing bullets
			for (var ebull of ebulls)
			{
				scene.remove(ebull.ebullobj);
			}
			for (var i = 0; i < ebulls.length; i++)
			{
				ebulls.splice(i, 1);
			}
			//spawn new ebulls
			for (var enemy of enemies)
			{
				if (enemy.enemyobj && boat.boatobj)
					ebulls.push(new Ebull(scene, enemy.enemyobj.position.x, enemy.enemyobj.position.z, enemy.enemyobj.rotation.y, boat.boatobj));

			}
		}
	}
	else
	{
		eshootflag = 0;
	}
	for (var ebull of ebulls)
	{
		ebull.update(time);
	}
	if (health <= 0)
	{
		gameover.style.display = 'block';
		mytext.style.display = '';
	}
	HUDtext.innerHTML = "Health: " + health + " | SCORE: " + score + " | Ammo: " + BULLETCOUNT;
}

// checking for and handling collisions
function collisions()
{
	// boat - treasure
	if (boat.boatobj)
	{
		for (let i = 0; i < treasures.length; i++)
		{
			if (treasures[i].treasureobj)
			{
				if (isColliding(boat.boatobj.children[0], boat.boatobj.position, treasures[i].treasureobj.children[0], treasures[i].treasureobj.position))
				{
					console.log("Treasure collected", i);
					BULLETCOUNT += 5;
					scene.remove(treasures[i].treasureobj);
					treasures.splice(i, 1);
					break;
				}
			}
		}
	}

	// bullet - enemy
	for (let i = 0; i < bullets.length; i++)
	{
		if (bullets[i].bulletobj)
		{
			for (let j = 0; j < enemies.length; j++)
			{
				if (enemies[j].enemyobj)
				{
					if (isColliding(bullets[i].bulletobj.children[0], bullets[i].bulletobj.position, enemies[j].enemyobj.children[0], enemies[j].enemyobj.position))
					{
						console.log("enemy shot", i);
						score += 1;
						scene.remove(enemies[j].enemyobj);
						enemies.splice(j, 1);
						break;
					}
				}
			}
		}
	}

	// ebull - boat
	for (let i = 0; i < ebulls.length; i++)
	{
		if (ebulls[i].ebullobj && boat.boatobj)
		{
			if (isColliding(ebulls[i].ebullobj.children[0], ebulls[i].ebullobj.position, boat.boatobj.children[0], boat.boatobj.position))
			{
				if (health > 0)
				{
					health = health - 10;
				}
				console.log("HIT", health);
				scene.remove(ebulls[i].ebullobj);
				ebulls.splice(i, 1);
				break;
			}
		}
	}


}

// collision detector function
function isColliding(obj1, obj1pos, obj2, obj2pos)
{
	const obj1Box = new THREE.Box3().setFromObject(obj1);
	const obj2Box = new THREE.Box3().setFromObject(obj2);
	return (obj2pos.distanceTo(obj1pos) < 20 && obj1Box.intersectsBox(obj2Box));
}