import Company from '../Models/company.js'
import User from '../Models/user.js'
import Shift from '../Models/shifts.js'
import jwt from 'jsonwebtoken'
import {sendEmail} from '../helpers/emailHelper.js'
import { sendTestEmail } from '../helpers/testEmail.js'
import 'dotenv/config';


const useTestEmails = process.env.USE_TEST_EMAILS === 'true';


export const test = (req,res) => {
    res.json('test is working')
}
export const addShift = async (req, res) => {
    try {
        const { userId, shiftDate, shiftStartTime, shiftEndTime, breakTime } = req.body;

        // Validate required fields
        if (!userId || !shiftDate || !shiftStartTime || !shiftEndTime || !breakTime) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Ensure breakTime is treated as a number
        const parsedBreakTime = parseFloat(breakTime);
        if (isNaN(parsedBreakTime)) {
            return res.status(400).json({ message: 'Invalid break time.' });
        }
  
        // Validate shift time
        const startTime = new Date(`${shiftDate}T${shiftStartTime}`);
        const endTime = new Date(`${shiftDate}T${shiftEndTime}`);
        if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) {
            return res.status(400).json({ message: 'Invalid or incorrect time format.' });
        }

        // Calculate shift duration (in hours)
        const shiftDurationInHours = ((endTime - startTime) / (1000 * 60 * 60)) - (parsedBreakTime /60); // Duration in hours

        // Token validation
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ error: 'Unauthorised: Token is missing' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ error: 'Unauthorised: Invalid token' });

        // Find the user and company
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const company = await Company.findById(user.company);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        // Create and save the shift
        const newShift = new Shift({
            user: userId,
            startDate: shiftDate,
            startTime,
            endTime,
            breakTime:parsedBreakTime ,
            shiftDuration: shiftDurationInHours,
            company: company._id,
        });

        await newShift.save();
        res.status(201).json({ message: 'Shift created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getShiftList = async (req, res) => { 
    try {
        const { startDate, endDate } = req.query;

        // Check if startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        // Ensure the dates are proper Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        const { token } = req.cookies;
        if (!token) {
          return res.status(401).json({ error: 'Unauthorised: Token is missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded) {
          return res.status(401).json({ error: 'Unauthorised: Invalid token' });
        }
        // Fetch the user from the database using the user id from the decoded token
        const user = await User.findById(decoded.id);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const company = await Company.findById(user.company);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
          }
 
          const shifts = await Shift.find({
            company: user.company,
            startDate: {
                $gte: parsedStartDate,
                $lte: parsedEndDate
            }
        })
        .select('user startDate startTime endTime breakTime shiftDuration')
        .populate('user', 'name');
          res.status(200).json(shifts)

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
}
}

export const getSingleShift = async (req, res) => {
    try {
        const id = req.params.id.toString();
        const shift = await Shift.findOne({ _id: id }).select('user startDate startTime endTime breakTime shiftDuration').populate('user', 'name _id')
        if (!shift) {
            return res.status(404).json({ message: "Shift not found" });
          }
          res.status(200).json(shift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
 }

 export const updateSingleShift = async (req, res) => {
    try {
        const { shiftId, userId, shiftDate, shiftStartTime, shiftEndTime, breakTime } = req.body;

        // Validate required fields
        if (!shiftId || !userId || !shiftDate || !shiftStartTime || !shiftEndTime || !breakTime) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Ensure breakTime is treated as a number
        const parsedBreakTime = parseFloat(breakTime);
        if (isNaN(parsedBreakTime)) {
            return res.status(400).json({ message: 'Invalid break time.' });
        }

        // Construct Date objects for the start and end times
        const startTime = new Date(`${shiftDate}T${shiftStartTime}:00Z`);
        const endTime = new Date(`${shiftDate}T${shiftEndTime}:00Z`);

        // Validate the times
        if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) {
            return res.status(400).json({ message: 'Invalid or incorrect time format.' });
        }

        // Calculate shift duration (in hours)
        const shiftDurationInHours = ((endTime - startTime) / (1000 * 60 * 60)) - (parsedBreakTime /60); // Duration in hours

        // Update and save the shift
        const updatedShift = await Shift.findOneAndUpdate(
            { _id: shiftId },
            { user:userId, startDate:shiftDate, startTime, endTime, breakTime:parsedBreakTime , shiftDuration:shiftDurationInHours  },
            { new: true } 
          );

        if (!updatedShift) {
        return res.status(404).json({ message: "Shift not found" });
        }
        res.status(200).json({ message: 'Shift updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
 }

 export const deleteSingleShift = async (req, res) => {
    try {
        const deletedShift = await Shift.findByIdAndDelete(req.body._id)
        if(!deletedShift) {
            return res.status(404).json({message: "Shift not found"})
        }
        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
  }

// For Manage Shifts
export const getShiftsListDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Check if startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        // Ensure the dates are proper Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        // Token validation
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ error: 'Unauthorized: Token is missing' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

        // Find the user and company
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const company = await Company.findById(user.company);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        // Fetch shifts within the given date range
        const shifts = await Shift.find({
            company: user.company,
            startDate: {
                $gte: parsedStartDate,
                $lte: parsedEndDate
            }
        })
        .select('user startDate startTime endTime breakTime shiftDuration')
        .populate('user', 'name');

        res.status(200).json(shifts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// For reporting
export const getShiftsDateRange = async (req, res ) => {
    try {
        const { startDate, endDate } = req.query

        if (!startDate || !endDate ) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }
        // Ensure the dates are proper Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
  
        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        // Token validation
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ error: 'Unauthorised: Token is missing' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ error: 'Unauthorised: Invalid token' });

        // Find the user and company
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const company = await Company.findById(user.company);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        
        const shiftsInRange = await Shift.aggregate([
            {
                $match: {
                    company: user.company,
                    startDate: {
                        $gte: parsedStartDate,
                        $lte: parsedEndDate
                    }
                }
            },
            {
                $addFields: {
                    shiftDuration: { $toDouble: "$shiftDuration" }  // Ensure shiftDuration is treated as a number
                }
            },
            {
                $group: {
                    _id: "$user",  // Group by the user
                    shiftCount: { $sum: 1 },  // Count the number of shifts
                    totalShiftDuration: { $sum: "$shiftDuration" }  // Sum the shiftDuration
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"  // Flatten the userDetails array
            },
            {
                $project: {
                    _id: 0,  // Do not include the internal _id field
                    userId: "$_id",  // Include the userId
                    name: "$userDetails.name",  // Include the user's name
                    shiftCount: 1,  // Include the shift count
                    totalShiftDuration: {$round :["$totalShiftDuration", 2]}  // Include the total shift duration
                }
            }
        ]);

        res.status(200).json(shiftsInRange)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getShiftsForMonth = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required.' });
        }

        // Calculate the start and end dates of the month
        const startDate = new Date(year, month - 1, 1);  // Month is 0-indexed, so subtract 1
        const endDate = new Date(year, month, 0);  // Get the last day of the month

        // Token validation
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ error: 'Unauthorised: Token is missing' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ error: 'Unauthorised: Invalid token' });

        // Find the user and company
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const company = await Company.findById(user.company);
        if (!company) return res.status(404).json({ error: 'Company not found' });

        const shiftsInRange = await Shift.aggregate([
            {
                $match: {
                    company: user.company,
                    startDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $addFields: {
                    shiftDuration: { $toDouble: "$shiftDuration" }  // Ensure shiftDuration is treated as a number
                }
            },
            {
                $group: {
                    _id: "$user",  // Group by the user
                    shiftCount: { $sum: 1 },  // Count the number of shifts
                    totalShiftDuration: { $sum: "$shiftDuration" }  // Sum the shiftDuration
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"  // Flatten the userDetails array
            },
            {
                $project: {
                    _id: 0,  // Do not include the internal _id field
                    userId: "$_id",  // Include the userId
                    name: "$userDetails.name",  // Include the user's name
                    shiftCount: 1,  // Include the shift count
                    totalShiftDuration: { $round: ["$totalShiftDuration", 2] }  // Round totalShiftDuration to 2 decimal places
                }
            }
        ]);

        res.status(200).json(shiftsInRange);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


export const getUserShifts = async (req, res) => { 


  
        try {
        const { token } = req.cookies;
        const { startDate, endDate } = req.query;

        // Check if startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        // Ensure the dates are proper Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        if (!token) {
            return res.status(401).json({ error: 'Unauthorised: Token is missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorised: Invalid token' });
        }

        const shifts = await Shift.find({
            user: decoded.id,
            startDate: {
                $gte: parsedStartDate,
                $lte: parsedEndDate
            }
        })
        .select(' startDate startTime endTime breakTime shiftDuration')
        res.status(200).json(shifts)
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const sendShiftsEmail = async (req, res) => {
    const { userIds } = req.body; // Getting the list of email addresses
    const subject = `RotaTrackr Notification`;
    if (!userIds || userIds.length === 0) {
        return res.status(400).json({ message: 'No userIds provided' });
    }
    // Loop through each email in the emailList to send the email
    try {
        const users = await User.find({ _id: { $in: userIds } }).select('name email');
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found with the provided userIds' });
        }
        for (let user of users) {
            const userEmail = user.email;
            const userName = user.name;
            const text = `Dear ${userName}, 

This week's rota has now been completed, and it is available for you to review. Please log in to RotaTrackr to check the updated schedule and ensure everything is in order.

Best regards,
The RotaTrackr Team

Contact Us:
Support: rotatrackr@gmail.com
Website: rotatrackr.com`;

            // Send email to each user

            if (useTestEmails) {
                // Use test email
                await sendTestEmail(userEmail, subject, text);
            } else {
                // Use real email
                await sendEmail(userEmail, subject, text);
            }
        }
        res.status(201).json({ message: 'Emails sent to users successfully!' });
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ message: 'Error sending emails' });
    }
};
