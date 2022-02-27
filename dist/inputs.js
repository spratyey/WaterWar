import { camera, scene, renderer } from "./setup";

let activated = false;
let camtype = "follow";
let timetoshoot = false;
function processInput(boat)
{
	const blocker = document.getElementById('blocker');
	const instructions = document.getElementById('instructions');
	instructions.addEventListener('click', (event) =>
	{
		instructions.style.display = 'none';
		blocker.style.display = 'none';
		activated = true;
	});

	window.addEventListener("resize", onWindowResize);

	// keyboard input for pressing and releasing keys
	window.addEventListener("keydown", (event) =>
	{
		if (event.key == "Escape")
		{
			blocker.style.display = 'block';
			instructions.style.display = '';
			activated = false;
		}
		if (activated)
		{
			if (event.key == "w")
				boat.spatial.velocity = 4;
			if (event.key == "s")
				boat.spatial.velocity = -4;
			if (event.key == "a")
				boat.spatial.rot = 0.04;
			if (event.key == "d")
				boat.spatial.rot = -0.04;
			if (event.key == "c")
			{
				if (camtype == "follow")
					camtype = "top";
				else
					camtype = "follow";
			}
			if (event.key == " ")
			{
				timetoshoot = true;
			}
				
		}
	});
	window.addEventListener("keyup", (event) =>
	{
		if (activated)
		{
			if (event.key == "w")
				boat.spatial.velocity = 0;
			if (event.key == "s")
				boat.spatial.velocity = 0;
			if (event.key == "a")
				boat.spatial.rot = 0;
			if (event.key == "d")
				boat.spatial.rot = 0;
			if (event.key == " ")
			{
				timetoshoot = false;
			}

		}
	});
}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export { timetoshoot,activated,camtype,processInput };
