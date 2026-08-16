// Validates the movie body on create so that bad or oversized input never makes
// it as far as the controller

// Only these three formats are accepted. An allow-list is safer than trying to
// block bad values one by one anything not on the list is rejected by default
const allowedFormats = ['DVD', 'Blu-ray', 'Digital'];

const validateMovieInput = (req, res, next) => {
  const { title, director, genre, format, description } = req.body;

  if (!title || !director || !genre || !format || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Confirm every field is text before trimming or measuring it so a number or
  // object sent in place of a string can't slip through
  if (
    typeof title !== 'string' ||
    typeof director !== 'string' ||
    typeof genre !== 'string' ||
    typeof format !== 'string' ||
    typeof description !== 'string'
  ) {
    return res.status(400).json({ error: 'All fields must be text values' });
  }

  const trimmedTitle = title.trim();
  const trimmedDirector = director.trim();
  const trimmedGenre = genre.trim();
  const trimmedFormat = format.trim();
  const trimmedDescription = description.trim();

  // Length bounds keep out blank-ish values and cap how much we store per field
  if (trimmedTitle.length < 2 || trimmedTitle.length > 60) {
    return res.status(400).json({ error: 'Title must be between 2 and 60 characters' });
  }

  if (trimmedDirector.length < 2 || trimmedDirector.length > 60) {
    return res.status(400).json({ error: 'Director must be between 2 and 60 characters' });
  }

  if (trimmedGenre.length < 2 || trimmedGenre.length > 40) {
    return res.status(400).json({ error: 'Genre must be between 2 and 40 characters' });
  }

  if (!allowedFormats.includes(trimmedFormat)) {
    return res.status(400).json({ error: 'Format must be DVD, Blu-ray, or Digital' });
  }

  if (trimmedDescription.length < 5 || trimmedDescription.length > 250) {
    return res.status(400).json({ error: 'Description must be between 5 and 250 characters' });
  }

  // Rebuild the body from the trimmed, checked values only. Any extra fields the
  // client tacked on get dropped, so the controller sees nothing but clean data
  req.body = {
    title: trimmedTitle,
    director: trimmedDirector,
    genre: trimmedGenre,
    format: trimmedFormat,
    description: trimmedDescription
  };

  next();
};

module.exports = validateMovieInput;
