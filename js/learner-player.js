// js/learner-player.js
import { getData } from "js/utils/api.js";

const params = new URLSearchParams(location.search);
const courseId = params.get('course');
let moduleIdx = Number(params.get('module') || 0);
let lessonIdx = Number(params.get('lesson') || 0);

// Check if enrolled
const enrolledCourses = getEnrolled();
if (!enrolledCourses.includes(courseId)) {
  alert('You must enroll in this course to access the videos.');
  window.location.href = `learner-detail.html?id=${courseId}`;
  throw new Error('Not enrolled');
}

const titleEl = document.getElementById('playerCourseTitle');
const modulesEl = document.getElementById('playerModules');
const videoEl = document.getElementById('courseVideo');
const iframeEl = document.getElementById('courseIframe');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const completeBtn = document.getElementById('completeBtn');
const progressPct = document.getElementById('progressPct');

function getProgress(){ return JSON.parse(localStorage.getItem('stb_progress_v1')||'{}'); }
function setProgress(obj){ localStorage.setItem('stb_progress_v1', JSON.stringify(obj)); }
function getEnrolled(){ return (JSON.parse(localStorage.getItem('stb_enrolled_v1')||'[]')).map(String); }

function markCompleted(courseId, modIndex, lesIndex){
  const p = getProgress();
  const key = String(courseId);
  p[key] = p[key] || [];
  const flat = `${modIndex}:${lesIndex}`;
  if(!p[key].includes(flat)) p[key].push(flat);
  setProgress(p);
}

function completedCount(course, courseId){
  const p = getProgress();
  const arr = p[String(courseId)] || [];
  return arr.length;
}

function renderSidebar(course){
  const modules = Array.isArray(course.modules) ? course.modules : [];
  if(!modules.length){
    modulesEl.innerHTML = '<p class="muted">No modules yet. Content coming soon.</p>';
    return;
  }

  modulesEl.innerHTML = modules.map((mod, mi) => {
    const lessons = (mod.lessons || []);
    const list = lessons.map((ls, li) => {
      const active = (mi === moduleIdx && li === lessonIdx) ? 'active' : '';
      return `<div class="side-module ${active}" data-mi="${mi}" data-li="${li}">${mi+1}.${li+1} ${ls.title||('Lesson '+(li+1))}</div>`;
    }).join('');
    return `<div class="module-group"><div class="mg-title">${mi+1}. ${mod.moduleTitle || mod.title || 'Module '+(mi+1)}</div>${list}</div>`;
  }).join('');
}

async function loadAndPlay(){
  const data = await getData('./data/courses.json') || [];
  const course = data.find(c => String(c.id) === String(courseId));
  if(!course) return alert('Course not found.');

  titleEl.innerText = course.title || 'Player';
  renderSidebar(course);

  // bind clicks
  modulesEl.querySelectorAll('.side-module').forEach(el=>{
    el.onclick = ()=>{
      const mi = Number(el.dataset.mi);
      const li = Number(el.dataset.li);
      moduleIdx = mi; lessonIdx = li;
      playCurrent(course);
      highlightSidebar();
      updateProgressUI(course);
      history.replaceState(null,'',`learner-player.html?course=${courseId}&module=${mi}&lesson=${li}`);
    };
  });

  prevBtn.onclick = ()=>{
    if(moduleIdx === 0 && lessonIdx === 0) return;
    if(lessonIdx > 0) lessonIdx--;
    else {
      moduleIdx = Math.max(0, moduleIdx-1);
      const prevLessons = (course.modules[moduleIdx].lessons||[]).length;
      lessonIdx = Math.max(0, prevLessons-1);
    }
    playCurrent(course);
    highlightSidebar();
  };

  nextBtn.onclick = ()=>{
    const lessons = (course.modules[moduleIdx].lessons||[]).length;
    if(lessonIdx < lessons - 1) lessonIdx++;
    else {
      if(moduleIdx < course.modules.length - 1){ moduleIdx++; lessonIdx = 0; }
      else return;
    }
    playCurrent(course);
    highlightSidebar();
  };

  completeBtn.onclick = async ()=>{
    markCompleted(courseId, moduleIdx, lessonIdx);
    updateProgressUI(course);
    alert('Marked complete');
  };

  videoEl.addEventListener('ended', ()=>{
    markCompleted(courseId, moduleIdx, lessonIdx);
    updateProgressUI(course);
  });

  playCurrent(course);
  highlightSidebar();
  updateProgressUI(course);
}

function highlightSidebar(){
  modulesEl.querySelectorAll('.side-module').forEach(el=>{
    const mi = Number(el.dataset.mi), li = Number(el.dataset.li);
    el.classList.toggle('active', mi===moduleIdx && li===lessonIdx);
  });
}

function updateProgressUI(course){
  const totalLessons = (course.modules || []).reduce((acc,m)=> acc + ((m.lessons||[]).length), 0);
  const done = completedCount(course, courseId);
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  progressPct.innerText = pct + '%';
}

function isEmbedUrl(u){
  if(!u) return false;
  return u.includes('youtube.com') || u.includes('youtu.be') || u.includes('drive.google.com') || u.includes('vimeo.com');
}

function setVideoSourceByUrl(url){
  const isEmbed = isEmbedUrl(url);
  if(isEmbed){
    videoEl.style.display = 'none';
    iframeEl.style.display = 'block';
    // if Google Drive share link (view) convert to embed if needed:
    // If user stored direct "uc?export=download" or youtube embed, it will work as-is.
    iframeEl.src = url;
  } else {
    iframeEl.style.display = 'none';
    videoEl.style.display = 'block';
    videoEl.src = url;
  }
}

function playCurrent(course){
  const modules = course.modules || [];
  if(!modules.length){
    document.getElementById('videoContainer').innerHTML = '<p class="muted" style="padding:20px">No lessons available yet.</p>';
    return;
  }
  const lesson = (modules[moduleIdx].lessons || [])[lessonIdx];
  if(!lesson || !lesson.url){
    document.getElementById('videoContainer').innerHTML = '<p class="muted" style="padding:20px">Lesson video not added yet.</p>';
    return;
  }
  setVideoSourceByUrl(lesson.url);
}

loadAndPlay();