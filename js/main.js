/* ==========================================================================
   JacksonSharp Carpentry — Demo JavaScript
   Handles: scroll reveals, header state, mobile nav, smooth scroll,
   reduced motion detection, scroll progress bar, keyboard nav
   ========================================================================== */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Detect prefers-reduced-motion
    // -------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable animation delays and transitions
        document.querySelectorAll('[style*="--delay"]').forEach(function (el) {
            el.style.setProperty('--delay', '0s');
        });
    }

    // -------------------------------------------------------------------------
    // Scroll progress bar
    // -------------------------------------------------------------------------
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: var(--amber, #d4943a);
        width: 0%;
        z-index: 2000;
        transition: width 0.2s ease-out;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });

    // -------------------------------------------------------------------------
    // Header scroll effect
    // -------------------------------------------------------------------------
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // -------------------------------------------------------------------------
    // Mobile navigation toggle
    // -------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    function closeNav() {
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';

            // Animate hamburger to X
            const spans = mobileToggle.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close nav when clicking a link
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeNav();
            });
        });

        // Close nav on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // -------------------------------------------------------------------------
    // Scroll reveal (IntersectionObserver)
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // -------------------------------------------------------------------------
    // Smooth scroll for anchor links
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = header.offsetHeight + 20;
                var targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
        });
    });

    // -------------------------------------------------------------------------
    // Counter animation for stat numbers
    // -------------------------------------------------------------------------
    function animateCounters() {
        var statNumbers = document.querySelectorAll('.stat-number');

        if (!statNumbers.length) return;

        var counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var text = el.textContent.trim();
                        var suffix = text.replace(/[0-9]/g, '');
                        var num = parseInt(text);

                        if (isNaN(num)) return;

                        var start = 0;
                        var duration = 1200;
                        var startTime = null;

                        function step(timestamp) {
                            if (!startTime) startTime = timestamp;
                            var progress = Math.min((timestamp - startTime) / duration, 1);
                            // Ease out cubic
                            var eased = 1 - Math.pow(1 - progress, 3);
                            el.textContent = Math.floor(eased * num) + suffix;
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            }
                        }

                        requestAnimationFrame(step);
                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(function (el) {
            counterObserver.observe(el);
        });
    }

    animateCounters();

    // -------------------------------------------------------------------------
    // Parallax-lite hero on scroll
    // -------------------------------------------------------------------------
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener(
            'scroll',
            function () {
                var scroll = window.scrollY;
                if (scroll < window.innerHeight) {
                    heroBg.style.transform = 'translateY(' + scroll * 0.25 + 'px) scale(1.05)';
                }
            },
            { passive: true }
        );
    }

    // ---- Demo Modal ----
    var modal = document.getElementById('demo-modal');
    var modalClose = document.getElementById('demo-modal-close');

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modal && modalClose) {
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // Intercept all CTA buttons (but not modal-internal links)
    document.querySelectorAll('.btn, .nav-cta, .cta-primary, .cta-secondary').forEach(function (btn) {
        if (btn.closest('.demo-modal')) return;
        btn.addEventListener('click', openModal);
    });

})();
