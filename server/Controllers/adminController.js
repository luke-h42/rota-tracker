import Company from '../Models/company.js'
import User from '../Models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendEmail} from '../helpers/emailHelper.js'
import 'dotenv/config';

export const test = (req,res) => {
    res.json('test is working')
}


// Owner role only
export const registerCompany = async (req, res) => {
    try {
        const { companyName, adminName, adminEmail, adminPassword } = req.body;
        if (!companyName || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Ensure company has not already been created
        const existingCompany = await Company.findOne(
            { name: companyName },  // Checking company name in the database
            null, 
            { collation: { locale: 'en', strength: 2 } } // Collation ensures case-insensitive search
          );
        if (existingCompany) {
            return res.status(400).json({ error: 'Company already exists' });
        }
        // Ensure that adminEmail is unique and not null
        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        // Create the new company
        const newCompany = new Company({ name: companyName });
        await newCompany.save();
    
        // Hash the password for the new admin
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
        // Create a new user with 'admin' role for the company
        const newAdmin = new User({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin', // Set role as 'admin'
          company: newCompany._id, // Associate the user with the new company
        });
        await newAdmin.save();
    
        // Add the new admin to the company's admin list
        newCompany.admins.push(newAdmin._id); // Use _id of the new user
        await newCompany.save();
    
        res.status(201).json({
          message: 'Company and admin created successfully!',
          company: newCompany,
          admin: newAdmin,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating the company and admin.' });
      }
}


export const getCompanyList = async (req, res) => {
  try {
    const companies = await Company.find() // Fetch all companies from database
    res.json(companies)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const registerAdmin = async (req, res) => {
  try {
    const { companyName, adminName, adminEmail, adminPassword } = req.body // Get info from frontend
    if (!companyName || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  // check if email already in use
  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
  }
  // Find the company by its ID 
  const company = await Company.findById(companyName); 
  if (!company) {
  return res.status(404).json({ error: 'Company not found' });
    }

  // Hash the password for the new admin
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create a new user with 'admin' role for the company
  const newAdmin = new User({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin', // Set role as 'admin'
    company: companyName, 
    });

    await newAdmin.save();

    // Push the new admin's ID to the company's admins array
    company.admins.push(newAdmin._id); 
    await company.save(); 

    // Return success response
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the admin.' });
  }
}

export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body; // Get info from frontend input
    const { token } = req.cookies; // Get token from cookies

    if (!userName || !userEmail || !userPassword ) {
      return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!userPassword || userPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  // check if email already in use
  const existingUser = await User.findOne({ email: userEmail });
  if (existingUser) {
      return res.status(200).json({ error: 'Email already in use' });
  }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorised: Token is missing' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorised: Invalid token' });
    }

    // Fetch the user from the database using the user id from the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the company associated with the logged-in user
    const company = await Company.findById(user.company);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Hash the password for the new user
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const verificationToken = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Create a new user with 'user' role and associate with the company
    const newUser = new User({
      name: userName,
      email: userEmail,
      password: hashedPassword,
      company: company._id, // Associate the new user with the same company
      verificationToken,
    });

    // Save the new user to the database
    await newUser.save();
    const subject = `Welcome to RotaTracker`
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello ${userName},</p>
  
      <p>We’re excited to let you know that you've been added to the team at <strong>${company.name}</strong> on <strong>RotaTracker</strong>! You're now all set to manage your shifts and stay updated with the team's schedule.</p>
  
      <p><strong>First, verify your account by clicking the link:</strong> <a href="${verificationLink}" style="color: #007bff;">Verify Email</a></p>
  
      <p>Here's what you can do next:</p>
      <ul>
        <li><strong>Login to your account:</strong> <a href="https://www.rotatracker.com/login" style="color: #007bff;">Login Here</a></li>
        <li><strong>Access your personal schedule:</strong> Keep track of your shifts and stay organized.</li>
        <li><strong>Check your shifts:</strong> View the details of your upcoming shifts and plan your time accordingly.</li>
        <li><strong>View the team’s schedule:</strong> Stay in the loop by seeing the full team’s rota and schedule.</li>
      </ul>
  
      <p>Need help? Our support team is here for you. Just reply to this email.</p>
  
      <p>We look forward to helping you stay organized and on top of your schedule!</p>
  
      <p>Welcome aboard!</p>
  
      <p>Best regards,</p>
      <p>The RotaTracker Team</p>
  
      <hr style="border: 1px solid #ddd;">
  
      <p><strong>Contact Us:</strong><br>
        Support: <a href="mailto:rotatracker@gmail.com" style="color: #007bff;">rotatracker@gmail.com</a><br>
        Website: <a href="https://www.rotatracker.com" style="color: #007bff;">rotatracker.com</a>
      </p>
    </div>
  `;
  
    const text = `Hello ${userName}, 

We’re excited to let you know that you've been added to the team at ${company.name} on RotaTracker! You're now all set to manage your shifts and stay updated with the team's schedule.

First, verify your account by clicking the link: ${verificationLink}

Here's what you can do next:
- Login to your account: [https://www.rotatracker.com/login] 
– Access your personal schedule and keep track of your shifts.
- Check your shifts: View the details of your upcoming shifts and plan your time accordingly.
- View the team’s schedule: Stay in the loop by seeing the full team’s rota and schedule.

Need help? Our support team is here for you. Just reply to this email.

We look forward to helping you stay organized and on top of your schedule!

Welcome aboard!

Best regards,
The RotaTracker Team

Contact Us:
Support: rotatracker@gmail.com
Website: rotatracker.com`
    
    
    try {
        await sendEmail(userEmail, subject, text, html);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
      res.status(201).json({ message: 'User registered and confirmation email sent!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserList = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorised: Token is missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthoried: Invalid token' });
    }
    // Fetch the user from the database using the user id from the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role !== 'admin' && user.role !== 'owner') {
      return res.status(403).json({ error: 'Forbidden: Only admins can access the user list' });
    }
    // Fetch the company associated with the logged-in user
    const company = await Company.findById(user.company);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const users = await User.find({ company: user.company }).select('name email role status');
    res.json(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const getSingleUser = async (req, res) => {
  const id = req.params.id.toString();
  try {
    const user = await User.findOne({ _id: id }).select('name email role status');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }
};


export const updateSingleUser = async (req, res) => {
  try {

    const { userId, name, email, role, status } = req.body;

 
    if (!userId || !name || !email || !role || !status) {
      return res.status(400).json({ message: "UserId, name, email, role, and status are required" });
    }


    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email, role, status },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
