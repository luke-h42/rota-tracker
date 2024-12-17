import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import { test , addShift , getShiftList, getSingleShift, updateSingleShift, deleteSingleShift, getShiftsListDateRange, getShiftsDateRange, getShiftsForMonth, getUserShifts, sendShiftsEmail} from '../Controllers/shiftController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL
      
    })
)

router.get('/', test)
router.post('/add-shift', roleCheck('admin', 'owner'), addShift) // Add single shift to database
router.get('/shift-list', roleCheck('user','admin', 'owner'), getShiftList) // Get list of all shifts
router.get('/shift/:id', roleCheck('admin', 'owner'), getSingleShift) // Get single shift information
router.put('/shift/:id', roleCheck('admin', 'owner'), updateSingleShift) // Update single shift 
router.delete('/shift/:id', roleCheck('admin', 'owner'), deleteSingleShift ) // Delete single shift
router.get('/shift-date-range', roleCheck('admin', 'owner'), getShiftsListDateRange) // Get all shifts in selected date range for shift list 
router.get('/shift-date-range-aggregated', roleCheck('admin', 'owner'), getShiftsDateRange) // Get all shifts in selected date range aggregated for reporting
router.get('/shift-month-range', roleCheck('admin', 'owner'), getShiftsForMonth) // Get all shifts in selected month
router.get('/user-shifts', roleCheck('user','admin', 'owner'), getUserShifts) // Get all shifts of user in selected week
router.post('/send-shifts-email', roleCheck('admin', 'owner'), sendShiftsEmail) // Send shifts on selected week

export default router;