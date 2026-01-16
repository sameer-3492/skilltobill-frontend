// js/learner.js
import { getData } from "./utils/api.js";

const container = document.getElementById('coursesList');
const searchBar = document.getElementById('searchBar');

function esc(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

async function render(q=''){
  container.innerHTML = '<p>Loading courses...</p>';
  const courses = await getData('./data/courses.json') || [];
  const filtered = courses.filter(c => c.title.toLowerCase().includes((q||'').toLowerCase()));
  if(!filtered.length){
    container.innerHTML = '<p class="muted">No courses found.</p>';
    return;
  }

  container.innerHTML = filtered.map(c => {
    const price = (c.price===0 || c.price==='0') ? 'Free' : `₹${c.price}`;
    const thumb = c.thumbnail || 'https://via.placeholder.com/600x340?text=Course';
    return `
      <article class="card learner-card">
        <img class="card-img" src="${esc(thumb)}" alt="${esc(c.title)}" />
        <div class="card-body">
          <h3>${esc(c.title)}</h3>
          <p class="muted">${esc(c.duration || c.description || '')}</p>
          <div class="card-foot price-enroll">
            <span class="price">${price}</span>
            <div class="cta">
              <button onclick="viewDetail('${c.id}')">View Details</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.viewDetail = id => location.href = `learner-detail.html?id=${encodeURIComponent(id)}`;

searchBar.addEventListener('input', e => render(e.target.value.trim()));

render();