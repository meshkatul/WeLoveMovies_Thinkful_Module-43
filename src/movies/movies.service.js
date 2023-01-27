const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");


const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

//get all movies(GET /movies)
function list() {
  return knex("movies").select("*");
}

//get all movies which are showing in theaters(GET /movies?is_showing=true)
function listMoviesInTheaters() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

//get movies by movieId(GET /movies/:movieId)
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

//get all the theaters where the movie is playing(GET /movies/:movieId/theaters)
function theaterListForMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ "mt.movie_id": movieId, "mt.is_showing": true });
}

//get all the reviews for the movie, including all the critic details(GET /movies/:movieId/reviews)
function reviewListForMovie(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId })
    .then((data) => data.map(addCritic));
}

module.exports = {
    list,
    listMoviesInTheaters,
    read,
    theaterListForMovie,
    reviewListForMovie,
}