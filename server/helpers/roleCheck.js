// middleware/roleCheck.js
import jwt from 'jsonwebtoken'
export const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ message: 'Unauthorised' });

        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
            }
            req.user = user;
            req.userId = user.id;
            next();
        });
    };
};
