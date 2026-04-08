/* ═══════════════════════════════════════════════════════════════
   BRANDLIFT STUDIO — Professional Script
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ─── DOM REFERENCES ─────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const menuCard = document.getElementById("menuCard");
const topBtn = document.getElementById("topBtn");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const menuItems = document.querySelectorAll(".menu-item");

/* ─── MOBILE MENU ─────────────────────────────────── */
function openMenu() {
    hamburger.classList.add("active");
    mobileMenu.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "";
}

function closeMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
});

navLinks.forEach(link => link.addEventListener("click", closeMenu));
menuItems.forEach(item => item.addEventListener("click", closeMenu));

document.addEventListener("click", (e) => {
    if (
        mobileMenu.classList.contains("active") &&
        !menuCard.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        closeMenu();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu();
        hamburger.focus();
    }
});

/* ─── NAVBAR SCROLL STYLE ─────────────────────────── */
function updateNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

/* ─── SCROLL TO TOP BUTTON ────────────────────────── */
function updateTopBtn() {
    topBtn.classList.toggle("visible", window.scrollY > 400);
}
window.addEventListener("scroll", updateTopBtn, { passive: true });
updateTopBtn();

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── REVEAL ON SCROLL (IntersectionObserver) ─────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const siblings = entry.target.parentElement.querySelectorAll(".reveal");
            siblings.forEach((el, i) => {
                if (el === entry.target) {
                    el.style.transitionDelay = `${i * 0.08}s`;
                }
            });
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ─── ABOUT SECTION SLIDE ANIMATION ──────────────── */
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".about-animate-left, .about-animate-right")
    .forEach(el => aboutObserver.observe(el));

/* ─── PORTFOLIO FILTER ────────────────────────────── */
function filterPortfolio(category, btn) {
    document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    const items = document.querySelectorAll(".portfolio-item");

    items.forEach(item => {
        const show = category === "all" || item.dataset.category === category;

        if (show) {
            item.style.opacity = "0";
            item.style.display = "";
            item.style.transform = "scale(0.96) translateY(8px)";

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    item.style.transition = "opacity 0.35s ease, transform 0.35s ease";
                    item.style.opacity = "1";
                    item.style.transform = "";
                });
            });
        } else {
            item.style.transition = "opacity 0.2s ease";
            item.style.opacity = "0";
            setTimeout(() => {
                if (item.dataset.category !== category && category !== "all") {
                    item.style.display = "none";
                }
            }, 220);
        }
    });
}
window.filterPortfolio = filterPortfolio;

/* ─── VIDEO UNMUTE TOGGLE ─────────────────────────── */
function toggleMute(btn) {
    const video = btn.closest(".portfolio-img").querySelector("video");
    if (!video) return;
    video.muted = !video.muted;
    btn.textContent = video.muted ? "🔇" : "🔊";
    btn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
}
window.toggleMute = toggleMute;

/* ─── CLIENTS MODAL ───────────────────────────────── */
const clientsModalOverlay = document.getElementById("clientsModalOverlay");
const clientsModalCard = document.getElementById("clientsModalCard");

/**
 * Opens the clients modal.
 * Locks body scroll, adds .open class to trigger CSS transitions.
 */
function openClientsModal() {
    clientsModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Trap focus inside modal after animation
    setTimeout(() => {
        const closeBtn = clientsModalOverlay.querySelector(".clients-modal-close");
        if (closeBtn) closeBtn.focus();
    }, 360);
}

/**
 * Closes the clients modal.
 * Restores body scroll.
 */
function closeClientsModal() {
    clientsModalOverlay.classList.remove("open");
    document.body.style.overflow = "";

    // Return focus to the button that opened the modal
    const openBtn = document.getElementById("clientsSeeMoreBtn");
    if (openBtn) openBtn.focus();
}

/**
 * Close when clicking directly on the dark overlay backdrop
 * (i.e. outside the white modal card).
 */
clientsModalOverlay.addEventListener("click", (e) => {
    if (!clientsModalCard.contains(e.target)) {
        closeClientsModal();
    }
});

/**
 * Close on Escape key.
 */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && clientsModalOverlay.classList.contains("open")) {
        closeClientsModal();
    }
});

/* Expose to global scope for inline onclick attributes */
window.openClientsModal = openClientsModal;
window.closeClientsModal = closeClientsModal;

/* ─── ACTIVE NAV LINK ON SCROLL ───────────────────── */
const sections = document.querySelectorAll("section[id]");

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link").forEach(link => {
                link.classList.toggle(
                    "active-link",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        }
    });
}, {
    threshold: 0.4,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue("--nav-h")} 0px 0px 0px`
});

sections.forEach(s => navObserver.observe(s));