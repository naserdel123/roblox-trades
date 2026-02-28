// ===================================
// تريدات روبلوكس - الجافاسكربت
// ===================================

class RobloxTradesApp {
    constructor() {
        this.currentUser = null;
        this.trades = this.loadData('trades') || [];
        this.users = this.loadData('users') || [];
        this.init();
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.setupTouchEffects();
        this.checkAuth();
    }

    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    setupTouchEffects() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
    }

    createRipple(x, y) {
        const container = document.getElementById('touchEffects');
        if (!container) return;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupEventListeners() {
        // نماذج المصادقة
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            this.setupPasswordStrength();
        }

        if (recoveryForm) {
            recoveryForm.addEventListener('submit', (e) => this.handleRecovery(e));
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('regPassword');
        const strengthBar = document.querySelector('.strength-bar');
        
        if (!passwordInput || !strengthBar) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            let strength = 0;
            
            if (password.length > 5) strength++;
            if (password.length > 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            const width = (strength / 5) * 100;
            strengthBar.style.setProperty('--strength', width + '%');
            strengthBar.querySelector('::before')?.style?.setProperty('width', width + '%');
        });
    }

    checkAuth() {
        const savedUser = this.loadData('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            // إذا كان في الصفحة الرئيسية، حدث الواجهة
            if (document.getElementById('currentUser')) {
                this.updateUI();
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveData('currentUser', user);
            
            if (rememberMe) {
                this.saveData('userSession', {
                    userId: user.id,
                    timestamp: Date.now()
                });
            }

            this.showNotification(`أهلاً بك، ${user.username}! 🎮`, 'success');
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            this.showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }

        if (this.users.find(u => u.username === username)) {
            this.showNotification('اسم المستخدم موجود بالفعل', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showNotification('البريد الإلكتروني مسجل مسبقاً', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveData('users', this.users);
        
        this.showNotification('تم إنشاء الحساب بنجاح! 🎉', 'success');
        
        // الانتقال لتسجيل الدخول بدون تحريك الصفحة
        setTimeout(() => {
            showForm('login');
            document.getElementById('loginUsername').value = username;
        }, 1500);
    }

    handleRecovery(e) {
        e.preventDefault();
        const email = document.getElementById('recoveryEmail').value;
        
        const user = this.users.find(u => u.email === email);
        
        if (user) {
            this.showNotification(`تم إرسال رابط التعيين إلى ${email}`, 'success');
            setTimeout(() => {
                showForm('login');
            }, 2000);
        } else {
            this.showNotification('لا يوجد حساب مرتبط بهذا البريد', 'error');
        }
    }

    updateUI() {
        const userElement = document.getElementById('currentUser');
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser.username;
        }

        // إظهار زر الزائد
        const fabBtn = document.getElementById('fabBtn');
        if (fabBtn && this.currentUser) {
            fabBtn.style.display = 'flex';
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span style="font-size: 1.3rem;">${icons[type]}</span>
            <div>
                <div style="font-weight: 700;">${type === 'success' ? 'نجاح' : type === 'error' ? 'خطأ' : 'تنبيه'}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">${message}</div>
            </div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===================================
// الدوال العامة
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new RobloxTradesApp();
});

// تبديل النماذج - نفس المكان بدون تحريك
function showForm(formType) {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const recoveryBox = document.getElementById('recoveryBox');
    
    // إخفاء الكل
    loginBox?.classList.add('hidden');
    registerBox?.classList.add('hidden');
    recoveryBox?.classList.add('hidden');
    
    // إظهار المطلوب
    if (formType === 'login') loginBox?.classList.remove('hidden');
    if (formType === 'register') registerBox?.classList.remove('hidden');
    if (formType === 'recovery') recoveryBox?.classList.remove('hidden');
}

// تبديل إظهار كلمة المرور
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// تسجيل الخروج
function logout() {
    if (app) app.logout();
}
