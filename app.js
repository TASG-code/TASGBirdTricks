const DEFAULT_LESSON = "trick_001";
const qs = (s)=>document.querySelector(s);

function cleanText(s){
  if(!s) return "";
  return String(s)
    .replace(/<[^>]*>/g,"")
    .replace(/\u00a0/g," ")
    .replace(/[^\S\r\n]+/g," ")
    .trim();
}
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

let lesson=null, stepIndex=0;
let typingAbort={abort:false};

const elTitle=qs("#lessonTitle"), elBubble=qs("#bubbleText"), elStepPill=qs("#stepPill"), elStepTitle=qs("#stepTitle");
const elStepImage=qs("#stepImage"), elImageStatus=qs("#imageStatus"), elProgress=qs("#progressBar");
const btnBack=qs("#backBtn"), btnNext=qs("#nextBtn"), btnComplete=qs("#completeBtn"), btnHint=qs("#hintBtn"), btnRestart=qs("#restartBtn");
const hintBox=qs("#hintBox"), elHintText=qs("#hintText");
const bubbleEl=qs("#bubble");
const levelSelector=qs("#levelSelector");
const eyesContainer=qs("#eyesContainer");
const bubbleRewards=qs("#bubbleRewards");

// Audio context
let audioContext = null;

// Physics for reward balls
let balls = [];
let physicsInterval = null;
let levelCompletedThisSession = false;

