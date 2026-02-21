// State Management
let permissions = {
    lokasi: false,
    penyimpanan: false,
    data: false,
    notifikasi: false,
    kamera: false,
    mic: false
};

let userData = {
    isLoggedIn: false,
    email: '',
    phone: '',
    profile: {
        namaLengkap: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alergi: '',
        golonganDarah: '',
        rpd: ''
    },
    monitoring: {},
    keluhan: {},
    pengingatObat: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Show splash screen for 2 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        showPermissionPage();
    }, 2000);
});

// Permission Functions
function showPermissionPage() {
    document.getElementById('permission-page').classList.remove('hidden');
}

function grantPermission(permission) {
    permissions[permission] = true;
    const button = event.target;
    button.textContent = 'Diizinkan';
    button.disabled = true;
    button.style.background = '#4CAF50';
    
    // Check if all permissions granted
    const allGranted = Object.values(permissions).every(value => value === true);
    if (allGranted) {
        document.getElementById('next-to-login').disabled = false;
        showNotification('Semua izin telah diberikan', 'success');
    }
}

function goToLogin() {
    document.getElementById('permission-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

// Login Functions
function showEmailLogin() {
    document.getElementById('login-options').classList.add('hidden');
    document.getElementById('email-login').classList.remove('hidden');
}

function showPhoneLogin() {
    document.getElementById('login-options').classList.add('hidden');
    document.getElementById('phone-login').classList.remove('hidden');
}

function showForgotPassword() {
    document.getElementById('login-options').classList.add('hidden');
    document.getElementById('forgot-password').classList.remove('hidden');
}

function backToLoginOptions() {
    document.getElementById('email-login').classList.add('hidden');
    document.getElementById('phone-login').classList.add('hidden');
    document.getElementById('forgot-password').classList.add('hidden');
    document.getElementById('login-options').classList.remove('hidden');
}

function processLogin(type) {
    if (type === 'email') {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            userData.email = email;
            userData.isLoggedIn = true;
            showNotification('Login berhasil!', 'success');
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        } else {
            showNotification('Email dan password harus diisi!', 'error');
        }
    } else if (type === 'phone') {
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('phone-password').value;
        
        if (phone && password) {
            userData.phone = phone;
            userData.isLoggedIn = true;
            showNotification('Login berhasil!', 'success');
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        } else {
            showNotification('Nomor telepon dan password harus diisi!', 'error');
        }
    }
}

// OTP Functions
function sendOTP() {
    const input = document.getElementById('forgot-input').value;
    if (input) {
        // Simulate sending OTP
        showNotification('Kode OTP telah dikirim ke ' + input, 'success');
        document.getElementById('otp-section').classList.remove('hidden');
        
        // Simulate OTP (in real app, this would be sent via SMS/email)
        sessionStorage.setItem('otp', '123456');
    } else {
        showNotification('Masukkan email atau nomor telepon!', 'error');
    }
}

function verifyOTP() {
    const otp = document.getElementById('otp').value;
    const correctOTP = sessionStorage.getItem('otp');
    
    if (otp === correctOTP) {
        showNotification('OTP valid! Silakan reset password Anda', 'success');
        // Here you would show reset password form
    } else {
        showNotification('Kode OTP salah!', 'error');
    }
}

function resendOTP() {
    showNotification('Kode OTP telah dikirim ulang', 'success');
    // Generate new OTP
    sessionStorage.setItem('otp', Math.floor(100000 + Math.random() * 900000).toString());
}

// Notification Function
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Data Storage Functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
}

// Dashboard Functions (to be used in dashboard.html)
function loadDashboard() {
    if (!userData.isLoggedIn) {
        window.location.href = '../index.html';
        return;
    }
    
    // Load user data
    const savedData = getFromLocalStorage('userData');
    if (savedData) {
        userData = savedData;
    }
}

// Form Functions for Data Diri
function saveDataDiri() {
    const dataDiri = {
        namaLengkap: document.getElementById('nama-lengkap').value,
        tanggalLahir: document.getElementById('tanggal-lahir').value,
        jenisKelamin: document.querySelector('input[name="jenis-kelamin"]:checked')?.value,
        alergi: document.getElementById('alergi').value,
        golonganDarah: document.getElementById('golongan-darah').value,
        rpd: document.getElementById('rpd').value
    };
    
    userData.profile = dataDiri;
    saveToLocalStorage('userData', userData);
    showNotification('Data diri berhasil disimpan!');
}

// Form Functions for Monitoring
function saveMonitoring() {
    const monitoring = {
        suhu: document.getElementById('suhu').value,
        berat: document.getElementById('berat').value,
        tinggi: document.getElementById('tinggi').value,
        saturasi: document.getElementById('saturasi').value,
        tensi: document.getElementById('tensi').value,
        golonganDarah: document.getElementById('monitoring-golongan-darah').value
    };
    
    userData.monitoring = monitoring;
    saveToLocalStorage('userData', userData);
    showNotification('Data monitoring berhasil disimpan!');
}

// Form Functions for Keluhan
function saveKeluhan() {
    const gejalaTambahan = [];
    document.querySelectorAll('input[name="gejala"]:checked').forEach(gejala => {
        gejalaTambahan.push(gejala.value);
    });
    
    const keluhan = {
        keluhan: document.getElementById('keluhan').value,
        mulaiKapan: document.getElementById('mulai-kapan').value,
        frekuensi: document.querySelector('input[name="frekuensi"]:checked')?.value,
        tingkatNyeri: document.getElementById('tingkat-nyeri').value,
        lokasiNyeri: document.getElementById('lokasi-nyeri').value,
        gejalaTambahan: gejalaTambahan,
        pernahSebelumnya: document.querySelector('input[name="pernah-sebelumnya"]:checked')?.value,
        sedangKonsumsiObat: document.querySelector('input[name="konsumsi-obat"]:checked')?.value,
        namaObat: document.getElementById('nama-obat')?.value || ''
    };
    
    userData.keluhan = keluhan;
    saveToLocalStorage('userData', userData);
    showNotification('Data keluhan berhasil disimpan!');
}

