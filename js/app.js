// Configuration
const CONTENT_PATH = 'content/semanas/';

// Elements
const contentContainer = document.getElementById('content');
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

// Load markdown file and convert to HTML
async function loadMarkdownContent(filename) {
    try {
        showLoading();

        const response = await fetch(`${CONTENT_PATH}${filename}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const markdown = await response.text();
        const html = marked.parse(markdown);

        displayContent(html);

    } catch (error) {
        console.error('Error loading content:', error);
        showError();
    }
}

// Show loading state
function showLoading() {
    loadingContainer.classList.remove('hidden');
    contentContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

// Display content
function displayContent(html) {
    contentContainer.innerHTML = html;
    contentContainer.classList.remove('hidden');
    loadingContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');

    // Extract and display topics in sidebar
    extractAndDisplayTopics();

    // Add IDs to h2 elements for scrolling
    addAnchorIds();
}

// Extract topics (h2 headings) and display in sidebar
function extractAndDisplayTopics() {
    const activeItem = document.querySelector('.sidebar-item.active');
    if (!activeItem) return;

    const topicsContainer = activeItem.querySelector('.week-topics');
    if (!topicsContainer) return;

    // Get all h2 elements from content
    const headings = contentContainer.querySelectorAll('h2');

    if (headings.length === 0) {
        topicsContainer.classList.add('hidden');
        return;
    }

    // Clear existing topics
    topicsContainer.innerHTML = '';

    // Create topic links
    headings.forEach((heading, index) => {
        const topicLink = document.createElement('div');
        topicLink.className = 'topic-link';
        topicLink.textContent = heading.textContent.replace(/^[📚🎯📋🎓]\s*/, ''); // Remove emojis
        topicLink.dataset.anchor = `topic-${index}`;

        // Scroll to topic on click
        topicLink.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollToTopic(`topic-${index}`);

            // Update active state
            topicsContainer.querySelectorAll('.topic-link').forEach(link => {
                link.classList.remove('active');
            });
            topicLink.classList.add('active');
        });

        topicsContainer.appendChild(topicLink);
    });

    // Show topics container
    topicsContainer.classList.remove('hidden');
    topicsContainer.classList.add('expanded');
}

// Add IDs to h2 elements for anchor scrolling
function addAnchorIds() {
    const headings = contentContainer.querySelectorAll('h2');
    headings.forEach((heading, index) => {
        heading.id = `topic-${index}`;
    });
}

// Scroll to specific topic
function scrollToTopic(anchorId) {
    const element = document.getElementById(anchorId);
    const mainElement = document.querySelector('main');

    if (element && mainElement) {
        const offset = 100; // Offset to account for sticky header (72px) + extra space
        const elementPosition = element.offsetTop;

        mainElement.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

// Show error state
function showError() {
    errorContainer.classList.remove('hidden');
    loadingContainer.classList.add('hidden');
    contentContainer.classList.add('hidden');
}

// Show locked content message
function showLockedContent(week) {
    const weekNumber = week.replace('week', '');
    const html = `
        <div class="text-center py-20">
            <div class="text-6xl mb-4">🔒</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Semana ${weekNumber}</h2>
            <p class="text-gray-600">Este contenido estará disponible próximamente</p>
            <p class="text-sm text-gray-500 mt-4">Completa primero las semanas anteriores</p>
        </div>
    `;
    displayContent(html);
}

// Mobile menu toggle
function setupMobileMenu() {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('open');
    });
}

// Sidebar navigation
function setupNavigation() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function (e) {
            // Skip if locked
            if (this.classList.contains('cursor-not-allowed')) return;

            // Check if clicking on the main item (not a topic link)
            if (e.target.classList.contains('topic-link')) return;

            const topicsContainer = this.querySelector('.week-topics');
            const arrow = this.querySelector('.week-arrow');

            // If clicking on already active item, toggle topics
            if (this.classList.contains('active') && topicsContainer) {
                topicsContainer.classList.toggle('expanded');
                arrow?.classList.toggle('rotated');
                return;
            }

            // Remove active from all
            document.querySelectorAll('.sidebar-item').forEach(i => {
                i.classList.remove('active');
                const topics = i.querySelector('.week-topics');
                const arr = i.querySelector('.week-arrow');
                topics?.classList.remove('expanded');
                arr?.classList.remove('rotated');
            });

            // Add active to clicked
            this.classList.add('active');

            // Get filename and load content
            const filename = this.getAttribute('data-file');

            if (filename) {
                loadMarkdownContent(filename);
                // Expand topics after content loads
                setTimeout(() => {
                    topicsContainer?.classList.add('expanded');
                    arrow?.classList.add('rotated');
                }, 300);
            } else {
                // Show locked message
                showLockedContent(this.getAttribute('data-week'));
            }

            // Scroll to top of main content
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Close mobile menu
            if (window.innerWidth < 768) {
                sidebar.classList.add('hidden');
            }
        });
    });
}

// Initialize app
function init() {
    setupNavigation();
    setupMobileMenu();

    // Load first week by default
    loadMarkdownContent('SEMANA_01_COMPOSABLES_Y_ESTADO.md');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
