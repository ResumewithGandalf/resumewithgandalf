// Load configuration
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();

        // Apply site title
        document.title = config.site.title;

        // Update favicons
        if (config.site.favicon) {
            const iconLinks = document.querySelectorAll('link[rel="icon"]');
            iconLinks.forEach(link => {
                if (link.type === 'image/x-icon') {
                    link.href = config.site.favicon.ico;
                } else if (link.type === 'image/png') {
                    const size = link.sizes.toString();
                    link.href = config.site.favicon.png.replace('.png', `-${size}.png`);
                }
            });
        }

        // Update logo images
        document.querySelector('.logo-light').src = config.site.logo.images.light;
        document.querySelector('.logo-dark').src = config.site.logo.images.dark;

        // Showcase section title and image
        const titleContainer = document.querySelector('.title-container');
        titleContainer.innerHTML = '';
        if (config.showcase.title_image && config.showcase.title_image.enabled) {
            const titleImage = document.createElement('img');
            titleImage.src = config.showcase.title_image.src;
            titleImage.alt = config.showcase.title_image.alt;
            titleImage.width = config.showcase.title_image.size.width;
            titleImage.height = config.showcase.title_image.size.height;
            titleImage.className = `title-image ${config.showcase.title_image.position}`;
            if (config.showcase.title_image.position === 'left') {
                titleContainer.appendChild(titleImage);
            }
        }
        const heading = document.createElement('h2');
        heading.textContent = config.showcase.heading;
        titleContainer.appendChild(heading);
        if (config.showcase.title_image && config.showcase.title_image.enabled && config.showcase.title_image.position === 'right') {
            const titleImage = document.createElement('img');
            titleImage.src = config.showcase.title_image.src;
            titleImage.alt = config.showcase.title_image.alt;
            titleImage.width = config.showcase.title_image.size.width;
            titleImage.height = config.showcase.title_image.size.height;
            titleImage.className = `title-image ${config.showcase.title_image.position}`;
            titleContainer.appendChild(titleImage);
        }

        // Showcase intro and Telegram
        const introText = document.querySelector('.showcase-intro');
        introText.innerHTML = '';
        introText.append(document.createTextNode(config.showcase.intro.text));
        if (config.showcase.intro.contact) {
            const contactSpan = document.createElement('span');
            contactSpan.className = 'contact-telegram';
            contactSpan.innerHTML = `For questions or custom designs, contact Gandalf on Telegram: <a href="${config.showcase.intro.contact.telegram_url}" target="_blank" rel="noopener noreferrer">${config.showcase.intro.contact.telegram} <i class="fab fa-telegram-plane"></i></a>`;
            introText.appendChild(contactSpan);
        }

        // Templates
        const templateGrid = document.querySelector('.template-grid');
        templateGrid.innerHTML = '';
        config.templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <div class="template-image-container">
                    <img src="${template.images.light}"
                         alt="${template.title} Light Mode"
                         class="template-light"
                         onerror="this.src='https://placehold.co/600x400/B8860B/FFF8DC?text=${encodeURIComponent(template.title)}'">
                    <img src="${template.images.dark}"
                         alt="${template.title} Dark Mode"
                         class="template-dark"
                         onerror="this.src='https://placehold.co/600x400/4E342E/DAA520?text=${encodeURIComponent(template.title)}'">
                </div>
                <h3>${template.title}</h3>
                <p class="template-description">${template.description}</p>
                <div class="template-links">
                    <a href="${template.demo_url}" target="_blank" rel="noopener noreferrer">
                        <i class="${template.id === 'custom' ? 'fab fa-telegram-plane' : 'fas fa-eye'}"></i>
                        ${template.id === 'custom' ? 'Request Custom Design' : 'View Demo'}
                    </a>
                </div>
            `;
            templateGrid.appendChild(templateCard);
        });

        // Footer
        const footer = document.getElementById('footer');
        footer.innerHTML = '';
        const footerHeading = document.createElement('h1');
        footerHeading.textContent = config.footer.heading;
        const footerSubtext = document.createElement('p');
        footerSubtext.textContent = config.footer.subtext;
        footer.appendChild(footerHeading);
        footer.appendChild(footerSubtext);
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

// Load config when the page loads
window.addEventListener('DOMContentLoaded', loadConfig);

// Theme toggle functionality (existing code)
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');
const text = themeToggle.querySelector('span');
const docElement = document.documentElement;

function updateToggleButton(theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark Mode';
    }
}

const savedTheme = localStorage.getItem('theme') ||
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
docElement.setAttribute('data-theme', savedTheme);
updateToggleButton(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = docElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    docElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        docElement.setAttribute('data-theme', newTheme);
        updateToggleButton(newTheme);
    }
}); 