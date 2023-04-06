import dbConn from "../db/pg.js";

const userExists = async (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id=$1";

  const { rows: [user] } = await dbConn.query(query, [id]);

  if (!user) 
    return res.status(404).send("User not found");

  // add user to request - for the next mw function to use
  req.user = user;
  return next();
};

export default userExists;