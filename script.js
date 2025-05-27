// --- Data ---

const userData = {
    fullName: "Praveen Sundaresan Ramesh",
    profileImage: "images/profile.jpg", // IMPORTANT: Update to your actual image path
    jobTitle: "Data Scientist & Engineer",
    summary: "I am a Data Engineer & Scientist with a strong analytical mindset and a track record of driving data-informed business decisions across banking and fintech. Experienced in both on-premise systems (Apache Hadoop) and cloud platforms (primarily Microsoft Azure), with hands-on expertise in cloud migration initiatives. Highly collaborative and skilled at bridging business and technical teams, translating complex requirements into efficient and actionable data solutions. Having worked in both a fast-paced startup environment and a well-structured enterprise setting, I adapt quickly to varying levels of process maturity. I am driven by continuous learning, and I stay current with the latest advancements in AI through a blend of in-depth research and hands-on experimentation",
    contact: {
        email: "praveen.sundaresanramesh@outlook.com",
        linkedin: "https://www.linkedin.com/in/srpraveen97/",
        github: "https://github.com/alexjohnson",
    },
    workHistory: [
        { role: "Data Engineering Analyst", company: "CIBC", duration: "Feb 2022 - Present", description: "Led a team of 5 data scientists in developing and deploying machine learning models for predictive maintenance and customer churn prediction. Spearheaded the adoption of MLOps practices, reducing model deployment time by 40%. Key achievement: Reduced churn by 18% within the first year.", skills: ["Python", "TensorFlow", "AWS SageMaker", "SQL", "Spark", "MLOps", "Team Leadership"] },
        { role: "Data Scientist", company: "Aliya Financial Technologies", duration: "Apr 2021 - Jan 2022", description: "Developed NLP models for sentiment analysis of customer feedback, improving product development cycles by 25%. Built and maintained data pipelines for ETL processes, handling terabytes of data monthly.", skills: ["Python", "Scikit-learn", "NLTK", "Pandas", "Airflow", "NLP", "Big Data"] },
        { role: "Graduate Research Associate", company: "McMaster University", duration: "Sep 2020 - Feb 2021", description: "Conducted research on machine learning algorithms for predictive analytics in healthcare, resulting in a publication in a peer-reviewed journal. Collaborated with cross-functional teams to implement data-driven solutions.", skills: ["Python", "R", "Machine Learning", "Research", "Data Analysis"] },
    ],
    certifications: [
        { name: "Microsoft Azure Data Science Associate", issuer: "Microsoft", date: "2025", icon: "images/azureds.png" },
        { name: "Microsoft Azure AI Fundamentals", issuer: "Microsoft", date: "2025", icon: "images/azureai900.png" },
        { name: "Databricks Fundamentals", issuer: "Databricks", date: "2025", icon: "images/dbfund.png" },
    ],
};

const newTheme = {
    primaryGradientFrom: 'from-blue-500', primaryGradientTo: 'to-sky-500', primaryHoverFrom: 'hover:from-blue-600', primaryHoverTo: 'hover:to-sky-600', primaryText: 'text-blue-600', darkPrimaryText: 'dark:text-sky-400', primaryRing: 'focus:ring-blue-500', secondaryButtonBorder: 'border-blue-600', darkSecondaryButtonBorder: 'dark:border-sky-400', secondaryButtonText: 'text-blue-600', darkSecondaryButtonText: 'dark:text-sky-400', secondaryButtonHoverBg: 'hover:bg-blue-600', darkSecondaryButtonHoverBg: 'dark:hover:bg-sky-400', sectionTitleUnderlineFrom: 'from-blue-500', sectionTitleUnderlineTo: 'to-sky-500', profileBgGradientFrom: 'dark:from-gray-800', profileBgGradientTo: 'dark:to-gray-900', activeNavBg: 'bg-blue-600', darkActiveNavBg: 'dark:bg-sky-500', hoverNavBg: 'hover:bg-blue-100', darkHoverNavBg: 'dark:hover:bg-gray-700', hoverNavText: 'hover:text-blue-700', darkHoverNavText: 'dark:hover:text-sky-300', tagBg: 'bg-blue-100', darkTagBg: 'dark:bg-sky-700', tagText: 'text-blue-700', darkTagText: 'dark:text-sky-100',
};

// IDs of your project and blog files (without .json extension)
// IMPORTANT: Update these lists when you add new project or blog files!
const projectIds = [
    "customer-churn-prediction",
    "predictive-maintenance-iot",
    "nlp-sentiment-analysis",
    "sales-forecasting-tool"
];
const blogPostIds = [
    "demystifying-mlops",
    "future-of-ai-ethics",
    "exploring-llms"
];

let allProjectsData = [];
let allBlogPostsData = [];

// --- Global State and Navigation ---
let currentPage = 'home';
let activeParam = null; // For project ID or blog ID
let isDarkMode = document.documentElement.classList.contains('dark');
let isMobileMenuOpen = false;
let isInitialLoaded = false; // For initial page load animations

