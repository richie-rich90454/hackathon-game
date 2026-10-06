import type {Game} from "./state";
import {checkReactions} from "./reactions";
import {playCollectionSound} from "./sfx";
export function spawnBall(game: Game){
	let {config, state}=game;
	let r=(Math.random()*(config.ballMaxRadius-config.ballMinRadius)+config.ballMinRadius)*1.2;
	let element=state.elements[Math.floor(Math.random()*state.elements.length)];
	state.balls.push({
		x: config.width+r,
		y: Math.random()*(config.height-2*r)+r,
		r: r,
		color: element.color,
		element: element.name,
		collectTimestamp: 0
	});
}
export function updateBalls(game: Game, dx: number){
	let {config, state}=game;
	state.balls.forEach(b=>b.x-=dx);
	state.balls=state.balls.filter(b=>{
		let dx=state.player.x-b.x;
		let dy=state.player.y-b.y;
		let distance=Math.sqrt(dx*dx+dy*dy);
		if (distance<b.r+config.planeSize){
			playCollectionSound(game);
			let basePoints=Math.floor(b.r*10);
			state.score+=basePoints;
			b.collectTimestamp=Date.now();
			checkReactions(game, b.element, basePoints);
			return false;
		}
		return b.x+b.r>0;
	});
}
