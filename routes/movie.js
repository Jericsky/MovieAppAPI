const express = require('express')
const movieControllers = require('../controllers/movie')
const {verify} = require('../auth')
 
const router = express.Router();

router.post('/addMovie',verify, movieControllers.addMovie);

router.get('/getMovies', verify, movieControllers.getMovies)

router.get('/getMovies/:movieId', verify, movieControllers.getSpecificMovie)

router.patch('/updateMovie/:movieId', verify, movieControllers.updateMovie)

router.delete('/deleteMovie/:movieId', verify, movieControllers.deleteMovie)

router.patch('/addComment/:movieId', verify, movieControllers.addMovieComment)

router.get('/getComments/:movieId', verify, movieControllers.getComments)

module.exports = router;