import express from "express";
import listEndpoints from "express-list-endpoints";

import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import productsRouter from "./api/products/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import reviewsRouter from "./api/reviews/index.js";

const server = express();
const port = process.env.PORT;

// ****************************** MIDDLEWARES ******************************

server.use(cors());
server.use(express.json());

// ******************************* ENDPOINTS *******************************

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

// ***************************** ERROR HANDLERS ****************************

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });

  console.log("Successfully connected to Mongo!");
});
