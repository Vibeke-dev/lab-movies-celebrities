// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

//1. CREATE

//Get celebrity names
router.get("/movie/create", (req, res) => {
    Celebrity.find()
      .then((dbCelebrities) => {
        res.render("movies/new-movie", { dbCelebrities });
      })
      .catch((err) => console.log(`Err while displaying post input page: ${err}`));
  });

// POST route to save the new celebrities to the database
router.post('/movie/create', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
   
    Movie.create({ title, genre, plot, cast })
      .then(dbMovies => {
        console.log(dbMovies._id)
        return Celebrity.findByIdAndUpdate(cast, { $push: { movies: dbMovies._id } });
      })
      .then(() => res.redirect('/movie'))
      .catch(err => {
        console.log(`Err while creating the movies in the DB: ${err}`);
        next(err);
      });
  });

//2. READ
// GET route to retrieve and display all the movies
router.get("/movie", (req, res, next) => {
    Movie.find()
      .then((allTheMoviesFromDB) => {
        //console.log("Retrieved celebrities from DB:", allTheMoviesFromDB);
        res.render("movies/movies.hbs", { movies: allTheMoviesFromDB });
      })
      .catch((error) => {
        console.log("Error while getting the movies from the DB: ", error);
        next(error);
      });
  });

  //Movie details
  router.get('/movies/:id', (req, res, next) => {
    const { id } = req.params;
    Movie.findById(id)
      .populate('cast') 
      .then(foundMovie => {
          //console.log(foundMovie) 
          res.render('movies/movie-details', {foundMovie})
        })
      .catch(err => {
        console.log(`Err while getting a single movie from the  DB: ${err}`);
        next(err);
      });
  });

  //4. DELETE
// POST route to delete a video from the database
router.post('/movies/:id/delete', (req, res, next) => {
    const { id } = req.params;
   console.log(id)
    Movie.findByIdAndRemove(id)
      .then(() => res.redirect('/movie'))
      .catch(error => next(error));
  });

//3. UPDATE
router.get('/movies/:id/edit', (req, res, next) => {
    const { id } = req.params;
   
    Movie.findById(id)
    .populate('cast') 
    .then(foundMovie => { 
        res.render('movies/edit-movie', {foundMovie})
      })  
      .catch(error => next(error));
  });

  // POST route to actually make updates on a specific movie
router.post('/movies/:id/edit', (req, res, next) => {
  //console.log(req.body);  
  const { id } = req.params;
  const { title, genre, plot, cast } = req.body;
    
   
    Movie.findByIdAndUpdate(id, { title, genre, plot }, { new: true })
      .then(dbMovies => {
        //console.log(cast)
        return Celebrity.findByIdAndUpdate(cast, { $push: { movies: dbMovies._id } });
      })
      .then(() => res.redirect('/movie'))
      .catch(error => next(error));
  });

module.exports = router;