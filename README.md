# Smart Groundnut Mill System

A data-driven platform designed for small groundnut mills and farmers to manage crop offers, product sales, inventory, and operational planning using machine learning (GRU).

---

## Problem Statement

Small groundnut mills and their owners lack data-driven tools to forecast crop inflow, manage inventory, and plan transport and labour efficiently.  
This leads to unplanned operations, higher costs, and reduced profits due to uncertain supply and fluctuating demand.

---

## Solution Overview

The Smart Groundnut Mill System connects farmers and mill owners through a single platform and uses time-series prediction to support better planning decisions.

The system enables:
- Farmers to offer harvested crops and buy mill products
- Mill owners to manage stock, accept or reject crop offers, and monitor sales
- Machine-learning-based predictions to plan vehicles, labour, and costs

---

## Key Features

### Farmer Dashboard
- Buy groundnut oil, seeds, and oil cakes
- Offer harvested groundnut crop to mill owners

### Mill Owner Dashboard
- Update and manage product inventory
- View and respond to farmer crop offers
- Planning and prediction dashboard

### ML-Based Planning (GRU Model)
- Predict future trends for:
  - Quantity_kg
  - Crop_Buyed_Cost
  - Transport_Cost
  - Workers_Hired_count
  - Labour_Cost
- Convert predictions into:
  - Vehicle recommendations
  - Labour planning
  - Cost and budget insights

---

## Machine Learning Details

- Model: GRU (Gated Recurrent Unit)
- Library: TensorFlow and Keras
- Input: Historical weekly data (CSV)
- Output: Future predictions with actionable planning insights
- Purpose: Operational and logistics planning

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js
- MySQL

### Machine Learning
- Python
- TensorFlow
- Keras

---

## Project Structure
smart-groundnut-mill-system/<br>
│<br>
├── frontend/<br>
│ ├── index.html<br>
│ └── planning_prediction.html<br>
│<br>
├── backend/<br>
│ ├── server.js<br>
│ ├── predict.py<br>
│ ├── weekly_crop_data.csv<br>
│ ├── package.json<br>
│ └── package-lock.json<br>
| └── .gitignore<br>
│
└── README.md<br>


---
## Deployment

The frontend of the application is deployed on Vercel for live demonstration and easy access.

The backend services (Node.js + MySQL) and the machine learning module (Python + TensorFlow GRU) are fully implemented and included in this repository. These components are designed to run on a server or cloud virtual machine in a real-world deployment scenario.

Vercel is used only for frontend hosting and demonstration purposes.

---

## Backend and Machine Learning Execution

The backend is implemented using Node.js and Express.js and exposes REST APIs for:
- Product and inventory management
- Farmer crop offers and mill owner actions
- Sales, delivery, and profit tracking
- Integration with the machine learning module

The machine learning module is implemented in Python using TensorFlow and Keras. It uses a GRU-based time series model to predict future trends for operational planning such as crop quantity, transport cost, labour requirements, and purchase cost.

The backend triggers the ML module through command-line execution and processes the predicted results to generate actionable planning insights.

---

## How to Run Locally

### Backend (Node.js)

```bash
cd backend
npm install
node server.js


Machine Learning (Python)
conda activate tensorflow-env
python predict.py Quantity_kg 12

Frontend

Open frontend/index.html in a browser
or use Live Server in Visual Studio Code.


Demo

Frontend Demo (Vercel): https://smart-groundnut-mill-system.vercel.app/

