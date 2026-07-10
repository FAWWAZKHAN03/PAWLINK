require("dotenv").config();

console.log("MONGO_URI =", process.env.MONGO_URI);

const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const start = async () => {
  console.log("MONGO_URI:", uri);
  await connectDB(uri);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

start();
