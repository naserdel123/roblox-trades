// ===================================
// إدارة المستخدمين والتخزين المحلي
// ===================================

class RobloxTradesApp {
    constructor() {
        this.currentUser = null;
        this.trades = JSON.parse(localStorage.getItem('trades')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.createFloatingShapes();
        this.checkAuth();
        this.renderTrades();
    }

    // إنشاء جسيمات الخلفية
    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            
            container.appendChild(particle);
        }
    }

    // إنشاء الأشكال العائمة
    createFloatingShapes() {
        const container = document.getElementById('shapes');
        if (!container) return;

        const shapes = ['◆', '○', '△', '□'];
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.fontSize = (20 + Math.random() * 40) + 'px';
            shape.style.animationDelay = Math.random() * 20 + 's';
            shape.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(shape);
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // نماذج المصادقة
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // نموذج إضافة تريد
        const tradeForm = document.getElementById('tradeForm');
        if (tradeForm) {
            tradeForm.addEventListener('submit', (e) => this.handleAddTrade(e));
        }

        // مناطق الرفع
        this.setupUploadAreas();
    }

    // إعداد مناطق الرفع
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
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length) {
                    this.handleFileSelect(files[0], previewImg, uploadArea);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handleFileSelect(e.target.files[0], previewImg, uploadArea);
                }
            });
        });
    }

    // معالجة اختيار الملف
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
            previewImg.classList.add('show');
            uploadArea.querySelector('.upload-content').style.opacity = '0';
            
            // تأثير نجاح
            uploadArea.style.borderColor = 'var(--success)';
            setTimeout(() => {
                uploadArea.style.borderColor = '';
            }, 1000);
        };
        reader.readAsDataURL(file);
    }

    // التحقق من المصادقة
    checkAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
            
            // إذا كان في صفحة تسجيل الدخول، انتقل للرئيسية
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.href = 'home.html';
            }
        }
    }

    // معالجة تسجيل الدخول
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('تم تسجيل الدخول بنجاح!', 'success');
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            this.showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
            this.shakeElement(document.getElementById('loginBox'));
        }
    }

    // معالجة التسجيل
    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
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

        const newUser = {
            id: Date.now(),
            username,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.showNotification('تم إنشاء الحساب بنجاح!', 'success');
        
        setTimeout(() => {
            toggleForm();
            document.getElementById('loginUsername').value = username;
        }, 1000);
    }

    // معالجة إضافة تريد
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
        localStorage.setItem('trades', JSON.stringify(this.trades));

        this.showNotification('تم نشر التريد بنجاح!', 'success');
        this.closeModal();
        this.renderTrades();
        
        // إعادة تعيين النموذج
        e.target.reset();
        document.querySelectorAll('.preview-image').forEach(img => {
            img.src = '';
            img.classList.remove('show');
        });
        document.querySelectorAll('.upload-content').forEach(content => {
            content.style.opacity = '1';
        });
    }

    // عرض التريدات
    renderTrades() {
        const grid = document.getElementById('tradesGrid');
        const template = document.getElementById('tradeCardTemplate');
        
        if (!grid || !template) return;

        grid.innerHTML = '';
        
        this.trades.forEach((trade, index) => {
            const clone = template.content.cloneNode(true);
            
            // تعبئة البيانات
            clone.querySelector('.item-image').src = trade.itemImage;
            clone.querySelector('.item-name').textContent = trade.itemName;
            clone.querySelector('.wanted-image').src = trade.tradeImage;
            clone.querySelector('.wanted-name').textContent = trade.tradeItemName;
            clone.querySelector('.tiktok-btn').href = trade.tiktokLink;
            
            // الوقت المنشور
            const timeAgo = this.getTimeAgo(trade.createdAt);
            clone.querySelector('.trade-time').textContent = timeAgo;
            
            const card = clone.querySelector('.trade-card');
            card.style.animationDelay = `${index * 0.1}s`;
            
            // تأثير الدخول
            card.addEventListener('mouseenter', () => {
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    card.style.zIndex = '';
                }, 300);
            });

            grid.appendChild(clone);
        });

        if (this.trades.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem;">لا توجد تريدات بعد</h3>
                    <p style="color: rgba(255,255,255,0.6);">كن أول من ينشر تريد!</p>
                </div>
            `;
        }
    }

    // حساب الوقت المنقضي
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

    // تحديث واجهة المستخدم
    updateUI() {
        const userElement = document.getElementById('currentUser');
        if (userElement && this.currentUser) {
            userElement.textContent = `مرحباً، ${this.currentUser.username}`;
        }
    }

    // تسجيل الخروج
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // فتح النافذة
    openModal() {
        const modal = document.getElementById('addTradeModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // تأثير دخول
            setTimeout(() => {
                modal.querySelector('.modal-content').style.transform = 'scale(1) translateY(0)';
            }, 10);
        }
    }

    // إغلاق النافذة
    closeModal() {
        const modal = document.getElementById('addTradeModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // إظهار إشعار
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
            color: white;
            border-radius: 12px;
            font-weight: 700;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // تأثير الاهتزاز
    shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    }
}

// ===================================
// الدوال العامة
// ===================================

let app;

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    app = new RobloxTradesApp();
});

// تبديل النماذج
function toggleForm() {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    
    if (loginBox.classList.contains('active')) {
        loginBox.classList.remove('active');
        setTimeout(() => {
            registerBox.classList.add('active');
        }, 300);
    } else {
        registerBox.classList.remove('active');
        setTimeout(() => {
            loginBox.classList.add('active');
        }, 300);
    }
}

// فتح النافذة
function openModal() {
    if (app) app.openModal();
}

// إغلاق النافذة
function closeModal() {
    if (app) app.closeModal();
}

// تسجيل الخروج
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

// اختصارات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
