import { Router } from "express";
import userExists from "../middleware/userExists.js";
import { userValidation, validateUser } from "../middleware/validateUser.js";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

const usersRoutes = new Router();

// CRUD: create, read, update, delete
usersRoutes.route("/")
    .get(getUsers)
    .post(userValidation, validateUser, createUser);

usersRoutes.route("/:id")
    .get(userExists, getUser)
    .put(userExists, userValidation, validateUser, updateUser)
    .delete(userExists, deleteUser);

export default usersRoutes;