// ==========================================
// STUDENT ACTIVITY MANAGEMENT SYSTEM
// Main JavaScript
// ==========================================

const API_URL = "http://127.0.0.1:5000";

let currentStudent =
    JSON.parse(localStorage.getItem("currentStudent"));

let activityChart = null;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (!currentStudent) {
        window.location.href = "login.html";
        return;
    }

    loadStudentProfile();
    setupNavigation();
    setupMobileMenu();
    setupLogout();
    setupQuickQuestions();
    setupActivitySearch();
    setupNovaChat();

    loadDashboard();
    loadActivities();
    loadUpcomingActivities();
    loadRegistrations();
    loadCertificates();
    loadAchievements();
    loadParticipation();
    loadAnalytics();

});


// ==========================================
// STUDENT PROFILE
// ==========================================

function loadStudentProfile() {

    if (!currentStudent) return;

    const name = currentStudent.name || "Student";
    const department = currentStudent.department || "Department";
    const year = currentStudent.year || "";

    const initials = name
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();


    // Top profile

    const profileInitials =
        document.getElementById("profileInitials");

    const profileName =
        document.getElementById("profileName");

    const profileDepartment =
        document.getElementById("profileDepartment");

    const welcomeName =
        document.getElementById("welcomeName");


    if (profileInitials) {
        profileInitials.textContent = initials;
    }

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileDepartment) {
        profileDepartment.textContent =
            `${department} • Year ${year}`;
    }

    if (welcomeName) {
        welcomeName.textContent =
            name.split(" ")[0];
    }


    // Settings

    const settingsInitials =
        document.getElementById("settingsInitials");

    const settingsName =
        document.getElementById("settingsName");

    const settingsFullName =
        document.getElementById("settingsFullName");

    const settingsEmail =
        document.getElementById("settingsEmail");

    const settingsDept =
        document.getElementById("settingsDept");

    const settingsYear =
        document.getElementById("settingsYear");

    const settingsDepartment =
        document.getElementById("settingsDepartment");


    if (settingsInitials) {
        settingsInitials.textContent = initials;
    }

    if (settingsName) {
        settingsName.textContent = name;
    }

    if (settingsFullName) {
        settingsFullName.textContent = name;
    }

    if (settingsEmail) {
        settingsEmail.textContent =
            currentStudent.email || "-";
    }

    if (settingsDept) {
        settingsDept.textContent =
            department;
    }

    if (settingsYear) {
        settingsYear.textContent =
            year ? `Year ${year}` : "-";
    }

    if (settingsDepartment) {
        settingsDepartment.textContent =
            `${department} • Year ${year}`;
    }

}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");

    const sections =
        document.querySelectorAll(".page-section");

    navItems.forEach(item => {

        item.addEventListener("click", function () {

            const targetId =
                this.getAttribute("data-section");

            if (!targetId) return;


            // Active button

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            this.classList.add("active");


            // Sections

            sections.forEach(section => {
                section.classList.remove("active");
            });

            const targetSection =
                document.getElementById(targetId);

            if (targetSection) {
                targetSection.classList.add("active");
            }


            // Page title

            const pageTitle =
                document.getElementById("pageTitle");

            const titles = {
                dashboard: "Dashboard",
                activities: "Activities",
                registrations: "My Registrations",
                certificates: "Certificates",
                achievements: "Achievements",
                analytics: "Analytics",
                settings: "Settings",
                nova: "NOVA AI Assistant"
            };

            if (pageTitle) {
                pageTitle.textContent =
                    titles[targetId] || "Dashboard";
            }


            // Close mobile sidebar

            const sidebar =
                document.getElementById("sidebar");

            if (sidebar) {
                sidebar.classList.remove("mobile-open");
            }

        });

    });


    // "View All" buttons

    document.querySelectorAll("[data-section]").forEach(button => {

        if (button.classList.contains("nav-item")) return;

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-section");

            const targetNav =
                document.querySelector(
                    `.nav-item[data-section="${targetId}"]`
                );

            if (targetNav) {
                targetNav.click();
            }

        });

    });

}


// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenu");

    const sidebar =
        document.getElementById("sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("mobile-open");

    });

}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("currentStudent");

        window.location.href = "login.html";

    });

}


// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

    if (!currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/dashboard/${currentStudent.student_id}`
            );

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                "Dashboard error:",
                data.message
            );

            return;
        }


        // IMPORTANT:
        // These IDs match index.html

        updateElement(
            "statRegistrations",
            data.registrations || 0
        );

        updateElement(
            "statCertificates",
            data.certificates || 0
        );

        updateElement(
            "statAchievements",
            data.achievements || 0
        );

        updateElement(
            "statParticipation",
            data.participation || 0
        );


        // Analytics

        updateElement(
            "analyticsActivities",
            data.registrations || 0
        );

        updateElement(
            "analyticsCertificates",
            data.certificates || 0
        );

        updateElement(
            "analyticsAchievements",
            data.achievements || 0
        );


        updateProgress(
            "activityProgress",
            data.registrations || 0
        );

        updateProgress(
            "certificateProgress",
            data.certificates || 0
        );

        updateProgress(
            "achievementProgress",
            data.achievements || 0
        );


        loadAnalyticsChart(data);

    }
    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ==========================================
// LOAD ACTIVITIES
// ==========================================

async function loadActivities() {

    const container =
        document.getElementById("activitiesContainer");

    if (!container) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/activities`
            );

        const activities =
            await response.json();

        if (!response.ok) {

            container.innerHTML =
                `<div class="empty-state">
                    Unable to load activities.
                </div>`;

            return;
        }


        if (!Array.isArray(activities) ||
            activities.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    No activities available.
                </div>`;

            return;
        }


        container.innerHTML = "";


        activities.forEach(activity => {

            container.innerHTML +=
                createActivityCard(activity);

        });


        attachRegisterButtons();

    }
    catch (error) {

        console.error(
            "Activities Error:",
            error
        );

        container.innerHTML =
            `<div class="empty-state">
                Unable to connect to server.
            </div>`;

    }

}


// ==========================================
// ACTIVITY CARD
// ==========================================

function createActivityCard(activity) {

    return `

        <div class="event-card">

            <div class="event-image">

                ${getActivityIcon(activity.category)}

            </div>

            <div class="event-content">

                <span class="blue-tag">
                    ${escapeHTML(
                        activity.category || "Activity"
                    )}
                </span>

                <h3>
                    ${escapeHTML(
                        activity.activity_name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        activity.description ||
                        "No description available."
                    )}
                </p>

                <div class="event-meta">

                    <span>
                        📅
                        ${formatDate(
                            activity.activity_date
                        )}
                    </span>

                    <span>
                        📍
                        ${escapeHTML(
                            activity.venue || "TBA"
                        )}
                    </span>

                    <span>
                        👥
                        Capacity:
                        ${activity.capacity || "N/A"}
                    </span>

                </div>

                <button
                    class="primary-btn register-btn"
                    data-activity-id="${activity.activity_id}"
                    style="margin-top:0;"
                >
                    Register
                </button>

            </div>

        </div>

    `;

}


// ==========================================
// ACTIVITY ICON
// ==========================================

function getActivityIcon(category) {

    const value =
        String(category || "").toLowerCase();

    if (value.includes("ai") ||
        value.includes("machine")) {
        return "🤖";
    }

    if (value.includes("web")) {
        return "💻";
    }

    if (value.includes("hack")) {
        return "🚀";
    }

    if (value.includes("sport")) {
        return "🏆";
    }

    if (value.includes("cultur")) {
        return "🎭";
    }

    return "🎓";

}


// ==========================================
// REGISTER BUTTONS
// ==========================================

function attachRegisterButtons() {

    const buttons =
        document.querySelectorAll(".register-btn");

    buttons.forEach(button => {

        button.addEventListener("click", async () => {

            const activityId =
                button.getAttribute(
                    "data-activity-id"
                );

            await registerForActivity(
                activityId,
                button
            );

        });

    });

}


// ==========================================
// REGISTER FOR ACTIVITY
// ==========================================

async function registerForActivity(
    activityId,
    button
) {

    if (!currentStudent) return;

    button.disabled = true;
    button.textContent = "Registering...";

    try {

        const response =
            await fetch(
                `${API_URL}/api/register-activity`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        student_id:
                            currentStudent.student_id,

                        activity_id:
                            activityId
                    })
                }
            );

        const data =
            await response.json();


        if (response.ok) {

            button.textContent =
                "Registered";

            button.disabled = true;


            alert(
                data.message ||
                "Successfully registered!"
            );


            // Refresh data

            loadDashboard();
            loadRegistrations();
            loadUpcomingActivities();

        }
        else {

            alert(
                data.message ||
                "Registration failed."
            );

            button.disabled = false;
            button.textContent = "Register";

        }

    }
    catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

        button.disabled = false;
        button.textContent = "Register";

    }

}


// ==========================================
// UPCOMING ACTIVITIES
// ==========================================

async function loadUpcomingActivities() {

    const container =
        document.getElementById(
            "upcomingActivities"
        );

    if (!container) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/activities`
            );

        const activities =
            await response.json();

        if (!response.ok) return;


        const today = new Date();

        const upcoming =
            activities
                .filter(activity => {

                    const date =
                        new Date(
                            activity.activity_date
                        );

                    return date >= today;

                })
                .sort((a, b) => {

                    return new Date(
                        a.activity_date
                    ) -
                    new Date(
                        b.activity_date
                    );

                })
                .slice(0, 3);


        if (upcoming.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    No upcoming activities.
                </div>`;

            return;
        }


        container.innerHTML = "";


        upcoming.forEach(activity => {

            const date =
                new Date(
                    activity.activity_date
                );

            const day =
                date.getDate();

            const month =
                date.toLocaleDateString(
                    "en-IN",
                    { month: "short" }
                );


            container.innerHTML += `

                <div class="activity-item">

                    <div class="date-box">

                        <strong>${day}</strong>

                        <span>
                            ${month.toUpperCase()}
                        </span>

                    </div>

                    <div class="activity-details">

                        <h4>
                            ${escapeHTML(
                                activity.activity_name
                            )}
                        </h4>

                        <p>
                            📍
                            ${escapeHTML(
                                activity.venue || "TBA"
                            )}
                        </p>

                    </div>

                    <span class="blue-tag">
                        ${escapeHTML(
                            activity.category ||
                            "Activity"
                        )}
                    </span>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Upcoming Activities Error:",
            error
        );

    }

}


