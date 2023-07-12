const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ where: { username: body.username } });

  const passwordCorrect = body.password === 'salainen';

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (user.disabled) {
    return res.status(401).json({ error: 'Account disabled, please contact admin' });
  }

  const userForToken = { username: user.username, id: user.id };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({ token: token, userId: user.id });

  res.status(201).send({ token, username: user.username, name: user.name });
});

module.exports = router;
