// const User = require("../models/User.js");
// const jwt = require("jsonwebtoken");

// // Helper to generate JWT
// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// // POST /api/auth/login
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Check user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, error: "Invalid credentials" });
//     }

//     // 2. Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res
//         .status(401)
//         .json({ success: false, error: "Invalid credentials" });
//     }

//     // 3. Generate token
//     const token = signToken(user._id);

//     // 4. Send cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // set to true in production (HTTPS)
//       sameSite: "lax",
//       maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     });

//     // 5. Send response with user data (without password)
//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // POST /api/auth/logout
// exports.logout = (req, res) => {
//   res.cookie("token", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });
//   res.status(200).json({ success: true, message: "Logged out" });
// };

// // GET /api/auth/me  (protected)
// exports.getMe = async (req, res) => {
//   // req.user is already attached by protect middleware
//   res.status(200).json({
//     success: true,
//     data: req.user,
//   });
// };

const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ======================================
// LOGIN
// ======================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate token
    const token = signToken(user._id);

    // ======================================
    // COOKIE FIX
    // ======================================

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true in production (HTTPS)
      sameSite: "none", // required for cross-origin cookies
      partitioned: true, // helps with modern Chrome privacy sandbox
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });

    // Response
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ======================================
// LOGOUT
// ======================================

exports.logout = (req, res) => {
  // res.cookie("token", "", {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   expires: new Date(0),
  // });

  // Inside your logout controller
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    partitioned: true,
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};;

// ======================================
// GET ME
// ======================================

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};