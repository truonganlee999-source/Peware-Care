// --- 1. NAVBAR SCROLL EFFECT & HAMBURGER MENU ---
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const hamburgerIcon = hamburger.querySelector('i');

// Hiệu ứng đổi màu Navbar khi cuộn chuột
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        // Nếu menu đang không mở, icon màu tối
        if (!navLinks.classList.contains('active')) {
            hamburgerIcon.style.color = "var(--text-dark)";
        }
    } else {
        navbar.classList.remove('scrolled');
        // Nếu menu đang không mở, icon màu trắng
        if (!navLinks.classList.contains('active')) {
            hamburgerIcon.style.color = "var(--white)";
        }
    }
});

// Chức năng: Bấm vào nút Hamburger / Nút X
hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài document
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        // Khi mở menu: Đổi sang dấu X và ép màu tối cho dễ nhìn
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
        hamburgerIcon.style.color = "var(--white)";
    } else {
        // Khi đóng menu: Trở về 3 gạch
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
        // Trả lại màu tuỳ thuộc vào vị trí cuộn chuột
        hamburgerIcon.style.color = window.scrollY > 50 ? "var(--text-dark)" : "var(--white)";
    }
});

// Chức năng: Chạm ra ngoài vùng menu để tắt
document.addEventListener('click', (e) => {
    // Nếu menu đang mở VÀ vị trí click không nằm trong menu VÀ không nằm trong nút hamburger
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        // Đóng menu
        navLinks.classList.remove('active');
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
        hamburgerIcon.style.color = window.scrollY > 50 ? "var(--text-dark)" : "var(--white)";
    }
});

// Chức năng: Tự động đóng menu khi bấm vào một link bất kỳ trong menu
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
        hamburgerIcon.style.color = window.scrollY > 50 ? "var(--text-dark)" : "var(--white)";
    });
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- 2. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add delay if specified in HTML data-delay attribute
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
            } else {
                entry.target.classList.add('active');
            }
            // Optional: Unobserve after revealing to animate only once
            observer.unobserve(entry.target); 
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// --- 3. NUMBER COUNTER ANIMATION ---
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

const counterCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCounter();
            });
            hasCounted = true; // Prevent counting again
            observer.unobserve(entry.target);
        }
    });
};

const statsSection = document.querySelector('.stats');
if(statsSection) {
    const counterObserver = new IntersectionObserver(counterCallback, { threshold: 0.5 });
    counterObserver.observe(statsSection);
}


// --- 4. LEAFLET INTERACTIVE MAP (VIETNAM & BIỂN ĐÔNG) ---
const map = L.map('vietnam-map', {
    scrollWheelZoom: false,
    minZoom: 5,
    maxBounds: [[7.0, 100.0], [24.0, 118.0]] 
}).setView([15.0, 109.5], 5.5);

// Sử dụng bản đồ CartoDB Voyager (Có đầy đủ tên tiếng Anh, màu sắc hiện đại)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// THỦ THUẬT: Tạo các nhãn (label) có màu nền giống màu nước biển để che chữ quốc tế
// const bienDongIcon = L.divIcon({ 
//     className: 'sea-label-sticker', 
//     html: 'BIỂN ĐÔNG', 
//     iconSize: [140, 35] 
// });
// const hoangSaIcon = L.divIcon({ 
//     className: 'island-label', 
//     html: 'Quần đảo Hoàng Sa<br>(Việt Nam)', 
//     iconSize: [130, 30] 
// });
// const truongSaIcon = L.divIcon({ 
//     className: 'island-label', 
//     html: 'Quần đảo Trường Sa<br>(Việt Nam)', 
//     iconSize: [130, 30] 
// });

// // Đặt tọa độ chính xác để ĐÈ LÊN chữ "South China Sea" của bản đồ
// L.marker([14.5, 114.0], { icon: bienDongIcon, interactive: false }).addTo(map); 
// L.marker([16.5, 112.0], { icon: hoangSaIcon, interactive: false }).addTo(map); 
// L.marker([10.0, 114.0], { icon: truongSaIcon, interactive: false }).addTo(map);

// Project Data
const projects = [
    { name: "Da Nang", lat: 16.0471, lng: 108.2068, type: "ocean", typeName: "Coastal Cleanup", waste: "12,500 kg", vol: "2,300", desc: "Community beach cleanup and plastic waste collection." },
    { name: "Ha Long", lat: 20.9599, lng: 107.0448, type: "ocean", typeName: "Ocean Protection", waste: "15,200 kg", vol: "1,500", desc: "Removing debris and plastic nets from Ha Long Bay." },
    { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, type: "river", typeName: "River Cleanup", waste: "25,000 kg", vol: "4,200", desc: "Saigon River cleanup project and water quality monitoring." },
    { name: "Can Tho", lat: 10.0452, lng: 105.7469, type: "river", typeName: "Floating Market Protect", waste: "8,300 kg", vol: "900", desc: "Reducing plastic usage at Cai Rang floating market." },
    { name: "Hoi An", lat: 15.8801, lng: 108.3380, type: "recycling", typeName: "Recycling Hub", waste: "10,000 kg", vol: "1,200", desc: "Zero-waste city initiative and plastic sorting center." },
    { name: "Nha Trang", lat: 12.2388, lng: 109.1967, type: "ocean", typeName: "Coral Reef Rescue", waste: "4,500 kg", vol: "600", desc: "Diving teams removing plastic waste from coral reefs." }
];

// Custom Marker Icon 
const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: var(--primary); width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(11,110,153,0.8);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

let markersLayer = L.layerGroup().addTo(map);

function renderMap(filterType = 'all') {
    markersLayer.clearLayers();

    projects.forEach(proj => {
        if (filterType === 'all' || proj.type === filterType) {
            const popupContent = `
                <div class="popup-card">
                    <h4>${proj.name}</h4>
                    <span class="popup-tag">${proj.typeName}</span>
                    <p><strong>Waste Collected:</strong> ${proj.waste}</p>
                    <p><strong>Volunteers:</strong> ${proj.vol}</p>
                    <p style="color: #666; margin-top: 5px; font-size: 0.85rem;">${proj.desc}</p>
                </div>
            `;
            const marker = L.marker([proj.lat, proj.lng], { icon: customIcon })
                .bindPopup(popupContent);
            
            markersLayer.addLayer(marker);
        }
    });
}

renderMap();

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filterValue = e.target.getAttribute('data-filter');
        renderMap(filterValue);
    });
});