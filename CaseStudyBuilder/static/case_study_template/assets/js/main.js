document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-dot');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // 1. Magnetic Cursor Engine
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursor) cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const animateCursor = () => {
        if (!follower) return;
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        
        follower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // 2. Cursor Hover States
    const interactiveElements = document.querySelectorAll('a, button, .stat-card, .agent-card, .case-img');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.width = '80px';
            follower.style.height = '80px';
            follower.style.transform = `translate3d(${followerX - 40}px, ${followerY - 40}px, 0)`;
            follower.style.backgroundColor = 'rgba(233, 30, 99, 0.05)';
            follower.style.borderColor = 'rgba(233, 30, 99, 1)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.backgroundColor = 'transparent';
            follower.style.borderColor = 'rgba(233, 30, 99, 1)';
        });
    });

    // 3. Reveal on Scroll (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Smooth Parallax for Case Images
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.case-img img').forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const move = (rect.top - window.innerHeight / 2) * 0.1;
                img.style.transform = `translateY(${move}px) scale(1.1)`;
            }
        });
    });

    // 5. THEME SWITCHING & MOBILE MENU
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    const updateThemeIcon = (isDark) => {
        const moonIcon = themeToggle.querySelector('.moon-icon');
        const sunIcon = themeToggle.querySelector('.sun-icon');
        if (moonIcon && sunIcon) {
            moonIcon.style.display = isDark ? 'none' : 'block';
            sunIcon.style.display = isDark ? 'block' : 'none';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // 6. Hero Text Slider Engine (Robust Edition)
    const initHeroSlider = () => {
        const sliderSlides = document.querySelectorAll('.hero-slider .slide');
        const sliderDots = document.querySelectorAll('.slider-dots .dot');
        const heroAsset = document.querySelector('.hero-3d-asset');
        
        const heroImages = [
            'assets/images/ux_innovation_trans.png',
            'assets/images/ux_ai_trans.png',
            'assets/images/ux_enterprise_trans.png'
        ];

        let slideIdx = 0;
        let intervalId;

        if (sliderSlides.length === 0) return;

        const updateSlider = (index) => {
            sliderSlides.forEach(s => s.classList.remove('active'));
            sliderDots.forEach(d => d.classList.remove('active'));
            
            sliderSlides[index].classList.add('active');
            if (sliderDots[index]) sliderDots[index].classList.add('active');
            
            // Update Hero Asset with a smooth transition
            if (heroAsset && heroImages[index]) {
                heroAsset.style.opacity = '0';
                setTimeout(() => {
                    heroAsset.style.backgroundImage = `url('${heroImages[index]}')`;
                    heroAsset.style.opacity = '1';
                }, 400);
            }
            
            slideIdx = index;
        };

        const startAuto = () => {
            intervalId = setInterval(() => {
                let next = (slideIdx + 1) % sliderSlides.length;
                updateSlider(next);
            }, 5000); // 5 seconds
        };

        // Initialize first slide state
        updateSlider(0);
        startAuto();

        // Manual Navigation
        sliderDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(intervalId);
                updateSlider(i);
                startAuto();
            });
        });
    };

    initHeroSlider();

    // 7. Journey Card Expansion Engine
    const initJourneyExpansion = () => {
        const journeyCards = document.querySelectorAll('.journey-card');
        
        journeyCards.forEach(card => {
            const expandBtn = card.querySelector('.expand-btn');
            
            // Make the whole card clickable for easier expansion
            card.addEventListener('click', (e) => {
                // Prevent double toggle if button itself is clicked
                if (e.target.tagName === 'BUTTON') return;
                
                card.classList.toggle('expanded');
                expandBtn.textContent = card.classList.contains('expanded') ? 'HIDE DETAILS' : 'VIEW DETAILS';
            });

            expandBtn.addEventListener('click', () => {
                card.classList.toggle('expanded');
                expandBtn.textContent = card.classList.contains('expanded') ? 'HIDE DETAILS' : 'VIEW DETAILS';
            });
        });
    };

    initJourneyExpansion();
});

