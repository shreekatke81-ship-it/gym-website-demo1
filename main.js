/* ============================================================
   IronFit Gym – Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVBAR – Scroll Effect & Active Link
       ========================================== */
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Sticky style after scroll
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link
        sections.forEach(section => {
            const top    = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navLinksEl.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    });


    /* ==========================================
       2. HAMBURGER MENU (Mobile)
       ========================================== */
    const hamburger  = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });


    /* ==========================================
       3. HERO BACKGROUND ANIMATION
       ========================================== */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        setTimeout(() => heroBg.classList.add('loaded'), 100);
    }


    /* ==========================================
       4. COUNTER ANIMATION (Hero Stats)
       ========================================== */
    function animateCounter(el) {
        const target   = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step     = target / (duration / 16);
        let current    = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    const counters  = document.querySelectorAll('.stat-num');
    let   counted   = false;

    function checkCounters() {
        if (counted) return;
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counters.forEach(animateCounter);
            counted = true;
        }
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    setTimeout(checkCounters, 800); // trigger on load if hero visible


    /* ==========================================
       5. PRICING TOGGLE (Monthly / Annual)
       ========================================== */
    const billingToggle = document.getElementById('billingToggle');
    const prices = {
        monthly:  [29, 59, 99],
        annual:   [23, 47, 79],
    };

    billingToggle && billingToggle.addEventListener('change', () => {
        const isAnnual = billingToggle.checked;
        const amounts  = document.querySelectorAll('.monthly-price');
        const key      = isAnnual ? 'annual' : 'monthly';

        amounts.forEach((el, i) => {
            el.style.transform = 'translateY(-10px)';
            el.style.opacity   = '0';
            setTimeout(() => {
                el.textContent     = prices[key][i];
                el.style.transform = 'translateY(0)';
                el.style.opacity   = '1';
                el.style.transition = 'all 0.3s ease';
            }, 150);
        });
    });


    /* ==========================================
       6. TESTIMONIALS SLIDER
       ========================================== */
    const track    = document.getElementById('testimonialsTrack');
    const prevBtn  = document.getElementById('prevBtn');
    const nextBtn  = document.getElementById('nextBtn');
    const dotsWrap = document.getElementById('sliderDots');

    if (track && prevBtn && nextBtn) {
        const cards       = track.querySelectorAll('.testimonial-card');
        let   current     = 0;
        let   perSlide    = getPerSlide();
        let   total       = Math.ceil(cards.length / perSlide);
        let   autoTimer;

        function getPerSlide() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        }

        // Build dots
        function buildDots() {
            dotsWrap.innerHTML = '';
            total = Math.ceil(cards.length / perSlide);
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('button');
                dot.className = `dot${i === current ? ' active' : ''}`;
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        function goTo(index) {
            current = (index + total) % total;
            const cardWidth   = cards[0].offsetWidth + 24; // gap = 24px
            const offset      = current * perSlide * cardWidth;
            track.style.transform = `translateX(-${offset}px)`;
            dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

        function startAuto() {
            autoTimer = setInterval(() => goTo(current + 1), 5000);
        }
        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        // Responsive recalc
        window.addEventListener('resize', () => {
            const newPer = getPerSlide();
            if (newPer !== perSlide) {
                perSlide = newPer;
                current = 0;
                buildDots();
                goTo(0);
            }
        });

        buildDots();
        startAuto();

        // Touch / Swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(current + 1) : goTo(current - 1);
                resetAuto();
            }
        });
    }


    /* ==========================================
       7. SCROLL-REVEAL ANIMATION (AOS-like)
       ========================================== */
    const aosElements = document.querySelectorAll('[data-aos]');

    function revealOnScroll() {
        aosElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('aos-animate');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // run on load


    /* ==========================================
       8. CONTACT FORM SUBMISSION
       ========================================== */
    const contactForm  = document.getElementById('contactForm');
    const formSuccess  = document.getElementById('formSuccess');

    contactForm && contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.form-submit');
        btn.textContent = 'Sending…';
        btn.disabled    = true;

        // Collect form data
       const data = {
    firstName: contactForm.firstName.value.trim(),
    lastName:  contactForm.lastName.value.trim(),
    email:     contactForm.email.value.trim(),
    phone:     contactForm.phone.value.trim(),
    interest:  contactForm.interest.value,
    message:   contactForm.message.value.trim(),
    submittedAt: new Date().toISOString(),
};

console.log("Form data:", data);
       try {

const result = await emailjs.send(
"service_idnjhp3",
"template_6lff3vp",
data
);

console.log("EmailJS SUCCESS:", result);

} catch (error) {
console.log("EmailJS ERROR:", error);
}

        // Simulate slight delay for UX
        await new Promise(r => setTimeout(r, 800));

        btn.textContent = 'Send Message';
        btn.disabled    = false;
        btn.innerHTML   = 'Send Message <i class="fas fa-paper-plane"></i>';
        contactForm.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
    });


    /* ==========================================
       9. NEWSLETTER FORM
       ========================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm && newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn   = newsletterForm.querySelector('button');
        const input = newsletterForm.querySelector('input');
        const email = input.value.trim();

        btn.innerHTML  = '<i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        input.value    = '';
        input.placeholder = 'Thanks for subscribing!';

        setTimeout(() => {
            btn.innerHTML  = '<i class="fas fa-arrow-right"></i>';
            btn.style.background = '';
            input.placeholder = '';
        }, 3000);
    });


    /* ==========================================
       10. BACK TO TOP BUTTON
       ========================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop && backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ==========================================
       11. PROGRAM CARDS – Staggered Entry
       ========================================== */
    const programCards = document.querySelectorAll('.program-card');
    const trainerCards = document.querySelectorAll('.trainer-card');
    const priceCards   = document.querySelectorAll('.price-card');

    function revealCards(cards, delay = 80) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity   = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity   = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    revealCards(programCards);
    revealCards(trainerCards);
    revealCards(priceCards, 100);


    /* ==========================================
       12. PARALLAX – Hero BG
       ========================================== */
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    }, { passive: true });


    /* ==========================================
       13. CURSOR GLOW (Desktop)
       ========================================== */
    if (window.innerWidth > 768) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: left 0.1s ease, top 0.1s ease;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', e => {
            glow.style.left = e.clientX + 'px';
            glow.style.top  = e.clientY + 'px';
        });
    }


    /* ==========================================
       14. LOADING SCREEN
       ========================================== */
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="loader-inner">
            <i class="fas fa-dumbbell loader-icon"></i>
            <div class="loader-bar"><div class="loader-fill"></div></div>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: #0d0d0d;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;

    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .loader-inner { text-align: center; }
        .loader-icon {
            font-size: 3rem;
            color: #e63946;
            display: block;
            margin-bottom: 1.5rem;
            animation: spinDumbbell 1s ease infinite alternate;
        }
        @keyframes spinDumbbell {
            from { transform: rotate(-20deg) scale(1); }
            to   { transform: rotate(20deg) scale(1.1); }
        }
        .loader-bar {
            width: 200px;
            height: 3px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto;
        }
        .loader-fill {
            height: 100%;
            background: linear-gradient(90deg, #e63946, #f4a261);
            border-radius: 3px;
            animation: loaderProgress 1.2s ease forwards;
        }
        @keyframes loaderProgress {
            from { width: 0%; }
            to   { width: 100%; }
        }
    `;
    document.head.appendChild(loaderStyle);
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity    = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => loader.remove(), 500);
        }, 1200);
    });


    /* ==========================================
       15. INITIALIZE TABLE SCHEMA (Contact Form)
       ========================================== */
    // Schema is created via TableSchemaUpdate tool, so we skip fetch here.
    // The form submit already calls POST tables/contacts.

    console.log('%c 🏋️ IronFit Gym – JS Loaded ', 'background:#e63946;color:#fff;font-size:14px;font-weight:bold;padding:4px 8px;border-radius:4px;');
});