// --- Data Fetching Functions ---
async function fetchJsonData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} for ${filePath}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${filePath}:`, error);
        return null; // Return null or an empty object/array as appropriate
    }
}

async function loadAllProjects() {
    const projectPromises = projectIds.map(id => fetchJsonData(`projects/${id}.json`));
    const projects = await Promise.all(projectPromises);
    allProjectsData = projects.filter(p => p !== null);
}

async function loadAllBlogPosts() {
    const blogPromises = blogPostIds.map(id => fetchJsonData(`blogs/${id}.json`));
    const posts = await Promise.all(blogPromises);
    allBlogPostsData = posts.filter(p => p !== null)
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
    // Update author from userData if needed (or keep it in JSON)
    allBlogPostsData.forEach(post => {
        if (!post.author) { // If author is not in the JSON, use global one
            post.author = userData.fullName;
        }
    });
}


function getIconSVG(iconName, classes = "w-6 h-6") {
    return `<svg class="${classes}"><use xlink:href="#icon-${iconName}"></use></svg>`;
}

function navigateTo(pageId, param = null) {
    currentPage = pageId;
    activeParam = param;
    renderApp(); // renderApp will now handle re-rendering content based on fetched data
    window.scrollTo(0, 0);
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
    renderApp(); // Re-render the entire app to reflect mode changes properly
}

// --- Component-like Rendering Functions ---

function renderHeader() {
    const headerEl = document.getElementById('main-header');
    const navLinks = [
        { name: 'Home', page: 'home' },
        { name: 'Projects', page: 'projects' },
        { name: 'Blog', page: 'blog' },
        { name: 'Contact', page: 'contact' },
    ];

    let navButtonsHTML = navLinks.map(link => `
        <button
            data-page="${link.page}"
            class="nav-link px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 ease-in-out
            ${currentPage === link.page
            ? `${newTheme.activeNavBg} text-white shadow-md ${newTheme.darkActiveNavBg}`
            : `text-gray-700 dark:text-gray-300 ${newTheme.hoverNavBg} ${newTheme.darkHoverNavBg} ${newTheme.hoverNavText} ${newTheme.darkHoverNavText}`
        }"
        >
            ${link.name}
        </button>
    `).join('');

    let mobileNavButtonsHTML = navLinks.map(link => `
        <button
            data-page="${link.page}"
            class="mobile-nav-link block w-full text-left px-3 py-3 rounded-md text-base font-semibold transition-colors
            ${currentPage === link.page
            ? `${newTheme.activeNavBg} text-white ${newTheme.darkActiveNavBg}`
            : `text-gray-700 dark:text-gray-300 ${newTheme.hoverNavBg} ${newTheme.darkHoverNavBg}`
        }"
        >
            ${link.name}
        </button>
    `).join('');

    headerEl.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <div class="flex items-center">
                    <a data-page="home" class="nav-link cursor-pointer text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo} dark:${newTheme.primaryGradientFrom} dark:${newTheme.primaryGradientTo} hover:opacity-80 transition-opacity">
                        ${userData.fullName.split(" ")[0]}
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-2">
                    ${navButtonsHTML}
                    <button id="darkModeToggleDesktop" class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        ${isDarkMode ? getIconSVG('sun', 'w-5 h-5') : getIconSVG('moon', 'w-5 h-5')}
                    </button>
                </div>
                <div class="md:hidden flex items-center">
                     <button id="darkModeToggleMobile" class="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 transition-colors">
                        ${isDarkMode ? getIconSVG('sun', 'w-5 h-5') : getIconSVG('moon', 'w-5 h-5')}
                    </button>
                    <button id="mobileMenuButton" class="p-2 rounded-md text-gray-700 dark:text-gray-300">
                        ${isMobileMenuOpen ? getIconSVG('x', 'w-7 h-7') : getIconSVG('menu', 'w-7 h-7')}
                    </button>
                </div>
            </div>
        </div>
        <div id="mobileMenu" class="${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                ${mobileNavButtonsHTML}
            </div>
        </div>
    `;

    headerEl.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            navigateTo(e.currentTarget.dataset.page);
            if (isMobileMenuOpen) {
                isMobileMenuOpen = false;
                renderHeader();
            }
        });
    });
    document.getElementById('darkModeToggleDesktop').addEventListener('click', toggleDarkMode);
    document.getElementById('darkModeToggleMobile').addEventListener('click', toggleDarkMode);
    document.getElementById('mobileMenuButton').addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        renderHeader();
    });
}

