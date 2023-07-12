function errorHandler(error, req, res, next) {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: error.errors.map(e => e.message).join(', ') });
  }

  if (
    error.name === 'SequelizeDatabaseError' ||
    error.name === 'SyntaxError' ||
    error.name === 'SequelizeForeignKeyConstraintError'
  ) {
    return res.status(400).send({ error: error.message });
  }

  next(error);
}

module.exports = { errorHandler };
