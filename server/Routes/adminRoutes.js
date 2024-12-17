import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import { test, registerCompany, registerAdmin, registerUser, getCompanyList, getUserList, getSingleUser, updateSingleUser} from '../Controllers/adminController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL
      
    })
)

router.get('/', test)
router.post('/register-company', roleCheck('owner'), registerCompany) // Make a new company with an admin account
router.get('/get-company-list', roleCheck('owner'), getCompanyList) // Get list of all registered companies
router.post('/register-admin', roleCheck('owner'), registerAdmin) // Add an admin to an existing company
router.post('/register-user', roleCheck('admin', 'owner'), registerUser) // Add an user to an existing company
router.get('/user-list', roleCheck('admin', 'owner'), getUserList) // Add an user to an existing company
router.get('/user/:id', roleCheck('admin', 'owner'), getSingleUser) // Get information of single user
router.put('/user/:id', roleCheck('admin', 'owner'), updateSingleUser) // Update information of single user




export default router;