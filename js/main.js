/* ==========================
   main.js — SkillToBill
========================== */

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------
  // LOAD NAVBAR
  // ----------------------
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      const navbarDiv = document.getElementById("navbar");
      if(navbarDiv) navbarDiv.innerHTML = data;
      initNavbarScripts();
      setActiveNavLink();
    });

  // ----------------------
  // LOAD FOOTER
  // ----------------------
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      const footerDiv = document.getElementById("footer");
      if(footerDiv) footerDiv.innerHTML = data;
    });

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
