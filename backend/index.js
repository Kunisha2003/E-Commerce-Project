const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const connection = require("./config/db.js")
const userRoutes = require("./routes/userRoute.js")
const categoryRoutes  = require("./routes/categoryRoutes.js");
const { createCategoryTable } = require("./models/categoryModel.js");
const productRoutes = require("./routes/productRoutes.js")
const {createProductsTable , createReviewsTable} = require("./models/productsModel.js")
const uploadRoutes = require("./routes/uploadRoutes.js")
const {
  createOrdersTable,
  createOrderItemsTable,
  createShippingAddressesTable,
  createPaymentResultsTable,
} = require("./models/orderModel.js");
const orderRoutes = require("./routes/orderRoutes.js")


dotenv.config();


const port = 5000 || process.env.PORT ;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  }));

connection;

(async () => {
  await createCategoryTable();
})();

(async () => {
  await createProductsTable();
})();

(async () => {
  await createReviewsTable();
})();

(async () => {
  await createOrdersTable();
  await createOrderItemsTable();
  await createShippingAddressesTable();
  await createPaymentResultsTable();
})();


app.use("/api/users" , userRoutes);
app.use("/api/category" , categoryRoutes)
app.use("/api/products" , productRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/orders", orderRoutes)

// const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port , ()=>{
    console.log(`Server is running on port number ${port}`);
})