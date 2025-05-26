import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../../../test/test-utils';
import VehicleTableRow from '../VehicleTableRow.tsx';
import type { Vehicle } from '../../../../types';

vi.mock('../../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

vi.mock('../../../Button', () => ({
  default: ({ onClick, title, children, icon }: any) => (
    <button onClick={onClick} title={title} data-testid={title}>
      {icon}
      {children}
    </button>
  ),
}));

vi.mock('../../../Icons', () => ({
  EditIcon: () => <span data-testid="edit-icon">Edit</span>,
  DeleteIcon: () => <span data-testid="delete-icon">Delete</span>,
}));

const mockVehicle: Vehicle = {
  id: 1,
  model: 'Toyota Camry',
  type: 'Sedan',
  status: 'active',
  registrationNumber: 'ABC123',
  lastMaintenance: '2024-01-15',
  location: 'New York',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
};

const defaultProps = {
  vehicle: mockVehicle,
  onVehicleClick: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('<VehicleTableRow />', () => {
  it('should display vehicle information correctly', () => {
    render(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('should call onVehicleClick when row is clicked', async () => {
    const user = userEvent.setup();
    const mockOnVehicleClick = vi.fn();

    render(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} onVehicleClick={mockOnVehicleClick} />
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    await user.click(row);

    expect(mockOnVehicleClick).toHaveBeenCalledWith(1);
    expect(mockOnVehicleClick).toHaveBeenCalledTimes(1);
  });

  it('should display correct status styling for different vehicle statuses', () => {
    const activeVehicle = { ...mockVehicle, status: 'active' as const };
    const maintenanceVehicle = { ...mockVehicle, status: 'maintenance' as const };
    const inactiveVehicle = { ...mockVehicle, status: 'inactive' as const };

    const { rerender } = render(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} vehicle={activeVehicle} />
        </tbody>
      </table>
    );

    let statusElement = screen.getByText('active');
    expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');

    rerender(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} vehicle={maintenanceVehicle} />
        </tbody>
      </table>
    );

    statusElement = screen.getByText('maintenance');
    expect(statusElement).toHaveClass('bg-orange-500/30', 'text-orange-800');

    rerender(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} vehicle={inactiveVehicle} />
        </tbody>
      </table>
    );

    statusElement = screen.getByText('inactive');
    expect(statusElement).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should call onEdit when edit button is clicked without triggering row click', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnVehicleClick = vi.fn();

    render(
      <table>
        <tbody>
          <VehicleTableRow 
            {...defaultProps} 
            onEdit={mockOnEdit} 
            onVehicleClick={mockOnVehicleClick} 
          />
        </tbody>
      </table>
    );

    const editButton = screen.getByTestId('Edit Vehicle');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(1);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnVehicleClick).not.toHaveBeenCalled();
  });

  it('should call onDelete when delete button is clicked without triggering row click', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    const mockOnVehicleClick = vi.fn();

    render(
      <table>
        <tbody>
          <VehicleTableRow 
            {...defaultProps} 
            onDelete={mockOnDelete} 
            onVehicleClick={mockOnVehicleClick} 
          />
        </tbody>
      </table>
    );

    const deleteButton = screen.getByTestId('Delete Vehicle');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnVehicleClick).not.toHaveBeenCalled();
  });

  it('should render action buttons with correct icons', () => {
    render(
      <table>
        <tbody>
          <VehicleTableRow {...defaultProps} />
        </tbody>
      </table>
    );

    screen.debug();

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });
}); 