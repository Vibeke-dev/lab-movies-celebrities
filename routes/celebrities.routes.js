// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");

//1. CREATE
router.get('/celebrities/create', (req, res) => res.render('celebrities/new-celebrity.hbs'));

// POST route to save the new celebrities to the database
router.post('/celebrities/create', (req, res, next) => {
    // console.log(req.body);
    const { name, occupation, catchPhrase } = req.body;
   
    Celebrity.create({ name, occupation, catchPhrase })
    .then(() => res.redirect('/celebrities'))
    .catch(error => res.redirect('/celebrities/new-celebrity'));
  });

//2. READ
// GET route to retrieve and display all the celebrities
router.get("/celebrities", (req, res, next) => {
    Celebrity.find()
      .then((allTheCelebritiesFromDB) => {
        console.log("Retrieved celebrities from DB:", allTheCelebritiesFromDB);
  
        res.render("celebrities/celebrities.hbs", { celebrities: allTheCelebritiesFromDB });
      })
      .catch((error) => {
        console.log("Error while getting the celebrities from the DB: ", error);
  
        // Call the error-middleware to display the error page to the user
        next(error);
      });
  });

module.exports = router;