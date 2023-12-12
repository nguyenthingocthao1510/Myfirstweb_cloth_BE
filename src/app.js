const express = require("express");
const LogInRoutes = require("./routes/LogIn");
const app = express();
const RegisterRoutes = require("./routes/Register");
const cors = require("cors");
const swaggerSpec = require("./swagger"); // Import your Swagger specification
const swaggerUi = require("swagger-ui-express"); // Import swagger-ui-express
const profileRoutes = require("./routes/profile");
const { verifyToken } = require("./middleware/authMiddleware");
const passwordRoutes = require("./routes/Password");
const EditProfileRoutes = require("./routes/profile");
const ListAllprofileRoutes = require("./routes/profile-admin");
const productRoutes = require("./routes/product");
const productdetailRoutes = require("./routes/productdetail");
const cartRoutes = require("./routes/cart");
const adminProductRoutes = require("./routes/adminproduct");
const orderRoutes = require("./routes/order");
const orderdetailRoutes = require("./routes/orderdetail")

require("dotenv").config();

// Use built-in middleware for json
app.use(express.json());

// Serve Swagger documentation using Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(cors());

// Enable CORS with the above options
app.use(cors(corsOptions));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Configure routes without passing the db object
app.use("/api", LogInRoutes);
app.use("/api", RegisterRoutes);
app.use("/api/profile", verifyToken, profileRoutes);
app.use("/api", verifyToken, passwordRoutes);
app.use("/api/profile", verifyToken, EditProfileRoutes);
app.use("/api/profile-admin", verifyToken, ListAllprofileRoutes);
app.use("/api", verifyToken, productRoutes);
app.use("/api", verifyToken, productdetailRoutes);
app.use("/api", verifyToken, cartRoutes);
app.use("/api", verifyToken, adminProductRoutes);
app.use("/api/order",verifyToken, orderRoutes)
app.use("/api/orderdetail",verifyToken, orderdetailRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Add the app.listen method to start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
