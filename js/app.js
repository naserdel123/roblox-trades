// ===================================
// تريدات روبلوكس - كود مبسط 100%
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
    
    // إخفاء الكل
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const recoveryBox = document.getElementById('recoveryBox');
    
    if (loginBox) {
        loginBox.style.display = 'none';
        loginBox.classList.remove('active');
    }
    if (registerBox) {
        registerBox.style.display = 'none';
        registerBox.classList.remove('active');
    }
    if (recoveryBox) {
        recoveryBox.style.display = 'none';
        recoveryBox.classList.remove('active');
    }
    
    // إظهار المطلوب
    let target = null;
    if (formType === 'login') target = loginBox;
    if (formType === 'register') target = registerBox;
    if (formType === 'recovery') target = recoveryBox;
    
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
        console.log('تم إظهار:', formType);
    }
}

// تبديل كلمة المرور
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
    console.log('كلمة المرور:', password ? '*****' : 'فارغة');
    console.log('المستخدمون المسجلون:', users);
    
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
    
    console.log('البيانات:', { username, email, password: password ? '*****' : 'فارغة' });
    
    // التحقق
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
    
    // التحقق من عدم التكرار
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
    
    // إنشاء الحساب
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
    
    // الانتقال لتسجيل الدخول
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
        // إنشاء كلمة مرور جديدة عشوائية
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
// إعداد عند تحميل الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== الصفحة جاهزة ===');
    
    // ربط نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('تم العثور على نموذج تسجيل الدخول');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('نموذج تسجيل الدخول غير موجود!');
    }
    
    // ربط نموذج التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('تم العثور على نموذج التسجيل');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.error('نموذج التسجيل غير موجود!');
    }
    
    // ربط نموذج الاسترجاع
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        console.log('تم العثور على نموذج الاسترجاع');
        recoveryForm.addEventListener('submit', handleRecovery);
    } else {
        console.error('نموذج الاسترجاع غير موجود!');
    }
    
    // التأكد من إظهار نموذج تسجيل الدخول أولاً
    showForm('login');
    
    console.log('=== الإعداد اكتمل ===');
});
          
