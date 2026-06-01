// ==========================================
// 1. FUNGSIONALITAS MODE GELAP (DARK MODE)
// ==========================================
const darkModeToggle = document.getElementById('darkModeToggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeToggle) darkModeToggle.textContent = '☀️ Mode Terang';
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            darkModeToggle.textContent = '🌙 Mode Gelap';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.textContent = '☀️ Mode Terang';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ==========================================
// 2. FILTER PENCARIAN BERITA (REAL-TIME)
// ==========================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const newsCards = document.querySelectorAll('.news-card');
const heroSection = document.getElementById('heroSection');
const gridTitle = document.getElementById('gridTitle');

function filterNews() {
    const query = searchInput.value.toLowerCase().trim();
    newsCards.forEach(card => {
        const titleData = card.getAttribute('data-title') || '';
        if (titleData.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    if (query !== '') {
        if (heroSection) heroSection.style.display = 'none';
        if (gridTitle) gridTitle.textContent = `Hasil pencarian untuk: "${searchInput.value}"`;
    } else {
        if (heroSection) heroSection.style.display = 'grid';
        if (gridTitle) gridTitle.textContent = 'Kabar Terkini Banua';
    }
}

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', filterNews);
    searchInput.addEventListener('keyup', filterNews);
}

// ==========================================
// 3. PERBAIKAN API CUACA REAL-TIME
// ==========================================
async function fetchWeather() {
    const tempElement = document.getElementById('weatherTemp');
    const descElement = document.getElementById('weatherDesc');

    // Validasi ketat: Hentikan fungsi jika elemen tidak ditemukan di halaman aktif
    if (!tempElement || !descElement) return;

    try {
        // Menggunakan API publik Open-Meteo dengan koordinat Banjarmasin Kalsel
        const url = 'https://open-meteo.com';
        
        // Menambahkan timeout pencegah loading tanpa kepastian
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);

        if (!response.ok) throw new Error('Respon jaringan bermasalah');
        
        const data = await response.json();
        
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const weatherCode = data.current_weather.weathercode;
            
            let description = 'Cerah';
            if (weatherCode >= 1 && weatherCode <= 3) description = 'Berawan';
            if (weatherCode >= 45 && weatherCode <= 48) description = 'Berkabut';
            if (weatherCode >= 51 && weatherCode <= 67) description = 'Gerimis';
            if (weatherCode >= 71 && weatherCode <= 82) description = 'Hujan';
            if (weatherCode >= 95) description = 'Hujan Petir';

            tempElement.textContent = `${temp}°C`;
            descElement.textContent = `• ${description}`;
        }
    } catch (error) {
        // Cadangan tampilan jika koneksi lokal pengguna bermasalah / CORS lokal blocker
        tempElement.textContent = '31°C'; 
        descElement.textContent = '• Berawan (Lokal)';
        console.log('Catatan Cuaca: Menggunakan data estimasi lokal (Offline/Local restriction).');
    }
}

// ==========================================
// 4. INPUT KOMENTAR DINAMIS
// ==========================================
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const commentCount = document.getElementById('commentCount');

if (commentForm && commentsList) {
    let count = 2;
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('commentName').value;
        const textInput = document.getElementById('commentText').value;

        const newComment = document.createElement('div');
        newComment.classList.add('comment-card');
        const initial = nameInput.charAt(0).toUpperCase();

        newComment.innerHTML = `
            <div class="comment-avatar">${initial}</div>
            <div class="comment-content">
                <h5>${nameInput} <span class="comment-date">Baru saja</span></h5>
                <p>${textInput}</p>
            </div>
        `;

        commentsList.insertBefore(newComment, commentsList.firstChild);
        count++;
        if (commentCount) commentCount.textContent = count;
        commentForm.reset();
    });
}

// ==========================================
// 5. FITUR BARU: SIMPAN BERITA (BOOKMARK)
// ==========================================
const bookmarkBtn = document.getElementById('bookmarkBtn');
if (bookmarkBtn) {
    const articleId = window.location.pathname; // Menggunakan jalur url sebagai id unik
    
    // Cek status simpan saat halaman dimuat
    if (localStorage.getItem(`bookmark_${articleId}`) === 'saved') {
        bookmarkBtn.classList.add('saved');
        bookmarkBtn.innerHTML = '🔖 Tersimpan di Favorit';
    }

    bookmarkBtn.addEventListener('click', () => {
        if (bookmarkBtn.classList.contains('saved')) {
            bookmarkBtn.classList.remove('saved');
            bookmarkBtn.innerHTML = '🔖 Simpan Berita';
            localStorage.removeItem(`bookmark_${articleId}`);
            alert('Berita dihapus dari daftar favorit Anda.');
        } else {
            bookmarkBtn.classList.add('saved');
            bookmarkBtn.innerHTML = '🔖 Tersimpan di Favorit';
            localStorage.setItem(`bookmark_${articleId}`, 'saved');
            alert('Berita berhasil disimpan! Anda dapat membacanya lagi nanti.');
        }
    });
}

// Menjalankan fungsi cuaca saat seluruh dokumen siap
document.addEventListener('DOMContentLoaded', fetchWeather);
