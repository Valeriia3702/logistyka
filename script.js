/**
 * script.js
 * Logika interfejsu użytkownika i animacje
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obsługa animacji przy scrollowaniu (Intersection Observer)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // 2. Obsługa Navbara (zmiana tła przy scrollu, jeśli potrzebne dodatkowe efekty)
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // 3. Integracja z danymi Demo (demo_data.js)
    updateStatsUI();

    // Przycisk dodawania losowej paczki (aby pokazać, że storage działa)
    const addBtn = document.getElementById('add-random-package');
    if(addBtn) {
        addBtn.addEventListener('click', () => {
            shipmentManager.addRandomPackage();
            updateStatsUI();
            
            // Prosta animacja przycisku
            const originalText = addBtn.innerText;
            addBtn.innerText = "Dodano!";
            addBtn.style.borderColor = "#2ecc71";
            addBtn.style.color = "#2ecc71";
            
            setTimeout(() => {
                addBtn.innerText = originalText;
                addBtn.style.borderColor = "var(--primary-color)";
                addBtn.style.color = "var(--dark-bg)";
            }, 1000);
        });
    }

    // Funkcja aktualizująca licznik na stronie
    function updateStatsUI() {
        const stats = shipmentManager.getStats();
        const activeCountEl = document.getElementById('active-packages');
        
        if(activeCountEl) {
            // Efekt licznika
            animateValue(activeCountEl, parseInt(activeCountEl.innerText), stats.active, 1000);
        }
    }

    // Pomocnicza funkcja do animacji liczb
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});