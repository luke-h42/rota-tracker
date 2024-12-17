import User from '../Models/user.js'
import jwt from 'jsonwebtoken'
import validator from 'validator';
import bcrypt from 'bcrypt'
import {sendEmail} from '../helpers/emailHelper.js'

export const changeName = async (req, res) => {
    try {
        const { newName, password } = req.body;
        const { token } = req.cookies;
        if (!token) {
          return res.status(401).json({ error: 'Unauthorised: Token is missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded) {
          return res.status(401).json({ error: 'Unauthorised: Invalid token' });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Verify the current password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Password is incorrect' });
        }
        // Update and save the new user name
        const updatedName = await User.findOneAndUpdate(
            { _id: decoded.id },
            { name: newName  },
            { new: true } 
          );

        if (!updatedName) {
        return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: 'Name updated successfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const changeEmail = async (req, res) => {
    try {
      const { newEmail, password } = req.body;
      const { token } = req.cookies;
  
      // Check if token is present
      if (!token) {
        return res.status(401).json({ error: 'Unauthorised: Token is missing' });
      }
  
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Verify if the token is valid
      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorised: Invalid token' });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify the current password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Password is incorrect' });
      }
  
      // Validate the new email
      if (!newEmail || !validator.isEmail(newEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
  
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Update and save the new user email
      const updatedEmail = await User.findOneAndUpdate(
        { _id: decoded.id },
        { email: newEmail },
        { new: true }
      );
  
      // Handle case where user is not found
      if (!updatedEmail) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send success response
      res.status(200).json({ message: 'Email updated successfully!' });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
      const { newPassword, currentPassword } = req.body; 
      const { token } = req.cookies;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorised: Token is missing' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorised: Invalid token' });
      }
  
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.json({ error: 'Current password is incorrect' });
      }
  
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully!' });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Update in future to save in database and also send a message
// Then add a support account (owner?) tto deal with requests
// Schema: user_id, user_name, company_id, company_name, user_email, supportMessage, request: pending || complete
export const getSupport = async (req, res) => {
    try {
      const { supportMessage } = req.body; 
      const { token } = req.cookies;
      if (!supportMessage) {
        return res.status(400).json({ message: 'Support message is required' });
      }
      if (!token) {
        return res.status(401).json({ error: 'Unauthorised: Token is missing' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorised: Invalid token' });
      }
  
      const user = await User.findById(decoded.id);
      const userEmail = user.email
      const supportEmail = 'dropletwebdesign@gmail.com'
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const supportSubject = `RotaTracker Support Request`;
      const supportText = `The following request has been made from ${user.name}, ${user.email}:
${supportMessage}`
      const text = `Hello ${user.name},

Thank you for reaching out to us. 

We have successfully received your support request and will review it as soon as possible. Our team is working diligently to address your inquiry, and you can expect a response shortly.

If you have any additional information or questions in the meantime, please don't hesitate to let us know.

We appreciate your patience and look forward to assisting you.   

Best Regards,
The RotaTracker team.
`
try {
  await sendEmail(userEmail, supportSubject, text);
  await sendEmail(supportEmail, supportSubject, supportText)
} catch (emailError) {
  console.error('Error sending confirmation email:', emailError);
  return res.status(500).json({ error: 'Error sending confirmation email' });
}
res.status(201).json({ message: 'Support message sent!' });

} catch (error) {
console.error(error);
res.status(500).json({ error: 'Server error' });
}
  


};
