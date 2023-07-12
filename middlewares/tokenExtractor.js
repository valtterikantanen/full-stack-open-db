const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

async function tokenExtractor(req, res, next) {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const user = await User.findByPk(req.decodedToken.id);
      if (user.disabled) {
        return res.status(403).json({ error: 'Account disabled, please contact admin' });
      }
      const session = await Session.findByPk(authorization.substring(7));
      if (!session) {
        return res.status(401).json({ error: 'Token expired, please log in' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Missing token' });
  }
  next();
}

module.exports = { tokenExtractor };
