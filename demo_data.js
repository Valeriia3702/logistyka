/**
 * demo_data.js
 * Zarządzanie danymi demo w LocalStorage.
 * Symulacja backendu dla systemu śledzenia paczek.
 */

const STORAGE_KEY = 'winwin_packages_v1';

// Klasa zarządzająca paczkami
class ShipmentManager {
    constructor() {
        this.packages = this.loadData();
    }

    // Ładowanie danych z LS lub inicjalizacja domyślnych
    loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            return this.initDefaultData();
        }
    }

    // Domyślne dane demo
    initDefaultData() {
        const defaultData = [
            { id: 'PK-1001', status: 'In Transit', location: 'Warszawa', destination: 'Gdańsk', progress: 45 },
            { id: 'PK-1002', status: 'Delivered', location: 'Kraków', destination: 'Kraków', progress: 100 },
            { id: 'PK-1003', status: 'Warehouse', location: 'Berlin', destination: 'Poznań', progress: 10 }
        ];
        this.saveData(defaultData);
        return defaultData;
    }

    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.packages = data;
    }

    getAllPackages() {
        return this.packages;
    }

    // Dodawanie nowej paczki (symulacja)
    addRandomPackage() {
        const cities = ['Wrocław', 'Łódź', 'Szczecin', 'Paryż', 'Madryt', 'Rzym'];
        const statuses = ['In Transit', 'Processing', 'Customs'];
        
        const newPackage = {
            id: `PK-${Math.floor(Math.random() * 9000) + 1000}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            location: cities[Math.floor(Math.random() * cities.length)],
            destination: 'Polska',
            progress: Math.floor(Math.random() * 80)
        };

        const currentData = this.getAllPackages();
        currentData.push(newPackage);
        this.saveData(currentData);
        
        console.log("Dodano nową paczkę do LocalStorage:", newPackage);
        return newPackage;
    }

    getStats() {
        return {
            total: this.packages.length,
            active: this.packages.filter(p => p.status !== 'Delivered').length
        };
    }
}

// Inicjalizacja menedżera globalnie
const shipmentManager = new ShipmentManager();