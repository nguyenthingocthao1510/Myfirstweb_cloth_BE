const db = require("../config/dbconnect");

exports.getAll = async (req, res) => {
  try {
    const result = await db.queryAsync("SELECT * FROM products");

    if (result.length === 0) {
      return res.status(404).json({ message: "No item found in product list" });
    }

    const items = result.map((row) => ({
      id: row.id,
      product_name: row.product_name,
      product_type: row.product_type,
      price: row.price,
      color: row.color,
      size: row.size,
      material: row.material,
      picture_one: row.picture_one,
      picture_two: row.picture_two,
      picture_three: row.picture_three,
    }));

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error retrieving items from the product list: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

exports.searchName = async (req, res) => {
  try {
    // Ensure the database connection is established before using it
    if (!db) {
      console.error("Database connection not established");
      return res.status(500).json({ message: "Internal server error" });
    }

    const encodedProductName = req.params.product_name;
    const decodedProductName = decodeURIComponent(encodedProductName);
    console.log("Decoded Product Name:", decodedProductName);

    console.log("Fetching data for product name:", decodedProductName);

    // Use explicit join syntax in the SQL query
    const result = await db
      .queryAsync("SELECT * FROM products WHERE product_name = ?", [
        decodedProductName,
      ])
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
    };

    return res.status(200).json({ item });
  } catch (error) {
    console.log("Error retrieving item from the product", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
