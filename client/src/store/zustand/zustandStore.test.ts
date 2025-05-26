import { act, renderHook } from '@testing-library/react';
import { useUIStore } from './zustandStore';

beforeEach(() => {
  useUIStore.setState({
    filterState: {
      searchQuery: '',
      sortBy: null,
      sortDirection: 'asc',
    },
    activeTab: 'info',
    lastViewedVehicleId: null,
  });
});

describe('useUIStore', () => {
  test('should initialize with default state', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.filterState.searchQuery).toBe('');
    expect(result.current.filterState.sortBy).toBe(null);
    expect(result.current.filterState.sortDirection).toBe('asc');
    expect(result.current.activeTab).toBe('info');
    expect(result.current.lastViewedVehicleId).toBe(null);
  });

  test('should update search query', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSearchQuery('Toyota');
    });
    
    expect(result.current.filterState.searchQuery).toBe('Toyota');
  });

  test('should toggle sort direction when same column is clicked', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSort('model');
    });
    
    expect(result.current.filterState.sortBy).toBe('model');
    expect(result.current.filterState.sortDirection).toBe('asc');
    
    act(() => {
      result.current.toggleSort('model');
    });
    
    expect(result.current.filterState.sortBy).toBe('model');
    expect(result.current.filterState.sortDirection).toBe('desc');
  });

  test('should set new sort column and reset direction to asc', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSort('model');
      result.current.toggleSort('model');
    });
    
    expect(result.current.filterState.sortDirection).toBe('desc');
    
    act(() => {
      result.current.toggleSort('type');
    });
    
    expect(result.current.filterState.sortBy).toBe('type');
    expect(result.current.filterState.sortDirection).toBe('asc');
  });

  test('should update active tab and last viewed vehicle', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setActiveTab('maintenance');
      result.current.setLastViewedVehicle(123);
    });
    
    expect(result.current.activeTab).toBe('maintenance');
    expect(result.current.lastViewedVehicleId).toBe(123);
  });
}); 