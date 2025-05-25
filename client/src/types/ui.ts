export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export interface FilterState {
  searchQuery: string;
  sortBy: 'model' | 'type' | 'status' | null;
  sortDirection: 'asc' | 'desc';
}

export type VehicleTab = 'info' | 'maintenance' | 'location' | 'analytics'; 