/* ==========================================
   SUPABASE CONFIGURATION
   ========================================== */
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; 
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ==========================================
   STATE MANAGEMENT
   ========================================== */
let currentUser = null;
let userRole = 'student'; // 'student' or 'admin'
let tasks = [];

/* ==========================================
   DOM ELEMENTS
   ========================================== */
const screens = {
    splash: document.getElementById('splash-screen'),
    auth: document.getElementById('auth-screen'),
    studentDashboard: document.getElementById('student-dashboard'),
    adminDashboard: document.getElementById('admin-dashboard')
};

/* ==========================================
   INITIALIZATION & SESSION CHECK
   ========================================== */
document.addEventListener('DOMContentLoaded', async () => {
    // Request Notification Permissions
    if ("Notification" in window) {
        Notification.requestPermission();
    }

    // GSAP Splash Animation
    gsap.from(".logo-container", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });

    // Check Session (Simulated for Frontend demo, replace with actual Supabase session logic)
    setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Fallback to localStorage if Supabase keys aren't set yet during development
        const localSession = localStorage.getItem('eduSync_session');

        if (session || localSession) {
            currentUser = JSON.parse(localSession);
            if(currentUser && currentUser.role === 'admin') {
                switchScreen('adminDashboard');
            } else {
                switchScreen('studentDashboard');
                loadStudentData();
            }
        } else {
            switchScreen('auth');
            gsap.from(".auth-container", { scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
        }
    }, 2000);
});

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    Object.values(screens).forEach(screen => screen.classList.remove('active-screen'));
    
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('active-screen');
}

/* ==========================================
   AUTH UI LOGIC (TABS)
   ========================================== */
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        authForms.forEach(form => form.classList.add('hidden'));
        document.getElementById(btn.dataset.target).classList.remove('hidden');
        
        gsap.from(`#${btn.dataset.target}`, { x: -20, opacity: 0, duration: 0.4 });
    });
});

/* ==========================================
   AUTHENTICATION LOGIC (MOCK/SUPABASE)
   ========================================== */
// Student Registration
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const pass = "Default@123"; // In a real app, collect password
    const name = document.getElementById('reg-fullname').value;
    const uid = 'STU' + Math.floor(Math.random() * 90000 + 10000);

    // Mock User Object
    const userObj = { id: uid, email, name, role: 'student', department: document.getElementById('reg-department').value };
    localStorage.setItem('eduSync_session', JSON.stringify(userObj));
    
    /* SUPABASE REAL LOGIC 
    const { data, error } = await supabase.auth.signUp({ email, password: pass });
    if(error) return alert(error.message);
    await supabase.from('students').insert([userObj]);
    */

    currentUser = userObj;
    switchScreen('studentDashboard');
    loadStudentData();
});

// Student Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    // Mock Login
    currentUser = { id: 'STU99887', email, name: 'John Doe', role: 'student', department: 'Computer Science' };
    localStorage.setItem('eduSync_session', JSON.stringify(currentUser));
    switchScreen('studentDashboard');
    loadStudentData();
});

// Admin Login
document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = { role: 'admin' };
    localStorage.setItem('eduSync_session', JSON.stringify(currentUser));
    switchScreen('adminDashboard');
});

// Logout handlers
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('admin-logout-btn').addEventListener('click', logout);

function logout() {
    localStorage.removeItem('eduSync_session');
    supabase.auth.signOut();
    switchScreen('auth');
}

/* ==========================================
   DASHBOARD & ID CARD LOGIC
   ========================================== */
function loadStudentData() {
    if(!currentUser) return;
    
    // Populate Header
    document.getElementById('header-name').innerText = `Hi, ${currentUser.name}`;
    document.getElementById('header-id').innerText = `ID: ${currentUser.id}`;
    
    // Populate ID Card
    document.getElementById('id-name').innerText = currentUser.name;
    document.getElementById('id-uid').innerText = `ID: ${currentUser.id}`;
    document.getElementById('id-course').innerText = currentUser.department || 'General';
    
    // Animate Dashboard entry
    gsap.from(".glass-header", { y: -50, opacity: 0, duration: 0.6 });
    gsap.from(".stat-card", { y: 30, opacity: 0, duration: 0.6, stagger: 0.2 });
    gsap.from(".flip-card", { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.5)" });

    loadTasks();
}

// Flip ID Card
document.getElementById('student-id-card').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

/* ==========================================
   TASK / REMINDER SYSTEM
   ========================================== */
const taskModal = document.getElementById('add-task-modal');
document.getElementById('fab-add-task').addEventListener('click', () => {
    taskModal.classList.remove('hidden');
    gsap.from(".modal-content", { y: 50, opacity: 0, duration: 0.4 });
});

document.querySelector('.close-modal').addEventListener('click', () => {
    taskModal.classList.add('hidden');
});

document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        type: document.getElementById('task-type').value,
        subject: document.getElementById('task-subject').value,
        date: document.getElementById('task-date').value,
        time: document.getElementById('task-time').value
    };

    tasks.push(newTask);
    
    // Schedule Browser Notification
    scheduleNotification(newTask.title, newTask.date, newTask.time);

    taskModal.classList.add('hidden');
    document.getElementById('task-form').reset();
    renderTasks();
});

function loadTasks() {
    // In real app, fetch from Supabase: await supabase.from('tasks').select('*').eq('student_id', currentUser.id)
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    
    document.getElementById('stat-pending').innerText = tasks.length;
    document.getElementById('stat-exams').innerText = tasks.filter(t => t.type === 'Exam').length;

    tasks.forEach((task, index) => {
        const el = document.createElement('div');
        el.className = 'task-card';
        el.innerHTML = `
            <div class="task-info">
                <h4>${task.title}</h4>
                <div class="task-meta">
                    <span class="task-badge">${task.type}</span>
                    <span><i class="fa-regular fa-clock"></i> ${task.date} ${task.time}</span>
                </div>
            </div>
            <button class="icon-btn" onclick="deleteTask(${task.id})"><i class="fa-regular fa-circle-check"></i></button>
        `;
        container.appendChild(el);
        
        // Stagger animation for new tasks
        gsap.from(el, { x: -30, opacity: 0, duration: 0.4, delay: index * 0.1 });
    });
}

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};

/* ==========================================
   BROWSER NOTIFICATIONS
   ========================================== */
function scheduleNotification(title, date, time) {
    if (Notification.permission === "granted") {
        const taskDateTime = new Date(`${date}T${time}`).getTime();
        const now = new Date().getTime();
        const timeToAlert = taskDateTime - now;

        if (timeToAlert > 0) {
            setTimeout(() => {
                new Notification("EduSync Reminder", {
                    body: `Upcoming: ${title}`,
                    icon: "icon-192.png"
                });
            }, timeToAlert);
        }
    }
}

/* ==========================================
   PWA SERVICE WORKER REGISTRATION
   ========================================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Dummy SW registration (requires an actual sw.js file to work fully offline)
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('SW registration skipped or failed for now:', err);
        });
    });
}
