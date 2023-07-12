const router = require('express').Router();

const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ['userId'] } }
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const where = {};
  if (req.query.read) {
    if (req.query.read !== 'true' && req.query.read !== 'false') {
      return res.status(400).end();
    }
    where.read = req.query.read;
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      through: { attributes: ['id', 'read'], where },
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
    }
  });
  if (!user) {
    return res.status(404).end();
  }
  res.json(user);
});

router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    try {
      user.name = req.body.name;
      await user.save();
      res.json(user);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(404).end();
  }
});

module.exports = router;
