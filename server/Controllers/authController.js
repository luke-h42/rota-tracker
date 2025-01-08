import User from '../Models/user.js'
import Company from '../Models/company.js'
import Subscription from '../Models/subscription.js'
import { hashPassword, comparePassword } from '../helpers/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {sendEmail} from '../helpers/emailHelper.js'
import { sendTestEmail } from '../helpers/testEmail.js'
import 'dotenv/config';

const useTestEmails = process.env.USE_TEST_EMAILS === 'true';


export const test = (req,res) => {
    res.json('test is working')
}


//Register Endpoint
export const registerUser = async (req, res) => {
    try {
        const{name, email, password} = req.body;
        // Check if name entered
        if(!name) {
            return res.json({
                error: 'Name is required'
            })
        };
        // Check if password valid
        if(!password || password.length < 6){
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        };
        // Check if unique email
        if(!email) {
            return res.json({
                error: 'email is required'
            })
        }
        const exist = await User.findOne({email})
        if(exist) {
            return res.json({
                error: 'email already in use'
            })
        }

        const hashedPassword = await hashPassword(password)
        // Create user in dB
        const user = await User.create({
            name, email, password : hashedPassword,  verificationLink
        })

        return res.json(User)
    } catch (error) {
        console.log(error)
    }
}

export const registerCompanyAndAdmin = async ( req, res) => {
    try {
        const { companyName, adminName, adminEmail, adminPassword } = req.body;
        if (!companyName || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure that adminEmail is unique and not null
        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

         // Create the new company
        const newCompany = new Company({ name: companyName });
        await newCompany.save();

        // Create trial subscription
        const trialSubscription = new Subscription({
            company:  newCompany._id,  // Will link the subscription to the company after it's created
            plan: 'trial',  // Assign the trial plan
            startDate: new Date(),
            endDate: null,  // Trial ends in 14 days
            trialEndDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            status: 'active',
            paymentStatus: 'pending',
            price: 0,  // Trial is free, no payment required
            usersLimit: 5,  // Set the users limit to 5 for the trial
        });

        await trialSubscription.save();
      
        // Update company to include trial 
        newCompany.subscription = trialSubscription._id;  // Set the company in the subscription
        await newCompany.save();  // Save the updated subscription

        // Hash the password for the new admin
        const hashedPassword = await hashPassword(adminPassword)

        // Create verification token
        const verificationToken = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        // Create a new user with 'admin' role for the company
        const newAdmin = new User({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin', // Set role as 'admin'
          company: newCompany._id, // Associate the user with the new company
          verificationToken
        });
        await newAdmin.save();
    
        // Add the new admin to the company's admin list
        newCompany.admins.push(newAdmin._id); // Use _id of the new user
        await newCompany.save();
    
        const subject = `Welcome to RotaTracker`
        const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hello ${adminName},</p>
          
          <p>We’re excited to welcome you to <strong>RotaTracker</strong>! Your company, <strong>${companyName}</strong>, has been successfully registered with us. You're now all set to start managing your rotas and scheduling like a pro!</p>
      
          <p>Here's what you can do next:</p>
          <ul>
            <li><strong>Verify your account:</strong> Please click the following link to verify your email: <a href="${verificationLink}" style="color: #007bff;">Verify Email</a></li>
            <li><strong>Login to your account:</strong> <a href="https://www.rotatracker.com/login" style="color: #007bff;">Login Here</a></li>
            <li><strong>Create your first rota:</strong> Get started by adding employees, shifts, and schedules for better team coordination.</li>
            <li><strong>Explore features:</strong> From shift swapping to real-time updates, RotaTracker has a lot to offer to help your company stay organized.</li>
          </ul>
      
          <p>Need help? Our support team is here for you. Just reply to this email.</p>
      
          <p>We look forward to helping your team work smarter and more efficiently.</p>
      
          <p>Welcome aboard once again!</p>
      
          <p>Best regards,</p>
          <p>The RotaTracker Team</p>
      
          <hr style="border: 1px solid #ddd;">
      
          <p><strong>Contact Us:</strong><br>
            Support: <a href="mailto:rotatracker@gmail.com" style="color: #007bff;">rotatracker@gmail.com</a><br>
            Website: <a href="https://www.rotatracker.com" style="color: #007bff;">rotatracker.com</a>
          </p>
        </div>
      `;
      
        const text = `
        Hello ${adminName}, 
        
        We’re excited to welcome you to RotaTracker! Your company, ${companyName}, has been successfully registered with us. You're now all set to start managing your rotas and scheduling like a pro!
        
        Here's what you can do next:
        - Verify your account: Please click the following link to verify your email: ${verificationLink}
        - Login to your account: https://www.rotatracker.com/login
        - Create your first rota: Get started by adding employees, shifts, and schedules for better team coordination.
        - Explore features: From shift swapping to real-time updates, RotaTracker has a lot to offer to help your company stay organized.
        
        Need help? Our support team is here for you. Just reply to this email.
        
        We look forward to helping your team work smarter and more efficiently.
        
        Welcome aboard once again!
        
        Best regards,
        The RotaTracker Team
        
        Contact Us:
        Support: rotatracker@gmail.com
        Website: rotatracker.com
        `;
        
        
        
        try {

            if (useTestEmails) {
                // Use test email
                await sendTestEmail(adminEmail, subject, text, html);
            } else {
                // Use real email
                await sendEmail(adminEmail, subject, text, html);
            }
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
          }
          res.status(201).json({ message: 'Company registered and confirmation email sent!' });

      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating the company and admin.' });
      }
}

export const verifyEmail = async( req, res) => {
    const { token } = req.query;
  
    if (!token) {
      return res.status(400).json({message: 'Invalid or missing token'});
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(400).json({message: 'User not found'});
      }
      if (user.isVerified) {
        return res.status(200).json({message: 'User already verified.'});
      }
      // Update user verification status
      user.isVerified = true;
      user.verificationToken = null;
      await user.save();
  
      res.status(200).json({message: 'Email successfully verified. You can now log in.'});
    } catch (err) {
        if (err.message === 'jwt expired') {
            return res.status(400).json({ error: 'Verification token has expired. Please request a new one.' });
          }
      res.status(400).json({message: 'Invalid or expired token'});
    }
  }

export const resendVerificationEmail = async (req, res) => {
const { email } = req.body;

// Ensure that the email is provided
if (!email) {
    return res.status(400).json({ error: 'Email is required' });
}

// Check if the user exists in the database
const user = await User.findOne({ email });

if (!user) {
    return res.status(400).json({ error: 'User not found' });
}

// If the user is already verified, return a message
if (user.isVerified) {
    return res.status(400).json({ error: 'User is already verified' });
}

// Create a new verification token
const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

// Send the verification email again
const html = `Please click the link below to verify your email: <a href="${verificationLink}">Verify Email</a>`;
const text = `Please click the link below to verify your email: ${verificationLink}`;

await sendEmail(user.email, 'Verify your email', text, html);

res.json({ message: 'Verification email resent. Please check your inbox.' });
};
  



// Login Endpoint (with Refresh Token)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email entered
        if (!email) {
            return res.json({ error: 'Email is required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: 'No user found' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email first' });
          }
        // Check if password matches
        const match = await comparePassword(password, user.password);
        if (match) {
            // Issue Access Token
            const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '60m' });

            // Issue Refresh Token (longer expiration time)
            const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            // Set both access token and refresh token as cookies
            res.cookie('token', accessToken, { httpOnly: true, sameSite: 'None', secure: true, path: "/", maxAge: 3600 * 1000 }); // 1 hour expiration
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days expiration

            res.json({
                id: user.id,
                role: user.role,
            });
        } else {
            res.json({ error: 'Password incorrect' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const resetPasswordLink = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

        // Generate the reset password token
        const verificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const verificationLink = `${process.env.FRONTEND_URL}/reset-password?token=${verificationToken}`;

        // Email content (HTML version)
        const html = `
            <p>Please click the link below to change your password:</p>
            <a href="${verificationLink}">Change Password</a>
            <p>If this wasn't you, please get in touch with support.</p>
            <p>Best regards,</p>
            <p>The RotaTracker Team</p>
      
            <hr style="border: 1px solid #ddd;">
      
            <p><strong>Contact Us:</strong><br>
             Support: <a href="mailto:rotatracker@gmail.com" style="color: #007bff;">rotatracker@gmail.com</a><br>
             Website: <a href="https://www.rotatracker.com" style="color: #007bff;">rotatracker.com</a>
            </p>
        `;

        // Plain text version
        const text = `
            Please click the link below to change your password:
            ${verificationLink}
            If this wasn't you, please get in touch with support.
            
            Best regards,
            The RotaTracker Team
        
            Contact Us:
            Support: rotatracker@gmail.com
            Website: rotatracker.com
        `;

        // Send the reset password email
        await sendEmail(user.email, 'Password Reset Request', text, html);

        // Send success response
        return res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error in sending reset password email:', error);
        return res.status(500).json({ error: 'Something went wrong, please try again later.' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong, please try again later.' });
    }
};

// Refresh Token Endpoint
export const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Issue new access token
        const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Return new access token
        res.cookie('token', newAccessToken, { httpOnly: true, sameSite: 'None', secure: true, path: "/", maxAge: 3600 * 1000 });
        res.json({ accessToken: newAccessToken });
    });
};



export const checkAuthenticated = (req, res) => {
    const { token } = req.cookies;
    if(!token) return res.status(401).json({message: 'Unauthorised'})
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err,user) => {
            if (err) {
                return res.status(401).json({ error: 'Token expired or invalid' });
              }
            req.userId = user.id;

            res.json({
                id: user.id,
                role: user.role,

            });
        })
    } else {
        res.json(null)
    }

}

export const getProfile = async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        try {
            // Verify the token and get user info
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from the database using the user id from the decoded token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Now, fetch the company name using the companyId from the user
            const company = await Company.findById(user.company).populate('subscription');
            
            // If the user is the owner (no company listed)
            if (user.role === 'owner') {
                return res.json({
                    name: user.name,
                    companyName: null, // Owner doesn't have a company
                    role: user.role,
                    subscription: null,
                });
            }

            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            // Return the user's name and the company name
            res.json({
                name: user.name,
                companyName: company.name,
                role: user.role,
                subscriptionStatus: company.subscription.status || null,
                trialEndDate: company.subscription.trialEndDate || null,
                subscriptionPlan: company.subscription.plan || null,
            });
        } catch (err) {

            console.error(err);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    } else {
        // No token available: return an empty profile or null values
        return res.json({
            name: null,
            companyName: null,
            role: null
        });}
};

export const logoutUser = (req, res) => {
    res.clearCookie('token', {httpOnly: true, sameSite: 'None', secure: true,  path: "/"})
    res.status(200).json({message: 'Logged out successfully'})
}

export const adminRoute = (req, res) => {
    res.json({message: 'Welcome Admin'})
}