function renderFooter() {
    const footerEl = document.getElementById('main-footer');
    if (!footerEl) return;
    footerEl.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center space-x-8 mb-6">
                <a href="${userData.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} hover:${newTheme.primaryText} dark:hover:${newTheme.darkPrimaryText} transition-colors">${getIconSVG('linkedin', 'w-7 h-7')}</a>
                <a href="${userData.contact.github}" target="_blank" rel="noopener noreferrer" class="${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} hover:${newTheme.primaryText} dark:hover:${newTheme.darkPrimaryText} transition-colors">${getIconSVG('github', 'w-7 h-7')}</a>
                <a href="mailto:${userData.contact.email}" class="${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} hover:${newTheme.primaryText} dark:hover:${newTheme.darkPrimaryText} transition-colors">${getIconSVG('mail', 'w-7 h-7')}</a>
            </div>
            <p class="text-sm">&copy; ${new Date().getFullYear()} ${userData.fullName}. All rights reserved.</p>
            <p class="text-xs mt-2 opacity-75">Designed with passion. Built with HTML, CSS & JS.</p>
        </div>
    `;
}

function createActionButton(text, page, param = null, icon = null, extraClasses = '') {
    const iconHTML = icon ? getIconSVG(icon, 'w-5 h-5 ml-2') : '';
    return `
        <button data-page="${page}" ${param ? `data-param="${param}"` : ''}
                class="action-button inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo} ${newTheme.primaryHoverFrom} ${newTheme.primaryHoverTo} focus:outline-none focus:ring-2 focus:ring-offset-2 ${newTheme.primaryRing} dark:focus:ring-offset-gray-800 transform transition-all duration-150 ease-in-out hover:scale-105 ${extraClasses}">
            ${text}
            ${iconHTML}
        </button>
    `;
}

function createSectionTitle(title, iconName) {
    const iconHTML = iconName ? getIconSVG(iconName, `w-10 h-10 mr-4 ${newTheme.primaryText} ${newTheme.darkPrimaryText} transition-transform duration-300 group-hover:rotate-12`) : '';
    return `
        <div class="flex items-center mb-8 group">
            ${iconHTML}
            <h2 class="text-4xl font-bold text-gray-800 dark:text-white relative">
                ${title}
                <span class="absolute -bottom-2 left-0 w-1/4 h-1 bg-gradient-to-r ${newTheme.sectionTitleUnderlineFrom} ${newTheme.sectionTitleUnderlineTo} transition-all duration-300 group-hover:w-1/3"></span>
            </h2>
        </div>
    `;
}

function renderProfileSection(containerId) {
    const sectionEl = document.getElementById(containerId);
    if (!sectionEl) return;

    const numFloatingImages = 5;
    let floatingImagesHTML = '';
    for (let i = 0; i < numFloatingImages; i++) {
        const size = Math.floor(Math.random() * 20) + 40;
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        const delay = Math.random() * 5;
        // Using a generic placeholder for floating images, or you could create specific small icons
        floatingImagesHTML += `
            <img src="https://placehold.co/${size}x${size}/${isDarkMode ? '4B5563' : 'BFDBFE'}/${isDarkMode ? '9CA3AF' : '3B82F6'}?text=◇&font=roboto"
                 alt="Floating tech item ${i + 1}"
                 class="absolute animate-float opacity-20 dark:opacity-15 rounded-lg shadow-md"
                 style="top: ${top}%; left: ${left}%; animation-delay: ${delay}s; width: ${size}px; height: ${size}px;"
                 onerror="this.style.display='none';">`;
    }

    sectionEl.innerHTML = `
        <div id="profile-content" class="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 transition-opacity duration-1000 ease-out ${isInitialLoaded && currentPage === 'home' ? '' : 'opacity-0'}">
            <div class="absolute inset-0 z-0 pointer-events-none">
                ${floatingImagesHTML}
            </div>
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center text-center md:text-left relative z-10">
                <div class="relative mb-8 md:mb-0 md:mr-12">
                    <img
                        src="${userData.profileImage}"
                        alt="${userData.fullName}"
                        id="profileImage"
                        class="w-52 h-52 md:w-64 md:h-64 rounded-full object-cover border-8 border-white dark:border-gray-700 shadow-2xl transform transition-all duration-500 ease-out cursor-pointer ${isInitialLoaded && currentPage === 'home' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}"
                        onerror="this.onerror=null; this.src='https://placehold.co/300x300/CCCCCC/FFFFFF?text=Error';"
                    />
                    <div id="profileImageDialog" class="hidden absolute bottom-full mb-2 w-64 left-1/2 -translate-x-1/2 p-3 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl transition-all duration-300" style="pointer-events: none;">
                        Hi, I am ${userData.fullName.split(" ")[0]}. Nice to meet you and thanks for visiting my website!
                        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800 dark:border-t-gray-700"></div>
                    </div>
                </div>
                <div id="profileTextContainer" class="flex-1 transition-all duration-500 ease-out ${isInitialLoaded && currentPage === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}">
                    <h1 id="typedName" class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight min-h-[72px] md:min-h-[84px] bg-clip-text text-transparent bg-gradient-to-r ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo}"></h1>
                    <p class="text-2xl md:text-3xl ${newTheme.primaryText} ${newTheme.darkPrimaryText} font-semibold mb-6">${userData.jobTitle}</p>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto md:mx-0 text-lg">${userData.summary}</p>
                    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        ${createActionButton('View My Work', 'projects', null, 'chevrons-right')}
                        <button data-page="contact" class="secondary-action-button nav-link inline-flex items-center justify-center px-6 py-3 border-2 ${newTheme.secondaryButtonBorder} ${newTheme.darkSecondaryButtonBorder} ${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} text-base font-medium rounded-md ${newTheme.secondaryButtonHoverBg} dark:${newTheme.darkSecondaryButtonHoverBg} hover:text-white dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 ${newTheme.primaryRing} dark:focus:ring-offset-gray-800 transform transition-all duration-150 ease-in-out hover:scale-105">
                            Get In Touch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const profileImageEl = document.getElementById('profileImage');
    const typedNameEl = document.getElementById('typedName');
    const profileImageDialogEl = document.getElementById('profileImageDialog');

    let typeInterval;
    function startTypingAnimation() {
        if (!typedNameEl) return;
        let charIndex = 0;
        const fullDisplayName = userData.fullName;
        typedNameEl.innerHTML = `<span class="inline-block w-1 h-10 md:h-12 ml-1 bg-gray-800 dark:bg-gray-200 animate-blink"></span>`;
        if (typeInterval) clearInterval(typeInterval);
        typeInterval = setInterval(() => {
            if (charIndex < fullDisplayName.length) {
                typedNameEl.innerHTML = fullDisplayName.slice(0, charIndex + 1) + `<span class="inline-block w-1 h-10 md:h-12 ml-1 bg-gray-800 dark:bg-gray-200 animate-blink"></span>`;
                charIndex++;
            } else {
                clearInterval(typeInterval);
                typedNameEl.innerHTML = fullDisplayName;
            }
        }, 150);
    }

    if (currentPage === 'home') { // Only run typing animation and entry animations on home page
        startTypingAnimation();
        // Entry animation for the section
        setTimeout(() => {
            const profileContentEl = document.getElementById('profile-content');
            const imgEl = document.getElementById('profileImage');
            const textContEl = document.getElementById('profileTextContainer');
            if (profileContentEl) profileContentEl.classList.remove('opacity-0');
            if (imgEl) {
                imgEl.classList.remove('opacity-0', 'scale-90');
                imgEl.classList.add('opacity-100', 'scale-100');
            }
            if (textContEl) {
                textContEl.classList.remove('opacity-0', 'translate-y-5');
                textContEl.classList.add('opacity-100', 'translate-y-0');
            }
        }, 100); // Small delay for CSS to apply
    } else { // If not home, ensure name is set without animation
        if (typedNameEl) typedNameEl.innerHTML = userData.fullName;
    }


    if (profileImageEl && profileImageDialogEl) {
        profileImageEl.addEventListener('mouseenter', () => profileImageDialogEl.classList.remove('hidden'));
        profileImageEl.addEventListener('mouseleave', () => profileImageDialogEl.classList.add('hidden'));
    }

    sectionEl.querySelectorAll('.action-button, .secondary-action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            navigateTo(e.currentTarget.dataset.page, e.currentTarget.dataset.param);
        });
    });
}

