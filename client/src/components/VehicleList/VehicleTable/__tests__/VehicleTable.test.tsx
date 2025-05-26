import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../../../test/test-utils';
import VehicleTable from '../VehicleTable.tsx';
import type { Vehicle } from '../../../../types';

vi.mock('../../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

vi.mock('../../../SortableHeader', () => ({
  default: ({ label }: { label: string }) => <th>{label}</th>,
}));

vi.mock('../../VehicleTableRow/VehicleTableRow', () => ({
  default: ({ vehicle, onVehicleClick }: { vehicle: Vehicle; onVehicleClick: (id: number) => void }) => (
    <tr data-testid={`vehicle-row-${vehicle.id}`}>
      <td>{vehicle.model}</td>
      <td>{vehicle.type}</td>
      <td>{vehicle.status}</td>
      <td>
        <button data-testid={`select-vehicle-${vehicle.id}`} onClick={() => onVehicleClick(vehicle.id)}>
          View Details
        </button>
      </td>
    </tr>
  ),
}));

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    model: 'Toyota Camry',
    type: 'Sedan',
    status: 'active',
    registrationNumber: 'ABC123',
    lastMaintenance: '2024-01-15',
    location: 'New York',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    model: 'Ford Transit',
    type: 'Van',
    status: 'maintenance',
    registrationNumber: 'XYZ789',
    lastMaintenance: '2024-01-10',
    location: 'Los Angeles',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-10',
  },
];

const defaultProps = {
  vehicles: mockVehicles,
  sortBy: null,
  sortDirection: 'asc' as 'asc' | 'desc',
  onSort: vi.fn(),
  onVehicleClick: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('<VehicleTable />', () => {
  it('should call onVehicleClick() with the correct vehicle ID when vehicle is selected', async () => {
    const user = userEvent.setup();
    const mockOnVehicleClick = vi.fn();

    render(<VehicleTable {...defaultProps} onVehicleClick={mockOnVehicleClick} />);

    const selectButton2 = screen.getByTestId('select-vehicle-2');
    await user.click(selectButton2);

    expect(mockOnVehicleClick).toHaveBeenCalledWith(2);

    const selectButton1 = screen.getByTestId('select-vehicle-1');
    await user.click(selectButton1);

    expect(mockOnVehicleClick).toHaveBeenCalledWith(1);
    expect(mockOnVehicleClick).toHaveBeenCalledTimes(2);
  });

  it('should display all vehicles rows available for selection and their details', () => {
    render(<VehicleTable {...defaultProps} />);

    expect(screen.getByTestId('vehicle-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('select-vehicle-1')).toBeInTheDocument();
    expect(screen.getByTestId('select-vehicle-2')).toBeInTheDocument();

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Ford Transit')).toBeInTheDocument();
  });
}); 