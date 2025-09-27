// Loader with percentage
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loading');
    const loader = document.getElementById('loader');
    const loaderPercentEl = document.getElementById('loaderPercent');
    if (!loader || !loaderPercentEl) return;

    let progress = 0;
    let finalized = false;
    const setProgress = (val) => {
        progress = Math.max(0, Math.min(100, val));
        loaderPercentEl.textContent = progress + '%';
    };

    const finalizeLoader = () => {
        if (finalized) return;
        finalized = true;
        setProgress(100);
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 200);
    };

    // Use image loading to inform progress
    const images = Array.from(document.images);
    let loadedCount = 0;
    const totalCount = images.length;
    const MAX_LOAD_MS = 6000; // safety timeout

    const onAssetDone = () => {
        loadedCount++;
        if (totalCount > 0) {
            const imgProgress = Math.floor((loadedCount / totalCount) * 100);
            setProgress(Math.max(progress, imgProgress));
            if (loadedCount >= totalCount) {
                finalizeLoader();
            }
        }
    };

    if (totalCount === 0) {
        // No images to wait for; finalize immediately
        setProgress(100);
        finalizeLoader();
    } else {
        images.forEach(img => {
            if (img.complete) {
                onAssetDone();
            } else {
                const done = () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    onAssetDone();
                };
                img.addEventListener('load', done);
                img.addEventListener('error', done);
            }
        });
    }

    // Safety timeout: finalize even if some resources stall
    setTimeout(() => {
        finalizeLoader();
    }, MAX_LOAD_MS);

    // Finalize on full window load (fallback)
    window.addEventListener('load', () => {
        finalizeLoader();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            const worksGrid = document.querySelector('.works-grid');
            projects.forEach((project, index) => {
                const workCard = document.createElement('div');
                workCard.classList.add('work-card');
                workCard.innerHTML = `
                    <div class="work-image">
                        <div class="work-placeholder">
                            <i class="${project.icon}"></i>
                        </div>
                    </div>
                    <div class="work-content">
                        <h3 class="work-title">${project.title}</h3>
                        <p class="work-description">${project.description}</p>
                        <a href="${project.link}" target="_blank" class="work-button">View</a>
                    </div>
                `;
                worksGrid.appendChild(workCard);

                workCard.style.opacity = '0';
                workCard.style.transform = 'translateY(30px)';
                workCard.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(workCard);
            });
        });
});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(26, 26, 26, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderBottom = '1px solid #3a3a3a';
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = 'none';
    }
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 80);
});

// Add parallax effect to floating cubes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cubes = document.querySelectorAll('.cube');
    
    cubes.forEach((cube, index) => {
        const speed = 0.5 + (index * 0.1);
        cube.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
});

// Close mobile menu when a nav link is clicked
if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-open');
        });
    });
}

// Close menu on resize back to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('nav-open');
    }
});

// Support Escape key to close mobile menu
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        nav.classList.remove('nav-open');
    }
});

// Add hover effect to social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Add click effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);