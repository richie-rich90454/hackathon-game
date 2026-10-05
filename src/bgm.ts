import type {PolySynth as PolySynthType, FMSynth as FMSynthType, Loop as LoopType} from "tone";
import {Midi} from "@tonejs/midi";

let isPlaying=false;
let starting=false;
let midiData: Midi|null=null;
let synth: PolySynthType<FMSynthType>|null=null;
let midiLoop: LoopType|null=null;

function initAudio(tone: typeof import("tone")){
	synth=new tone.PolySynth(tone.FMSynth,{
		harmonicity: 3,
		modulationIndex: 10,
		oscillator:{
			type: "sine" as const
		},
		envelope:{
			attack: 0.002,
			decay: 1.2,
			sustain: 0.3,
			release: 1.5
		},
		modulation:{
			type: "triangle" as const
		},
		modulationEnvelope:{
			attack: 0.002,
			decay: 0.5,
			sustain: 0,
			release: 0.5
		}
	}).toDestination();
}
function decodeMidi(dataUri: string): Midi{
	let base64=dataUri.slice(dataUri.indexOf(",")+1);
	let binary=atob(base64);
	let bytes=new Uint8Array(binary.length);
	for (let i=0;i<binary.length;i++){
		bytes[i]=binary.charCodeAt(i);
	}
	return new Midi(bytes);
}
async function startMusic(){
	if (isPlaying||starting) return;
	starting=true;
	try{
		if (!midiData){
			try{
				let {MIDI_DATA_URI}=await import("./midi");
				midiData=decodeMidi(MIDI_DATA_URI);
			}
			catch (e){
				console.error("MIDI load failed:", e);
				return;
			}
		}
		// Tone builds its AudioContext while the module is evaluated, so it is imported on the
		// first real interaction instead of on load. Autoplay policies then allow it to start.
		let tone=await import("tone");
		if (!synth) initAudio(tone);
		await tone.start();
		if (midiData.header.tempos.length){
			let bpm=midiData.header.tempos[0].bpm;
			synth!.context.transport.bpm.value=bpm;
		}
		midiLoop?.stop();
		midiLoop?.dispose();
		let startTime=tone.now()+0.1;
		midiLoop=new tone.Loop((time)=>{
			midiData!.tracks.forEach(track=>{
				track.notes.forEach(n=>{
					synth!.triggerAttackRelease(n.name, n.duration, time+n.time, n.velocity*0.75);
				});
			});
		}, midiData.duration);
		midiLoop.start(startTime);
		isPlaying=true;
	}
	finally{
		starting=false;
	}
}
let unlockAndPlay=async ()=>{
	await startMusic();
	if (isPlaying&&synth&&synth.context.state=="running"){
		window.removeEventListener("pointerdown", unlockAndPlay);
		window.removeEventListener("keydown", unlockAndPlay);
	}
};
// Registered synchronously so the very first interaction is never missed.
window.addEventListener("pointerdown", unlockAndPlay);
window.addEventListener("keydown", unlockAndPlay);
