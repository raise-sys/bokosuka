let reference,sound=false,context,timer,busy=false;
const keyMap={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',' ':'wait',Escape:'pause'};
async function move(direction){if(busy||!reference)return;busy=true;try{await reference.invokeMethodAsync('Move',direction);}finally{busy=false;}}
function stop(){clearTimeout(timer);timer=null;}
export function stopInput(){stop();}
function repeat(direction){move(direction);timer=setTimeout(()=>repeat(direction),155);}
function down(event){const button=event.target.closest('[data-direction]');if(!button||button.disabled)return;event.preventDefault();stop();button.setPointerCapture(event.pointerId);move(button.dataset.direction);timer=setTimeout(()=>repeat(button.dataset.direction),300);}
function key(event){if(event.target.closest('summary,input,textarea')||event.ctrlKey||event.metaKey||event.altKey)return;const direction=keyMap[event.key];if(!direction)return;event.preventDefault();if(!event.repeat)move(direction);}
function visibility(){if(document.hidden)stop();}
export function initialize(dotnet){reference=dotnet;document.addEventListener('pointerdown',down);document.addEventListener('pointerup',stop);document.addEventListener('pointercancel',stop);document.addEventListener('keydown',key);window.addEventListener('blur',stop);document.addEventListener('visibilitychange',visibility);try{return Math.max(0,parseInt(localStorage.getItem('bokosuka-best')||'0',10)||0);}catch{return 0;}}
export function saveBest(value){try{localStorage.setItem('bokosuka-best',String(value));}catch{}}
export function setSound(value){sound=value;if(sound){context??=new(window.AudioContext||window.webkitAudioContext)();context.resume();}}
export function tone(frequency){if(!sound||!context)return;const osc=context.createOscillator(),gain=context.createGain();osc.type='square';osc.frequency.value=frequency;gain.gain.setValueAtTime(.025,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.07);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+.08);}
export function dispose(){stop();document.removeEventListener('pointerdown',down);document.removeEventListener('pointerup',stop);document.removeEventListener('pointercancel',stop);document.removeEventListener('keydown',key);window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',visibility);reference=null;context?.close();context=null;}

