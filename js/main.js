javascript
// filepath: c:\Users\HP\Desktop\stb\skilltobill469\STB\STB-Frontend\js\main.js
/* ==========================
   main.js — SkillToBill
========================== */

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------
  // LOAD NAVBAR
  // ----------------------
  fetch("/components/navbar.html")
    .then(res => {
      if (!res.ok) throw new Error("Navbar not found");
      return res.text();
    })
    .then(data => {
      const navbarDiv = document.getElementById("navbar");
      if (navbarDiv) navbarDiv.innerHTML = data;
      initNavbarScripts();
      setActiveNavLink();
    })
    .catch(err => console.error(err));

  // ----------------------
  // LOAD FOOTER
  // ----------------------
  fetch("/components/footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Footer not found");
      return res.text();
    })
    .then(data => {
      const footerDiv = document.getElementById("footer");
      if (footerDiv) footerDiv.innerHTML = data;
    })
    .catch(err => console.error(err));

});

// ----------------------
// DROPDOWN LOGIC
// ----------------------
function initNavbarScripts() {
  const profileIcon = document.querySelector('.profile-icon');
  const profileMenu = document.querySelector('.profile-menu');
  const notificationsIcon = document.querySelector('.notifications-icon');
  const notificationsMenu = document.querySelector('.notifications-menu');

  if(profileIcon) profileIcon.addEventListener('click', () => profileMenu.classList.toggle('active'));
  if(notificationsIcon) notificationsIcon.addEventListener('click', () => notificationsMenu.classList.toggle('active'));

  document.addEventListener('click', (e) => {
    if(profileIcon && !profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove('active');
    }
    if(notificationsIcon && !notificationsIcon.contains(e.target) && !notificationsMenu.contains(e.target)) {
      notificationsMenu.classList.remove('active');
    }
  });
}

// ----------------------
// ACTIVE PAGE HIGHLIGHT
// ----------------------
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(link => {
    if(link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}