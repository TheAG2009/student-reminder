// --- CONFIGURATION ---
// Replace these with your actual Supabase URL/Key. 
// If left empty, the app will run in "Demo Mode".
const SB_URL = ''; 
const SB_KEY = '';

let supabase = null;
if (SB_URL && SB_KEY) {
    supabase = window.supabase.createClient(SB_URL, SB_KEY);
}

// --- APP STATE ---
let user = null;
let tasks = [];

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("EduSync Initialized");
    
    // Auto-remove splash screen after 2.5 seconds regardless of errors
    setTimeout(() => {
        const localUser = localStorage.getItem('edusync_user');
        if (localUser) {
            user = JSON.parse(localUser);
            showScreen('student-dashboard');
            updateUI();
        } else {
            showScreen('auth-screen');
        }
    }, 2500);
});

// --- SCREEN NAVIGATION ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    
    const target = document.getElementById(id);
    target.classList.remove('hidden');
    target.classList.add('active-screen');

    gsap.from(target, { opacity: 0, y: 20, duration: 0.5 });
}

// --- AUTH LOGIC ---
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
        document.getElementById(btn.dataset.target).classList.remove('hidden');
    });
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Demo Login
    user = { name: "Demo Student", id: "STU-8829", dept: "Science" };
    localStorage.setItem('edusync_user', JSON.stringify(user));
    showScreen('student-dashboard');
    updateUI();
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    user = {
        name: document.getElementById('reg-fullname').value,
        id: "STU-" + Math.floor(1000 + Math.random() * 9000),
        dept: document.getElementById('reg-department').value
    };
    localStorage.setItem('edusync_user', JSON.stringify(user));
    showScreen('student-dashboard');
    updateUI();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('edusync_user');
    location.reload();
});

// --- TASK LOGIC ---
document.getElementById('fab-add-task').addEventListener('click', () => {
    document.getElementById('add-task-modal').classList.remove('hidden');
});

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('add-task-modal').classList.add('hidden');
});

document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        type: document.getElementById('task-type').value,
        date: document.getElementById('task-date').value
    };
    tasks.push(newTask);
    renderTasks();
    document.getElementById('add-task-modal').classList.add('hidden');
    document.getElementById('task-form').reset();
});

function renderTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    
    document.getElementById('stat-pending').innerText = tasks.length;
    document.getElementById('stat-exams').innerText = tasks.filter(t => t.type === 'Exam').length;

    tasks.forEach(t => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.innerHTML = `
            <div>
                <strong>${t.title}</strong><br>
                <small>${t.type} • ${t.date}</small>
            </div>
            <i class="fa-solid fa-circle-check" style="color: #38bdf8; cursor:pointer;" onclick="deleteTask(${t.id})"></i>
        `;
        container.appendChild(div);
    });
}

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};

function updateUI() {
    if (!user) return;
    document.getElementById('header-name').innerText = user.name;
    document.getElementById('header-id').innerText = "ID: " + user.id;
    document.getElementById('id-name').innerText = user.name;
    document.getElementById('id-course').innerText = user.dept;
    document.getElementById('id-uid').innerText = "ID: " + user.id;
}

// ID Flip
document.getElementById('student-id-card').addEventListener('click', () => {
    document.getElementById('student-id-card').classList.toggle('flipped');
});
