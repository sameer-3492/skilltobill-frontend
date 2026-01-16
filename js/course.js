// js/course.js
const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");
const token = localStorage.getItem("token");
if(!token) window.location.href="signup-login.html";

async function loadCourseVideos() {
    const res = await fetch(`https://skilltobill-b.onrender.com/api/courses/${courseId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const course = await res.json();
    document.getElementById("courseTitle").innerText = course.title;

    const videosDiv = document.getElementById("videosList");
    course.videos.forEach(video => {
        const v = document.createElement("div");
        v.innerHTML = `
            <h3>${video.title}</h3>
            <video width="400" controls>
                <source src="${video.url}" type="video/mp4">
            </video>`;
        videosDiv.appendChild(v);
    });
}
loadCourseVideos();
