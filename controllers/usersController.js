import dbConn from "../db/pg.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM users";

  const { rows } = await dbConn.query(query);

  res.send(rows);
});

export { getUsers };
