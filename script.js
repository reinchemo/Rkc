(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    document.documentElement.classList.add("js-ready");

    /* ---------- 1. Mobile navigation ---------- */
    const menuToggle = $("#menuToggle");
    const navLinks = $("#navLinks");
    const iconMenu = menuToggle ? menuToggle.querySelector(".icon-menu") : null;
    const iconClose = menuToggle ? menuToggle.querySelector(".icon-close") : null;

    const setMenu = (open) => {
        if (!menuToggle || !navLinks) return;
        navLinks.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        if (iconMenu) iconMenu.style.display = open ? "none" : "block";
        if (iconClose) iconClose.style.display = open ? "block" : "none";
        document.body.classList.toggle("menu-open", open);
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            setMenu(!navLinks.classList.contains("active"));
        });

        // Close menu when clicking a link
        $$("#navLinks a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) setMenu(false);
        });
    }

    /* ---------- 2. Interactive Project Tabs (Switchable) ---------- */
    const tabButtons = $$(".tab-btn");
    const panels = $$(".showcase-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Add active to clicked button and target panel
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add("active");
        });
    });

    /* ---------- 3. Scroll Progress Bar ---------- */
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    let scrollTicking = false;
    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
                progress.style.transform = `scaleX(${Math.min(100, Math.max(0, percent)) / 100})`;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    /* ---------- 4. Scroll Reveal Animations ---------- */
    const revealItems = $$(".rv");
    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("in"));
    }

    /* ---------- 5. Smooth Anchor Navigation ---------- */
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.getElementById(decodeURIComponent(href.slice(1)));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        });
    });

    /* ---------- 6. Back-to-top Button ---------- */
    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("visible", window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

})();