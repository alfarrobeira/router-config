import express from "express";
import usersRoutes from "./routes/usersRoutes.js";

const port = process.env.PORT || 3001;
const server = express();

// middleware applied on all routes to be able to read the req.body in JSON
server.use(express.json());

server.use("/users", usersRoutes);

server.listen(port, () => console.log("Server listening on port " + port));