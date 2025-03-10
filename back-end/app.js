import "express-async-errors";
import dotenv from "dotenv";
import connect from "./db/connect.js";
import express from "express";
import authRouter from "./routes/auth.js";
import errorHandler from "./middlewares/error-handler.js";
import notFound from "./middlewares/not-found.js";
import cookieParser from "cookie-parser";
 
// config
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/auth", authRouter);
// app.use("/api/projects", projectRouter);

// middleware
app.use(notFound);
app.use(errorHandler);

// connect to database and start server
const startServer = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer(); 
