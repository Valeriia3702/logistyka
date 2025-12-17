/**
 * demo_script.js
 * Logika dla podstrony demo.html - obsługa mapy Leaflet i interfejsu bocznego.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- KONFIGURACJA MAPY ---

    // 1. Słownik współrzędnych dla miast z demo (Leaflet potrzebuje lat/lng)
    const cityCoords = {
        'Warszawa': [52.2297, 21.0122],
        'Kraków': [50.0647, 19.9450],
        'Gdańsk': [54.3520, 18.6466],
        'Poznań': [52.4064, 16.9252],
        'Wrocław': [51.1079, 17.0385],
        'Łódź': [51.7592, 19.4560],
        'Szczecin': [53.4285, 14.5528],
        'Berlin': [52.5200, 13.4050],
        'Paryż': [48.8566, 2.3522],
        'Madryt': [40.4168, -3.7038],
        'Rzym': [41.9028, 12.4964]
    };
    // Domyślne współrzędne (środek Polski), gdyby miasta nie było na liście
    const defaultCoords = [52.0693, 19.4803];


    // 2. Inicjalizacja mapy Leaflet
    // Ustawiamy widok początkowy na Europę Środkową
    const map = L.map('map').setView([52.0693, 19.4803], 6);

    // 3. Dodanie "Ciemnej Materii" - warstwy kafelków (Dark Mode Tile Layer)
    // Używamy darmowego dostawcy CartoDB dla futurystycznego wyglądu
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Grupa markerów (ułatwia czyszczenie mapy przy odświeżaniu)
    let markersGroup = L.layerGroup().addTo(map);


    // --- FUNKCJE LOGIKI ---

    // Funkcja główna: Pobiera dane i odświeża widok
    function refreshDemoView() {
        // 1. Pobierz dane z naszego "backendu" (demo_data.js)
        const packages = shipmentManager.getAllPackages();
        
        // 2. Wyczyść stare dane
        markersGroup.clearLayers();
        const listContainer = document.getElementById('shipment-list');
        listContainer.innerHTML = '';

        // 3. Iteruj po paczkach i rysuj je
        packages.forEach(pkg => {
            addPackageToMapAndList(pkg, listContainer);
        });
    }


    function addPackageToMapAndList(pkg, listContainer) {
        // --- A. Rysowanie na MAPIE ---
        let coords = cityCoords[pkg.location] || defaultCoords;

        // Ustalanie koloru markera w zależności od statusu (uproszczone)
        let statusColor = '#00b4d8'; // In Transit (Primary)
        let statusClass = 'status-transit';
        
        if (pkg.status === 'Delivered') {
            statusColor = '#2ecc71'; // Green
            statusClass = 'status-delivered';
        } else if (pkg.status === 'Warehouse' || pkg.status === 'Processing') {
            statusColor = '#f39c12'; // Orange
            statusClass = 'status-warehouse';
        }

        // Tworzenie niestandardowej ikony (prosta kropka CSS)
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: ${statusColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${statusColor};"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker(coords, {icon: customIcon}).addTo(markersGroup);

        // Zawartość dymku (popup)
        const popupContent = `
            <div style="min-width: 150px;">
                <h3>${pkg.id}</h3>
                <p><strong>Status:</strong> <span style="color:${statusColor}">${pkg.status}</span></p>
                <p><strong>Lokalizacja:</strong> ${pkg.location}</p>
                <p><strong>Cel:</strong> ${pkg.destination}</p>
                <p><strong>Progres:</strong> ${pkg.progress}%</p>
            </div>
        `;
        marker.bindPopup(popupContent);


        // --- B. Dodawanie do LISTY BOCZNEJ ---
        const listItem = document.createElement('li');
        listItem.className = `shipment-item ${statusClass}`;
        listItem.innerHTML = `
            <span class="ship-id">${pkg.id}</span>
            <span class="ship-route"><i class="fas fa-map-marker-alt"></i> ${pkg.location} &rarr; ${pkg.destination}</span>
            <span class="ship-status-badge" style="background: ${statusColor}40; color: ${statusColor}">${pkg.status}</span>
        `;

        // Kliknięcie na liście centruje mapę na markerze
        listItem.addEventListener('click', () => {
            map.flyTo(coords, 10, { animate: true, duration: 1.5 });
            marker.openPopup();
        });

        // Dodajemy na początek listy (najnowsze na górze)
        listContainer.prepend(listItem);
    }


    // --- OBSŁUGA ZDARZEŃ ---

    // Przycisk "Generuj Nową Paczkę"
    const addBtn = document.getElementById('demo-add-btn');
    addBtn.addEventListener('click', () => {
        // Wywołujemy funkcję z demo_data.js
        shipmentManager.addRandomPackage();
        // Odświeżamy widok (mapę i listę)
        refreshDemoView();
        
        // Mały efekt na przycisku
        addBtn.innerHTML = '<i class="fas fa-check"></i> Wygenerowano!';
        setTimeout(() => {
            addBtn.innerHTML = '<i class="fas fa-plus"></i> Generuj Nową Paczkę';
        }, 1000);
    });


    // --- START ---
    // Uruchomienie przy załadowaniu strony
    refreshDemoView();

});