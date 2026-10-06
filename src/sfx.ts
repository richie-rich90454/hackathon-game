import type {Game} from "./state";

// Tone is pulled in on the start click (see initSfx) because it builds its AudioContext while the module
// is evaluated. Until then this stays inert and the sound effects are simply silent.
let now: ()=>number=()=>0;
export async function initSfx(game: Game){
	let tone=await import("tone");
	await tone.start();
	now=tone.now;
	game.state.synth=new tone.PolySynth(tone.Synth).toDestination();
}
export function playCollectionSound(game: Game){
	if (Date.now()-game.state.lastSoundTime<game.config.soundCooldown){
		return;
	}
	if (game.state.synth){
		game.state.synth.triggerAttackRelease("E4", "8n", now(), 1.0);
		game.state.lastSoundTime=Date.now();
	}
}
export function playReactionSound(game: Game, reactionName: string){
	if (Date.now()-game.state.lastSoundTime<game.config.soundCooldown){
		return;
	}
	if (!game.state.synth){
		return;
	}
	let synthConfig;
	switch(reactionName){
		case "Steamburst":
			synthConfig={oscillator: { type: "sine" as "sine"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("G4", "8n", now(), 0.5);
			break;
		case "Frostburn":
			synthConfig={oscillator: { type: "triangle" as "triangle"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("A4", "8n", now(), 0.5);
			break;
		case "Sparkflare":
			synthConfig={oscillator: { type: "sawtooth" as "sawtooth"}, envelope: { attack: .01, decay: .3, sustain: 0, release: .3}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("E3", "4n", now(), 0.5);
			break;
		case "Chillshock":
			synthConfig={oscillator: { type: "square" as "square"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("F3", "8n", now(), 0.5);
			break;
		case "Voltflow":
			synthConfig={oscillator: { type: "pulse" as "pulse"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("D4", "8n", now(), 0.5);
			break;
		case "Galeweave":
			synthConfig={oscillator: { type: "sine" as "sine"}, envelope: { attack: .01, decay: .3, sustain: 0, release: .3}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("C5", "4n", now(), 0.5);
			break;
		case "Stoneguard":
			synthConfig={oscillator: { type: "triangle" as "triangle"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("B3", "8n", now(), 0.5);
			break;
		case "Wildfire":
			synthConfig={oscillator: { type: "sawtooth" as "sawtooth"}, envelope: { attack: .01, decay: .3, sustain: 0, release: .3}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("G3", "4n", now(), 0.5);
			break;
		case "Icebind":
			synthConfig={oscillator: { type: "sine" as "sine"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("A5", "8n", now(), 0.5);
			break;
		case "Lifeburst":
			synthConfig={oscillator: { type: "triangle" as "triangle"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("E4", "8n", now(), 0.5);
			break;
		case "Growthspark":
			synthConfig={oscillator: { type: "pulse" as "pulse"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("F4", "8n", now(), 0.5);
			break;
		case "Shockbloom":
			synthConfig={oscillator: { type: "sawtooth" as "sawtooth"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("G4", "8n", now(), 0.5);
			break;
		case "Wildgrowth":
			synthConfig={oscillator: { type: "triangle" as "triangle"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("A4", "8n", now(), 0.5);
			break;
		case "Flamebloom":
			synthConfig={oscillator: { type: "sawtooth" as "sawtooth"}, envelope: { attack: .01, decay: .3, sustain: 0, release: .3}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("E3", "4n", now(), 0.5);
			break;
		case "Surgebloom":
			synthConfig={oscillator: { type: "pulse" as "pulse"}, envelope: { attack: .01, decay: .2, sustain: 0, release: .2}};
			game.state.synth.set(synthConfig);
			game.state.synth.triggerAttackRelease("D4", "8n", now(), 0.5);
			break;
	}
	game.state.lastSoundTime=Date.now();
}
