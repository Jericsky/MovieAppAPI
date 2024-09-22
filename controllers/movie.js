const Movie = require('../models/Movies');
const Comment = require('../models/Comment')

module.exports.addMovie = async (req,res) => {
    try {
        const {title, director, year, description, genre, comment} = req.body;

        let newMovie = new Movie({
            title,
            director,
            year,
            description,
            genre,
            comment
        })

        return await newMovie.save()
        .then((result) => {
            console.log(result)
            return res.status(201).send(result)
        })
    } catch (error) {
        console.log('Error in adding a movie: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to add a movie'})
    }
}

module.exports.getMovies = async (req, res) => {
    try {
        return await Movie.find({})
        .then((result) => {
            
            if(result.length > 0){
                return res.status(200).send({movies: result})
            } else {
                return res.status(404).send({error: 'No movies found'})
            }
        })
    } catch (error) {
        console.log('Error in gettin movies: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to get movies'})
    }
}

module.exports.getSpecificMovie = async (req, res) => {
    try {

        const {movieId} = req.params;

        const movie = await Movie.findById(movieId)

        if(!movie){
            return res.status(404).send({error: 'Movie not found'})
        }

        res.status(200).send(movie)
        
    } catch (error) {
        console.log('Error in getting specific movie: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to get specific movie'})
    }
}

module.exports.updateMovie = async (req, res) => {
    try {
        const {movieId} = req.params;
        const {title, director, year, description, genre} = req.body;

        if(!movieId){
            return res.status(404).send({error: 'Movie not found'})
        }

        let updatedMovie = {
            title,
            director,
            year,
            description,
            genre
        }

        return await Movie.findByIdAndUpdate(movieId, updatedMovie, {new: true})
        .then((result) => {
            console.log(result)

            if(result){
                return res.status(200).send({
                    message: 'Movie updated successfuly',
                    updatedMovie: result
                })
            } else {
                return res.status(404).send({error: 'Failed. Movie may not exist'})
            }
        })
        
    } catch (error) {
        console.log('Error to update movie: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to update movie'})
    }
}

module.exports.deleteMovie = async (req, res) => {
    try {

        const {movieId} = req.params

        const movie = await Movie.findByIdAndDelete(movieId)

        if(!movie){
            return res.status(400).send({error: 'Movie not exist'})
        }

        res.status(200).send({message: 'Movie deleted successfully'})

    } catch (error) {
        console.log('Faile dto delete movie: ', error)
        return res.status(500).send({error: 'Internal server error: failed to delete movie'})
    }
}

module.exports.addMovieComment = async (req, res) => {
    try {

        const {id} = req.user;
        const {movieId} = req.params;
        const {comment} = req.body;

        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).send({error: 'Movie not found'})
        }

        let newComment = new Comment({
            userId: id,
            comment
        })

        await newComment.save()

        movie.comments.push(
            newComment
        )

        await movie.save()

        const updatedMovie = await Movie.findById(movieId).populate('comments')
        console.log(updatedMovie)

        res.status(201).send(updatedMovie)
        
    } catch (error) {
        console.log('Failed to add comment: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to add comment'})
    }
}

module.exports.getComments = async (req, res) => {
    try {


        const result = await Comment.find({})
        if(!result){
            return res.status(404).send({error: 'No movie found'})
        }
        console.log(result)

        res.status(200).send(result)

    } catch (error) {
        console.log('Failed to get comment: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to get comments'})
    }
}

