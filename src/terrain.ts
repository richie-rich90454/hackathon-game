import type {Game} from "./state";
export function generateInitialTerrain(game: Game){
	let {config, state}=game;
	state.terrain=[];
	let cols=Math.ceil(config.width/config.terrainSegmentWidth)+2;
	let h=(config.terrainMaxHeight+config.terrainMinHeight)/2;
	for (let i=0;i<cols;i++){
		state.terrain.push({
			x: i*config.terrainSegmentWidth,
			y: config.height-h
		});
		h+=(Math.random()*2-1)*config.terrainMaxDelta;
		h=Math.max(config.terrainMinHeight, Math.min(config.terrainMaxHeight, h));
	}
}
export function updateTerrain(game: Game, dx: number){
	let {config, state}=game;
	for (let p of state.terrain){
		p.x-=dx;
	}
	state.terrain=state.terrain.filter(p=>p.x>-config.terrainSegmentWidth*2);
	let last=state.terrain[state.terrain.length-1];
	while (last.x<config.width+config.terrainSegmentWidth){
		let h=config.height-last.y+(Math.random()*2-1)*config.terrainMaxDelta*.5;
		h=Math.max(config.terrainMinHeight, Math.min(config.terrainMaxHeight, h));
		state.terrain.push({
			x: last.x+config.terrainSegmentWidth,
			y: config.height-h
		});
		last=state.terrain[state.terrain.length-1];
	}
}
