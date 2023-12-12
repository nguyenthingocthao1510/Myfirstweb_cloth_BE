const db = require("../config/dbconnect");

exports.getAll = async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Retrieve items from the cart for the specified user
    const items = await db.queryAsync(
      "SELECT id, name, type, price, quantity, size, color FROM cart WHERE user_id = ?",
      [userId]
    );

    if (items.length > 0) {
      // Calculate total money and add it to each item
      items.forEach((item) => {
        item.totalmoney = item.price * item.quantity;
      });

      return res.status(200).json({ items, data: true });
    } else {
      return res.status(404).json({ message: "Cart is empty", data: false });
    }
  } catch (error) {
    console.error("Error fetching cart items", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.addOne = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { name, price, type, quantity, size, color } = req.body;

    // ... (validation and user existence checks)

    const result = await db.queryAsync(
      "INSERT INTO cart (user_id, name, price, type, quantity, size, color) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, name, price, type, quantity, size, color]
    );

    if (result.affectedRows === 1) {
      const insertedCartId = result.insertId;

      return res.status(201).json({
        cart_id: insertedCartId,
        message: "Product added to cart",
      });
    } else {
      return res.status(500).json({ message: "Failed to add product to cart" });
    }
  } catch (error) {
    console.error("Error adding product to cart", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const userid = req.params.user_id;
    const result = await db.queryAsync("DELETE FROM cart WHERE  user_id = ?", [
      userid,
    ]);
    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: "Product not found in the cart",
      });
    }
    res.status(200).json({
      message: "Product deleted from the cart succesfully",
    });
  } catch (error) {
    console.error("Error deleting product in the cart");
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { quantity, size, color } = req.body;
    const id = req.params.id;
    const userid = req.params.user_id;

    if (!quantity || !size || !color) {
      return res.status(400).json({ message: "Bad request." });
    }

    const result = await db.queryAsync(
      "UPDATE cart SET quantity = ? , size = ? , color = ? WHERE id = ? AND user_id = ?",
      [quantity, size, color, id, userid]
    );

    if (result.affectedRows === 1) {
      const updatedItem = {
        quantity: quantity,
        size: size,
        color: color,
      };

      return res.status(200).json({
        item: updatedItem,
        message: "Product is updated in cart",
      });
    } else {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
  } catch (error) {
    console.log("Error updating product", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getuser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.queryAsync("SELECT id FROM accounts WHERE id = ?", [
      id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No user found in user list" });
    }

    const items = {
      id: result[0].id,
    };

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error retrieving user from the user list: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
