
import { Resident, ResidentStatus, StorageInfo } from './types';

const STORAGE_KEY = 'condo_guard_db';
const MAX_CAPACITY = 200; // Simulated capacity in entries

export const db = {
  getResidents: (): Resident[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      let residents: Resident[] = data ? JSON.parse(data) : [];
      
      // Lógica de Expiração Automática
      const today = new Date().toISOString().split('T')[0]; 
      let hasChanges = false;

      const updatedResidents = residents.map(resident => {
        if (
          resident.status === ResidentStatus.ACTIVE && 
          resident.endDate && 
          resident.endDate < today
        ) {
          hasChanges = true;
          return { ...resident, status: ResidentStatus.INACTIVE };
        }
        return resident;
      });

      if (hasChanges) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResidents));
        return updatedResidents;
      }

      return residents;
    } catch (error) {
      console.error("Erro ao ler banco de dados:", error);
      return [];
    }
  },

  saveResident: (resident: Resident): void => {
    const residents = db.getResidents();
    const index = residents.findIndex(r => r.id === resident.id);
    if (index >= 0) {
      residents[index] = resident;
    } else {
      residents.push(resident);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
  },

  deleteResident: (id: string): void => {
    const residents = db.getResidents();
    const filtered = residents.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  deleteInactive: (): number => {
    const residents = db.getResidents();
    const activeOnes = residents.filter(r => r.status === ResidentStatus.ACTIVE);
    const deletedCount = residents.length - activeOnes.length;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeOnes));
    return deletedCount;
  },

  updateStatus: (id: string, status: ResidentStatus): void => {
    const residents = db.getResidents();
    const index = residents.findIndex(r => r.id === id);
    if (index >= 0) {
      residents[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
    }
  },

  getStorageInfo: (): StorageInfo => {
    const residents = db.getResidents();
    const used = residents.length;
    return {
      used,
      total: MAX_CAPACITY,
      percentage: (used / MAX_CAPACITY) * 100
    };
  }
};
