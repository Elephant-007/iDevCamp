const express = require('express');
const router = express.Router();

// get all bootcamp
router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
});

// get single bootcamp
router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
});

// post
router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Created new bootcamp' });
});

// put
router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Updated bootcamp ${req.params.id}` });
});

// delete
router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Deleted bootcamp ${req.params.id}` });
});

module.exports = router;
