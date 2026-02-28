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
        this.checkAuth();
        
        // إذا كنا في الصفحة الرئيسية
        if (document.getElementById('tradesGrid')) {
            this.renderTrades();
            this.setupFilters();
            // ❌ لا تفتح النافذة تلقائياً
        }
    }

    createParticles() {
        const containers = document.querySelectorAll('.particles');
        containers.forEach(container => {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                
                const colors = ['#6366f1', '#ec4899', '#f59e0b'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                container.appendChild(particle);
            }
        });
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const recoveryForm = document.getElementById('recoveryForm');
        const tradeForm = document.getElementById('tradeForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (recoveryForm) {
            recoveryForm.addEventListener('submit', (e) => this.handleRecovery(e));
        }

        if (tradeForm) {
            tradeForm.addEventListener('submit', (e) => this.handleAddTrade(e));
        }

        this.setupUploadAreas();
    }

    setupUploadAreas() {
        const setups = [
            { area: 'uploadArea', input: 'itemImage', preview: 'previewImage' },
            { area: 'tradeUploadArea', input: 'tradeImage', preview: 'previewTradeImage' }
        ];

        setups.forEach(({ area, input, preview }) => {
            const uploadArea = document.getElementById(area);
            const fileInput = document.getElementById(input);
            const previewImg = document.getElementById(preview);

            if (!uploadArea || !fileInput) return;

            uploadArea.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handleFileSelect(e.target.files[0], previewImg, uploadArea);
                }
            });
        });
    }

    handleFileSelect(file, previewImg, uploadArea) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('الرجاء اختيار ملف صورة', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            uploadArea.querySelector('.upload-content').style.opacity = '0';
        };
        reader.readAsDataURL(file);
    }

    checkAuth() {
        const savedUser = this.loadData('currentUser');
        
        if (savedUser) {
            this.currentUser = savedUser;
            this.updateUI();
        }
    }

    updateUI() {
        const userElement = document.getElementById('currentUser');
        const userStatus = document.getElementById('userStatus');
        
        if (userElement) {
            if (this.currentUser) {
                userElement.textContent = this.currentUser.username;
                if (userStatus) userStatus.textContent = 'متصل';
            } else {
                userElement.textContent = 'زائر';
                if (userStatus) userStatus.textContent = 'غير مسجل';
            }
        }

        // إظهار زر الزائد فقط للمسجلين
        const fabBtn = document.getElementById('fabBtn');
        if (fabBtn) {
            if (this.currentUser) {
                fabBtn.style.display = 'flex';
                setTimeout(() => {
                    fabBtn.style.opacity = '1';
                    fabBtn.style.transform = 'scale(1)';
                }, 100);
            } else {
                fabBtn.style.display = 'none';
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveData('currentUser', user);
            
            this.showNotification(`أهلاً بك، ${user.username}! 🎮`, 'success');
            
            setTimeout(() => {
                window.location.href = 'home.html';
                // ❌ لا تفتح النافذة تلقائياً هنا
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

    handleAddTrade(e) {
        e.preventDefault();
        
        if (!this.currentUser) {
            this.showNotification('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const itemName = document.getElementById('itemName').value;
        const tradeItemName = document.getElementById('tradeItemName').value;
        const tiktokLink = document.getElementById('tiktokLink').value;
        const itemImage = document.getElementById('previewImage').src;
        const tradeImage = document.getElementById('previewTradeImage').src;

        if (!itemImage || !tradeImage || itemImage === window.location.href) {
            this.showNotification('الرجاء رفع الصورتين', 'error');
            return;
        }

        const newTrade = {
            id: Date.now(),
            userId: this.currentUser.id,
            username: this.currentUser.username,
            itemName,
            itemImage,
            tradeItemName,
            tradeImage,
            tiktokLink,
            createdAt: new Date().toISOString()
        };

        this.trades.unshift(newTrade);
        this.saveData('trades', this.trades);

        this.showNotification('تم نشر التريد بنجاح! 🚀', 'success');
        this.closeModal();
        this.renderTrades();
        
        // إعادة تعيين النموذج
        e.target.reset();
        document.querySelectorAll('.preview-image').forEach(img => {
            img.src = '';
            img.style.display = 'none';
        });
        document.querySelectorAll('.upload-content').forEach(content => {
            content.style.opacity = '1';
        });
    }

    renderTrades(tradesToRender = this.trades) {
        const grid = document.getElementById('tradesGrid');
        const template = document.getElementById('tradeCardTemplate');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) return;

        grid.innerHTML = '';
        
        if (tradesToRender.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }
        
        tradesToRender.forEach((trade, index) => {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.item-image').src = trade.itemImage;
            clone.querySelector('.item-name').textContent = trade.itemName;
            clone.querySelector('.item-owner').textContent = `بواسطة ${trade.username}`;
            clone.querySelector('.wanted-image').src = trade.tradeImage;
            clone.querySelector('.wanted-name').textContent = trade.tradeItemName;
            clone.querySelector('.tiktok-btn').href = trade.tiktokLink;
            
            const timeAgo = this.getTimeAgo(trade.createdAt);
            clone.querySelector('.trade-time').textContent = timeAgo;
            
            const card = clone.querySelector('.trade-card');
            card.style.animationDelay = `${index * 0.1}s`;

            grid.appendChild(clone);
        });
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                let filtered = [...this.trades];
                if (btn.dataset.filter === 'recent') {
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                this.renderTrades(filtered);
            });
        });
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = {
            سنة: 31536000,
            شهر: 2592000,
            أسبوع: 604800,
            يوم: 86400,
            ساعة: 3600,
            دقيقة: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `منذ ${interval} ${unit}`;
            }
        }
        return 'الآن';
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // فتح النافذة يدوياً فقط
    openModal() {
        const modal = document.getElementById('addTradeModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('addTradeModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
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
                <div style="font-weight: 700;">${type === 'success' ? 'نجاح' : 'خطأ' : 'تنبيه'}</div>
                <div style="font-size: 0.9rem;">${message}</div>
            </div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
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

function showForm(formType) {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const recoveryBox = document.getElementById('recoveryBox');
    
    if (loginBox) loginBox.classList.add('hidden');
    if (registerBox) registerBox.classList.add('hidden');
    if (recoveryBox) recoveryBox.classList.add('hidden');
    
    if (formType === 'login' && loginBox) loginBox.classList.remove('hidden');
    if (formType === 'register' && registerBox) registerBox.classList.remove('hidden');
    if (formType === 'recovery' && recoveryBox) recoveryBox.classList.remove('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

// فتح النافذة يدوياً فقط
function openModal() {
    if (app) app.openModal();
}

function closeModal() {
    if (app) app.closeModal();
}

function logout() {
    if (app) app.logout();
}

// إغلاق النافذة عند النقر خارجها
document.addEventListener('click', (e) => {
    const modal = document.getElementById('addTradeModal');
    if (e.target === modal) {
        closeModal();
    }
});
  
