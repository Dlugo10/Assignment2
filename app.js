const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000; // You can choose any port you prefer

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the Mongoose model for the "products" collection
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String
});

const Product = mongoose.model('Product', productSchema);

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create the product.' });
  }
});

// Get a list of all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch products.' });
  }
});

// Get a single product by ID
app.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch the product.' });
  }
});

// Update a product by ID
app.put('/products/:productId', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update the product.' });
  }
});

// Delete a product by ID
app.delete('/products/:productId', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete the product.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});