function renderWorkHistorySection(containerId) {
    const sectionEl = document.getElementById(containerId);
    if (!sectionEl) return;

    let workHistoryHTML = userData.workHistory.map((item, index) => {
        let skillsHTML = item.skills.map(skill => `<span class="bg-gradient-to-r ${newTheme.tagBg} dark:${newTheme.darkTagBg} ${newTheme.tagText} dark:${newTheme.darkTagText} px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm">${skill}</span>`).join('');
        return `
            <div class="work-history-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div class="flex justify-between items-start cursor-pointer work-history-header" data-index="${index}">
                    <div>
                        <h3 class="text-2xl font-semibold ${newTheme.primaryText} ${newTheme.darkPrimaryText}">${item.role}</h3>
                        <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">${item.company}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">${item.duration}</p>
                    </div>
                    <button class="chevron-button ${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} p-2 rounded-full ${newTheme.hoverNavBg} ${newTheme.darkHoverNavBg} transition-colors">
                        ${getIconSVG('chevron-down', 'w-6 h-6 chevron-icon')}
                    </button>
                </div>
                <div class="details hidden mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                    <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">${item.description}</p>
                    ${item.skills && item.skills.length > 0 ? `
                        <div>
                            <h4 class="font-semibold text-md text-gray-800 dark:text-gray-200 mb-2">Key Skills & Technologies:</h4>
                            <div class="flex flex-wrap gap-2">${skillsHTML}</div>
                        </div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    sectionEl.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            ${createSectionTitle('Career Journey', 'briefcase')}
            <div class="space-y-8">${workHistoryHTML}</div>
        </div>
    `;

    sectionEl.querySelectorAll('.work-history-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.work-history-card');
            const details = card.querySelector('.details');
            const iconUse = card.querySelector('.chevron-icon use');
            details.classList.toggle('hidden');
            if (iconUse) {
                iconUse.setAttribute('xlink:href', details.classList.contains('hidden') ? '#icon-chevron-down' : '#icon-chevron-up');
            }
        });
    });
}

function renderHighlightedProjectsSection(containerId) {
    const sectionEl = document.getElementById(containerId);
    if (!sectionEl || !allProjectsData.length) {
        if (sectionEl) sectionEl.innerHTML = ''; // Clear if no data
        return;
    }

    let projectsHTML = allProjectsData.slice(0, 3).map(project => createProjectCardHTML(project)).join('');

    sectionEl.innerHTML = `
        <div class="py-16 md:py-24 bg-gray-100 dark:bg-gray-900">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                ${createSectionTitle('Featured Projects', 'lightbulb')}
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">${projectsHTML}</div>
                ${allProjectsData.length > 3 ? `
                    <div class="text-center mt-12">
                        ${createActionButton('Explore All Projects', 'projects', null, 'chevrons-right')}
                    </div>` : ''}
            </div>
        </div>
    `;
    sectionEl.querySelectorAll('.action-button, .project-card-button').forEach(button => {
        button.addEventListener('click', (e) => {
            navigateTo(e.currentTarget.dataset.page, e.currentTarget.dataset.param);
        });
    });
}

function renderCertificationsSection(containerId) {
    const sectionEl = document.getElementById(containerId);
    if (!sectionEl) return;

    let certificationsHTML = userData.certifications.map(cert => {
        return `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div class="p-3 bg-gradient-to-br ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo} rounded-full mb-4 shadow-md">
                   <img src="${cert.icon}" alt="${cert.name} icon" class="w-10 h-10 object-contain">
                </div>
                <h4 class="font-semibold text-lg text-gray-800 dark:text-white mb-1">${cert.name}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${cert.issuer}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">${cert.date}</p>
            </div>
        `;
    }).join('');
    sectionEl.innerHTML = `
           <div class="py-16 md:py-24">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                ${createSectionTitle('Credentials & Certifications', 'award')}
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">${certificationsHTML}</div>
            </div>
        </div>
    `;
}

function createProjectCardHTML(project) {
    if (!project) return ''; // Handle case where project might be null
    // Ensure thumbnail path is correct, if it's already full path or needs "images/" prefix
    const thumbnailSrc = project.thumbnail.startsWith('http') || project.thumbnail.startsWith('images/') ? project.thumbnail : `images/${project.thumbnail}`;
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group transform hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1">
            <div class="relative overflow-hidden">
                <img src="${thumbnailSrc}" alt="${project.title}" class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" onerror="this.onerror=null; this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Image'; this.alt='Error loading image';">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-semibold ${newTheme.primaryText} ${newTheme.darkPrimaryText} mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors">${project.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 h-16">${project.overview}</p>
                ${createActionButton('View Project Details', 'project-detail', project.id, 'external-link', 'w-full text-sm py-2.5 project-card-button')}
            </div>
        </div>
    `;
}

function renderHomePageContent() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    homeSection.innerHTML = `
        <div id="profile-section-container"></div>
        <div id="work-history-section-container"></div>
        <div id="highlighted-projects-section-container"></div>
        <div id="certifications-section-container"></div>
    `;
    renderProfileSection('profile-section-container');
    renderWorkHistorySection('work-history-section-container');
    renderHighlightedProjectsSection('highlighted-projects-section-container');
    renderCertificationsSection('certifications-section-container');
}

function renderProjectsPageContent() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;
    if (!allProjectsData.length) {
        projectsSection.innerHTML = `<div class="container mx-auto px-4 py-12 text-center text-gray-500 text-xl">No projects loaded. Check console for errors.</div>`;
        return;
    }
    let projectsHTML = allProjectsData.map(project => createProjectCardHTML(project)).join('');
    projectsSection.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            ${createSectionTitle('All My Projects', 'briefcase')}
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">${projectsHTML}</div>
        </div>
    `;
    projectsSection.querySelectorAll('.project-card-button').forEach(button => {
        button.addEventListener('click', (e) => {
            navigateTo(e.currentTarget.dataset.page, e.currentTarget.dataset.param);
        });
    });
}

function renderProjectDetailPageContent(projectId) {
    const detailSection = document.getElementById('project-detail');
    if (!detailSection) return;
    const project = allProjectsData.find(p => p.id === projectId);
    if (!project) {
        detailSection.innerHTML = `<div class="container mx-auto px-4 py-12 text-center text-red-500 text-xl">Project not found.</div>`;
        return;
    }

    const thumbnailSrc = project.thumbnail.startsWith('http') || project.thumbnail.startsWith('images/') ? project.thumbnail : `images/${project.thumbnail}`;
    let goalsHTML = project.goals.map(goal => `<li class="flex items-start"><svg class="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0"><use xlink:href="#icon-chevrons-right"></use></svg> <span>${goal}</span></li>`).join('');
    let techHTML = project.technologies.map(tech => `<span class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-1.5 text-sm font-medium rounded-full shadow-sm">${tech}</span>`).join('');
    let screenshotsHTML = project.screenshots.map((ss, i) => {
        const screenshotSrc = ss.startsWith('http') || ss.startsWith('images/') ? ss : `images/${ss}`;
        return `<img src="${screenshotSrc}" alt="Screenshot ${i + 1}" class="rounded-lg shadow-xl object-cover w-full h-auto border border-gray-200 dark:border-gray-700" onerror="this.onerror=null; this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Screenshot';this.alt='Error loading screenshot';">`;
    }).join('');

    detailSection.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <button data-page="projects" class="back-button nav-link mb-10 inline-flex items-center px-5 py-2.5 border-2 ${newTheme.secondaryButtonBorder} ${newTheme.darkSecondaryButtonBorder} text-sm font-semibold rounded-lg ${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} bg-transparent ${newTheme.hoverNavBg} ${newTheme.darkHoverNavBg} transition-colors">
                &larr; Back to Projects
            </button>
            <article class="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl">
                <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo} dark:${newTheme.primaryGradientFrom} dark:${newTheme.primaryGradientTo} mb-6 leading-tight">${project.title}</h1>
                <img src="${thumbnailSrc}" alt="${project.title} main image" class="w-full max-w-4xl mx-auto h-auto rounded-lg shadow-xl mb-10 border-4 border-gray-200 dark:border-gray-700" onerror="this.onerror=null; this.src='https://placehold.co/800x450/CCCCCC/FFFFFF?text=Error';this.alt='Error loading image';">
                <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:${newTheme.primaryText} dark:prose-headings:${newTheme.darkPrimaryText} prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:${newTheme.primaryText} dark:prose-a:${newTheme.darkPrimaryText} hover:prose-a:underline">
                    <div class="p-6 ${newTheme.tagBg} dark:bg-gray-700 rounded-lg mb-8 shadow">
                        <h2 class="!mt-0 flex items-center">${getIconSVG('target', 'mr-3 w-6 h-6')}Project Overview</h2>
                        <p class="!text-base">${project.overview}</p>
                    </div>
                    <h2 class="flex items-center">${getIconSVG('target', 'mr-3 w-6 h-6')}Key Goals</h2>
                    <ul class="!list-none !pl-0 space-y-2">${goalsHTML}</ul>
                    <h2 class="flex items-center">${getIconSVG('code', 'mr-3 w-6 h-6')}Technologies & Tools</h2>
                    <div class="flex flex-wrap gap-3 my-4">${techHTML}</div>
                    <h2 class="flex items-center">${getIconSVG('lightbulb', 'mr-3 w-6 h-6')}Challenges & Innovative Solutions</h2>
                    <div class="space-y-3"><p><strong>Challenges Encountered:</strong> ${project.challenges}</p><p><strong>How They Were Solved:</strong> ${project.solutions}</p></div>
                    ${project.screenshots && project.screenshots.length > 0 ? `
                        <h2 class="flex items-center">${getIconSVG('users', 'mr-3 w-6 h-6')}Visuals & Demonstrations</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">${screenshotsHTML}</div>` : ''}
                    ${(project.githubLink || project.liveDemoLink) ? `
                        <h2 class="flex items-center">${getIconSVG('external-link', 'mr-3 w-6 h-6')}Explore Further</h2>
                        <ul class="!list-none !pl-0 space-y-3">
                            ${project.githubLink ? `<li><a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center font-medium ${newTheme.primaryText} ${newTheme.darkPrimaryText} hover:text-sky-500 dark:hover:text-sky-300 transition-colors">${getIconSVG('github', 'w-5 h-5 mr-2')} GitHub Repository</a></li>` : ''}
                            ${project.liveDemoLink ? `<li><a href="${project.liveDemoLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center font-medium ${newTheme.primaryText} ${newTheme.darkPrimaryText} hover:text-sky-500 dark:hover:text-sky-300 transition-colors">${getIconSVG('external-link', 'w-5 h-5 mr-2')} Live Demo</a></li>` : ''}
                        </ul>` : ''}
                </div>
            </article>
        </div>
    `;
    detailSection.querySelector('.back-button.nav-link').addEventListener('click', (e) => navigateTo(e.currentTarget.dataset.page));
}

