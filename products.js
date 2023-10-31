var express = require("express");
var router = express.Router();
const Products = require("../model/productModel");

router.get("/", function (req, res, next) {
    try {
      res.json({message: "products page"})
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/", async (req, res) => {
    // console.log(req.body);
    try {
      const { productName, productPrice, category, stock } = req.body;
  
      const newProduct = new Products({
        productName,
        productPrice,
        category,
        stock,
      });
  
      await newProduct.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Registration failed", error: error.message });
    }
  });

module.exports = router;