import User from '../models/user-model.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register
export const registerUser = async(req, res) => {
const { username, email, password} = req.body;
try{
    //check if the user already exists
    const existingUser = await User.findOne({ email});
    if(existingUser){
        return res.status(400).json({message : "User already exists"});
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = new User({
        username,
        email,
        password : hashedPassword
    });
    
    //Save user to database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
}
catch(err){
    res.status(500).json({ message: "Registration Failed", error: err.message });
}
};

//Login
export const loginUser = async(req, res) => {
const { email, password } = req.body;
try{
    //Check if user exists
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message : "User does not exist"});
    }
    //Check password\
    const isMatch =  await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message : "Invalid credentials"});
    }
    //Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
        message : "Login successful",
        token,
        user:{
            id : user._id,
            username: user.username,
            email: user.email
        }
    });
}
catch(err){
    res.status(500).json({message : "Login Failed", error : err.message});
}
};

// USER LOGIN FLOW USING JWT
// 1. User sends login credentials (email & password) via POST request.
// 2. Backend finds user in DB by email using User.findOne({ email }).
// 3. If user exists → bcrypt compares hashed password with provided one.
// 4. If password matches:
//      ➤ A JWT token is created using user's _id (or other data).
//      ➤ jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' })
// 5. This JWT token is sent in the response to the frontend.
// 6. Frontend stores this token (in localStorage or cookies).
// 7. For all future API requests, frontend attaches the token in the headers:
//      ➤ { Authorization: "Bearer <token>" }
// 8. A middleware checks token in each protected route to verify user:
//      ➤ jwt.verify(token, SECRET_KEY) → gives back userId if valid.
// 9. If token is valid → user is authenticated & allowed to access the route.