// ==========================================
// REGISTRATIONS
// ==========================================

async function loadRegistrations() {

    const table =
        document.getElementById(
            "registrationsTable"
        );

    if (!table || !currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/registrations/${currentStudent.student_id}`
            );

        const registrations =
            await response.json();


        if (!response.ok) {

            table.innerHTML =
                `<tr>
                    <td colspan="4"
                        class="empty-table">
                        Unable to load registrations.
                    </td>
                </tr>`;

            return;
        }


        if (!Array.isArray(registrations) ||
            registrations.length === 0) {

            table.innerHTML =
                `<tr>
                    <td colspan="4"
                        class="empty-table">
                        No registrations found.
                    </td>
                </tr>`;

            return;
        }


        table.innerHTML =
            registrations.map(reg => `

                <tr>

                    <td>
                        ${escapeHTML(
                            reg.activity_name
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            reg.activity_date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            reg.venue || "TBA"
                        )}
                    </td>

                    <td>
                        <span class="status registered">
                            ${escapeHTML(
                                reg.status ||
                                "Registered"
                            )}
                        </span>
                    </td>

                </tr>

            `).join("");

    }
    catch (error) {

        console.error(
            "Registrations Error:",
            error
        );

        table.innerHTML =
            `<tr>
                <td colspan="4"
                    class="empty-table">
                    Unable to connect to server.
                </td>
            </tr>`;

    }

}


// ==========================================
// CERTIFICATES
// ==========================================

async function loadCertificates() {

    const container =
        document.getElementById(
            "certificatesContainer"
        );

    if (!container || !currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/certificates/${currentStudent.student_id}`
            );

        const certificates =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<div class="empty-state">
                    Unable to load certificates.
                </div>`;

            return;
        }


        if (!Array.isArray(certificates) ||
            certificates.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    No certificates available.
                </div>`;

            return;
        }


        container.innerHTML = "";


        certificates.forEach(certificate => {

            container.innerHTML += `

                <div class="certificate-card">

                    <div class="certificate-icon">
                        🏆
                    </div>

                    <h3>
                        ${escapeHTML(
                            certificate.certificate_name
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            certificate.activity_name ||
                            ""
                        )}
                    </p>

                    <small>
                        Issued:
                        ${formatDate(
                            certificate.issue_date
                        )}
                    </small>

                    ${
                        certificate.certificate_url
                        ? `
                            <br><br>

                            <a
                                href="${escapeHTML(
                                    certificate.certificate_url
                                )}"
                                target="_blank"
                                class="secondary-btn"
                            >
                                View Certificate
                            </a>
                        `
                        : ""
                    }

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Certificates Error:",
            error
        );

    }

}


// ==========================================
// ACHIEVEMENTS
// ==========================================

async function loadAchievements() {

    const container =
        document.getElementById(
            "achievementsContainer"
        );

    if (!container || !currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/achievements/${currentStudent.student_id}`
            );

        const achievements =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<div class="empty-state">
                    Unable to load achievements.
                </div>`;

            return;
        }


        if (!Array.isArray(achievements) ||
            achievements.length === 0) {

            container.innerHTML =
                `<div class="empty-state">
                    No achievements yet.
                </div>`;

            return;
        }


        container.innerHTML = "";


        achievements.forEach(achievement => {

            container.innerHTML += `

                <div class="achievement-card">

                    <div class="achievement-icon">
                        ⭐
                    </div>

                    <h3>
                        ${escapeHTML(
                            achievement.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            achievement.description ||
                            ""
                        )}
                    </p>

                    <span>
                        ${formatDate(
                            achievement.achievement_date
                        )}
                    </span>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Achievements Error:",
            error
        );

    }

}


