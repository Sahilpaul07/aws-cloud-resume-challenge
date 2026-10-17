
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.querySelector(".navbar ul");

// Mobile navigation menu
menuBtn.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
});

// Close menu after clicking a navigation link
navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰";
    });
});

// Automatically update copyright year
document.getElementById("year").textContent =
    new Date().getFullYear();

/* Cloud Resume Challenge - Visitor Counter */
const apiUrl = "https://m7c6hzsav8.execute-api.ap-south-1.amazonaws.com/prod/count";

async function updateVisitorCount() {
    const counterElement = document.getElementById("visitor-count");

    if (!counterElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        counterElement.textContent = data.count;
    } catch (error) {
        console.error("Visitor counter error:", error);
        counterElement.textContent = "Unavailable";
    }
}

updateVisitorCount();
