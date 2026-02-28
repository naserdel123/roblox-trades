// ===================================
// تريدات روبلوكس - الجافاسكربت
// ===================================

console.log('=== التطبيق يشتغل ===');

// بيانات التطبيق
let users = [];
let currentUser = null;
let trades = [];

// تحميل البيانات من LocalStorage
try {
    const savedUsers = localStorage.getItem('users');
    const savedCurrent = localStorage.getItem('currentUser');
    const savedTrades = localStorage.getItem('trades');
    
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedCurrent) currentUser = JSON.parse(savedCurrent);
    if (savedTrades) trades = JSON.parse(savedTrades);
    
    console.log('البيانات المحملة:', { users: users.length, currentUser, trades: trades.length });
} catch (e) {
    console.error('خطأ في تحميل البيانات:', e);
}

// ===================================
// دوال مساعدة
// ===================================

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('تم حفظ المستخدمين:', users);
}

function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function saveTrades() {
    localStorage.setItem('trades', JSON.stringify(trades));
}

function showMessage(msg, type = 'info') {
    console.log(type + ':', msg);
    alert(msg);
}

// ===================================
// تبديل النماذج
// ===================================

function showForm(formType) {
    console.log('تبديل إلى:', formType);
    
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const recoveryBox = document.getElementById('recoveryBox');
    
    if (loginBox) {
        loginBox.style.display = formType === 'login' ? 'block' : 'none';
        loginBox.classList.toggle('active', formType === 'login');
    }
    if (registerBox) {
        registerBox.style.display = formType === 'register' ? 'block' : 'none';
        registerBox.classList.toggle('active', formType === 'register');
    }
    if (recoveryBox) {
        recoveryBox.style.display = formType === 'recovery' ? 'block' : 'none';
        recoveryBox.classList.toggle('active', formType === 'recovery');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// ===================================
// تسجيل الدخول
// ===================================

function handleLogin(e) {
    e.preventDefault();
    console.log('=== تسجيل الدخول ===');
    
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!usernameInput || !passwordInput) {
        console.error('حقول تسجيل الدخول غير موجودة');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    console.log('المستخدم:', username);
    
    if (!username || !password) {
        showMessage('الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log('تم العثور على المستخدم:', user);
        currentUser = user;
        saveCurrentUser();
        showMessage('أهلاً بك، ' + user.username + '! 🎮', 'success');
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } else {
        console.log('المستخدم غير موجود');
        showMessage('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// ===================================
// إنشاء حساب
// ===================================

function handleRegister(e) {
    e.preventDefault();
    console.log('=== إنشاء حساب ===');
    
    const usernameInput = document.getElementById('regUsername');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('regConfirmPassword');
    
    if (!usernameInput || !emailInput || !passwordInput || !confirmInput) {
        console.error('حقول التسجيل غير موجودة');
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    
    console.log('البيانات:', { username, email });

    if (!username || !email || !password || !confirmPassword) {
        showMessage('الرجاء ملء جميع الحقول', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        showMessage('اسم المستخدم موجود بالفعل', 'error');
        return;
    }
    
    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
        showMessage('البريد الإلكتروني مسجل مسبقاً', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    showMessage('تم إنشاء الحساب بنجاح! 🎉', 'success');
    
    setTimeout(() => {
        showForm('login');
        const loginUsername = document.getElementById('loginUsername');
        if (loginUsername) loginUsername.value = username;
    }, 1500);
}

// ===================================
// استرجاع الحساب
// ===================================

function handleRecovery(e) {
    e.preventDefault();
    console.log('=== استرجاع الحساب ===');
    
    const emailInput = document.getElementById('recoveryEmail');
    if (!emailInput) {
        console.error('حقل البريد غير موجود');
        return;
    }
    
    const email = emailInput.value.trim();
    console.log('البريد:', email);
    
    if (!email) {
        showMessage('الرجاء إدخال البريد الإلكتروني', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (user) {
        const newPassword = Math.random().toString(36).substring(2, 10);
        user.password = newPassword;
        saveUsers();
        
        showMessage('تم إرسال رابط استرجاع إلى: ' + email + '\n\nكلمة المرور الجديدة: ' + newPassword + '\n\n(احفظها!)', 'success');
        
        setTimeout(() => {
            showForm('login');
        }, 3000);
    } else {
        showMessage('لا يوجد حساب مرتبط بهذا البريد', 'error');
    }
}

// ===================================
// إضافة تريد
// ===================================

function handleAddTrade(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }

    const itemNameInput = document.getElementById('itemName');
    const tradeItemNameInput = document.getElementById('tradeItemName');
    const tiktokLinkInput = document.getElementById('tiktokLink');
    const itemImageEl = document.getElementById('previewImage');
    const tradeImageEl = document.getElementById('previewTradeImage');

    if (!itemNameInput || !tradeItemNameInput || !tiktokLinkInput) {
        showMessage('خطأ في النموذج', 'error');
        return;
    }

    const itemName = itemNameInput.value.trim();
    const tradeItemName = tradeItemNameInput.value.trim();
    const tiktokLink = tiktokLinkInput.value.trim();
    const itemImage = itemImageEl?.src || '';
    const tradeImage = tradeImageEl?.src || '';

    if (!itemImage || !tradeImage || itemImage === window.location.href) {
        showMessage('الرجاء رفع الصورتين', 'error');
        return;
    }

    const newTrade = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        itemName: itemName,
        itemImage: itemImage,
        tradeItemName: tradeItemName,
        tradeImage: tradeImage,
        tiktokLink: tiktokLink,
        createdAt: new Date().toISOString()
    };

    trades.unshift(newTrade);
    saveTrades();

    showMessage('تم نشر التريد بنجاح! 🚀', 'success');
    closeModal();
    renderTrades();
    
    // إعادة تعيين النموذج
    e.target.reset();
    if (itemImageEl) {
        itemImageEl.src = '';
        itemImageEl.style.display = 'none';
    }
    if (tradeImageEl) {
        tradeImageEl.src = '';
        tradeImageEl.style.display = 'none';
    }
    document.querySelectorAll('.upload-content').forEach(content => {
        if (content) content.style.opacity = '1';
    });
}

// ===================================
// عرض التريدات
// ===================================

function renderTrades(tradesToRender = trades) {
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
        if (itemOwner) itemOwner.textContent = 'بواسطة ' + trade.username;
        if (wantedImage) wantedImage.src = trade.tradeImage;
        if (wantedName) wantedName.textContent = trade.tradeItemName;
        if (tiktokBtn) tiktokBtn.href = trade.tiktokLink;
        if (tradeTime) tradeTime.textContent = getTimeAgo(trade.createdAt);
        
        const card = clone.querySelector('.trade-card');
        if (card) card.style.animationDelay = (index * 0.1) + 's';

        grid.appendChild(clone);
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        'سنة': 31536000,
        'شهر': 2592000,
        'أسبوع': 604800,
        'يوم': 86400,
        'ساعة': 3600,
        'دقيقة': 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return 'منذ ' + interval + ' ' + unit;
        }
    }
    return 'الآن';
}

// ===================================
// إعداد الصفحة الرئيسية
// ===================================

function setupHomePage() {
    console.log('=== إعداد الصفحة الرئيسية ===');
    
    // تحديث واجهة المستخدم
    const userElement = document.getElementById('currentUser');
    const userStatus = document.getElementById('userStatus');
    
    if (userElement) {
        if (currentUser) {
            userElement.textContent = currentUser.username;
            if (userStatus) userStatus.textContent = 'متصل';
        } else {
            userElement.textContent = 'زائر';
            if (userStatus) userStatus.textContent = 'غير مسجل';
        }
    }

    // إظهار زر الزائد فقط للمسجلين
    const fabBtn = document.getElementById('fabBtn');
    if (fabBtn) {
        if (currentUser) {
            fabBtn.style.display = 'flex';
            setTimeout(() => {
                fabBtn.style.opacity = '1';
                fabBtn.style.transform = 'scale(1)';
            }, 100);
        } else {
            fabBtn.style.display = 'none';
        }
    }

    // عرض التريدات
    renderTrades();

    // إعداد الفلاتر
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            let filtered = [...trades];
            if (btn.dataset.filter === 'recent') {
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            renderTrades(filtered);
        });
    });

    // إعداد مناطق الرفع
    setupUploadAreas();
}

// ===================================
// النافذة المنبثقة
// ===================================

function openModal() {
    console.log('فتح النافذة');
    const modal = document.getElementById('addTradeModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    console.log('إغلاق النافذة');
    const modal = document.getElementById('addTradeModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// تسجيل الخروج
// ===================================

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===================================
// إعداد عند تحميل الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== الصفحة جاهزة ===');
    console.log('المسار الحالي:', window.location.pathname);
    
    // ربط نماذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('تم العثور على نموذج تسجيل الدخول');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // ربط نموذج التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('تم العثور على نموذج التسجيل');
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // ربط نموذج الاسترجاع
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        console.log('تم العثور على نموذج الاسترجاع');
        recoveryForm.addEventListener('submit', handleRecovery);
    }
    
    // ربط نموذج إضافة تريد
    const tradeForm = document.getElementById('tradeForm');
    if (tradeForm) {
        console.log('تم العثور على نموذج إضافة تريد');
        tradeForm.addEventListener('submit', handleAddTrade);
    }
    
    // إذا كنا في الصفحة الرئيسية
    if (document.getElementById('tradesGrid')) {
        console.log('نحن في الصفحة الرئيسية');
        setupHomePage();
    } else {
        // نحن في صفحة تسجيل الدخول
        console.log('نحن في صفحة تسجيل الدخول');
        showForm('login');
    }
    
    console.log('=== الإعداد اكتمل ===');
});

// إغلاق النافذة عند النقر خارجها
document.addEventListener('click', (e) => {
    const modal = document.getElementById('addTradeModal');
    if (e.target === modal) {
        closeModal();
    }
});
      
