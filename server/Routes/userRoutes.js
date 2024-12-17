import express from 'express';
import cors from 'cors'
import {  changeName, changeEmail,  changePassword , getSupport} from '../Controllers/userController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
      
    })
)


router.put('/change-name', roleCheck('user', 'admin', 'owner'), changeName) // Change name for the user
router.put('/change-email', roleCheck('user', 'admin', 'owner'), changeEmail) // Change email for the user
router.put('/change-password', roleCheck('user', 'admin', 'owner'), changePassword) // Change password for the user
router.post('/get-support', roleCheck('user', 'admin', 'owner'), getSupport) // Change password for the user

export default router;