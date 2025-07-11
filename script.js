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
// --- Contact Form Submission Logic to use PHP Proxy ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // !!! IMPORTANT: This is the URL to your PHP proxy script, NOT the Discord webhook itself !!!
    const PHP_PROXY_URL = 'send_discord.php'; // Adjust path if send_discord.php is in a subfolder
    // Example: const PHP_PROXY_URL = '/api/send_discord.php';
    // !!! END IMPORTANT !!!

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            formStatus.textContent = 'Sending message...';
            formStatus.style.color = 'var(--text-dark)';

            // Get form field values
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            // Client-side validation: Check if required fields exist and are not empty
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all required fields (Name, Email, Message).';
                formStatus.style.color = 'salmon';
                return;
            }

            // Prepare data to send to your PHP script
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            try {
                // Send the data to your PHP proxy script
                const response = await fetch(PHP_PROXY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Tell PHP we're sending JSON
                    },
                    body: JSON.stringify(formData) // Convert JS object to JSON string
                });

                const result = await response.json(); // PHP script will return JSON

                if (response.ok && result.success) { // Check both HTTP status and PHP success flag
                    formStatus.textContent = 'Message sent successfully! Redirecting...';
                    formStatus.style.color = 'lightgreen';
                    contactForm.reset(); // Clear the form fields

                    setTimeout(() => {
                        window.location.href = '#hero';
                    }, 1500);
                } else {
                    // Handle server-side errors or failed API calls from PHP
                    console.error('Server Error:', result.message || 'Unknown server error');
                    formStatus.textContent = `Error: ${result.message || 'Something went wrong on the server.'}`;
                    formStatus.style.color = 'salmon';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                formStatus.textContent = 'An unexpected network error occurred. Please try again.';
                formStatus.style.color = 'salmon';
            }
        });
    } else {
        console.warn("Contact form or form status element not found. Contact form submission will not work.");
    }
});