// ==========================================
// PARTICIPATION
// ==========================================

async function loadParticipation() {

    if (!currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/participation/${currentStudent.student_id}`
            );

        const participation =
            await response.json();


        if (!response.ok) return;


        // Recent activity

        const recent =
            document.getElementById(
                "recentActivity"
            );

        if (recent) {

            if (
                !Array.isArray(participation) ||
                participation.length === 0
            ) {

                recent.innerHTML =
                    `<div class="empty-state">
                        No participation records yet.
                    </div>`;

            }
            else {

                recent.innerHTML =
                    participation
                        .slice(0, 5)
                        .map(item => `

                            <div class="recent-item">

                                <div class="recent-icon green">
                                    ✓
                                </div>

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            item.activity_name
                                        )}
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            item.attendance_status ||
                                            "Participation recorded"
                                        )}
                                    </p>

                                </div>

                                <span>
                                    ${formatDate(
                                        item.activity_date
                                    )}
                                </span>

                            </div>

                        `)
                        .join("");

            }

        }

    }
    catch (error) {

        console.error(
            "Participation Error:",
            error
        );

    }

}


// ==========================================
// ANALYTICS
// ==========================================

async function loadAnalytics() {

    if (!currentStudent) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/dashboard/${currentStudent.student_id}`
            );

        const data =
            await response.json();

        if (!response.ok) return;

        updateElement(
            "analyticsActivities",
            data.registrations || 0
        );

        updateElement(
            "analyticsCertificates",
            data.certificates || 0
        );

        updateElement(
            "analyticsAchievements",
            data.achievements || 0
        );

        updateProgress(
            "activityProgress",
            data.registrations || 0
        );

        updateProgress(
            "certificateProgress",
            data.certificates || 0
        );

        updateProgress(
            "achievementProgress",
            data.achievements || 0
        );

        loadAnalyticsChart(data);

    }
    catch (error) {

        console.error(
            "Analytics Error:",
            error
        );

    }

}


// ==========================================
// ANALYTICS CHART
// ==========================================

