import User from '../model/Users.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.redirect("back");
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedInfo) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send("Internal Server Error");
        }
        try {
            const user = await User.findById(decodedInfo.id);
            if (!user || !user.isAdmin) {
                return res.redirect("back");
            }
            next();
        }
        catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).send("Internal Server Error");
        }
    });
};
export const checkUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedinfo) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedinfo.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
};
//# sourceMappingURL=authMiddleware.js.map