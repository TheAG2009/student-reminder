// Check if user is already registered
window.onload = () => {
    const user = JSON.parse(localStorage.getItem('student_user'));
    if (user) showDashboard(user);
};

// Handle Registration
document.getElementById('reg-form').onsubmit = (e) => {
    e.preventDefault();
    const user = {
        name: document.getElementById('name').value,
        college: document.getElementById('college').value,
        id: 'SR-' + Math.floor(Math.random() * 9000)
    };
    localStorage.setItem('student_user', JSON.stringify(user));
    showDashboard(user);
};

function showDashboard(user) {
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Hi, ${user.name}`;
    document.getElementById('student-id-tag').innerText = `ID: ${user.id}`;
    renderTasks();
}

// Simple Task Management
function addTask() {
    const title = document.getElementById('task-title').value;
    const time = document.getElementById('task-time').value;
    const tasks = JSON.parse(localStorage.getItem('student_tasks')) || [];
    
    tasks.push({ title, time });
    localStorage.setItem('student_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    const tasks = JSON.parse(localStorage.getItem('student_tasks')) || [];
    list.innerHTML = tasks.map(t => `
        <div class="task-item">
            <strong>${t.title}</strong><br>
            <small>${new Date(t.time).toLocaleString()}</small>
        </div>
    `).join('');
}
