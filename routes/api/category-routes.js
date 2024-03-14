const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// find all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: [{ id: req.params.id }],

      include: [{ model: Product }],
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    // Create the category
    const category = await Category.create({ category_name });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    // Find the category by ID
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Update the category's name
    category.category_name = category_name;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the category by ID
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
