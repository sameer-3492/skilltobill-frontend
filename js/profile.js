// js/profile.js - Updated for Modern Design
const token = localStorage.getItem("token");
if (!token) window.location.href = "signup-login.html";

const API_BASE = "https://skilltobill-b.onrender.com/api";

// Load dashboard content based on role
async function loadDashboard(role) {
  if (role === 'earner') {
    // Load notifications
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
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
      }
    } catch (err) {
      document.getElementById('notificationsList').innerText = 'Unable to load notifications.';
    }

    // Load enrolled courses
    try {
      const res = await fetch(`${API_BASE}/courses/my-courses`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const courses = await res.json();
        const container = document.getElementById('coursesList');
        container.innerHTML = '';
        document.getElementById('coursesSection').style.display = 'block';
        if (!courses.length) {
          container.innerText = 'You are not enrolled in any courses yet.';
        } else {
          courses.forEach(c => {
            const div = document.createElement('div');
            const progressText = c.completed ? 'Completed' : `${c.progress || 0}%`;
            div.className = 'course-item';
            div.innerHTML = `<strong>${c.title}</strong> - <span class="progress">${progressText}</span>`;
            container.appendChild(div);
          });
        }
      }
    } catch (err) {
      document.getElementById('coursesList').innerText = 'Unable to load your courses.';
    }
  } else if (role === 'client') {
    // Show client dashboard
    document.getElementById('clientSection').style.display = 'block';
  }
}

// Load Profile
async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const user = await res.json();

    // Validate user data
    if (!user) {
      throw new Error("No user data received");
    }

    // Update hero profile section with safe fallbacks
    document.getElementById("nameText").innerText = user.name || "Anonymous User";
    document.getElementById("bioText").innerText = user.bio || "No bio available";
    document.getElementById("locationText").innerText = user.location || "Location not set";
    document.getElementById("profilePic").src = user.profileImage || "assets/images/default.png";

    // Load dashboard content based on role
async function loadDashboard(role) {
  if (role === 'earner') {
    // Load notifications
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
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
      }
    } catch (err) {
      document.getElementById('notificationsList').innerText = 'Unable to load notifications.';
    }

    // Load enrolled courses
    try {
      const res = await fetch(`${API_BASE}/courses/my-courses`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const courses = await res.json();
        const container = document.getElementById('coursesList');
        container.innerHTML = '';
        document.getElementById('coursesSection').style.display = 'block';
        if (!courses.length) {
          container.innerText = 'You are not enrolled in any courses yet.';
        } else {
          courses.forEach(c => {
            const div = document.createElement('div');
            const progressText = c.completed ? 'Completed' : `${c.progress || 0}%`;
            div.className = 'course-item';
            div.innerHTML = `<strong>${c.title}</strong> - <span class="progress">${progressText}</span>`;
            container.appendChild(div);
          });
        }
      }
    } catch (err) {
      document.getElementById('coursesList').innerText = 'Unable to load your courses.';
    }
  } else if (role === 'client') {
    // Show client dashboard
    document.getElementById('clientSection').style.display = 'block';
  }
}

  } catch (error) {
    console.error("Error loading profile:", error);
    showErrorState(error.message);
  }
}

