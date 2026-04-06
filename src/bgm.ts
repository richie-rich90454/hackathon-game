import {PolySynth, FMSynth, now, start as toneStart, Loop} from "tone";
import {Midi} from "@tonejs/midi";

let isPlaying=false;
let midiData: Midi|null=null;
let synth: PolySynth<FMSynth>|null=null;
let midiLoop: Loop|null=null;

async function initAudio(){
	synth=new PolySynth(FMSynth,{
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
async function loadMidi(): Promise<Midi|null>{
	try{
		let res=await fetch("hackathon_game.mid");
		let buf=await res.arrayBuffer();
		return new Midi(buf);
	}
	catch (e){
		console.error("MIDI load failed:", e);
		return null;
	}
}
async function startMusic(){
	if (!synth) await initAudio();
	if (!midiData) midiData=await loadMidi();
	if (!midiData) return;
	await toneStart();
	midiLoop?.stop();
	let startTime=now()+0.1;
	midiData.tracks.forEach(track=>{
		track.notes.forEach(n=>{
			synth!.triggerAttackRelease(n.name, n.duration, startTime+n.time, n.velocity*0.75);
		});
	});
	midiLoop=new Loop((time)=>{
		midiData!.tracks.forEach(track=>{
			track.notes.forEach(n=>{
				synth!.triggerAttackRelease(n.name, n.duration, time+n.time, n.velocity*0.75);
			});
		});
	}, midiData.duration);
	midiLoop.start(startTime);
	if (midiData.header.tempos.length){
		let bpm=midiData.header.tempos[0].bpm;
		synth!.context.transport.bpm.value=bpm;
	}
	isPlaying=true;
}
window.addEventListener("DOMContentLoaded", async ()=>{
	await initAudio();
	await loadMidi();
	let unlockAndPlay=async ()=>{
		if (!isPlaying) await startMusic();
		window.removeEventListener("click", unlockAndPlay);
		window.removeEventListener("keydown", unlockAndPlay);
	};
	window.addEventListener("click", unlockAndPlay);
	window.addEventListener("keydown", unlockAndPlay);
});