const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// // ================= REGISTER ADMIN =================
// const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newAdmin = new Admin({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || "editor",
//     });

//     await newAdmin.save();

//     res.status(201).json({ message: "Admin created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating admin" });
//   }
// };

// ================= LOGIN ADMIN =================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ( !email || !password){
        return res.status(400).json({message: "Anyone Field Is Missing"});
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// const deleteAdmin = async (req, res) => {
//   try {
//     if (req.admin.id === req.params.id) {
//       return res.status(400).json({ message: "Cannot delete yourself" });
//     }

//     const admin = await Admin.findById(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     await admin.deleteOne();

//     res.json({ message: "Admin deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting admin" });
//   }
// };

module.exports = {getAdmins, loginAdmin}