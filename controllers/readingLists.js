const router = require('express').Router();

const { ReadingList } = require('../models');
const { tokenExtractor } = require('../middlewares/tokenExtractor');

router.post('/', async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.create({
      blogId: req.body.blog_id,
      userId: req.body.user_id
    });
    res.status(201).json(readingListEntry);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id);
    if (!readingListEntry) {
      return res.status(404).end();
    }
    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(403).end();
    }
    readingListEntry.read = req.body.read;
    await readingListEntry.save();
    res.json(readingListEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
