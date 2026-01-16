// js/learner-dashboard.js
import { getData } from "./utils/api.js";

const container = document.getElementById('myCourses');
function getEnrolled(){ 
  return (JSON.parse(localStorage.getItem('stb_enrolled_v1')||'[]')).map(String); 
}

document.getElementById('clearEnrolledBtn').addEventListener('click', () => {
  localStorage.removeItem('stb_enrolled_v1');
  location.reload();
});

(async function(){
  container.innerHTML = '<p>Loading...</p>';
  const courses = await getData('./data/courses.json') || [];
  const enrolled = getEnrolled();

  if(!enrolled.length){
    container.innerHTML = '<p class="muted">You have not enrolled in any courses yet. <a href="learner-zone.html">Browse courses</a></p>';
    return;
  }

  const my = courses.filter(c => enrolled.includes(String(c.id)));
  if(!my.length){
    container.innerHTML = '<p class="muted">No enrolled courses found. <a href="learner-zone.html">Browse courses</a></p>';
    return;
  }

  container.innerHTML = my.map(c=>{
    const thumb = c.thumbnail || 'https://via.placeholder.com/600x340?text=Course';
    const price = (c.price===0 || c.price==='0') ? 'Free' : `₹${c.price}`;
    return `
      <article class="card learner-card small">
        <img class="card-img" src="${thumb}" alt="${c.title}" />
        <div class="card-body">
          <h3>${c.title}</h3>
          <p class="muted">${c.duration || c.description || ''}</p>
          <div class="card-foot price-enroll">
            <button onclick="openPlayerFromDashboard('${c.id}')">Open</button>
            <span class="small-muted">${Array.isArray(c.modules)?c.modules.length:0} modules • ${price}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
})();

window.openPlayerFromDashboard = (courseId) => {
  location.href = `learner-player.html?course=${encodeURIComponent(courseId)}&module=0&lesson=0`;
};
