// earner-dashboard.js
const token = localStorage.getItem("token");
if(!token) window.location.href="signup-login.html";

function showFriendlyError(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerText = message;
    el.style.color = '#b00020';
}

async function fetchDashboard() {
    // Load basic user info
    try {
        const res = await fetch("https://skilltobill-b.onrender.com/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('auth');
        const user = await res.json();
        document.getElementById("welcomeName").innerText = `Welcome, ${user.name}`;
        document.getElementById("profilePic").src = user.profileImage || "assets/images/default.png";
        document.getElementById("totalEarnings").innerText = `$${user.earnings || 0}`;
        document.getElementById("completedJobs").innerText = user.completedJobs || 0;
        document.getElementById("activeJobs").innerText = user.activeJobs || 0;

        // Recent jobs
        const tbody = document.getElementById("jobsTable");
        tbody.innerHTML = "";
        (user.jobs || []).forEach(job=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${job.title}</td><td>${job.client}</td><td>${job.status}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showFriendlyError('jobsTable', 'Unable to load dashboard. Please refresh or try again later.');
    }

    // Load enrolled courses and progress
    try {
        const res = await fetch("https://skilltobill-b.onrender.com/api/courses/my-courses", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('courses');
        const courses = await res.json();
        const container = document.getElementById('coursesList');
        container.innerHTML = '';
        if (!courses.length) {
            container.innerText = 'You are not enrolled in any courses yet. Visit Courses to enroll.';
        } else {
            courses.forEach(c => {
                const div = document.createElement('div');
                const progressText = c.completed ? 'Completed' : `${c.progress || 0}%`;
                div.className = 'course-item';
                div.innerHTML = `<a href="course.html?id=${c._id}"><strong>${c.title}</strong></a> - <span class="progress">${progressText}</span>`;
                container.appendChild(div);
            });
        }
    } catch (err) {
        showFriendlyError('coursesList', 'Unable to load your courses. Try again later.');
    }

    // Load in-app notifications
    try {
        const res = await fetch("https://skilltobill-b.onrender.com/api/notifications", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('notifications');
        const notifications = await res.json();
        const nContainer = document.getElementById('notificationsList');
        nContainer.innerHTML = '';
        if (!notifications.length) {
            nContainer.innerText = 'No new notifications';
        } else {
            const ul = document.createElement('ul');
            notifications.forEach(n => {
                const li = document.createElement('li');
                const time = new Date(n.createdAt).toLocaleString();
                li.innerText = `${n.message} · ${time}`;
                ul.appendChild(li);
            });
            nContainer.appendChild(ul);
        }
    } catch (err) {
        showFriendlyError('notificationsList', 'Unable to load notifications.');
    }
}

fetchDashboard();

// Profile image upload
document.getElementById('profileImageInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const res = await fetch('https://skilltobill-b.onrender.com/api/auth/upload-profile-image', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      showFriendlyError('coursesList', data.message || 'Upload failed');
      return;
    }

    document.getElementById('profilePic').src = data.profileImage;

    // Update localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.profileImage = data.profileImage;
    localStorage.setItem('user', JSON.stringify(user));

    showFriendlyError('coursesList', 'Profile image updated successfully!');
  } catch (err) {
    showFriendlyError('coursesList', 'Network error during upload.');
  }
});
