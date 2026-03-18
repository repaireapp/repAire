import AsyncStorage from '@react-native-async-storage/async-storage';

// --- TYPES ---
export type VehicleType = 'roadBike' | 'mtb' | 'cityBike' | 'escooter';

export interface MaintenanceTask {
  id: string;
  label: string;
  intervalDays: number;
  lastDone: string; // ISO date or empty string
  codexLinkId?: string;
}

export interface UserMaintenanceProfile {
  vehicleName: string;
  vehicleType: VehicleType;
  tasks: MaintenanceTask[];
  onboardingComplete: boolean;
}

export type TaskStatus = 'ok' | 'soon' | 'late' | 'never';

// --- DEFAULT TASKS ---
const DEFAULT_TASKS: Record<VehicleType, Omit<MaintenanceTask, 'lastDone'>[]> = {
  roadBike: [
    { id: 'tire', label: 'Pression Pneus', intervalDays: 30, codexLinkId: 'pneu' },
    { id: 'chain', label: 'Graissage Chaîne', intervalDays: 60, codexLinkId: 'zoom_degraissant' },
    { id: 'brake', label: 'Patins/Plaquettes', intervalDays: 180, codexLinkId: 'freins' },
  ],
  cityBike: [
    { id: 'tire', label: 'Pression Pneus', intervalDays: 30, codexLinkId: 'pneu' },
    { id: 'chain', label: 'Graissage Chaîne', intervalDays: 60, codexLinkId: 'zoom_degraissant' },
    { id: 'brake', label: 'Patins/Plaquettes', intervalDays: 180, codexLinkId: 'freins' },
  ],
  mtb: [
    { id: 'tire', label: 'Pression Pneus', intervalDays: 15, codexLinkId: 'pneu' },
    { id: 'chain', label: 'Graissage Chaîne', intervalDays: 30, codexLinkId: 'zoom_degraissant' },
    { id: 'brake', label: 'Plaquettes Freins', intervalDays: 90, codexLinkId: 'frein_disque' },
  ],
  escooter: [
    { id: 'tire', label: 'Pression Pneus', intervalDays: 30, codexLinkId: 'pneu' },
    { id: 'stem', label: 'Serrage Vis Potence', intervalDays: 30, codexLinkId: 'zoom_cles_allen' },
    { id: 'brake', label: 'Réglage Freins', intervalDays: 90, codexLinkId: 'frein_disque' },
  ],
};

const STORAGE_KEY = '@repAire_garage_v2';

// --- SERVICE ---
export const MaintenanceService = {
  getStatus(lastDoneIso: string, intervalDays: number): TaskStatus {
    if (!lastDoneIso) return 'never';
    const lastDate = new Date(lastDoneIso);
    const now = new Date();
    const daysElapsed = Math.ceil(Math.abs(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysElapsed >= intervalDays) return 'late';
    if (daysElapsed >= intervalDays - 3) return 'soon';
    return 'ok';
  },

  createProfile(type: VehicleType, name: string): UserMaintenanceProfile {
    const tasks = DEFAULT_TASKS[type].map(t => ({ ...t, lastDone: '' }));
    return { vehicleName: name, vehicleType: type, tasks, onboardingComplete: true };
  },

  async saveGarage(garage: UserMaintenanceProfile[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(garage));
    } catch {}
  },

  async loadGarage(): Promise<UserMaintenanceProfile[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  completeTask(garage: UserMaintenanceProfile[], vehicleName: string, taskId: string): UserMaintenanceProfile[] {
    return garage.map(v => {
      if (v.vehicleName !== vehicleName) return v;
      return {
        ...v,
        tasks: v.tasks.map(t => t.id === taskId ? { ...t, lastDone: new Date().toISOString() } : t),
      };
    });
  },

  renameProfile(garage: UserMaintenanceProfile[], oldName: string, newName: string): UserMaintenanceProfile[] {
    return garage.map(v => v.vehicleName === oldName ? { ...v, vehicleName: newName } : v);
  },
};
