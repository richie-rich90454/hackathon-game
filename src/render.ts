import type {Game} from "./state";
const cursorSpeedEl=document.getElementById("cursor-speed")!;
const cursorMaxSpeedEl=document.getElementById("cursor-max-speed")!;
const cursorScoreEl=document.getElementById("cursor-score")!;
// The sky only changes when the canvas is resized, so it is painted once into an offscreen canvas and
// blitted from then on. Evaluating that gradient over the whole canvas every frame was the most
// expensive single thing the renderer did.
let skyLayer: HTMLCanvasElement|null=null;
let skyLayerWidth=0;
let skyLayerHeight=0;
function ensureSkyLayer(game: Game){
	let {config}=game;
	if (!skyLayer){
		skyLayer=document.createElement("canvas");
	}
	if (skyLayerWidth==config.width&&skyLayerHeight==config.height){
		return;
	}
	skyLayerWidth=config.width;
	skyLayerHeight=config.height;
	skyLayer.width=config.width;
	skyLayer.height=config.height;
	let layerCtx=skyLayer.getContext("2d");
	if (!layerCtx){
		return;
	}
	let grad=layerCtx.createLinearGradient(0, 0, 0, config.height);
	grad.addColorStop(0, config.skyGradient[0]);
	grad.addColorStop(1, config.skyGradient[1]);
	layerCtx.fillStyle=grad;
	layerCtx.fillRect(0, 0, config.width, config.height);
}
function renderSky(game: Game){
	let {ctx}=game;
	ensureSkyLayer(game);
	if (skyLayer&&skyLayerWidth>0&&skyLayerHeight>0){
		ctx.drawImage(skyLayer, 0, 0);
	}
}
function renderTerrain(game: Game){
	let {config, ctx, state}=game;
	ctx.fillStyle="#225535";
	ctx.beginPath();
	ctx.moveTo(0, config.height);
	for (let p of state.terrain){
		ctx.lineTo(p.x, p.y);
	}
	ctx.lineTo(config.width, config.height);
	ctx.closePath();
	ctx.fill();
}
function renderPlane(game: Game){
	let {config, ctx, state}=game;
	ctx.save();
	ctx.translate(state.player.x, state.player.y);
	let tiltAngle=Math.max(-Math.PI/6, Math.min(Math.PI/6, state.player.verticalVelocity*.1));
	ctx.rotate(tiltAngle);
	ctx.fillStyle=config.planeColor;
	ctx.beginPath();
	ctx.moveTo(config.planeSize, 0);
	ctx.lineTo(-config.planeSize,-config.planeSize/2);
	ctx.lineTo(-config.planeSize, config.planeSize/2);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}
function renderBalls(game: Game){
	let {ctx, state}=game;
	state.balls.forEach(b=>{
		ctx.beginPath();
		ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
		ctx.fillStyle=b.color;
		ctx.fill();
	});
}
function renderTrail(game: Game){
	let {ctx, state}=game;
	ctx.save();
	state.trailParticles.forEach((p, i)=>{
		ctx.globalAlpha=p.opacity;
		ctx.fillStyle=`rgba(255, 215, 0, ${p.opacity})`;
		ctx.beginPath();
		let radius=Math.max(0, p.size*(1-i*.05));
		ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
		ctx.fill();
		p.opacity-=p.decay;
	});
	ctx.restore();
}
function renderOrbCursor(game: Game){
	let {config, ctx, state}=game;
	ctx.save();
	ctx.translate(state.player.x, state.player.y);
	let angle=Math.atan2(state.player.verticalVelocity, state.player.forwardSpeed);
	ctx.rotate(angle);
	let gradient=ctx.createRadialGradient(0, 0, 0, 0, 0, config.cursorSize+config.cursorGlowRadius);
	gradient.addColorStop(0, "#FFF");
	gradient.addColorStop(1, config.cursorGradient[1]);
	ctx.fillStyle=gradient;
	ctx.beginPath();
	ctx.arc(0, 0, config.cursorSize+config.cursorGlowRadius, 0, Math.PI*2);
	ctx.fill();
	let innerGradient=ctx.createRadialGradient(0, 0, 0, 0, 0, config.cursorSize);
	innerGradient.addColorStop(0, config.cursorGradient[0]);
	innerGradient.addColorStop(1, config.cursorGradient[1]);
	ctx.fillStyle=innerGradient;
	ctx.beginPath();
	ctx.arc(0, 0, config.cursorSize, 0, Math.PI*2);
	ctx.fill();
	ctx.strokeStyle="#000";
	ctx.lineWidth=2;
	ctx.beginPath();
	ctx.moveTo(-config.cursorSize/2, 0);
	ctx.lineTo(0,-config.cursorSize/2);
	ctx.lineTo(config.cursorSize/2, 0);
	ctx.lineTo(0, config.cursorSize/2);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
}
function renderReactionTimer(game: Game){
	let {config, ctx, state}=game;
	if (!state.player.aura){
		return;
	}
	let now=Date.now();
	let timeLeft=config.reactionWindow-(now-state.player.auraTimestamp);
	if (timeLeft<=0) return;
	ctx.save();
	ctx.translate(state.player.x+30, state.player.y-20);
	ctx.fillStyle="rgba(255, 255, 255, .7)";
	ctx.beginPath();
	ctx.arc(0, 0, 10, 0, Math.PI*2);
	ctx.fill();
	ctx.fillStyle="#000";
	ctx.font="15px \"EB Garamond\"";
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	ctx.fillText((timeLeft/1000).toFixed(1), 0, 0);
	ctx.restore();
}
function renderStats(game: Game){
	let {ctx, state}=game;
	ctx.fillStyle="#FFF";
	ctx.font="16px \"EB Garamond\"";
	cursorSpeedEl.textContent=`Speed: ${state.player.forwardSpeed.toFixed(2)}`;
	cursorMaxSpeedEl.textContent=`Max: ${state.player.maxSpeed.toFixed(2)}`;
	cursorScoreEl.textContent=`Score: ${state.score}`;
}
function renderReactionMessage(game: Game){
	let {config, ctx, state}=game;
	if (state.lastReactionMessage.text){
		ctx.globalAlpha=state.lastReactionMessage.opacity;
		ctx.fillStyle="#FFD800";
		ctx.font="20px \"EB Garamond\"";
		ctx.fillText(state.lastReactionMessage.text, config.width/2-40, config.height/2);
		state.lastReactionMessage.opacity-=state.lastReactionMessage.decay;
		if (state.lastReactionMessage.opacity<=0){
			state.lastReactionMessage.text="";
			state.lastReactionMessage.opacity=1;
		}
		ctx.globalAlpha=1;
	}
}
export function draw(game: Game){
	let {config, ctx}=game;
	ctx.clearRect(0, 0, config.width, config.height);
	renderSky(game);
	renderTerrain(game);
	renderBalls(game);
	renderPlane(game);
	renderTrail(game);
	renderOrbCursor(game);
	renderReactionTimer(game);
	renderStats(game);
	renderReactionMessage(game);
}
