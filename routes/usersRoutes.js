import { Router } from "express";
import { getUsers } from "../controllers/usersController.js";

const usersRoutes = new Router();

// CRUD: create, read, update, delete
usersRoutes.route("/")
    .get(getUsers);
    // .put()
    // .push()
    // .delete();

export default usersRoutes;