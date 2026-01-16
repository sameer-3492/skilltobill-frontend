const token = localStorage.getItem("token");
if(!token) window.location.href="signup-login.html";

async function fetchClientDashboard() {
    const res = await fetch("https://skilltobill-b.onrender.com/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const user = await res.json();
    document.getElementById("welcomeName").innerText = `Welcome, ${user.name}`;
    document.getElementById("profilePic").src = user.profileImage || "assets/images/default.png";
    document.getElementById("totalPayments").innerText = `$${user.totalPayments || 0}`;
    document.getElementById("completedJobs").innerText = user.completedJobs || 0;
    document.getElementById("activeJobs").innerText = user.activeJobs || 0;

    const tbody = document.getElementById("jobsTable");
    tbody.innerHTML = "";
    (user.postedJobs || []).forEach(job=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${job.title}</td><td>${job.earner}</td><td>${job.status}</td>`;
        tbody.appendChild(tr);
    });
}
fetchClientDashboard();

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
