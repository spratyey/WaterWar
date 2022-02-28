import Stats from "three/examples/jsm/libs/stats.module.js";

let stats;

function getDevUi()
{
	// stats gui, top left corner
	stats = new Stats();
	document.body.appendChild(stats.dom);
}

getDevUi();
export { stats };