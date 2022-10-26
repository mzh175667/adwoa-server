import { Review, User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";

const updateReview = async (trainer) => {
  let document;

  try {
    const reviewing = await Review.find({ trainer: trainer });
    var sum = 0;

    const reviewsRecive = reviewing.length;
    reviewing.map((item, index) => {
      item.reviews.map((r, i) => {
        console.log("itemreview", r.rating);
        sum = sum + r.rating;
      });
    });
    const average = sum / reviewsRecive;
    document = await User.findByIdAndUpdate(
      {
        _id: trainer,
      },
      {
        numReviews: reviewsRecive,
        averageRating: average,
      }
    );

    console.log("doc", document);

    console.log("....document", document);
    return document;
  } catch (err) {
    return next(err);
  }
};

export default updateReview;
