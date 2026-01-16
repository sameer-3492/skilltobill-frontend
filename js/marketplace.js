// Load Navbar
fetch("navbar.html")
  .then(res => res.text())
  .then(data => { document.getElementById("navbar").innerHTML = data; });

// Load Footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => { document.getElementById("footer").innerHTML = data; });

document.addEventListener("DOMContentLoaded", () => {
  const marketplaceDiv = document.getElementById("marketplaceContainer");
  const backBtn = document.getElementById("backButton");
  const heading = document.getElementById("marketplaceHeading");
  const searchInput = document.getElementById("searchBar");

  let currentCategory = null;
  let currentSubcategory = null;

  const subcategoriesData = {
    "Cleaning": [
      { name: "Bathroom", img: "images/marketplace/cleaning/bathroom.png" },
      { name: "Kitchen", img: "images/marketplace/cleaning/kitchen.png" },
      { name: "Hall", img: "images/marketplace/cleaning/hall.png" },
      { name: "Full House", img: "images/marketplace/cleaning/full-house.png" },
      { name: "AC", img: "images/marketplace/cleaning/ac-cleaning.png" },
      { name: "Cooler", img: "images/marketplace/cleaning/cooler-cleaning.png" },
      { name: "Water Tank", img: "images/marketplace/cleaning/water-tank.png" }
    ],
    "Repair": [
      { name: "AC", img: "images/marketplace/repair/ac-repair.png" },
      { name: "Washing Machine", img: "images/marketplace/repair/washing-machine.png" },
      { name: "Electrician", img: "images/marketplace/repair/electrician.png" },
      { name: "Refrigerator", img: "images/marketplace/repair/refrigerator.png" },
      { name: "Bike", img: "images/marketplace/repair/bike-repair.png" },
      { name: "Car", img: "images/marketplace/repair/car-repair.png" },
      { name: "Cooler", img: "images/marketplace/repair/cooler-repair.png" },
      { name: "Fan", img: "images/marketplace/repair/fan-repair.png" },
      { name: "Plumbing", img: "images/marketplace/repair/plumbing.png" },
      { name: "Painter", img: "images/marketplace/repair/painter.png" },
      { name: "Mixer", img: "images/marketplace/repair/mixer.png" }
    ],
    "Installation": [
      { name: "AC", img: "images/marketplace/installation/ac-installation.png" },
      { name: "Fan", img: "images/marketplace/installation/fan-installation.png" },
      { name: "Light-board", img: "images/marketplace/installation/lightboard.png" }
    ],
    "Creative Services": [
      { name: "Short-video Editing", img: "images/marketplace/creative-services/short-video-editing.png" },
      { name: "Long-video Editing", img: "images/marketplace/creative-services/long-video-editing.png" },
      { name: "Content-Writing", img: "images/marketplace/creative-services/content-writing.png" },
      { name: "Social-media Management", img: "images/marketplace/creative-services/social-media-management.png" },
      { name: "Digital Marketing", img: "images/marketplace/creative-services/digital-marketing.png" },
      { name: "Logo Design", img: "images/marketplace/creative-services/logo-design.png" },
      { name: "Poster Design", img: "images/marketplace/creative-services/poster-design.png" },
      { name: "Social-media Post Design", img: "images/marketplace/creative-services/social-media-post.png" }
    ]
  };

  // Fetch earners from API
  async function fetchEarners(category, subcategory = null) {
    try {
      let url = `/api/earners?category=${encodeURIComponent(category)}`;
      if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response not ok");
      return await res.json();
    } catch (err) {
      console.error(err);
      alert("Error fetching earners.");
      return [];
    }
  }

  // Render categories
  function renderCategories() {
    currentCategory = null;
    currentSubcategory = null;
    heading.textContent = "";
    backBtn.style.display = "none";

    const categories = ["Home Tutors","Cleaning","Repair","Maid","Chef","Installation","Creative Services"];
    marketplaceDiv.innerHTML = categories.map(cat => `
      <div class="category-card" data-category="${cat}">
        <img src="images/marketplace/${cat.toLowerCase().replace(/\s/g,'-')}.png">
        <h4>${cat}</h4>
      </div>
    `).join("");

    document.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", () => {
        currentCategory = card.dataset.category;
        if(subcategoriesData[currentCategory]){
          renderSubcategories(currentCategory, subcategoriesData[currentCategory]);
        } else {
          heading.textContent = currentCategory;
          loadEarners(currentCategory);
        }
      });
    });
  }

  // Render subcategories
  function renderSubcategories(category, list) {
    currentSubcategory = null;
    heading.textContent = category;
    backBtn.style.display = "block";

    marketplaceDiv.innerHTML = list.map(sub => `
      <div class="subcategory-card" data-sub="${sub.name}">
        <img src="${sub.img}">
        <h4>${sub.name}</h4>
      </div>
    `).join("");

    document.querySelectorAll(".subcategory-card").forEach(card => {
      card.addEventListener("click", async () => {
        currentSubcategory = card.dataset.sub;
        heading.textContent = `${category} → ${currentSubcategory}`;
        loadEarners(category, currentSubcategory);
      });
    });
  }

  // Load earners
  async function loadEarners(category, subcategory = null) {
    backBtn.style.display = "block";
    const earners = await fetchEarners(category, subcategory);
    marketplaceDiv.innerHTML = earners.map(e => `
      <div class="earner-card">
        <img src="${e.profileImage}" alt="${e.name}">
        <h4>${e.name}</h4>
        <p>${e.skill}</p>
        <p>Rating: ${e.rating || "N/A"}</p>
      </div>
    `).join("");
  }

  // Search filter
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll(".category-card, .subcategory-card, .earner-card")
      .forEach(card => {
        const title = card.querySelector("h4")?.textContent.toLowerCase() || "";
        card.style.display = title.includes(q) ? "block" : "none";
      });
  });

  // Back button
  backBtn.addEventListener("click", () => {
    if (currentSubcategory) {
      renderSubcategories(currentCategory, subcategoriesData[currentCategory]);
      currentSubcategory = null;
      heading.textContent = currentCategory;
    } else if (currentCategory) {
      renderCategories();
    }
  });

  // Initial render
  renderCategories();
});