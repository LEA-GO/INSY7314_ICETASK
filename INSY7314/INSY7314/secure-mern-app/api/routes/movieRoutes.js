const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  createMovie
} = require('../controllers/movieController');

const validateMovieInput = require('../middleware/validateMovieInput');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Validation is listed ahead of the controller, so a create request has to pass
// it before any record is added
router.post('/', validateMovieInput, createMovie);

module.exports = router;
