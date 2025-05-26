import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import VehicleDetails from './VehicleDetails';
import { useVehicle, useDeleteVehicle } from '../../hooks/useVehicles';
import { useUIStore } from '../../store';
import type { Vehicle } from '../../types';

vi.mock('../../hooks/useVehicles');
vi.mock('../../store');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../../components/Modals', () => ({
  EditVehicleModal: () => <div data-testid="edit-modal">Edit Modal</div>,
  ConfirmationModal: () => <div data-testid="confirmation-modal">Confirmation Modal</div>,
}));

vi.mock('../../components/Toast', () => ({
  default: () => <div data-testid="toast">Toast</div>,
}));

vi.mock('../../components/LoadingSpinner', () => ({
  default: ({ message }: { message: string }) => <div data-testid="loading-spinner">{message}</div>,
}));

vi.mock('../../components/VehicleDetails', () => ({
  VehicleDetailsHeader: ({ vehicle }: { vehicle: Vehicle }) => (
    <div data-testid="vehicle-header">{vehicle.model}</div>
  ),
  VehicleDetailsTabs: ({ activeTab: _activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
    <div data-testid="vehicle-tabs">
      <button onClick={() => onTabChange('info')} data-testid="info-tab">Info</button>
      <button onClick={() => onTabChange('maintenance')} data-testid="maintenance-tab">Maintenance</button>
      <button onClick={() => onTabChange('location')} data-testid="location-tab">Location</button>
      <button onClick={() => onTabChange('analytics')} data-testid="analytics-tab">Analytics</button>
    </div>
  ),
  VehicleInfoTab: ({ vehicle }: { vehicle: Vehicle }) => (
    <div data-testid="vehicle-info-tab">
      <div data-testid="vehicle-model">{vehicle.model}</div>
      <div data-testid="vehicle-type">{vehicle.type}</div>
      <div data-testid="vehicle-registration">{vehicle.registrationNumber}</div>
      <div data-testid="vehicle-status">{vehicle.status}</div>
    </div>
  ),
  MaintenanceTab: ({ vehicle }: { vehicle: Vehicle }) => (
    <div data-testid="maintenance-tab-content">
      <div data-testid="maintenance-vehicle-id">{vehicle.id}</div>
    </div>
  ),
  LocationTab: ({ vehicle }: { vehicle: Vehicle }) => (
    <div data-testid="location-tab-content">
      <div data-testid="vehicle-location">{vehicle.location}</div>
      <div data-testid="vehicle-status-location">{vehicle.status}</div>
    </div>
  ),
  AnalyticsTab: () => (
    <div data-testid="analytics-tab-content">Analytics Content</div>
  ),
}));

const mockVehicle: Vehicle = {
  id: 1,
  model: 'Tesla Model 3',
  type: 'Electric',
  status: 'active',
  registrationNumber: 'ABC-123',
  lastMaintenance: '2024-01-15',
  location: 'San Francisco, CA',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

const mockVehicle2: Vehicle = {
  id: 2,
  model: 'Ford Transit',
  type: 'Van',
  status: 'maintenance',
  registrationNumber: 'XYZ-789',
  lastMaintenance: '2024-02-01',
  location: 'New York, NY',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
};

const mockUIStore = {
  activeTab: 'info',
  setActiveTab: vi.fn(),
  setLastViewedVehicle: vi.fn(),
};

describe('<VehicleDetails />', () => {
  const mockUseVehicle = vi.mocked(useVehicle);
  const mockUseDeleteVehicle = vi.mocked(useDeleteVehicle);
  const mockUseUIStore = vi.mocked(useUIStore);

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseDeleteVehicle.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    mockUseUIStore.mockReturnValue(mockUIStore as any);
  });

  describe.each([
    {
      vehicle: mockVehicle,
      name: 'Tesla Model 3',
      expectedInfo: {
        model: 'Tesla Model 3',
        type: 'Electric',
        registration: 'ABC-123',
        status: 'active',
        location: 'San Francisco, CA'
      }
    },
    {
      vehicle: mockVehicle2,
      name: 'Ford Transit',
      expectedInfo: {
        model: 'Ford Transit',
        type: 'Van',
        registration: 'XYZ-789',
        status: 'maintenance',
        location: 'New York, NY'
      }
    }
  ])('renderTabContent - Vehicle Information Display for $name', ({ vehicle, expectedInfo }) => {
    it('should display correct vehicle information in info tab', async () => {
      mockUseVehicle.mockReturnValue({
        data: vehicle,
        isLoading: false,
        error: null,
      } as any);

      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'info',
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-info-tab')).toBeInTheDocument();
      });

      expect(screen.getByTestId('vehicle-model')).toHaveTextContent(expectedInfo.model);
      expect(screen.getByTestId('vehicle-type')).toHaveTextContent(expectedInfo.type);
      expect(screen.getByTestId('vehicle-registration')).toHaveTextContent(expectedInfo.registration);
      expect(screen.getByTestId('vehicle-status')).toHaveTextContent(expectedInfo.status);
    });

    it('should display correct location information in location tab', async () => {
      mockUseVehicle.mockReturnValue({
        data: vehicle,
        isLoading: false,
        error: null,
      } as any);

      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'location',
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('location-tab-content')).toBeInTheDocument();
      });

      expect(screen.getByTestId('vehicle-location')).toHaveTextContent(expectedInfo.location);
      expect(screen.getByTestId('vehicle-status-location')).toHaveTextContent(expectedInfo.status);
    });
  });

  describe('renderTabContent - Tab Switching', () => {
    it('should render different content when switching between tabs', async () => {
      const user = userEvent.setup();
      
      mockUseVehicle.mockReturnValue({
        data: mockVehicle,
        isLoading: false,
        error: null,
      } as any);

      const mockSetActiveTab = vi.fn();
      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'info',
        setActiveTab: mockSetActiveTab,
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-info-tab')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('location-tab'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('location');
    });

    it('should render maintenance tab with correct vehicle ID', async () => {
      mockUseVehicle.mockReturnValue({
        data: mockVehicle,
        isLoading: false,
        error: null,
      } as any);

      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'maintenance',
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-tab-content')).toBeInTheDocument();
      });

      expect(screen.getByTestId('maintenance-vehicle-id')).toHaveTextContent('1');
    });

    it('should render analytics tab', async () => {
      mockUseVehicle.mockReturnValue({
        data: mockVehicle,
        isLoading: false,
        error: null,
      } as any);

      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'analytics',
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('analytics-tab-content')).toBeInTheDocument();
      });

      expect(screen.getByTestId('analytics-tab-content')).toHaveTextContent('Analytics Content');
    });
  });

  describe('renderTabContent - Edge Cases', () => {
    it('should return null for unknown tab', async () => {
      mockUseVehicle.mockReturnValue({
        data: mockVehicle,
        isLoading: false,
        error: null,
      } as any);

      mockUseUIStore.mockReturnValue({
        ...mockUIStore,
        activeTab: 'unknown',
      } as any);

      render(<VehicleDetails />);

      await waitFor(() => {
        expect(screen.getByTestId('vehicle-header')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('vehicle-info-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('location-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('maintenance-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('analytics-tab-content')).not.toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading spinner when vehicle is loading', () => {
      mockUseVehicle.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      render(<VehicleDetails />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toHaveTextContent('Loading vehicle...');
    });

    it('should show error message when vehicle fails to load', () => {
      mockUseVehicle.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: 'Failed to fetch vehicle' },
      } as any);

      render(<VehicleDetails />);

      expect(screen.getByText('Error loading vehicle')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch vehicle')).toBeInTheDocument();
    });

    it('should show not found message when vehicle is null', () => {
      mockUseVehicle.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      render(<VehicleDetails />);

      expect(screen.getByText('Vehicle not found')).toBeInTheDocument();
      expect(screen.getByText('The vehicle you are looking for does not exist.')).toBeInTheDocument();
    });
  });
}); 