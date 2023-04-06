import dbConn from "../db/pg.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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
const createUser = asyncHandler(
  async (req, res) => {
    // middleware function has validated input from req.body
    const { first_name, last_name, age, email } = req.body;
    const query =
      "INSERT INTO users (first_name, last_name, age, email) VALUES ($1, $2, $3, $4) RETURNING *";

    const { rows: [user] } = await dbConn.query(query, [first_name, last_name, age, email]);

    res.status(201).json(user);
  }
);


// UPDATE:
// PUT /users/:id ⇒ update a specific user
// If there is an error during the db request, status code 500 (internal server error) is sent
const updateUser = asyncHandler(
  async(req, res) => {
    // middleware functions have checked whether user is in db and validated input from req.body

    const { id } = req.params;
    const { first_name, last_name, age, email } = req.body;

    const updateQuery = "UPDATE users SET first_name=$1, last_name=$2, age=$3, email=$4 WHERE id=$5 RETURNING *"
    const { rows: [user]} = await dbConn.query(updateQuery, [first_name, last_name, age, email, id])
    if (!user)
      throw new apiError("Could not update user.", 500);

    res.json(user);
})

// DELETE:
// DELETE /users/:id ⇒ delete a specific user
// If there is an error during the db request, status code 500 (internal server error) is sent
const deleteUser = asyncHandler(async (req, res) => {
  // middleware function "userExists" has checked whether user is in db
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id=$1 RETURNING *";

  const { rows: [user]} = await dbConn.query(query, [id]);
  if (!user) 
    throw new apiError("Could not delete user.", 500);

  res.json(user);
});


export { getUsers, getUser, createUser, updateUser, deleteUser };
