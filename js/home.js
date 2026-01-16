document.addEventListener("DOMContentLoaded", () => {

    // Marketplace Data
    const marketplaceServices = [
        { title: "Home Tutors", description: "Private home tutor at your doorstep.", img: "images/marketplace/home-tutors.png" },
        { title: "Electrician", description: "Fast home electrical repairs & installations.", img: "images/marketplace/repair/electrician.png" },
        { title: "Home Cleaning", description: "Professional home cleaning & dusting.", img: "images/marketplace/cleaning/hall.png" }
    ];

    // Learner Zone Data
    const learnerCourses = [
        { title: "AI Course", description: "Become future-ready with AI skills.", img: "images/learners/ai.png" },
        { title: "Smartphone Skills", description: "Master your phone efficiently.", img: "images/learners/smartphone.png" },
        { title: "Online Earning Starter", description: "Start earning online quickly.", img: "images/learners/earning.png" }
    ];

// Updated Blog Data for Home Page
const blogs = [
    { 
        title: "How to Start Freelancing in 2026", 
        description: "Step by step guide to begin freelancing and earn.", 
        img: "images/blogs/blog1.jpg", 
        link: "blog-detail.html?id=freelancing-start" 
    },
    { 
        title: "Top 5 Skills to Learn in 2026", 
        description: "Focus on high demand skills that pay well.", 
        img: "images/blogs/blog2.jpg", 
        link: "blog-detail.html?id=top-skills" 
    },
    { 
        title: "How to Balance Learning and Earning as a Freelancer in 2026", 
        description: "Practical tips to grow skills while earning.", 
        img: "images/blogs/blog3.jpg", 
        link: "blog-detail.html?id=learning-earning-balance" 
    }
];


// Render Blogs on Home Page
const blogContainer = document.querySelector(".blog-container");
if (blogContainer) {
    blogContainer.innerHTML = '<div class="spinner"></div>';
    setTimeout(() => {
        blogContainer.innerHTML = blogs.map(b => `
            <div class="blog-card">
                <img src="${b.img}" alt="${b.title}">
                <h3>${b.title}</h3>
                <p>${b.description}</p>
                <a href="${b.link}" class="btn-small">Read More</a>
            </div>
        `).join("");
    }, 500);
}

    // Render Marketplace
    const servicesContainer = document.querySelector(".services-container");
    if (servicesContainer) {
        servicesContainer.innerHTML = '<div class="spinner"></div>';
        setTimeout(() => {
            servicesContainer.innerHTML = marketplaceServices.map(s => `
                <a href="marketplace.html?service=${s.title.toLowerCase().replace(/\s+/g, '-')}" class="service-card">
                    <img src="${s.img}" alt="${s.title}" loading="lazy">
                    <h3>${s.title}</h3>
                    <p>${s.description}</p>
                </a>
            `).join("");
        }, 500);
    }

    // Render Learner Zone
    const learnerContainer = document.querySelector(".learner-container");
    if (learnerContainer) {
        learnerContainer.innerHTML = '<div class="spinner"></div>';
        setTimeout(() => {
            learnerContainer.innerHTML = learnerCourses.map(l => `
                <a href="learner-zone.html" class="learner-card">
                    <img src="${l.img}" alt="${l.title}">
                    <h3>${l.title}</h3>
                    <p>${l.description}</p>
                </a>
            `).join("");
        }, 500);
    }

   
});