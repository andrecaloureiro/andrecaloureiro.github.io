import users from '../model/userModel.js';

export const create = async (req, res) => {
    try {
        const userData = new users(req.body);
        const { email } = userData;

        const userExist = await users.findOne({ email });
        if (userExist) {
            return res.status(400).json({ error: "user already exists" });
        }
        const savedUser = await userData.save();
        res.status(201).json(savedUser);    
    
    } catch (error) {
        res.status(500).json({ error:"internal server error" });
    }
}


export const getMessage = async (req, res) => {
    try {
        return res,json('Hello World')
    } catch (error) {
        res.status(500).json({ error:"internal server error" });
    }
}