import User from '../models/user.js';
import OTP from '../models/otp.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
    const { name, email, password, otp } = req.body

    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })

        }
        const hashedpassword = await bcryptjs.hash(password, 10)
        const opt = await OTP.findOne({ email, otp })
        if (!opt) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        const newUser = await User.create({ name, email, password: hashedpassword })
        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email

        }, process.env.JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        })

        newUser.password = undefined
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error: error })
    }
}

export async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "User Not Found!!" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password!!" })
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email

        }, process.env.JWT_SECRET)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        })

        user.password = undefined
        res.status(200).json({
            message: "User logged in successfully",
            user: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error: error })
    }
}

export async function getMe(req, res) {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function changePassword(req, res) {
    const { newPassword, otp } = req.body;

    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP instead of current password
        const validOtp = await OTP.findOne({ email: user.email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash and update new password
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
