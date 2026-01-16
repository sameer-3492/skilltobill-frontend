// js/learner-detail.js
import { getData } from "./utils/api.js";

const params = new URLSearchParams(location.search);
const id = params.get('id');

const token = localStorage.getItem('token');
if(!token) {
  alert('Please login to view course details.');
  window.location.href = 'signup-login.html';
  throw new Error('Not logged in');
}

const courseTitle = document.getElementById('courseTitle');
const courseMeta = document.getElementById('courseMeta');
const enrollBtn = document.getElementById('enrollBtn');
const priceTag = document.getElementById('priceTag');

function getEnrolled(){ return (JSON.parse(localStorage.getItem('stb_enrolled_v1')||'[]')).map(String); }
function setEnrolled(arr){ localStorage.setItem('stb_enrolled_v1', JSON.stringify(arr)); }
function safe(s){ return String(s||''); }

(async function init(){
  if(!id) return location.href='learner-zone.html';
  const courses = await getData('./data/courses.json')||[];
  const course = courses.find(c=>String(c.id)===String(id));
  if(!course){ courseMeta.innerHTML='<p>Course not found.</p>'; return; }

  courseTitle.innerText = course.title || 'Course';
  const thumb = course.thumbnail || 'https://via.placeholder.com/600x340?text=Course';
  courseMeta.innerHTML = `
    <img src="${thumb}" class="detail-thumb" alt="${safe(course.title)}" />
    <div class="meta">
      <h2>${safe(course.title)}</h2>
      <p class="muted">${safe(course.description||'')}</p>
      <p><strong>Duration:</strong> ${safe(course.duration||'N/A')}</p>
      <p><strong>Modules:</strong> ${Array.isArray(course.modules)?course.modules.length:0}</p>
    </div>
  `;
  priceTag.innerText = (course.price===0||course.price==='0') ? 'Free' : `₹${course.price}`;

  const enrolled = getEnrolled();
  const isEnrolled = enrolled.includes(String(course.id));

  // Enroll button
  if(isEnrolled){
    enrollBtn.innerText='Start Learning';
    enrollBtn.onclick = () => location.href = `learner-player.html?course=${course.id}&module=0&lesson=0`;
    priceTag.innerText = 'Enrolled';
  } else if(course.price>0){
    enrollBtn.innerText='Pay & Enroll';
    enrollBtn.onclick = async ()=>{
      const token = localStorage.getItem('token');
      if(!token) return alert('Please login first.');

      try {
        const res = await fetch('https://skilltobill-b.onrender.com/api/orders/course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courseId: course.id, amount: course.price })
        });
        const data = await res.json();
        if(!res.ok) return alert(data.message || 'Failed to create order');

        const options = {
          key: 'your_razorpay_key_id', // Replace with actual key
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'STB Course Enrollment',
          description: `Enroll in ${course.title}`,
          handler: async function (response) {
            // Verify payment
            const verifyRes = await fetch('https://skilltobill-b.onrender.com/api/orders/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                orderId: data.dbOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if(verifyRes.ok) {
              const enrolled = getEnrolled();
              enrolled.push(String(course.id));
              setEnrolled(enrolled);
              alert('Payment successful! Enrolled in course.');
              location.href = `learner-player.html?course=${course.id}&module=0&lesson=0`;
            } else {
              alert('Payment verification failed.');
            }
          }
        };
        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        alert('Payment failed.');
      }
    };
  } else {
    enrollBtn.innerText='Enroll for Free';
    enrollBtn.onclick = ()=>{
      const enrolled=getEnrolled();
      if(!enrolled.includes(String(course.id))){
        enrolled.push(String(course.id));
        setEnrolled(enrolled);
        alert('Enrolled successfully!');
        location.href = `learner-player.html?course=${course.id}&module=0&lesson=0`;
      } else {
        alert('Already enrolled.');
        location.href='learner-dashboard.html';
      }
    };
  }
})();

// Player
// Removed openPlayer as videos are only in player page
