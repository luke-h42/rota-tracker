import express from 'express';
import cors from 'cors'
import { test , addShift , getShiftList, getSingleShift, updateSingleShift, deleteSingleShift, getShiftsDateRange, getShiftsForMonth, getUserShifts} from '../Controllers/shiftController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
      
    })
)

router.get('/', test)
router.post('/add-shift', roleCheck('admin', 'owner'), addShift) // Add single shift to database
router.get('/shift-list', roleCheck('user','admin', 'owner'), getShiftList) // Get list of all shifts
router.get('/shift/:id', roleCheck('admin', 'owner'), getSingleShift) // Get single shift information
router.put('/shift/:id', roleCheck('admin', 'owner'), updateSingleShift) // Update single shift 
router.delete('/shift/:id', roleCheck('admin', 'owner'), deleteSingleShift ) // Delete single shift
router.get('/shift-date-range', roleCheck('admin', 'owner'), getShiftsDateRange) // Get all shifts in selected date range
router.get('/shift-month-range', roleCheck('admin', 'owner'), getShiftsForMonth) // Get all shifts in selected month
router.get('/user-shifts', roleCheck('user','admin', 'owner'), getUserShifts) // Get all shifts in selected month

export default router;