function loadAnalyticsChart(data) {

    const canvas =
        document.getElementById(
            "activityChart"
        );

    if (!canvas ||
        typeof Chart === "undefined") {
        return;
    }


    if (activityChart) {
        activityChart.destroy();
    }


    activityChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Registrations",
                    "Participation",
                    "Certificates",
                    "Achievements"
                ],

                datasets: [{

                    data: [
                        data.registrations || 0,
                        data.participation || 0,
                        data.certificates || 0,
                        data.achievements || 0
                    ],

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });

}


// ==========================================
// PROGRESS BARS
// ==========================================

function updateProgress(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    // Simple visual scale.
    // Maximum display value = 10.

    const percentage =
        Math.min(
            100,
            (Number(value) / 10) * 100
        );

    element.style.width =
        `${percentage}%`;

}


// ==========================================
// ACTIVITY SEARCH
// ==========================================

function setupActivitySearch() {

    const search =
        document.getElementById(
            "activitySearch"
        );

    if (!search) return;

    search.addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .toLowerCase()
                    .trim();

            const cards =
                document.querySelectorAll(
                    "#activitiesContainer .event-card"
                );


            cards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    text.includes(query)
                    ? ""
                    : "none";

            });

        }
    );

}


// ==========================================
// NOVA QUICK QUESTIONS
// ==========================================

function setupQuickQuestions() {

    const buttons =
        document.querySelectorAll(
            ".quick-question"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.getAttribute(
                        "data-question"
                    );

                if (question) {
                    openNovaWithMessage(question);
                }

            }
        );

    });

}

// ==========================================
// NOVA CHAT
// ==========================================

function setupNovaChat() {

    const input =
        document.getElementById("chatInput");

    const sendButton =
        document.getElementById("sendMessage");

    const messages =
        document.getElementById("chatMessages");

    if (!input || !sendButton || !messages) {
        return;
    }

    sendButton.addEventListener("click", () => {
        sendNovaMessage(input, messages);
    });

    input.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendNovaMessage(input, messages);
        }
    });

}


// ==========================================
// OPEN NOVA
// ==========================================

function openNovaWithMessage(message) {

    const novaNav =
        document.querySelector(
            '.nav-item[data-section="nova"]'
        );

    if (novaNav) {
        novaNav.click();
    }
    else {

        const sections =
            document.querySelectorAll(".page-section");

        sections.forEach(section => {
            section.classList.remove("active");
        });

        const novaSection =
            document.getElementById("nova");

        if (novaSection) {
            novaSection.classList.add("active");
        }

    }

    const input =
        document.getElementById("chatInput");

    const messages =
        document.getElementById("chatMessages");

    if (!input || !messages) return;

    input.value = message;

    sendNovaMessage(input, messages);

}


// ==========================================
// SEND NOVA MESSAGE
// ==========================================

async function sendNovaMessage(input, messages) {

    const message = input.value.trim();

    if (!message) return;

    messages.innerHTML += `
        <div class="chat-message user">
            <div class="chat-bubble">
                ${escapeHTML(message)}
            </div>
        </div>
    `;

    input.value = "";
    input.disabled = true;

    const sendButton =
        document.getElementById("sendMessage");

    if (sendButton) {
        sendButton.disabled = true;
    }

    scrollNovaToBottom(messages);

    const typingId =
        "novaTyping_" + Date.now();

    messages.innerHTML += `
        <div class="chat-message nova-typing-message" id="${typingId}">
            <div class="chat-bubble nova-typing">
                <span>NOVA is typing</span>
                <span class="typing-dots">
                    <i></i><i></i><i></i>
                </span>
            </div>
        </div>
    `;

    scrollNovaToBottom(messages);

    try {

        await new Promise(resolve =>
            setTimeout(resolve, 650)
        );

        const response =
            await novaResponse(message);

        const typingElement =
            document.getElementById(typingId);

        if (typingElement) {
            typingElement.remove();
        }

        messages.innerHTML += `
            <div class="chat-message">
                <div class="chat-bubble">
                    ${response}
                </div>
            </div>
        `;

    }
    catch (error) {

        console.error("NOVA Error:", error);

        const typingElement =
            document.getElementById(typingId);

        if (typingElement) {
            typingElement.remove();
        }

        messages.innerHTML += `
            <div class="chat-message">
                <div class="chat-bubble">
                    Sorry, I couldn't load your information right now.
                    Please try again.
                </div>
            </div>
        `;

    }

    input.disabled = false;

    if (sendButton) {
        sendButton.disabled = false;
    }

    input.focus();

    scrollNovaToBottom(messages);

}


