import Company from '../Models/company.js'
import User from '../Models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
  console.log(company)
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

    // Create a new user with 'user' role and associate with the company
    const newUser = new User({
      name: userName,
      email: userEmail,
      password: hashedPassword,
      role: 'user', // Default role as 'user'
      company: company._id, // Associate the new user with the same company
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
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