// Form Functions for Pengingat Obat
function savePengingatObat() {
    const pengingat = {
        jumlahObat: document.getElementById('jumlah-obat').value,
        dosis: document.getElementById('dosis').value,
        bentuk: document.querySelector('input[name="bentuk-obat"]:checked')?.value,
        frekuensi: document.querySelector('input[name="frekuensi-obat"]:checked')?.value,
        aturanMinum: document.querySelector('input[name="aturan-minum"]:checked')?.value
    };
    
    userData.pengingatObat.push(pengingat);
    saveToLocalStorage('userData', userData);
    showNotification('Pengingat obat berhasil disimpan!');
    
    // Schedule notification (simulated)
    scheduleNotification(pengingat);
}

function scheduleNotification(obat) {
    // In real app, this would use browser notifications
    if (Notification.permission === 'granted') {
        showNotification(`Pengingat: Minum obat ${obat.dosis} sesuai jadwal`);
    }
}

// HealthMind Assistant Functions
function sendToHealthMind() {
    const question = document.getElementById('healthmind-input').value;
    if (!question) return;
    
    // Simulate AI response
    const responses = [
        "Berdasarkan keluhan Anda, sebaiknya konsultasi dengan dokter.",
        "Istirahat yang cukup dan minum air putih hangat.",
        "Jika keluhan berlanjut, segera periksakan ke fasilitas kesehatan terdekat."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add to chat
    const chatContainer = document.getElementById('chat-container');
    const userMessage = `<div class="user-message">${question}</div>`;
    const aiMessage = `<div class="ai-message">${randomResponse}</div>`;
    
    chatContainer.innerHTML += userMessage + aiMessage;
    document.getElementById('healthmind-input').value = '';
}

// Camera Functions
function openCamera() {
    // Check if camera permission granted
    if (!permissions.kamera) {
        showNotification('Izin kamera belum diberikan', 'error');
        return;
    }
    
    // Simulate opening camera
    showNotification('Membuka kamera...', 'success');
    
    // In real app, this would use getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Show video stream
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                // You would append this to a modal
            })
            .catch(function(error) {
                showNotification('Gagal mengakses kamera: ' + error.message, 'error');
            });
    }
}

// Gallery Functions
function openGallery() {
    // Simulate opening gallery
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Process image
            showNotification('Gambar berhasil dipilih: ' + file.name, 'success');
        }
    };
    input.click();
}

// Voice Input Functions
function startVoiceInput() {
    if (!permissions.mic) {
        showNotification('Izin microphone belum diberikan', 'error');
        return;
    }
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'id-ID';
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('healthmind-input').value = transcript;
        };
        
        recognition.onerror = function(event) {
            showNotification('Error: ' + event.error, 'error');
        };
    } else {
        showNotification('Browser tidak mendukung voice input', 'error');
    }
}

// PDF Generation
function generatePDF() {
    // In real app, this would use a library like jsPDF
    showNotification('Membuat PDF...', 'success');
    
    // Simulate PDF generation
    setTimeout(() => {
        showNotification('PDF berhasil disimpan!', 'success');
    }, 2000);
}

// Logout Function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        userData.isLoggedIn = false;
        saveToLocalStorage('userData', userData);
        window.location.href = '../index.html';
    }
}

// Account Functions
function updateEmail() {
    const newEmail = document.getElementById('new-email').value;
    if (newEmail && validateEmail(newEmail)) {
        userData.email = newEmail;
        saveToLocalStorage('userData', userData);
        showNotification('Email berhasil diperbarui!');
    } else {
        showNotification('Email tidak valid!', 'error');
    }
}

function updateUsername() {
    const newUsername = document.getElementById('new-username').value;
    if (newUsername) {
        // Check if username exists (simulated)
        const existingUsers = getFromLocalStorage('users') || [];
        if (existingUsers.includes(newUsername)) {
            showNotification('Username sudah digunakan!', 'error');
        } else {
            userData.username = newUsername;
            saveToLocalStorage('userData', userData);
            showNotification('Username berhasil diperbarui!');
        }
    }
}

function updatePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Password tidak cocok!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password minimal 6 karakter!', 'error');
        return;
    }
    
    userData.password = newPassword;
    saveToLocalStorage('userData', userData);
    showNotification('Password berhasil diperbarui!');
}

function updateProfilePhoto(type) {
    if (type === 'camera') {
        if (!permissions.kamera) {
            showNotification('Izin kamera belum diberikan', 'error');
            return;
        }
        openCamera();
    } else if (type === 'gallery') {
        openGallery();
    }
    
    // Simulate photo update
    showNotification('Foto profil berhasil diperbarui!', 'success');
}

function deleteProfilePhoto() {
    if (confirm('Yakin ingin menghapus foto profil?')) {
        userData.profilePhoto = null;
        saveToLocalStorage('userData', userData);
        showNotification('Foto profil berhasil dihapus!');
    }
}

// Language Functions
function changeLanguage(lang) {
    const languages = {
        'id': 'Indonesia',
        'en': 'English',
        'ar': 'العربية',
        'zh': '中文'
    };
    
    userData.language = lang;
    saveToLocalStorage('userData', userData);
    showNotification(`Bahasa diubah ke ${languages[lang]}`);
    
    // In real app, you would update all text content
}

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function calculateBMI(weight, height) {
    // height in cm, weight in kg
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    return bmi.toFixed(1);
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}