// ==========================================
// NOVA DATABASE HELPERS
// ==========================================

async function novaFetch(endpoint) {

    const response =
        await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error("NOVA request failed");
    }

    return await response.json();

}


function scrollNovaToBottom(messages) {

    if (!messages) return;

    messages.scrollTop =
        messages.scrollHeight;

}


// ==========================================
// NOVA RESPONSE
// ==========================================

async function novaResponse(message) {

    const text =
        message.toLowerCase().trim();

    const firstName =
        currentStudent &&
        currentStudent.name
            ? currentStudent.name.split(" ")[0]
            : "there";


    // GREETING

    if (
        text === "hi" ||
        text === "hello" ||
        text === "hey" ||
        text.includes("good morning") ||
        text.includes("good afternoon") ||
        text.includes("good evening")
    ) {

        return `
            Hello ${escapeHTML(firstName)}! 👋<br>
            I'm NOVA, your Student Activity Assistant.<br>
            I can help you with your activities,
            registrations, certificates, achievements
            and participation.
        `;

    }


    // MY ACTIVITIES / REGISTRATIONS

    if (
        text.includes("my activities") ||
        text.includes("my activity") ||
        text.includes("my registration") ||
        text.includes("my registrations") ||
        text.includes("what did i register") ||
        text.includes("what have i registered")
    ) {

        const registrations =
            await novaFetch(
                `/api/registrations/${currentStudent.student_id}`
            );

        if (
            !Array.isArray(registrations) ||
            registrations.length === 0
        ) {

            return `
                You haven't registered for any activities yet.<br><br>
                You can explore available activities
                and register from the <b>Activities</b> section.
            `;

        }

        const list =
            registrations
                .slice(0, 5)
                .map(reg =>
                    `<li>${escapeHTML(reg.activity_name)}</li>`
                )
                .join("");

        return `
            You have registered for
            <b>${registrations.length}</b> activity${registrations.length === 1 ? "" : "ies"}.<br><br>
            <ul>${list}</ul>
            You can see the complete list in
            <b>My Registrations</b>.
        `;

    }


    // UPCOMING EVENTS

    if (
        text.includes("upcoming") ||
        text.includes("upcoming event") ||
        text.includes("upcoming events") ||
        text.includes("next event") ||
        text.includes("next activity")
    ) {

        const activities =
            await novaFetch("/api/activities");

        if (!Array.isArray(activities)) {
            return `I couldn't load the upcoming activities right now.`;
        }

        const today = new Date();

        const upcoming =
            activities
                .filter(activity => {
                    const date =
                        new Date(activity.activity_date);

                    return date >= today;
                })
                .sort((a, b) =>
                    new Date(a.activity_date) -
                    new Date(b.activity_date)
                )
                .slice(0, 3);

        if (upcoming.length === 0) {
            return `There are no upcoming activities at the moment.`;
        }

        const list =
            upcoming
                .map(activity => `
                    <li>
                        <b>${escapeHTML(activity.activity_name)}</b>
                        — ${formatDate(activity.activity_date)}
                    </li>
                `)
                .join("");

        return `
            Here are the upcoming activities:<br><br>
            <ul>${list}</ul>
            Open <b>Activities</b> for more details.
        `;

    }


    // CERTIFICATES

    if (
        text.includes("certificate") ||
        text.includes("certificates")
    ) {

        const certificates =
            await novaFetch(
                `/api/certificates/${currentStudent.student_id}`
            );

        if (
            !Array.isArray(certificates) ||
            certificates.length === 0
        ) {

            return `
                You currently have <b>0 certificates</b>.<br><br>
                Certificates will appear here once they are
                added to your student record.
            `;

        }

        const list =
            certificates
                .slice(0, 5)
                .map(certificate =>
                    `<li>${escapeHTML(certificate.certificate_name)}</li>`
                )
                .join("");

        return `
            You have <b>${certificates.length}</b>
            certificate${certificates.length === 1 ? "" : "s"}.<br><br>
            <ul>${list}</ul>
            You can view them in the <b>Certificates</b> section.
        `;

    }


    // ACHIEVEMENTS

    if (
        text.includes("achievement") ||
        text.includes("achievements")
    ) {

        const achievements =
            await novaFetch(
                `/api/achievements/${currentStudent.student_id}`
            );

        if (
            !Array.isArray(achievements) ||
            achievements.length === 0
        ) {

            return `
                You currently have <b>0 achievements</b>.<br><br>
                Your achievements will appear here once
                they are added to your student record.
            `;

        }

        const list =
            achievements
                .slice(0, 5)
                .map(achievement =>
                    `<li>${escapeHTML(achievement.title)}</li>`
                )
                .join("");

        return `
            You have <b>${achievements.length}</b>
            achievement${achievements.length === 1 ? "" : "s"}.<br><br>
            <ul>${list}</ul>
            You can view them in the <b>Achievements</b> section.
        `;

    }


    // PARTICIPATION / ATTENDANCE

    if (
        text.includes("participation") ||
        text.includes("attendance") ||
        text.includes("attended")
    ) {

        const participation =
            await novaFetch(
                `/api/participation/${currentStudent.student_id}`
            );

        if (
            !Array.isArray(participation) ||
            participation.length === 0
        ) {

            return `
                You currently have <b>0 participation records</b>.
                Once your participation is recorded,
                it will appear on your dashboard.
            `;

        }

        const list =
            participation
                .slice(0, 5)
                .map(item => `
                    <li>
                        <b>${escapeHTML(item.activity_name)}</b>
                        — ${escapeHTML(
                            item.attendance_status ||
                            "Participation recorded"
                        )}
                    </li>
                `)
                .join("");

        return `
            You have <b>${participation.length}</b>
            participation record${participation.length === 1 ? "" : "s"}.<br><br>
            <ul>${list}</ul>
        `;

    }


    // GENERAL ACTIVITIES

    if (
        text === "activity" ||
        text === "activities" ||
        text.includes("available activities") ||
        text.includes("college activities") ||
        text.includes("events")
    ) {

        const activities =
            await novaFetch("/api/activities");

        if (
            !Array.isArray(activities) ||
            activities.length === 0
        ) {

            return `There are no activities available right now.`;

        }

        return `
            There are currently
            <b>${activities.length}</b> activities available.<br><br>
            Open the <b>Activities</b> section to explore them
            and register for the ones you like.
        `;

    }


    // REGISTER / JOIN

    if (
        text.includes("register") ||
        text.includes("join") ||
        text.includes("how can i join")
    ) {

        return `
            To join an activity, open the
            <b>Activities</b> section and click
            <b>Register</b> on the activity you want.
        `;

    }


    // PROFILE

    if (
        text.includes("profile") ||
        text.includes("my details") ||
        text.includes("my information")
    ) {

        return `
            You can view your personal information
            in the <b>Settings</b> section.
        `;

    }


    // HELP

    if (
        text.includes("help") ||
        text.includes("what can you do") ||
        text.includes("what do you do")
    ) {

        return `
            I can help you with:<br><br>
            • Your activities<br>
            • Upcoming events<br>
            • Registrations<br>
            • Certificates<br>
            • Achievements<br>
            • Participation & attendance<br>
            • Your student profile
        `;

    }


    // THANK YOU

    if (
        text.includes("thank you") ||
        text.includes("thanks")
    ) {

        return `
            You're welcome, ${escapeHTML(firstName)}! 😊
            I'm always here to help.
        `;

    }


    // DEFAULT

    return `
        I'm here to help with your student activities. 😊<br><br>
        Try asking:
        <b>"My activities"</b>,
        <b>"Upcoming events"</b>,
        <b>"My certificates"</b>,
        <b>"My achievements"</b>
        or <b>"My participation"</b>.
    `;

}
// ==========================================
// UPDATE ELEMENT
// ==========================================

function updateElement(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


// ==========================================
// SECURITY - ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}