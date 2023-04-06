import dbConn from "../db/pg.js";
import { body, validationResult } from "express-validator";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { query } from "express";

// READ:
// GET /users ⇒ return all users
const getUsers = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM users";

  const { rows } = await dbConn.query(query);

  res.send(rows);
});

// GET /users/:id ⇒ return a single user
const getUser = asyncHandler(async (req, res) => {
  // middleware function "userExists" has checked whether user is in db
  // and attached user to the request

  res.json(req.user);
});

// POST /users ⇒ create a new user
// The information to create the user should come from req.body.
// Send a status code of 400 (bad request) if no firstname or lastname is present in the body of the request
// Implement express-validator (or any other validation middleware) to validate/sanitize the input sent by the client
// Create a dynamic parameterized SQL query with the firstname and lastname to create a user in the database
const createUser = asyncHandler(
  // names must be at least 3 chars long
  body("first_name").isLength({ min: 3 }),
  body("last_name").isLength({ min: 3 }),
  body("age").isNumeric({min: 1}),
  // email must be provided in right format
  body("email").isEmail(),
  async (req, res) => {
    console.log("Hello from createUser.");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get verified data from request body
    const { first_name, last_name, age, email } = req.body;
    const query =
      "INSERT INTO users (first_name, last_name, age, email) VALUES ($1, $2, $3, $4) RETURNING *";

    const {
      rows: [user],
    } = await dbConn.query(query, [first_name, last_name, age, email]);

    res.status(201).json(user);
  }
);

// UPDATE:
// PUT /users/:id ⇒ update a specific user
// - Get the id, firstname and lastname from the request object
// - Send a status code of 400 (bad request) if no firstname or lastname is found
// - Check the existence of the target user in the database. If the user does not exist, send a status code of 404 (not found) back
// - Dynamically create a parameterized SQL query according to the existence of the 2 variables (firstname/lastname). 
// - If there is an error during the DB request, send a status code 500 (internal server error) to the client
const updateUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { first_name, last_name, age, email } = req.body;

    // Todo: use validator to check firstName, lastName, email

    // middleware function "userExists" has checked whether user is in db

    const updateQuery = "UPDATE users SET first_name=$1, last_name=$2, age=$3, email=$4 WHERE id=$5 RETURNING *"
    const { rows: [user]} = await dbConn.query(updateQuery, [first_name, last_name, age, email, id])
    if (!user)
        return res.status(500).send("Could not update user.")

    res.json(user);
})

// DELETE:
// DELETE /users/:id ⇒ delete a specific user
// - If there is an error during the DB request, send a status code 500 (internal server error) to the client
const deleteUser = asyncHandler(async (req, res) => {
  // Check wether user exists, is handled by middleware function
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id=$1 RETURNING *";

  const { rows: [user]} = await dbConn.query(query, [id]);
  if (!user) 
    return res.status(500).send("Could not delete user.")

  res.json(user);
});


export { getUsers, getUser, createUser, updateUser, deleteUser };
