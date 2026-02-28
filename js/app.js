// ===================================
// تريدات روبلوكس - التطبيق الكامل
// ===================================

class RobloxTradesApp {
    constructor() {
        this.currentUser = null;
        this.trades = this.loadData('trades') || [];
        this.users = this.loadData('users') || [];
        this.init();
    }

    // تحميل البيانات من LocalStorage
    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }

    // حفظ البيانات في LocalStorage
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }

    // تهيئة التطبيق
    init() {
        this.setupEventListeners();
        this.createParticles();
        this.createFloatingShapes();
        this.setupTouchEffects();
        this.checkAuth();
        this.renderTrades();
    }

    // إنشاء جسيمات الخلفية
    createParticles() {
        const containers = document.querySelectorAll('.particles');
        containers.forEach(container => {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                
                const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                
                container.appendChild(particle);
            }
        });
    }

    // إنشاء الأشكال العائمة
    createFloatingShapes() {
        const container = document.getElementById('shapes');
        if (!container) return;

        const shapes = ['◆', '○', '△', '□', '✦'];
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.fontSize = (20 + Math.random() * 40) + 'px';
            shape.style.animationDelay = Math.random() * 20 + 's';
            shape.style.animationDuration = (15 + Math.random() * 10) + 's';
            shape.style.color = ['#6366f1', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 3)];
            container.appendChild(shape);
        }
    }

    // تأثيرات اللمس
    setupTouchEffects() {
        const container = document.getElementById('touchEffects');
        if (!container) return;

        document.addEventListener('click', (e) => {
            this.createTouchRipple(e.clientX, e.clientY);
            this.createTouchSparkles(e.clientX, e.clientY);
        });
    }

    createTouchRipple(x, y) {
        const container = document.getElementById('touchEffects');
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = (x - 25) + 'px';
        ripple.style.top = (y - 25) + 'px';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    createTouchSparkles(x, y) {
        const container = document.getElementById('touchEffects');
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'touch-sparkle';
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            sparkle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            sparkle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            container.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }
    }

    // إعداد مستمعي الأحداث
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

        // نموذج التريد
        const tradeForm = document.getElementById('tradeForm');
        if (tradeForm) {
            tradeForm.addEventListener('submit', (e) => this.handleAddTrade(e));
        }

        // مناطق الرفع
        this.setupUploadAreas();

        // أزرار مغناطيسية
        this.setupMagneticButtons();

        // فلترة التريدات
        this.setupFilters();
    }

    // قوة كلمة المرور
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
            strengthBar.querySelector('::after')?.style?.setProperty('width', width + '%');
            
            // تحديث لون الشريط
            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#10b981'];
            strengthBar.style.background = `linear-gradient(90deg, ${colors[strength-1] || '#334155'} ${width}%, #334155 ${width}%)`;
        });
    }

    // أزرار مغناطيسية
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-magnetic');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // فلترة التريدات
    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterTrades(btn.dataset.filter);
            });
        });
    }

    filterTrades(filter) {
        let filtered = [...this.trades];
        
        switch(filter) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                // يمكن إضافة عدد المشاهدات لاحقاً
                filtered.sort((a, b) => b.id - a.id);
                break;
        }
        
        this.renderTrades(filtered);
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
            
            ['dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    if (eventName === 'dragover') uploadArea.classList.add('dragover');
                    else uploadArea.classList.remove('dragover');
                    
                    if (eventName === 'drop' && e.dataTransfer.files.length) {
                        this.handleFileSelect(e.dataTransfer.files[0], previewImg, uploadArea);
                    }
                });
            });

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
            previewImg.classList.add('show');
            uploadArea.querySelector('.upload-content').style.opacity = '0';
            this.showNotification('تم رفع الصورة بنجاح', 'success');
        };
        reader.readAsDataURL(file);
    }

    // التحقق من المصادقة
    checkAuth() {
        const savedUser = this.loadData('currentUser');
        const savedSession = this.loadData('userSession');
        
        if (savedUser && savedSession) {
            // التحقق من صلاحية الجلسة (7 أيام)
            const sessionAge = Date.now() - savedSession.timestamp;
            if (sessionAge < 7 * 24 * 60 * 60 * 1000) {
                this.currentUser = savedUser;
                this.updateUI();
            } else {
                this.logout();
            }
        }

        // التحكم في ظهور زر الزائد
        const fabBtn = document.getElementById('fabBtn');
        if (fabBtn) {
            if (this.currentUser) {
                fabBtn.style.display = 'block';
                setTimeout(() => fabBtn.style.opacity = '1', 100);
            } else {
                fabBtn.style.display = 'none';
            }
        }
    }

    // معالجة تسجيل الدخول
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

            this.showNotification(`أهلاً بعودتك، ${user.username}! 🎮`, 'success');
            
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
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // التحقق من البيانات
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
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveData('users', this.users);
        
        this.showNotification('تم إنشاء الحساب بنجاح! 🎉', 'success');
        
        setTimeout(() => {
            toggleForm('login');
            document.getElementById('loginUsername').value = username;
        }, 1500);
    }

    // معالجة استرجاع الحساب
    handleRecovery(e) {
        e.preventDefault();
        const email = document.getElementById('recoveryEmail').value;
        
        const user = this.users.find(u => u.email === email);
        
        if (user) {
            // محاكاة إرسال رابط (في الواقع تحتاج backend)
            this.showNotification(`تم إرسال رابط التعيين إلى ${email}`, 'success');
            setTimeout(() => {
                toggleForm('login');
            }, 2000);
        } else {
            this.showNotification('لا يوجد حساب مرتبط بهذا البريد', 'error');
        }
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
            userAvatar: this.currentUser.avatar,
            itemName,
            itemImage,
            tradeItemName,
            tradeImage,
            tiktokLink,
            createdAt: new Date().toISOString(),
            views: 0
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
            img.classList.remove('show');
        });
        document.querySelectorAll('.upload-content').forEach(content => {
            content.style.opacity = '1';
        });
    }

    // عرض التريدات
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
            
            // تأثيرات البطاقة
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
        const userStatus = document.getElementById('userStatus');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser.username;
            if (userStatus) userStatus.textContent = 'متصل';
            if (userAvatar) {
                userAvatar.innerHTML = `<img src="${this.currentUser.avatar}" style="width:100%;height:100%;border-radius:50%;">`;
            }
        }

        // إظهار زر الزائد
        const fabBtn = document.getElementById('fabBtn');
        if (fabBtn && this.currentUser) {
            fabBtn.style.display = 'block';
            setTimeout(() => fabBtn.style.opacity = '1', 100);
        }
    }

    // تسجيل الخروج
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }

    // فتح النافذة
    openModal() {
        const modal = document.getElementById('addTradeModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
  
