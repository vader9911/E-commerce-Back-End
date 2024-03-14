const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
  // find all tags
router.get('/', async (req, res) => {


  try {
    const tags = await Tag.findAll({
      include: [{ model: Product}]
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }

});
  // find a single tag by its `id`
router.get('/:id',async (req, res) => {
  try {
    const tag = await Tag.findOne({
         where: [{ id: req.params.id }],

        include: [{ model: Product }],
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    const tag = await Tag.create({ tag_name });
    // Return success message along with the created tag
    res.status(201).json({ message: 'Tag created successfully', tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    // Find the tag by ID
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    tag.tag_name = tag_name;
    await tag.save();
    // Return success message along with the updated tag
    res.status(200).json({ message: 'Tag updated successfully', tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find the tag by ID
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    // Delete the tag
    await tag.destroy();

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
