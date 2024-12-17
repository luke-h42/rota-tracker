import express from 'express';
import cors from 'cors'
import {test, registerUser, loginUser, getProfile, logoutUser, checkAuthenticated, adminRoute, registerCompanyAndAdmin, verifyEmail, resendVerificationEmail, resetPasswordLink, resetPassword} from '../Controllers/authController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
   
        
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/get-started', registerCompanyAndAdmin)
router.get('/authentication', checkAuthenticated)
router.get('/admin', roleCheck('admin'), adminRoute)
router.get('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerificationEmail)
router.post('/reset-password-link', resetPasswordLink)
router.post('/reset-password', resetPassword)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.post('/logout', logoutUser)
export default router;