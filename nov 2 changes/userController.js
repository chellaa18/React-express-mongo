const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middlewares/verifyToken");
require("dotenv").config();
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-"  + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
      
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images Only!"); 
        }
    }
}).single('profileImage');



exports.get = async (req, res) => {
  try {
    await User.find({})
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
};

exports.post = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err });
        }
    
        try {
          console.log(req.body);
            const { firstName, lastName, email, password, profileImage } = req.body;
            const encrptPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: encrptPassword,
                profileImage:  path.join("uploads/", req.file.filename)
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ message: "Registration failed", error: error.message });
        }
    });
};


exports.deleteUser = async (req, res) => {
  try {
    const ID = req.params.id;
    await User.deleteOne({ _id: ID })
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, _id } = req.body;

    const result = await User.findByIdAndUpdate(
      { _id: _id },
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }
    );
    res.status(200).json({ message: "User updated successfully", result });
  } catch (error) {
    res.status(400).json({ message: "Request failed", error: error.message });
  }
};

exports.fetchUserbyID = async (req, res, next) => {
  try {
    const ID = req.params.id;
    await User.findOne({ _id: ID })
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    const comparePwd = await bcrypt.compare(password, user.password);

    if (!user) {
      res.status(400).json({ message: "Login failed", error: error.message });
    } else if (!comparePwd) {
      res.status(400).json({ message: "Login failed", error: error.message });
    } else {
      // res.json({user});

      //secret Key
      const secretKey = process.env.SECRET_KEY;
      console.log(secretKey);

      const token = jwt.sign(
        {
          data: user._id,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      res.status(201).json({ token, user, message: "login Success" });
    }
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const tokenVerification = verifyToken(token);

    if (tokenVerification.error) {
      return res.status(401).json({ message: tokenVerification.error });
    }

    const { decoded } = tokenVerification;

    const userID = decoded.data;

    const foundUser = await User.findOne({ _id: userID });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: foundUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};