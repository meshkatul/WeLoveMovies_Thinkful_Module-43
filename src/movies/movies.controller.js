const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExist(req, res, next){
    const { movieId } = req.params;
    const foundMovie = await service.read(movieId);
    if(foundMovie){
        res.locals.movie = foundMovie;
        return next();
    }
    return next({ status: 404, message: "Movie can not be found"});
}



async function list(req, res){
    if(req.query.is_showing){
        const data = await service.listMoviesInTheaters();
        res.json({ data });
    } else {
        const data = await service.list();
        res.json({ data });
    }
}

async function read(req, res){
    const data = res.locals.movie;
    res.json({ data });
}

async function theaterListForMovie(req, res){
    const data = await service.theaterListForMovie(res.locals.movie.movie_id);
    res.json({ data });
}

async function reviewListForMovie(req, res){
    const data = await service.reviewListForMovie(res.locals.movie.movie_id);
    res.json({ data });
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExist), read],
    theaterListForMovie: [asyncErrorBoundary(movieExist), asyncErrorBoundary(theaterListForMovie)],
    reviewListForMovie: [asyncErrorBoundary(movieExist), asyncErrorBoundary(reviewListForMovie)],
}
