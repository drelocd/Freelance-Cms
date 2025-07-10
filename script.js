document.addEventListener('DOMContentLoaded', () => {
    // Select navigation elements
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Select preloader elements
    const preloader = document.getElementById('preloader');
    const scrollDownArrow = document.getElementById('scrollDownArrow');

    // --- Preloader and Page Transition Logic ---
    if (preloader && scrollDownArrow) {
        scrollDownArrow.addEventListener('click', () => {
            preloader.classList.add('hide-preloader');
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
                document.body.style.overflowY = 'auto';
            }, { once: true });
        });
    } else {
        console.warn("Preloader elements not found. Ensuring body overflow is auto.");
        document.body.style.overflowY = 'auto';
        if (preloader) {
            preloader.style.display = 'none';
        }
    }

    // --- Mobile Navigation Toggle Logic ---
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    mainNav.classList.remove('nav-open');
                    navToggle.classList.remove('nav-open');
                }
            });
        });
    }

    // --- Torchlight/Spotlight Effect for Services and Projects ---
    const illuminatedItems = document.querySelectorAll('.service-item, .portfolio-item');

    illuminatedItems.forEach(item => {
        const spotlight = document.createElement('div');
        spotlight.classList.add('spotlight');
        item.appendChild(spotlight);

        item.addEventListener('mousemove', (e) => {
            const itemRect = item.getBoundingClientRect();
            const x = e.clientX - itemRect.left;
            const y = e.clientY - itemRect.top;

            // Define the FIXED size of the circle spotlight
            const fixedSpotlightRadius = '190px'; // Your desired radius for the clipped circle

            // Define the greenish and golden colors.
            // These will be used in the diagonal linear gradient.
            const greenishGoldenColors = `
                hsl(45, 100%, 85%, 0.8),    /* Brighter gold, higher opacity */
                hsl(55, 100%, 85%, 0.4),
                hsl(90, 100%, 80%, 0.4),
                hsl(140, 100%, 75%, 0.4),
                hsl(160, 100%, 75%, 0.4),
                hsl(120, 100%, 80%, 0.4),
                hsl(70, 100%, 85%, 0.4),
                hsl(45, 100%, 85%, 0.4)
            `;
            // Increased opacities to 0.4 for better visibility with a linear gradient.
            // You might need to adjust these more based on how strong you want the diagonal lines.

            // Set the background image to a linear gradient.
            // The gradient direction determines the "diagonal" nature.
            // 'to bottom right' creates a 45-degree diagonal.
            // 'at ${x}px ${y}px' is NOT used with linear-gradient; it applies across the element.
            spotlight.style.backgroundImage = `
                linear-gradient(to bottom right, ${greenishGoldenColors})
            `;

            // **THIS IS STILL THE CRUCIAL PART:** Apply the clip-path
            // It creates a perfect circle of the defined radius, centered at the mouse coordinates.
            // Anything outside this circle will be invisible.
            spotlight.style.clipPath = `circle(${fixedSpotlightRadius} at ${x}px ${y}px)`;
            spotlight.style.webkitClipPath = `circle(${fixedSpotlightRadius} at ${x}px ${y}px)`; // For Webkit browsers
        });

        item.addEventListener('mouseleave', () => {
            // Reset the background image and clip-path when the mouse leaves.
            spotlight.style.backgroundImage = 'none';
            spotlight.style.clipPath = 'none';
            spotlight.style.webkitClipPath = 'none';
        });
    });
});
