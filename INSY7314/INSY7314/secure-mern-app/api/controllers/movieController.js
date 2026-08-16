// Handlers for the movie routes. The data sits in memory for now so it resets
// every time the server restarts

const movies = [
  {
    id: 'm1',
    title: 'District 9',
    director: 'Neill Blomkamp',
    genre: 'Science Fiction',
    format: 'Blu-ray',
    description: 'Aliens stranded in Johannesburg are confined to a militarised slum.'
  },
  {
    id: 'm2',
    title: 'Tsotsi',
    director: 'Gavin Hood',
    genre: 'Drama',
    format: 'DVD',
    description: 'A young Johannesburg gang leader is forced to face his conscience.'
  }
];

// GET /api/movies
const getAllMovies = (req, res) => {
  // The list view leaves out the description on purpose callers only get the
  // summary fields, so we never hand back more than the list actually needs
  const summary = movies.map(({ id, title, director, genre, format }) => ({
    id,
    title,
    director,
    genre,
    format
  }));

  res.status(200).json({ count: summary.length, data: summary });
};

// GET /api/movies/:id
const getMovieById = (req, res) => {
  const { id } = req.params;

  // Check the id against a whitelist before looking anything up. Anything with
  // unexpected characters (a script tag, quotes a slash) is refused here
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid movie ID format' });
  }

  const movie = movies.find((item) => item.id === id);

  // The id was well-formed but matched nothing, which is a 404 rather than a 400
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.status(200).json({ data: movie });
};

// POST /api/movies
// The body has already passed through validateMovieInput by the time it reaches here
const createMovie = (req, res) => {
  const { title, director, genre, format, description } = req.body;

  const newMovie = {
    id: `m${movies.length + 1}`,
    title,
    director,
    genre,
    format,
    description
  };

  movies.push(newMovie);

  res.status(201).json({ message: 'Movie created', data: newMovie });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie
};
