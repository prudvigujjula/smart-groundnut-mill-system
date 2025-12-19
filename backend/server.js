const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

// ---- Python (TensorFlow env) configuration ----
const PYTHON_PATH = "C:\\Users\\Dell\\anaconda3\\envs\\tensorflow-env\\python.exe";
const PREDICT_SCRIPT = path.join(__dirname, "predict.py");

app.use(cors());
app.use(bodyParser.json());

// ---------------- MySQL Connection ----------------
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',         // replace with your MySQL username
  password: 'Hari@143',         // replace with your MySQL password
  database: 'groundnut_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// ---------------- API Routes ----------------
app.get('/api/predict_gru', (req, res) => {
  const { column, days } = req.query;

  if (!column || !days) {
    return res.status(400).json({ error: "Missing column or days parameter" });
  }

  const command = `"${PYTHON_PATH}" "${PREDICT_SCRIPT}" ${column} ${days}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Python execution error:", err);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "GRU prediction failed" });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseErr) {
      console.error("❌ JSON parse error:", parseErr);
      console.error("Raw output:", stdout);
      res.status(500).json({ error: "Invalid ML output" });
    }
  });
});


// Get all products and stock
app.get('/api/products', (req,res)=>{
  db.query("SELECT * FROM products", (err, result)=>{
    if(err) res.status(500).send(err);
    else res.json(result);
  });
});

// Update product stock (mill owner)
app.post('/api/products/update', (req,res)=>{
  const { product_id, qty } = req.body;
  db.query("UPDATE products SET stock_qty=stock_qty+? WHERE product_id=?", [qty, product_id], (err,result)=>{
    if(err) res.status(500).send(err);
    else res.json({ message: "Stock updated successfully" });
  });
});

// Farmer buys product
app.post('/api/products/buy', (req,res)=>{
  const { product_id, qty } = req.body;
  db.query("SELECT stock_qty, price FROM products WHERE product_id=?", [product_id], (err,result)=>{
    if(err) res.status(500).send(err);
    else {
      if(result[0].stock_qty < qty){
        res.status(400).json({ message:"Not enough stock"});
      } else {
        const cost = result[0].price * qty;
        const transport = qty >= 500 ? qty*10 : 0;
        const labour = qty*5;
        const profit = cost - (transport+labour);

        // Update stock
        db.query("UPDATE products SET stock_qty=stock_qty-? WHERE product_id=?", [qty,product_id]);

        // Record delivery
        db.query("INSERT INTO deliveries (product_id, quantity, cost, transport_cost, labour_cost, total_profit) VALUES (?,?,?,?,?,?)",
        [product_id, qty, cost, transport, labour, profit]);

        res.json({ message: "Purchase successful", delivery: {cost, transport, labour, profit} });
      }
    }
  });
});

// Farmer offers crop
app.post('/api/crop_offer', (req, res) => {
  const { farmer_id, quantity, address, harvest_date, contact, expected_price } = req.body;

  db.query(
    `INSERT INTO crop_offers 
     (farmer_id, quantity, address, harvest_date, contact, expected_price, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
    [farmer_id, quantity, address, harvest_date, contact, expected_price],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Crop offer sent to mill owner" });
    }
  );
});


// Mill owner sees crop offers
app.get('/api/crop_offer', (req,res)=>{
  db.query("SELECT co.offer_id, u.name as farmer, co.quantity, co.address, co.status FROM crop_offers co JOIN users u ON co.farmer_id=u.user_id", (err,result)=>{
    if(err) res.status(500).send(err);
    else res.json(result);
  });
});

// Mill owner accepts/rejects crop
app.post('/api/crop_offer/action', (req,res)=>{
  const { offer_id, action } = req.body; // action = "Bought" or "Rejected"
  db.query("UPDATE crop_offers SET status=? WHERE offer_id=?", [action, offer_id], (err,result)=>{
    if(err) res.status(500).send(err);
    else res.json({ message:"Offer updated"});
  });
});

// Get deliveries / profits
app.get('/api/deliveries', (req,res)=>{
  db.query("SELECT d.delivery_id, p.name as product, d.quantity, d.cost, d.transport_cost, d.labour_cost, d.total_profit FROM deliveries d JOIN products p ON d.product_id=p.product_id", (err,result)=>{
    if(err) res.status(500).send(err);
    else res.json(result);
  });
});

app.listen(PORT, ()=>{
  console.log(`Server running at http://localhost:${PORT}`);
});
