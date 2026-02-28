// ===================================
// تريدات روبلوكس - الجافاسكربت المصحح
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
            console.error('Error loading data:', e);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Saved ${key}:`, data);
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }

    init() {
        console.log('App initialized');
        this.setupEventListeners();
        this.createParticles();
        this.checkAuth();
        
        // إذا كنا في الصفحة الرئيسية
        if (document.getElementById('tradesGrid')) {
            this.renderTrades();
            this.setupFilters();
        }
    }

    createParticles() {
        const containers = document.querySelectorAll('.particles');
        containers.forEach(container => {
            if (!container) return;
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
        console.log('Setting up event listeners');
        
        // نموذج تسجيل الدخول
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Login form found');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        }
        
        // نموذج التسجيل
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            console.log('Register form found');
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Register form submitted');
                this.handleRegister(e);
            });
        }

        // نموذج استرجاع الحساب
        const recoveryForm = document.getElementById('recoveryForm');
        if (recoveryForm) {
            console.log('Recovery form found');
            recoveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Recovery form submitted');
                this.handleRecovery(e);
            });
        }

        // نموذج إضافة تريد
        const tradeForm = document.getElementById('tradeForm');
        if (tradeForm) {
            tradeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTrade(e);
            });
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
            const content = uploadArea.querySelector('.upload-content');
            if (content) content.style.opacity = '0';
        };
        reader.readAsDataURL(file);
    }

    checkAuth() {
        const savedUser = this.loadData('currentUser');
        console.log('Checking auth:', savedUser);
        
        if (savedUser) {
            this.currentUser = savedUser;
            this.updateUI();
        }
    }

    // ===================================
    // تسجيل الدخول
    // ===================================
    handleLogin(e) {
        console.log('Handling login...');
        
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!usernameInput || !passwordInput) {
            console.error('Login inputs not found');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        console.log('Username:', username);
        console.log('Users in storage:', this.users);

        if (!username || !password) {
            this.showNotification('الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
            return;
        }

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log('User found:', user);
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
            console.log('User not found');
            this.showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    }

    // ===================================
    // إنشاء حساب جديد
    // ===================================
    handleRegister(e) {
        console.log('Handling register...');
        
        const usernameInput = document.getElementById('regUsername');
        const emailInput = document.getElementById('regEmail');
        const passwordInput = document.getElementById('regPassword');
        const confirmPasswordInput = document.getElementById('regConfirmPassword');
        
        if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error('Register inputs not found');
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        console.log('Register data:', { username, email });

        // التحقق من البيانات
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('الرجاء ملء جميع الحقول', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        // التحقق من عدم التكرار
        const existingUser = this.users.find(u => u.username === username);
        if (existingUser) {
            this.showNotification('اسم المستخدم موجود بالفعل', 'error');
            return;
        }

        const existingEmail = this.users.find(u => u.email === email);
        if (existingEmail) {
            this.showNotification('البريد الإلكتروني مسجل مسبقاً', 'error');
            return;
        }

        // إنشاء حساب جديد
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        console.log('Creating new user:', newUser);

        // حفظ الحساب
        this.users.push(newUser);
        const saved = this.saveData('users', this.users);
        
        if (saved) {
            this.showNotification('تم إنشاء الحساب بنجاح! 🎉', 'success');
            
            // الانتقال لتسجيل الدخول
            setTimeout(() => {
                showForm('login');
                const loginUsername = document.getElementById('loginUsername');
                if (loginUsername) loginUsername.value = username;
            }, 1500);
        } else {
            this.showNotification('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    // ===================================
    // استرجاع الحساب
    // ===================================
    handleRecovery(e) {
        console.log('Handling recovery...');
        
        const emailInput = document.getElementById('recoveryEmail');
        if (!emailInput) {
            console.error('Recovery email input not found');
            return;
        }

        const email = emailInput.value.trim();
        console.log('Recovery email:', email);

        if (!email) {
            this.showNotification('الرجاء إدخال البريد الإلكتروني', 'error');
            return;
        }

        // البحث عن الحساب
        const user = this.users.find(u => u.email === email);
        
        if (user) {
            // محاكاة إرسال الرابط (في الواقع تحتاج server)
            console.log('User found for recovery:', user);
            this.showNotification(`تم إرسال رابط استرجاع كلمة المرور إلى ${email}`, 'success');
            
            // إعادة تعيين كلمة المرور مؤقتاً (للتجربة)
            setTimeout(() => {
                const newPassword = Math.random().toString(36).slice(-8);
                user.password = newPassword;
                this.saveData('users', this.users);
                
                this.showNotification(`كلمة المرور الجديدة: ${newPassword} (احفظها)`, 'success');
                
                setTimeout(() => {
                    showForm('login');
                }, 3000);
            }, 2000);
        } else {
            console.log('Email not found');
            this.showNotification('لا يوجد حساب مرتبط بهذا البريد الإلكتروني', 'error');
        }
    }

    // ===================================
    // إضافة تريد جديد
    // ===================================
    handleAddTrade(e) {
        e.preventDefault();
        
        if (!this.currentUser) {
            this.showNotification('يجب تسجيل الدخول أولاً', 'error');
            return;
        }

        const itemNameInput = document.getElementById('itemName');
        const tradeItemNameInput = document.getElementById('tradeItemName');
        const tiktokLinkInput = document.getElementById('tiktokLink');
        const itemImage = document.getElementById('previewImage')?.src;
        const tradeImage = document.getElementById('previewTradeImage')?.src;

        if (!itemNameInput || !tradeItemNameInput || !tiktokLinkInput) {
            this.showNotification('خطأ في النموذج', 'error');
            return;
        }

        const itemName = itemNameInput.value.trim();
        const tradeItemName = tradeItemNameInput.value.trim();
        const tiktokLink = tiktokLinkInput.value.trim();

        if (!itemImage || !tradeImage || itemImage === window.location.href) {
            this.showNotification('الرجاء رفع الصورتين', 'error');
            return;
        }

        const newTrade = {
            id: Date.now(),
            userId: this.currentUser.id,
            username: this.currentUser.username,
            itemName: itemName,
            itemImage: itemImage,
            tradeItemName: tradeItemName,
            tradeImage: tradeImage,
            tiktokLink: tiktokLink,
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
            if (content) content.style.opacity = '1';
        });
    }

    // ===================================
    // عرض التريدات
    // ===================================
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
            
            const itemImage = clone.querySelector('.item-image');
            const itemName = clone.querySelector('.item-name');
            const itemOwner = clone.querySelector('.item-owner');
            const wantedImage = clone.querySelector('.wanted-image');
            const wantedName = clone.querySelector('.wanted-name');
            const tiktokBtn = clone.querySelector('.tiktok-btn');
            const tradeTime = clone.querySelector('.trade-time');
            
            if (itemImage) itemImage.src = trade.itemImage;
            if (itemName) itemName.textContent = trade.itemName;
            if (itemOwner) itemOwner.textContent = `بواسطة ${trade.username}`;
            if (wantedImage) wantedImage.src = trade.tradeImage;
            if (wantedName) wantedName.textContent = trade.tradeItemName;
            if (tiktokBtn) tiktokBtn.href = trade.tiktokLink;
            if (tradeTime) tradeTime.textContent = this.getTimeAgo(trade.createdAt);
            
            const card = clone.querySelector('.trade-card');
            if (card) card.style.animationDelay = `${index * 0.1}s`;

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

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

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
        if (!container) {
            alert(message); // fallback
            return;
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slide-in 0.3s ease;
            z-index: 10000;
        `;
        
        notification.textContent = message;

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
    console.log('DOM loaded, starting app...');
    app = new RobloxTradesApp();
});

function showForm(formType) {
    console.log('Showing form:', formType);
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const recoveryBox = document.getElementById('recoveryBox');
    
    if (loginBox) {
        loginBox.classList.add('hidden');
        loginBox.classList.remove('active');
