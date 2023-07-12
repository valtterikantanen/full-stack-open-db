const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { tokenExtractor } = require('../middlewares/tokenExtractor');

router.get('/', async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } }
      ]
    };
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User },
    where,
    order: [['likes', 'desc']]
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).end();
    }
    if (req.decodedToken.id !== blog.userId) {
      return res.status(403).end();
    }
    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).end();
    }
    if (req.body.likes === undefined) {
      return res.status(400).end();
    }
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
