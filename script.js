// Database Mockup
const DB = {
    saveUser: (user) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    setSession: (user) => localStorage.setItem('session', JSON.stringify(user)),
    getSession: () => JSON.parse(localStorage.getItem('session')),
    logout: () => localStorage.removeItem('session')
};

// Toggle between Login and Register
function toggleAuth(isReg) {
    document.getElementById('login-box').classList.toggle('hidden', isReg);
    document.getElementById('register-box').classList.toggle('hidden', !isReg);
}

// Handle Registration
function handleRegister(e) {
    e.preventDefault();
    const newUser = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        pass: document.getElementById('reg-pass').value,
        college: document.getElementById('reg-college').value,
        id: 'NX-' + Math.floor(1000 + Math.random() * 9000),
        role: 'student'
    };
    DB.saveUser(newUser);
    alert("Profile Created! Please Login.");
    location.reload();
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value;
    const pass = document.getElementById('log-pass').value;

    if(email === "admin@nexus.com" && pass === "admin123") {
        const admin = { name: "Admin", role: "admin" };
        DB.setSession(admin);
        renderAdmin();
        return;
    }

    const user = DB.getUsers().find(u => u.email === email && u.pass === pass);
    if(user) {
        DB.setSession(user);
        renderDash(user);
    } else {
        alert("Wrong credentials!");
    }
}

// Dashboard Rendering
function renderDash(user) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('dash-screen').classList.remove('hidden');
    document.getElementById('user-welcome').innerText = `Hi, ${user.name.split(' ')[0]}`;
    document.getElementById('user-id-tag').innerText = user.id;
    document.getElementById('card-name').innerText = user.name;
    document.getElementById('card-college').innerText = user.college;
}

// Admin Panel Rendering
function renderAdmin() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('hidden');
    const list = document.getElementById('admin-user-list');
    list.innerHTML = DB.getUsers().map(u => `
        <div style="padding:10px; border-bottom:1px solid #333">
            <strong>${u.name}</strong> - ${u.id}<br><small>${u.email}</small>
        </div>
    `).join('');
}

function logout() { DB.logout(); location.reload(); }

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

// Session Recovery
window.onload = () => {
    const s = DB.getSession();
    if(s) s.role === 'admin' ? renderAdmin() : renderDash(s);
};
