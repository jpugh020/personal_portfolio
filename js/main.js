// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all main functions
    initializeNavigation();
    initializeProjects();
    initializeFormValidation();
    updateCurrentYear();
});

// Navigation functionality
function initializeNavigation() {
    const nav = document.querySelector('nav ul');
    const header = document.querySelector('header');
    
    // Create and add hamburger menu for mobile
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    header.insertBefore(hamburger, nav);

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Projects functionality
function initializeProjects() {
    const projects = document.querySelectorAll('.project-card');
    
    // Add click event for project images to show lightbox
    projects.forEach(project => {
        const img = project.querySelector('img');
        if (img) {
            img.addEventListener('click', () => showLightbox(img.src, img.alt));
        }
    });
}

// Lightbox functionality
function showLightbox(imageSrc, imageAlt) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Image preview');
    
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="close-lightbox" aria-label="Close preview">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}">
        </div>
    `;

    // Add lightbox to page
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close lightbox functionality
    const closeLightbox = () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    };

    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard accessibility
    lightbox.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// Form validation
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    // Real-time validation
    inputs.forEach(input => {
        // Create validation message element
        const validationMessage = document.createElement('span');
        validationMessage.className = 'validation-message';
        input.parentNode.appendChild(validationMessage);

        // Add validation on input
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = {
                name: form.querySelector('#name').value,
                email: form.querySelector('#email').value,
                message: form.querySelector('#message').value
            };

            try {
                // Option 1: Using a form service (Formspree)
                const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showFormSubmissionMessage('Thank you! Your message has been sent.');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Option 2: Fallback to mailto link
                const mailtoLink = \`mailto:your.email@example.com?subject=Portfolio Contact from \${encodeURIComponent(formData.name)}&body=\${encodeURIComponent(\`Name: \${formData.name}\\nEmail: \${formData.email}\\n\\nMessage:\\n\${formData.message}\`)}\`;
                
                window.location.href = mailtoLink;
            }
        }
    });
}

// Input validation helper
function validateInput(input) {
    const validationMessage = input.parentNode.querySelector('.validation-message');
    let isValid = true;
    let message = '';

    // Clear previous validation
    input.classList.remove('invalid');
    input.classList.remove('valid');

    // Validate based on input type
    switch (input.type) {
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(input.value);
            message = isValid ? '' : 'Please enter a valid email address';
            break;
        
        case 'text':
            isValid = input.value.trim().length >= 2;
            message = isValid ? '' : 'This field is required (minimum 2 characters)';
            break;
        
        case 'textarea':
            isValid = input.value.trim().length >= 10;
            message = isValid ? '' : 'Please enter a message (minimum 10 characters)';
            break;
    }

    // Update input styling and message
    input.classList.add(isValid ? 'valid' : 'invalid');
    validationMessage.textContent = message;
    validationMessage.className = 'validation-message ' + (isValid ? 'valid' : 'invalid');

    return isValid;
}

// Form submission message
function showFormSubmissionMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'form-message success';
    messageElement.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(messageElement, form.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Update copyright year
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
