const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExist(req, res, next){
    const { reviewId } = req.params;
    const foundReview = await service.read(reviewId);
    if(foundReview){
        res.locals.review = foundReview;
        return next();
    }

    return next({ status: 404, message: "Review cannot be found."});
}

async function update(req, res){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    }
    const review = await service.update(updatedReview);
    const critic = await service.getReviewWithCritic(res.locals.review.review_id);
    res.json({ data: {...review, ...critic} });
}

async function destroy(req, res){
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
}


module.exports = {
    update: [asyncErrorBoundary(reviewExist), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExist), asyncErrorBoundary(destroy)],
}


