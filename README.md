# INSY7314 – ICE Task 2: Structured Backend API (Movies)

A structured Express backend API built for Learning Unit 2, Theme 1. Movie records
are held in memory and reset whenever the server restarts.

## Setup

```bash
cd api
npm install
node index.js
```

Server runs on `http://localhost:4000`.

## Environment variables

See `api/.env.example`. The real `.env` is kept out of version control.

| Variable | Purpose |
|---|---|
| PORT | Port the server listens on |
| APP_NAME | Application name returned by the root route |
| NODE_ENV | Current environment |
| CLIENT_ORIGIN | The only origin CORS will allow |
| USE_HTTPS | Switches between HTTP and HTTPS |

## Project structure

```
api/
├── controllers/movieController.js
├── middleware/errorHandler.js
├── middleware/validateMovieInput.js
├── routes/movieRoutes.js
├── index.js
└── package.json
```

## Movie attributes

`id`, `title`, `director`, `genre`, `format`, `description`

## Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Root route | 200 |
| GET | `/health` | Server health check | 200 |
| GET | `/api/movies` | Retrieve all movies | 200 |
| GET | `/api/movies/:id` | Retrieve one movie by id | 200 |
| POST | `/api/movies` | Create a new movie | 201 |

## Validation rules

- All fields are required
- All fields must be strings
- Title: 2–60 characters
- Director: 2–60 characters
- Genre: 2–40 characters
- Format: allow-list — DVD, Blu-ray, Digital
- Description: 5–250 characters
- Route `:id` must match `^[a-zA-Z0-9-]+$`

## Error responses

| Status | Meaning |
|---|---|
| 400 | Invalid input or malformed id |
| 404 | Movie not found, or route not found |
| 500 | Unhandled server error, generic message only |

## Sample request bodies used to add five new movies

```json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "genre": "Science Fiction",
  "format": "Digital",
  "description": "A thief who steals secrets through dream-sharing takes on one last job."
}
```

```json
{
  "title": "Parasite",
  "director": "Bong Joon-ho",
  "genre": "Thriller",
  "format": "Blu-ray",
  "description": "A poor family schemes their way into the household of a wealthy one."
}
```

```json
{
  "title": "The Gods Must Be Crazy",
  "director": "Jamie Uys",
  "genre": "Comedy",
  "format": "DVD",
  "description": "A Kalahari bushman sets out to return a bottle that fell from the sky."
}
```

```json
{
  "title": "Mad Max: Fury Road",
  "director": "George Miller",
  "genre": "Action",
  "format": "Blu-ray",
  "description": "A drifter and a rebel flee a warlord's army across a desert wasteland."
}
```

```json
{
  "title": "Whiplash",
  "director": "Damien Chazelle",
  "genre": "Drama",
  "format": "Digital",
  "description": "A young drummer is pushed to breaking point by a ruthless instructor."
}
```

## Known limitations

- In-memory storage, so data resets on restart
- IDs are generated from array length, so they would collide if deletion were added
- No duplicate checking on create
