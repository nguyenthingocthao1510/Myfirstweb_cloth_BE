const db = require("../config/dbconnect");

exports.getOne = async (req, res) => {
  try {
    // Ensure the database connection is established before using it
    if (!db) {
      console.error("Database connection not established");
      return res.status(500).json({ message: "Internal server error" });
    }

    const id = req.params.id;

    // Use explicit join syntax in the SQL query
    const result = await db
      .queryAsync("SELECT * FROM products WHERE id = ?", [id])
      .catch((error) => {
        console.error("Database query error:", error);
        throw error;
      });

    console.log("Result from the database:", result);

    if (result.length === 0) {
      return res.status(404).json({ message: "Item not found in the product" });
    }

    // Verify that the column names in the result object match the actual column names
    const item = {
      id: result[0].id,
      user_id: result[0].user_id,
      product_name: result[0].product_name, // Assuming 'name' is the correct column name
      product_type: result[0].product_type,
      price: result[0].price,
      color: result[0].color,
      size: result[0].size,
      material: result[0].material,
      picture_one: result[0].picture_one,
    };

    return res.status(200).json({ item });
  } catch (error) {
    console.log("Error retrieving item from the product", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
