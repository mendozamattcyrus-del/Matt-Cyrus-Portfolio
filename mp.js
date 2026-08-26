
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click (mobile)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Sliding pill indicator
        const pill = document.getElementById('navPill');
        const navItems = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');

        function movePill(target) {
            if (!target || window.innerWidth <= 768) {
                pill.classList.remove('visible');
                return;
            }
            const linkRect = target.getBoundingClientRect();
            const listRect = navLinks.getBoundingClientRect();
            pill.style.width = linkRect.width + 'px';
            pill.style.left = (linkRect.left - listRect.left) + 'px';
            pill.classList.add('visible');
        }

        function updateActiveLink() {
            const scrollPos = window.scrollY + 150;
            let currentId = 'home';
            sections.forEach(section => {
                if (section.offsetTop <= scrollPos) {
                    currentId = section.id;
                }
            });
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + currentId) {
                    item.classList.add('active');
                    movePill(item);
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        window.addEventListener('resize', () => {
            const active = document.querySelector('.nav-links a.active');
            movePill(active);
        });

        // Hover preview
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => movePill(item));
        });
        navLinks.addEventListener('mouseleave', () => {
            const active = document.querySelector('.nav-links a.active');
            movePill(active);
        });

        // Initial pill position
        setTimeout(() => {
            const active = document.querySelector('.nav-links a.active');
            movePill(active);
        }, 700);

        // Reveal on scroll
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => revealObserver.observe(el));

        // Form submit
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                e.target.reset();
            }, 2500);
        });