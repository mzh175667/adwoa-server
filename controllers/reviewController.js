import { Review } from "../models";
import updateReview from "../helper/reviewUpdate";
import CustomErrorHandler from "../services/CustomErrorHandler";
const ratingController = {
  // create profile
  async store(req, res, next) {
    console.log("sdajfhweuhdskl....", req.body);
    const { reviews, trainer, rating, alreadyReview } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      reviewData,
      documentSave,
      update;

    try {
      reviewData = new Review({
        // reviews,
        reviews,
        rating,
        trainer,
        alreadyReview: false,
        user: req.user._id,
      });

      if (reviewData.alreadyReview) {
        console.log("alreadyExist");
        return next(CustomErrorHandler.alreadyExist("alreadyExist"));
      } else {
        (statusCode = 201),
          (success = true),
          (message = "reviews submit successfully"),
          (documentSave = await reviewData.save());

        update = await updateReview(trainer);

        console.log("update....", update);
      }
    } catch (err) {
      return next(err);
    }
    document = {
      statusCode,
      success,
      message,
      data: documentSave,
    };
    res.status(statusCode).json(document);
  },

  //Review Show trainer
  async show(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      reviewing;
    try {
      reviewing = await Review.find({ trainer: req.params.id });
      if (reviewing) {
        (message = "created successfully"),
          (statusCode = 201),
          (success = true);
        console.log("reviewing", reviewing);
      } else {
        message = "not create";
        success = false;
        statusCode = 404;
      }
    } catch (err) {
      return next(err);
    }
    document = {
      statusCode,
      success,
      message,
      data: reviewing,
    };
    res.status(statusCode).json(document);
  },
};

export default ratingController;
