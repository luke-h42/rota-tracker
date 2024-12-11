import User from '../Models/user.js'
import Company from '../Models/company.js'
import { hashPassword, comparePassword } from '../helpers/auth.js'
import jwt from 'jsonwebtoken'


export const test = (req,res) => {
    res.json('test is working')
}


//Register Endpoint
export const registerUser = async (req, res) => {
    try {
        const{name, email, password, role='user', company='test'} = req.body;
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
            name, email, password : hashedPassword, role
        })

        return res.json(User)
    } catch (error) {
        console.log(error)
    }
}


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
            const company = await Company.findById(user.company);
            
            // If the user is the owner (no company listed)
            if (user.role === 'owner') {
                return res.json({
                    name: user.name,
                    companyName: null, // Owner doesn't have a company
                    role: user.role,
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