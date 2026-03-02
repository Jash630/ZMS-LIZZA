const Product = require('../models/Product');
const mongoose = require("mongoose");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get single product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      price,
    } = req.body;

    const imagePaths = req.files.map(
      (file) => `uploads/${file.filename}`
    );

    const newProduct = new Product({
      title,
      slug,
      shortDescription,
      fullDescription,
      price,
      images: imagePaths,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      price,
      isActive,
    } = req.body;

    product.title = title || product.title;
    product.slug = slug || product.slug;
    product.shortDescription = shortDescription || product.shortDescription;
    product.fullDescription = fullDescription || product.fullDescription;
    product.price = price || product.price;
    product.isActive = isActive ?? product.isActive;

    if (req.files && req.files.length > 0) {
      product.images = req.files.map(
        (file) => `uploads/${file.filename}`
      );
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};



module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
