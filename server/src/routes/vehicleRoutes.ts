import { Router } from 'express';
import {
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    addMaintenance,
    getMaintenanceHistory
} from '../controllers/vehicleController';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);
router.post('/:id/maintenance', addMaintenance);
router.get('/:id/maintenance', getMaintenanceHistory);

export default router; 