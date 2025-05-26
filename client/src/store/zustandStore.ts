import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FilterState, VehicleTab } from '../types';

interface UIState {
  filterState: FilterState;
  activeTab: VehicleTab;
  lastViewedVehicleId: number | null;
  setSearchQuery: (query: string) => void;
  toggleSort: (column: 'model' | 'type' | 'status') => void;
  setActiveTab: (tab: VehicleTab) => void;
  setLastViewedVehicle: (vehicleId: number) => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  sortBy: null,
  sortDirection: 'asc',
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      set => ({
        filterState: initialFilterState,
        activeTab: 'info',
        lastViewedVehicleId: null,
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

export const useFilterState = () => useUIStore(state => state.filterState);
