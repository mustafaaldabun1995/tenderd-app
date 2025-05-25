import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ToastState, FilterState, VehicleTab } from '../types';

interface UIState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedVehicleId: number | null;
  filterState: FilterState;
  activeTab: VehicleTab;
  lastViewedVehicleId: number | null;
  toast: ToastState;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (vehicleId: number) => void;
  closeEditModal: () => void;
  openDeleteDialog: (vehicleId: number) => void;
  closeDeleteDialog: () => void;
  setSearchQuery: (query: string) => void;
  toggleSort: (column: 'model' | 'type' | 'status') => void;
  setActiveTab: (tab: VehicleTab) => void;
  setLastViewedVehicle: (vehicleId: number) => void;
  showToast: (message: string, type: ToastState['type']) => void;
  hideToast: () => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  sortBy: null,
  sortDirection: 'asc',
};

const initialToastState: ToastState = {
  message: '',
  type: 'success',
  isVisible: false,
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      set => ({
        isAddModalOpen: false,
        isEditModalOpen: false,
        isDeleteDialogOpen: false,
        selectedVehicleId: null,
        filterState: initialFilterState,
        activeTab: 'info',
        lastViewedVehicleId: null,
        toast: initialToastState,
        openAddModal: () => set({ isAddModalOpen: true }),
        closeAddModal: () => set({ isAddModalOpen: false }),
        openEditModal: (vehicleId: number) => set({ isEditModalOpen: true, selectedVehicleId: vehicleId }),
        closeEditModal: () => set({ isEditModalOpen: false, selectedVehicleId: null }),
        openDeleteDialog: (vehicleId: number) => set({ isDeleteDialogOpen: true, selectedVehicleId: vehicleId }),
        closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedVehicleId: null }),
        setSearchQuery: (query: string) =>
          set(state => ({
            filterState: { ...state.filterState, searchQuery: query },
          })),
        toggleSort: (column: 'model' | 'type' | 'status') =>
          set(state => {
            if (state.filterState.sortBy === column) {
              return {
                filterState: {
                  ...state.filterState,
                  sortDirection: state.filterState.sortDirection === 'asc' ? 'desc' : 'asc',
                },
              };
            }
            return {
              filterState: {
                ...state.filterState,
                sortBy: column,
                sortDirection: 'asc',
              },
            };
          }),
        setActiveTab: (tab: VehicleTab) => set({ activeTab: tab }),
        setLastViewedVehicle: (vehicleId: number) => set({ lastViewedVehicleId: vehicleId }),
        showToast: (message: string, type: ToastState['type']) => set({ toast: { message, type, isVisible: true } }),
        hideToast: () => set(state => ({ toast: { ...state.toast, isVisible: false } })),
      }),
      {
        name: 'fleet-ui-storage',
        partialize: state => ({
          filterState: state.filterState,
          activeTab: state.activeTab,
          lastViewedVehicleId: state.lastViewedVehicleId,
        }),
        version: 1,
      }
    ),
    { name: 'ui-store' }
  )
);

export const useModalState = () => {
  const { isAddModalOpen, isEditModalOpen, isDeleteDialogOpen, selectedVehicleId } = useUIStore();

  return {
    isAddModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    selectedVehicleId,
  };
};

export const useFilterState = () => useUIStore(state => state.filterState);
export const useToastState = () => useUIStore(state => state.toast);
