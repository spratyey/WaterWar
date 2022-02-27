import Stats from "https://unpkg.com/three@0.138.0/examples/jsm/libs/stats.module.js";

let stats;

function getDevUi()
{
	// stats gui, top left corner
	stats = new Stats();
	document.body.appendChild(stats.dom);
}

getDevUi();
export { stats };