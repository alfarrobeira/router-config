import { Router } from "express";
import userExists from "../middleware/userExists.js";
import { getUsers, getUser, createUser, updateUser, deleteUser, testFunc } from "../controllers/usersController.js";

const usersRoutes = new Router();

// CRUD: create, read, update, delete
usersRoutes.route("/")
    .get(getUsers)
    .post(createUser)
    .put(testFunc, userExists, updateUser)
    .delete(userExists, deleteUser);

usersRoutes.get("/:id", userExists, getUser);

export default usersRoutes;