function createBlogPostPreviewHTML(post) {
    if (!post) return '';
    let tagsHTML = post.tags.slice(0, 3).map(tag => `<span class="inline-block ${newTheme.tagBg} dark:${newTheme.darkTagBg} rounded-full px-3 py-1.5 text-xs font-semibold ${newTheme.tagText} dark:${newTheme.darkTagText} mr-2 mb-2 shadow-sm">${tag}</span>`).join('');
    return `
        <article class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <h3 class="text-2xl md:text-3xl font-semibold ${newTheme.primaryText} ${newTheme.darkPrimaryText} mb-3 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors">${post.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                ${getIconSVG('calendar-days', 'w-4 h-4 mr-2 text-gray-400 dark:text-gray-500')} ${new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 leading-relaxed">${post.snippet}</p>
            <div class="mb-5">${tagsHTML}</div>
            ${createActionButton('Read Full Article', 'blog-detail', post.id, 'external-link', 'text-sm py-2.5 blog-post-button')}
        </article>
    `;
}

function renderBlogPageContent() {
    const blogSection = document.getElementById('blog');
    if (!blogSection) return;
    if (!allBlogPostsData.length) {
        blogSection.innerHTML = `<div class="container mx-auto px-4 py-12 text-center text-gray-500 text-xl">No blog posts loaded. Check console for errors.</div>`;
        return;
    }
    let postsHTML = allBlogPostsData.map(post => createBlogPostPreviewHTML(post)).join('');
    blogSection.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            ${createSectionTitle('Thoughts & Insights', 'message-square')}
            <div class="space-y-10">${postsHTML}</div>
        </div>
    `;
    blogSection.querySelectorAll('.blog-post-button').forEach(button => {
        button.addEventListener('click', (e) => {
            navigateTo(e.currentTarget.dataset.page, e.currentTarget.dataset.param);
        });
    });
}

function renderBlogDetailPageContent(blogId) {
    const detailSection = document.getElementById('blog-detail');
    if (!detailSection) return;
    const post = allBlogPostsData.find(p => p.id === blogId);
    if (!post) {
        detailSection.innerHTML = `<div class="container mx-auto px-4 py-12 text-center text-red-500 text-xl">Blog post not found.</div>`;
        return;
    }
    let tagsHTML = post.tags.map(tag => `<span class="bg-gradient-to-r ${newTheme.tagBg} dark:${newTheme.darkTagBg} ${newTheme.tagText} dark:${newTheme.darkTagText} px-4 py-1.5 text-sm font-medium rounded-full shadow-sm">${tag}</span>`).join('');

    detailSection.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <button data-page="blog" class="back-button nav-link mb-10 inline-flex items-center px-5 py-2.5 border-2 ${newTheme.secondaryButtonBorder} ${newTheme.darkSecondaryButtonBorder} text-sm font-semibold rounded-lg ${newTheme.secondaryButtonText} ${newTheme.darkSecondaryButtonText} bg-transparent ${newTheme.hoverNavBg} ${newTheme.darkHoverNavBg} transition-colors">
                &larr; Back to Blog
            </button>
            <article class="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl">
                <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${newTheme.primaryGradientFrom} ${newTheme.primaryGradientTo} dark:${newTheme.primaryGradientFrom} dark:${newTheme.primaryGradientTo} mb-4 leading-tight">${post.title}</h1>
                <div class="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8 space-x-4">
                    <span>By: <span class="font-medium text-gray-700 dark:text-gray-300">${post.author}</span></span>
                    <span class="flex items-center">${getIconSVG('calendar-days', 'w-4 h-4 mr-1.5')} Published: ${new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-4 prose-headings:${newTheme.primaryText} dark:prose-headings:${newTheme.darkPrimaryText} prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:${newTheme.primaryText} dark:prose-a:${newTheme.darkPrimaryText} hover:prose-a:underline prose-strong:text-gray-800 dark:prose-strong:text-gray-200 prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-1 prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-1">
                    ${post.content}
                </div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 class="font-semibold text-lg text-gray-800 dark:text-white mb-3">Filed Under:</h4>
                        <div class="flex flex-wrap gap-3">${tagsHTML}</div>
                    </div>` : ''}
            </article>
        </div>
    `;
    detailSection.querySelector('.back-button.nav-link').addEventListener('click', (e) => navigateTo(e.currentTarget.dataset.page));
}

function renderContactPageContent() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    contactSection.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            ${createSectionTitle("Let's Connect", 'mail')}
            <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl">
                <p class="text-gray-700 dark:text-gray-300 mb-8 text-lg text-center">
                    I'm always excited to discuss new projects, innovative ideas, or potential collaborations.
                    Whether you have a question or just want to say hi, feel free to reach out!
                </p>
                <div id="form-message" class="hidden mb-6 p-4 rounded-md shadow-md"></div>
                <form id="contactForm" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" required class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${newTheme.primaryRing} focus:${newTheme.secondaryButtonBorder} sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g., Jane Doe">
                        <p class="error-message mt-1.5 text-xs text-red-500 dark:text-red-400 hidden"></p>
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" required class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${newTheme.primaryRing} focus:${newTheme.secondaryButtonBorder} sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="you@example.com">
                        <p class="error-message mt-1.5 text-xs text-red-500 dark:text-red-400 hidden"></p>
                    </div>
                    <div>
                        <label for="message" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
                        <textarea name="message" id="message" rows="5" required minlength="10" class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${newTheme.primaryRing} focus:${newTheme.secondaryButtonBorder} sm:text-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="Tell me about your project or inquiry..."></textarea>
                        <p class="error-message mt-1.5 text-xs text-red-500 dark:text-red-400 hidden"></p>
                    </div>
                    <div>${createActionButton('Send Message', '#', null, 'mail', 'w-full py-3.5 text-lg contact-submit-button')}</div>
                </form>
                <div class="mt-10 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
                    <p class="text-gray-700 dark:text-gray-300 text-md mb-3">Alternatively, connect with me on:</p>
                    <div class="flex justify-center space-x-6">
                        <a href="${userData.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="${newTheme.primaryText} ${newTheme.darkPrimaryText} hover:text-sky-500 dark:hover:text-sky-300 transition-colors duration-150 flex items-center group">${getIconSVG('linkedin', 'w-6 h-6 mr-1.5 group-hover:scale-110 transition-transform')} LinkedIn</a>
                        <a href="${userData.contact.github}" target="_blank" rel="noopener noreferrer" class="${newTheme.primaryText} ${newTheme.darkPrimaryText} hover:text-sky-500 dark:hover:text-sky-300 transition-colors duration-150 flex items-center group">${getIconSVG('github', 'w-6 h-6 mr-1.5 group-hover:scale-110 transition-transform')} GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('contactForm');
    const formMessageEl = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            // Clear previous messages
            formMessageEl.classList.add('hidden');
            formMessageEl.textContent = '';
            form.querySelectorAll('.error-message').forEach(el => {
                el.classList.add('hidden');
                el.textContent = '';
            });
            form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('border-red-500'));


            let isValid = true;
            const nameInput = form.querySelector('#name');
            const emailInput = form.querySelector('#email');
            const messageInput = form.querySelector('#message');

            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.classList.add('border-red-500');
                nameInput.parentElement.querySelector('.error-message').textContent = 'Full Name is required.';
                nameInput.parentElement.querySelector('.error-message').classList.remove('hidden');
            }
            if (!emailInput.value.trim()) {
                isValid = false;
                emailInput.classList.add('border-red-500');
                emailInput.parentElement.querySelector('.error-message').textContent = 'Email Address is required.';
                emailInput.parentElement.querySelector('.error-message').classList.remove('hidden');
            } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('border-red-500');
                emailInput.parentElement.querySelector('.error-message').textContent = 'Please enter a valid email address.';
                emailInput.parentElement.querySelector('.error-message').classList.remove('hidden');
            }
            if (!messageInput.value.trim()) {
                isValid = false;
                messageInput.classList.add('border-red-500');
                messageInput.parentElement.querySelector('.error-message').textContent = 'Message is required.';
                messageInput.parentElement.querySelector('.error-message').classList.remove('hidden');
            } else if (messageInput.value.trim().length < 10) {
                isValid = false;
                messageInput.classList.add('border-red-500');
                messageInput.parentElement.querySelector('.error-message').textContent = `Message should be at least 10 characters long.`;
                messageInput.parentElement.querySelector('.error-message').classList.remove('hidden');
            }


            if (isValid) {
                console.log("Form data submitted:", {
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value,
                });
                formMessageEl.innerHTML = `<p class="font-semibold">Message Sent Successfully!</p><p class="text-sm">Thank you for reaching out. I'll get back to you as soon as possible.</p>`;
                formMessageEl.className = 'mb-6 p-4 bg-green-100 dark:bg-green-800 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded-md shadow-md';
                formMessageEl.classList.remove('hidden');
                form.reset();
                setTimeout(() => formMessageEl.classList.add('hidden'), 5000);
            } else {
                formMessageEl.innerHTML = `<p class="font-semibold">Please correct the errors above.</p>`;
                formMessageEl.className = 'mb-6 p-4 bg-red-100 dark:bg-red-800 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded-md shadow-md';
                formMessageEl.classList.remove('hidden');
            }
        });
    }
}


