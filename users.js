var express = require("express");
var router = express.Router();
const multer = require("multer");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

const verifyTkn = () =>{

}

router.get("/", function (req, res, next) {
  try {
    User.find({})
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const { firstName, lastName, email, password } = req.body;
    const encrbtPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: encrbtPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
});

// router.get("/fetchuser/:id", function (req, res, next) {
//   try {
//     const ID = req.params.id;
//     User.findOne({ _id: ID })
//       .then((data) => res.json({ data }))
//       .catch((err) => res.json(err));
//   } catch (error) {
//     console.log(error);
//   }
// });

router.delete("/deleteuser/:id", function (req, res, next) {
  try {
    const ID = req.params.id;
    User.deleteOne({ _id: ID })
      .then((data) => res.json({ data }))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateuser/:id", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    const comparePwd = await bcrypt.compare(password, user.password);

    if (!user) {
      res.status(400).json({ message: "Login failed", error: error.message });
    }else if(!comparePwd ){
      res.status(400).json({ message: "Login failed", error: error.message });
    } else {
      // res.json({user});

     const token =  jwt.sign(
        {
          data: user._id,
        },
        "7urtmrewte5wuytyutyiuyt",
        { expiresIn: "1hr" }
      );

      res.status(201).json({ token, user, message: "login Success" });
    }
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
});

router.get("/getSingle", async function (req, res, next) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const tokenValue = token.split(' ')[1]; 

  try {
    const decoded = jwt.verify(tokenValue, "7urtmrewte5wuytyutyiuyt");

    const userID = decoded.data;

    User.findOne({ _id: userID })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data });
      })
      .catch((err) => res.status(500).json({ message: "Error fetching user", error: err }));
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});


module.exports = router;