// Load Skills Showcase
function loadSkillsShowcase(skills) {
  const skillsContainer = document.getElementById("skillsContainer");
  skillsContainer.innerHTML = "";

  if (skills.length === 0) {
    skillsContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎯</span>
        <h3>No Skills Added Yet</h3>
        <p>Add your skills to showcase your expertise.</p>
      </div>
    `;
    return;
  }

  skills.forEach(skill => {
    const skillTag = document.createElement("span");
    skillTag.className = "skill-tag";
    skillTag.textContent = skill;
    skillsContainer.appendChild(skillTag);
  });
}

// Load Stats Dashboard
function loadStatsDashboard() {
  // For now, show placeholder stats - replace with real API data when available
  document.getElementById("earningsText").innerText = "₹0";
  document.getElementById("clientsText").innerText = "0";
  document.getElementById("projectsText").innerText = "0";
  document.getElementById("ratingText").innerText = "0.0";
}

// Calculate Profile Completion
function calculateProfileCompletion(user) {
  let completed = 0;
  let total = 5; // name, bio, location, skills, category
  let tips = [];

  if (user.name && user.name !== "Anonymous User") completed++;
  else tips.push("Add your full name");

  if (user.bio && user.bio !== "No bio available") completed++;
  else tips.push("Write a professional bio");

  if (user.location && user.location !== "Location not set") completed++;
  else tips.push("Add your location");

  if (user.skills && user.skills.length > 0) completed++;
  else tips.push("Add your skills");

  if (user.category) completed++;
  else tips.push("Select your expertise category");

  const percentage = Math.round((completed / total) * 100);

  document.getElementById("completionPercent").textContent = `${percentage}%`;
  document.getElementById("completionFill").style.width = `${percentage}%`;

  const tipElement = document.getElementById("completionTip");
  if (percentage === 100) {
    tipElement.textContent = "🎉 Your profile is complete! You're ready to shine!";
    tipElement.style.color = "#10b981";
  } else {
    tipElement.textContent = `💡 ${tips[0] || "Keep completing your profile"}`;
    tipElement.style.color = "#f59e0b";
  }
}

// Show Error State
function showErrorState(errorMessage = "Unable to load profile. Please try refreshing the page.") {
  document.getElementById("nameText").innerText = "Error Loading Profile";
  document.getElementById("bioText").innerText = errorMessage;
  document.getElementById("locationText").innerText = "";
  document.getElementById("profilePic").src = "images/default-avatar.png";

  // Show error in skills section
  const skillsContainer = document.getElementById("skillsContainer");
  skillsContainer.innerHTML = `
    <div class="empty-state error-state">
      <span class="empty-icon">⚠️</span>
      <h3>Unable to Load Skills</h3>
      <p>${errorMessage}</p>
    </div>
  `;

  // Hide completion section
  const completionSection = document.querySelector('.completion-section');
  if (completionSection) {
    completionSection.style.display = 'none';
  }
}

// Edit Profile Modal
document.getElementById("editBtn").addEventListener("click", () => {
  // Populate form with current user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  document.getElementById("nameInput").value = user.name || "";
  document.getElementById("bioInput").value = user.bio || "";
  document.getElementById("locationInput").value = user.location || "";
  document.getElementById("skillsInput").value = (user.skills || []).join(", ");
  document.getElementById("categoryInput").value = user.category || "";

  document.getElementById("editModal").classList.remove("hidden");
});

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("nameInput").value,
    bio: document.getElementById("bioInput").value,
    location: document.getElementById("locationInput").value,
    skills: document.getElementById("skillsInput").value.split(",").map(s => s.trim()).filter(s => s),
    category: document.getElementById("categoryInput").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      document.getElementById("editModal").classList.add("hidden");
      loadProfile();
    } else {
      alert("Update failed. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating your profile.");
  }
});

// Share Profile
document.getElementById("shareBtn").addEventListener("click", () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert("Profile link copied to clipboard!");
  }).catch(() => {
    alert("Copy this link: " + url);
  });
});

// Quick Actions
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.textContent.toLowerCase();
    if (action.includes('courses')) {
      window.location.href = 'courses.html';
    } else if (action.includes('marketplace')) {
      window.location.href = 'marketplace.html';
    } else if (action.includes('contact')) {
      // Scroll to contact section or open modal
      alert('Contact feature coming soon!');
    }
  });
});

// Profile image upload
document.getElementById('editAvatarBtn').addEventListener('click', () => {
  document.getElementById('profileImageInput').click();
});

document.getElementById('profileImageInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const res = await fetch(`${API_BASE}/auth/upload-profile-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Upload failed');
      return;
    }

    document.getElementById('profilePic').src = data.profileImage;

    // Update localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.profileImage = data.profileImage;
    localStorage.setItem('user', JSON.stringify(user));

    alert('Profile image updated successfully!');
  } catch (err) {
    alert('Network error during upload.');
  }
});

// Load profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);
