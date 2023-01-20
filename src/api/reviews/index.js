import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import ReviewsModel from "./model.js";
import ProductsModel from "../products/model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId", async (req, res, next) => {
  try {
    const review = new ReviewsModel(req.body);
    const { _id } = await review.save();
    if (review) {
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        { $push: { reviews: _id } },
        { new: true, runValidators: true }
      );
      if (updatedProduct) {
        res.send(_id);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found!`
          )
        );
      }
    } else {
      next(createHttpError(400, `Please add a valid review`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId).populate(
      { path: "reviews" }
    );
    if (product) {
      res.send(product.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findById(req.params.reviewId);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:productId/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await ReviewsModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedReview) {
      res.send(updatedReview);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:productId/:reviewId", async (req, res, next) => {
  try {
    const deletedReview = await ReviewsModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (deletedReview) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Review with id ${req.params.reviewId}`));
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
