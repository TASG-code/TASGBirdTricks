const qs = (s)=>document.querySelector(s);

function cleanText(s){
  if(!s) return "";
  return String(s).replace(/<[^>]*>/g,"").replace(/\u00a0/g," ").replace(/[^\S\r\n]+/g," ").trim();
}
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

let lesson=null, stepIndex=0;
let typingAbort={abort:false};

const elTitle=qs("#lessonTitle"), elBubble=qs("#bubbleText"), elStepPill=qs("#stepPill"), elStepTitle=qs("#stepTitle");
const elProgress=qs("#progressBar");
const btnBack=qs("#backBtn"), btnNext=qs("#nextBtn"), btnHint=qs("#hintBtn"), btnRestart=qs("#restartBtn");
const hintBox=qs("#hintBox"), elHintText=qs("#hintText");
const canvas=qs("#illustrationCanvas");
const ctx=canvas.getContext("2d");

// Load lesson data
async function loadLesson(){
  const res=await fetch("stay_training.json", {cache:"no-store"});
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Typing animation
async function typeBubble(text){
  typingAbort.abort=true; 
  await sleep(10); 
  typingAbort={abort:false};
  const t=cleanText(text);
  elBubble.textContent="";
  for(let i=0;i<t.length;i++){
    if(typingAbort.abort) return;
    elBubble.textContent+=t[i];
    await sleep(12);
  }
}

// Generate illustration for each step
function drawIllustration(stepData){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  const stage = stepData.stage;
  
  // Common elements
  drawPerch();
  drawBird();
  
  // Stage-specific elements
  if(stage === 1){
    drawHand(300, 200);
    drawText("Stay", 300, 160, 24, '#2477c9');
    drawTimer("1 sec", 450, 100);
  }
  else if(stage === 2){
    drawHand(300, 200);
    drawText("Stay", 300, 160, 24, '#2477c9');
    drawTimer(stepData.duration || "5-15 sec", 450, 100);
  }
  else if(stage === 3){
    drawHand(150, 200);
    drawText("Stay", 150, 160, 24, '#2477c9');
    drawArrow(200, 250, 350, 250);
    drawPerson(400, 280);
  }
  else if(stage === 4){
    drawHand(150, 200);
    drawText("Stay", 150, 160, 24, '#2477c9');
    drawDistraction(400, 200);
  }
  else if(stage === 5){
    drawText("Stay", 200, 100, 24, '#2477c9');
    drawPerson(450, 300);
    drawTimer("30-60 sec", 450, 100);
  }
  
  // Draw step indicator
  ctx.fillStyle = '#0d1b2a';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Stage ${stage}`, 20, 30);
}

// Drawing helper functions
function drawPerch(){
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(180, 250, 100, 10);
  ctx.fillRect(215, 260, 5, 80);
  ctx.fillRect(225, 260, 5, 80);
}

function drawBird(){
  // Body
  ctx.fillStyle = '#4a9eff';
  ctx.beginPath();
  ctx.ellipse(230, 220, 25, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.beginPath();
  ctx.arc(230, 190, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // Beak
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.moveTo(245, 190);
  ctx.lineTo(260, 190);
  ctx.lineTo(245, 195);
  ctx.closePath();
  ctx.fill();
  
  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(238, 185, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Wing
  ctx.fillStyle = '#3a7ecf';
  ctx.beginPath();
  ctx.ellipse(220, 230, 12, 20, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawHand(x, y){
  ctx.fillStyle = '#ffd4a3';
  
  // Palm
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 40, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Fingers
  for(let i=0; i<4; i++){
    ctx.fillRect(x - 20 + i*12, y - 40, 8, 35);
  }
  
  // Thumb
  ctx.save();
  ctx.translate(x-25, y);
  ctx.rotate(-0.5);
  ctx.fillRect(-4, -15, 8, 25);
  ctx.restore();
}

function drawPerson(x, y){
  ctx.fillStyle = '#6c5ce7';
  
  // Head
  ctx.fillStyle = '#ffd4a3';
  ctx.beginPath();
  ctx.arc(x, y-60, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Body
  ctx.fillStyle = '#6c5ce7';
  ctx.fillRect(x-25, y-40, 50, 60);
  
  // Legs
  ctx.fillRect(x-20, y+20, 15, 40);
  ctx.fillRect(x+5, y+20, 15, 40);
}

function drawArrow(x1, y1, x2, y2){
  ctx.strokeStyle = '#2477c9';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 15 * Math.cos(angle - Math.PI / 6), y2 - 15 * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 15 * Math.cos(angle + Math.PI / 6), y2 - 15 * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function drawTimer(text, x, y){
  ctx.fillStyle = '#e7fbf1';
  ctx.fillRect(x-50, y-20, 100, 40);
  ctx.strokeStyle = '#bfead2';
  ctx.lineWidth = 2;
  ctx.strokeRect(x-50, y-20, 100, 40);
  ctx.fillStyle = '#0e6b43';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y+5);
  ctx.textAlign = 'left';
}

function drawText(text, x, y, size, color){
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px sans-serif`;
  ctx.fillText(text, x, y);
}

function drawDistraction(x, y){
  // Waving hand
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.3);
  drawHand(0, 0);
  ctx.restore();
  
  // Motion lines
  ctx.strokeStyle = '#ffd4a3';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Progress bar
function setProgress(){
  const total = lesson.steps.length;
  const pct=Math.round(((stepIndex+1)/total)*100);
  elProgress.style.width=`${pct}%`;
}

// Hint system
function hideHint(){ hintBox.classList.add("hidden"); }
function showHint(){
  const step = lesson.steps[stepIndex];
  elHintText.textContent=cleanText(step.hint || "Keep practicing!");
  hintBox.classList.remove("hidden");
}

// Render step
async function renderStep(){
  const step = lesson.steps[stepIndex];
  const total = lesson.steps.length;

  elTitle.textContent=`Stay Command Training`;
  elStepPill.textContent=`Step ${stepIndex+1} of ${total}`;
  elStepTitle.textContent=cleanText(step.title||"Step");

  hideHint();
  await typeBubble(step.instruction);
  
  drawIllustration(step);

  setProgress();

  btnBack.disabled=(stepIndex===0);
  btnNext.disabled=(stepIndex>=total-1);
}

// Button handlers
btnBack.addEventListener("click", async ()=>{
  stepIndex=Math.max(0, stepIndex-1);
  await renderStep();
});

btnNext.addEventListener("click", async ()=>{
  if(stepIndex>=lesson.steps.length-1) return;
  stepIndex++;
  await renderStep();
});

btnHint.addEventListener("click", showHint);

btnRestart.addEventListener("click", async ()=>{
  stepIndex=0;
  await renderStep();
});

// Initialize
(async function init(){
  try{
    lesson=await loadLesson();
    await renderStep();
  }catch(e){
    console.error("Lesson load error", e);
    elTitle.textContent="Lesson load error";
    elBubble.textContent="Could not load stay_training.json";
  }
})();
