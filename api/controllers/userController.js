import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{ $set: req.body },{new: true}); //find User by id and update it
        res.status(200).json(updatedUser);
    } catch(err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(createError(404, "User not found!"));

        await User.findByIdAndDelete(req.params.id);

        // Only clear the token if the logged-in user is deleting their own account
        if (req.user.id === req.params.id) {
            res.clearCookie("access_token");
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id); 
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
};
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); 
      
        res.status(200).json(users);
    } catch(err) {
        next(err);
    }
};