// --- Main App Render Logic ---
function renderApp() {
    renderHeader(); // Always render header as it contains current page indicators

    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
        section.innerHTML = ''; // Clear previous content to avoid stale data if re-rendering
    });

    const activePageSection = document.getElementById(currentPage);
    if (activePageSection) {
        activePageSection.classList.add('active');
        // Call specific render function for the active page
        if (currentPage === 'home') renderHomePageContent();
        else if (currentPage === 'projects') renderProjectsPageContent();
        else if (currentPage === 'project-detail') renderProjectDetailPageContent(activeParam);
        else if (currentPage === 'blog') renderBlogPageContent();
        else if (currentPage === 'blog-detail') renderBlogDetailPageContent(activeParam);
        else if (currentPage === 'contact') renderContactPageContent();
    } else {
        // Fallback to home if current page not found
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
            renderHomePageContent();
        }
    }

    if (!isInitialLoaded) {
        renderFooter();
        isInitialLoaded = true;
    }
}

// --- Initial Load and App Initialization ---
async function initializeApp() {
    // `isDarkMode` is already initially set to true globally based on the HTML class.
    // Now we check localStorage to see if the user has a different saved preference.

    const storedDarkMode = localStorage.getItem('darkMode');

    if (storedDarkMode === 'false') {
        // User explicitly chose light mode on a previous visit.
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
    } else if (storedDarkMode === 'true') {
        // User explicitly chose dark mode, or it was set by a previous default.
        // The HTML class is already 'dark', and isDarkMode is already 'true'.
        // We just ensure consistency here.
        isDarkMode = true;
        if (!document.documentElement.classList.contains('dark')) {
             document.documentElement.classList.add('dark'); // Should already be there
        }
    } else {
        // No preference stored in localStorage (e.g., first visit).
        // The page loaded with dark mode by default from HTML's class="dark".
        // So, isDarkMode is already true from the global initialization.
        // We now "save" this default choice to localStorage so it persists.
        localStorage.setItem('darkMode', 'true');
        // isDarkMode remains true.
    }

    // Show a loading indicator if desired (this part remains the same)
    const mainElement = document.querySelector('main');
    const originalMainContent = `
        <section id="home" class="page-section"></section>
        <section id="projects" class="page-section"></section>
        <section id="project-detail" class="page-section"></section>
        <section id="blog" class="page-section"></section>
        <section id="blog-detail" class="page-section"></section>
        <section id="contact" class="page-section"></section>
    `;
    if (mainElement) mainElement.innerHTML = '<div class="text-center py-20 text-gray-500 dark:text-gray-400">Loading portfolio data...</div>';


    await Promise.all([loadAllProjects(), loadAllBlogPosts()]);

    if (mainElement) mainElement.innerHTML = originalMainContent; // Restore sections

    renderApp(); // Initial render after data is loaded and dark mode is set

    // Listen for changes in system color scheme (this part remains the same)
    // This listener will now primarily affect users who clear their localStorage,
    // as the default dark mode or their toggled choice will usually take precedence.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const storedPreference = localStorage.getItem('darkMode');
        // Only react to system changes if the user hasn't made an explicit choice on the site yet.
        // Given our new default logic, 'darkMode' will be set in localStorage after the first load.
        if (storedPreference === null) { 
            const newColorSchemeIsDark = event.matches;
            isDarkMode = newColorSchemeIsDark; // Update global state
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            // If you also want this system-driven change to "stick" until manual toggle:
            // localStorage.setItem('darkMode', isDarkMode.toString());
            renderApp(); // Re-render relevant parts
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);