// Sound functions
function playBubbleSound(){
  if(!audioContext){
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.frequency.value = 300 + Math.random() * 200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.03, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  osc.start();
  osc.stop(audioContext.currentTime + 0.1);
}

function playBoinkSound(velocity){
  if(!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  const volume = Math.min(0.08, Math.abs(velocity) * 0.01);
  const freq = 150 + Math.abs(velocity) * 8;
  osc.frequency.value = freq;
  osc.type = 'triangle';
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}

function playBubbleCollisionSound(){
  if(!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.frequency.value = 400 + Math.random() * 200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
  osc.start();
  osc.stop(audioContext.currentTime + 0.12);
}

// Eyes animation
function setEyesHappy(){
  eyesContainer.className = 'eyes-container happy';
}

function setEyesThinking(){
  eyesContainer.className = 'eyes-container thinking';
  setTimeout(()=>{
    setEyesHappy();
  }, 1600);
}

// Bubble rewards with physics
function spawnBubbleBlob(){
  const colors = ['#ff3b30', '#ffb020', '#1e86ff'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const blob = document.createElement('div');
  blob.className = 'bubble-blob';
  blob.style.background = randomColor;
  blob.style.boxShadow = `0 4px 12px ${randomColor}66`;
  blob.style.left = '0px';
  blob.style.bottom = '0px';
  
  bubbleRewards.appendChild(blob);
  
  const ball = {
    element: blob,
    x: 20,
    y: 5,
    vx: 15 + Math.random() * 5,
    vy: -10 - Math.random() * 5,
    radius: 20,
    color: randomColor,
    mass: 1,
    restitution: 0.7
  };
  
  balls.push(ball);
  
  if(!physicsInterval){
    physicsInterval = setInterval(updatePhysics, 1000/60);
  }
}

function updatePhysics(){
  const container = bubbleRewards.getBoundingClientRect();
  const width = container.width - 40;
  const height = container.height - 40;
  const floor = 0;
  const gravity = 0.5;
  const damping = 0.99;
  
  for(let i = 0; i < balls.length; i++){
    const ball = balls[i];
    
    ball.vy += gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= damping;
    ball.vy *= damping;
    
    if(ball.y <= floor){
      ball.y = floor;
      ball.vy = -ball.vy * ball.restitution;
      if(Math.abs(ball.vy) > 2) playBoinkSound(ball.vy);
    }
    
    if(ball.y >= height){
      ball.y = height;
      ball.vy = -ball.vy * ball.restitution;
      playBoinkSound(ball.vy);
    }
    
    if(ball.x >= width){
      ball.x = width;
      ball.vx = -ball.vx * ball.restitution;
      playBoinkSound(ball.vx);
    }
    
    if(ball.x <= 0){
      ball.x = 0;
      ball.vx = -ball.vx * ball.restitution;
      playBoinkSound(ball.vx);
    }
    
    for(let j = i + 1; j < balls.length; j++){
      const other = balls[j];
      const dx = other.x - ball.x;
      const dy = other.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = ball.radius + other.radius;
      
      if(distance < minDist){
        playBubbleCollisionSound();
        
        const angle = Math.atan2(dy, dx);
        const targetX = ball.x + Math.cos(angle) * minDist;
        const targetY = ball.y + Math.sin(angle) * minDist;
        const ax = (targetX - other.x) * 0.5;
        const ay = (targetY - other.y) * 0.5;
        
        ball.x -= ax;
        ball.y -= ay;
        other.x += ax;
        other.y += ay;
        
        const normalX = dx / distance;
        const normalY = dy / distance;
        const relVelX = other.vx - ball.vx;
        const relVelY = other.vy - ball.vy;
        const speed = relVelX * normalX + relVelY * normalY;
        
        if(speed < 0) continue;
        
        const impulse = 2 * speed / (ball.mass + other.mass);
        ball.vx += impulse * other.mass * normalX;
        ball.vy += impulse * other.mass * normalY;
        other.vx -= impulse * ball.mass * normalX;
        other.vy -= impulse * ball.mass * normalY;
      }
    }
    
    ball.element.style.left = `${ball.x}px`;
    ball.element.style.bottom = `${ball.y}px`;
    
    if(Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1 && ball.y <= 2){
      ball.vx = 0;
      ball.vy = 0;
      ball.y = 0;
    }
  }
  
  const allAtRest = balls.every(b => 
    Math.abs(b.vx) < 0.1 && Math.abs(b.vy) < 0.1 && b.y <= 2
  );
  
  if(allAtRest && balls.length > 0){
    clearInterval(physicsInterval);
    physicsInterval = null;
  }
}

function clearAllBalls(){
  balls.forEach(ball => ball.element.remove());
  balls = [];
  if(physicsInterval){
    clearInterval(physicsInterval);
    physicsInterval = null;
  }
}

// Level system
function getLevelProgress(lessonId){
  try{
    const raw = localStorage.getItem(`LESSON__${lessonId}`);
    if(!raw) return {unlockedLevel: 'basic', currentLevel: 'basic', completedLevels: []};
    const data = JSON.parse(raw);
    if(!data.currentLevel) data.currentLevel = data.unlockedLevel || 'basic';
    return data;
  }catch(_){
    return {unlockedLevel: 'basic', currentLevel: 'basic', completedLevels: []};
  }
}

function saveLevelProgress(lessonId, unlockedLevel, currentLevel, completedLevels){
  localStorage.setItem(`LESSON__${lessonId}`, JSON.stringify({unlockedLevel, currentLevel, completedLevels}));
}

function unlockNextLevel(lessonId, completedLevel){
  const levelProgress = getLevelProgress(lessonId);
  if(!levelProgress.completedLevels.includes(completedLevel)){
    levelProgress.completedLevels.push(completedLevel);
  }
  
  let newUnlockedLevel = levelProgress.unlockedLevel;
  if(completedLevel === 'basic'){
    newUnlockedLevel = 'intermediate';
  } else if(completedLevel === 'intermediate'){
    newUnlockedLevel = 'advanced';
  }
  
  saveLevelProgress(lessonId, newUnlockedLevel, levelProgress.currentLevel, levelProgress.completedLevels);
  return newUnlockedLevel;
}

function setCurrentLevel(lessonId, level){
  const levelProgress = getLevelProgress(lessonId);
  saveLevelProgress(lessonId, levelProgress.unlockedLevel, level, levelProgress.completedLevels);
}

function getCurrentSteps(lesson){
  const levelProgress = getLevelProgress(lesson.lessonId);
  const currentLevel = levelProgress.currentLevel;
  
  if(currentLevel === 'basic' && lesson.steps_basic){
    return {steps: lesson.steps_basic, level: 'basic'};
  } else if(currentLevel === 'intermediate' && lesson.steps_intermediate){
    return {steps: lesson.steps_intermediate, level: 'intermediate'};
  } else if(currentLevel === 'advanced' && lesson.steps_advanced){
    return {steps: lesson.steps_advanced, level: 'advanced'};
  }
  return {steps: lesson.steps_basic || lesson.steps || [], level: 'basic'};
}

function updateLevelSelector(){
  const levelProgress = getLevelProgress(lesson.lessonId);
  
  Array.from(levelSelector.options).forEach(option => {
    const level = option.value;
    if(level === 'basic'){
      option.disabled = false;
    } else if(level === 'intermediate'){
      option.disabled = levelProgress.unlockedLevel === 'basic';
    } else if(level === 'advanced'){
      option.disabled = levelProgress.unlockedLevel !== 'advanced';
    }
  });
  
  levelSelector.value = levelProgress.currentLevel;
}

levelSelector.addEventListener('change', async ()=>{
  const selectedLevel = levelSelector.value;
  const levelProgress = getLevelProgress(lesson.lessonId);
  
  if(selectedLevel === 'intermediate' && levelProgress.unlockedLevel === 'basic'){
    alert('Intermediate level is locked. Complete Basic level first!');
    levelSelector.value = levelProgress.currentLevel;
    return;
  }
  if(selectedLevel === 'advanced' && levelProgress.unlockedLevel !== 'advanced'){
    alert('Advanced level is locked. Complete Intermediate level first!');
    levelSelector.value = levelProgress.currentLevel;
    return;
  }
  
  setCurrentLevel(lesson.lessonId, selectedLevel);
  stepIndex = 0;
  await renderStep();
});

// Lesson loading
function getLessonId(){ return new URL(location.href).searchParams.get("lesson") || DEFAULT_LESSON; }
async function loadLesson(lessonId){
  const res=await fetch(`${lessonId}.json`, {cache:"no-store"});
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function typeBubble(text){
  typingAbort.abort=true; await sleep(10); typingAbort={abort:false};
  const t=cleanText(text);
  elBubble.textContent="";
  setEyesThinking();
  for(let i=0;i<t.length;i++){
    if(typingAbort.abort) return;
    elBubble.textContent+=t[i];
    await sleep(14);
  }
}

function displayImage(imagePath){
  elStepImage.classList.add("hidden");
  elImageStatus.classList.add("hidden");
  
  if(!imagePath){
    elImageStatus.textContent = "No image for this step.";
    elImageStatus.classList.remove("hidden");
    return;
  }
  
  elStepImage.src = imagePath;
  elStepImage.onload = ()=>{
    elStepImage.classList.remove("hidden");
  };
  elStepImage.onerror = ()=>{
    elImageStatus.textContent = "Image failed to load.";
    elImageStatus.classList.remove("hidden");
  };
}

function setProgress(){
  const currentData = getCurrentSteps(lesson);
  const total = currentData.steps.length;
  const pct=Math.round(((stepIndex+1)/total)*100);
  elProgress.style.width=`${pct}%`;
}

function hideHint(){ hintBox.classList.add("hidden"); }
function showHint(){
  const currentData = getCurrentSteps(lesson);
  const step = currentData.steps[stepIndex];
  elHintText.textContent=cleanText(step.hint || "Try again!");
  hintBox.classList.remove("hidden");
}

async function renderStep(){
  const currentData = getCurrentSteps(lesson);
  const step = currentData.steps[stepIndex];
  const total = currentData.steps.length;
  const levelLabel = currentData.level.charAt(0).toUpperCase() + currentData.level.slice(1);
  const isLastStep = (stepIndex === total - 1);

  elTitle.textContent=`${lesson.title} [${levelLabel}]`;
  elStepPill.textContent=`Step ${stepIndex+1} of ${total}`;
  elStepTitle.textContent=cleanText(step.title||"Step");

  hideHint();
  await typeBubble(step.instruction);

  displayImage(step.image || "");

  setProgress();
  updateLevelSelector();

  btnBack.disabled=(stepIndex===0);
  btnNext.disabled=isLastStep;
  
  if(isLastStep){
    btnComplete.classList.remove("hidden");
    btnNext.classList.add("hidden");
  } else {
    btnComplete.classList.add("hidden");
    btnNext.classList.remove("hidden");
  }
}

async function completeLevel(){
  const currentData = getCurrentSteps(lesson);
  const currentLevel = currentData.level;
  const newUnlockedLevel = unlockNextLevel(lesson.lessonId, currentLevel);
  
  if(!levelCompletedThisSession){
    levelCompletedThisSession = true;
    setTimeout(()=>{
      spawnBubbleBlob();
    }, 300);
  }
  
  if(newUnlockedLevel !== currentLevel){
    const levelNames = {basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced'};
    const ready = confirm(`🎉 Congratulations! You've completed ${levelNames[currentLevel]} level!\n\n${levelNames[newUnlockedLevel]} level is now unlocked.\n\nAre you ready for ${levelNames[newUnlockedLevel]} level?`);
    
    if(ready){
      setCurrentLevel(lesson.lessonId, newUnlockedLevel);
      stepIndex = 0;
      levelCompletedThisSession = false;
      await renderStep();
    }
  } else {
    alert("🎉 Amazing work! You've completed all levels!");
  }
}

btnBack.addEventListener("click", async ()=>{
  stepIndex=Math.max(0, stepIndex-1);
  await renderStep();
});

btnNext.addEventListener("click", async ()=>{
  const currentData = getCurrentSteps(lesson);
  if(stepIndex>=currentData.steps.length-1) return;
  stepIndex++;
  await renderStep();
});

btnComplete.addEventListener("click", completeLevel);
btnHint.addEventListener("click", showHint);

btnRestart.addEventListener("click", async ()=>{
  clearAllBalls();
  stepIndex=0;
  levelCompletedThisSession = false;
  await renderStep();
});

(async function init(){
  setEyesHappy();

  const lessonId=getLessonId();
  try{
    lesson=await loadLesson(lessonId);
    lesson.lessonId=lessonId;
    await renderStep();
  }catch(e){
    console.error("Lesson load error", e);
    elTitle.textContent="Lesson load error";
    elStepTitle.textContent="Could not load lesson";
    elBubble.textContent=`Could not load ${lessonId}.json`;
  }
})();
