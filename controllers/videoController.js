import { Video } from "../models";
import videoSchema from "../validators/videoSchema";
const videoController = {
  // create profile
  async store(req, res, next) {
    console.log("video", req.body);
    // validation
    const { error } = videoSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      sessionId,
      topic,
      video_links,
      video_category,
      video_details,
      price,
    } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      video;

    try {
      video = await Video.create({
        sessionId,
        topic,
        video_links,
        video_category,
        video_details,
        price,
        user: req.user._id,
      });
      if (video) {
        (message = "created successfully"),
          (statusCode = 201),
          (success = true);
      } else {
        message = "not create";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: video,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
  async index(req, res, next) {
    console.log("video", req.user._id);

    // const {
    //   sessionId,
    //   topic,
    //   video_links,
    //   video_category,
    //   video_details,
    //   price,
    // } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      video;

    try {
      video = await Video.find({ userId: req.body._id });
      if (video) {
        (message = "created successfully"),
          (statusCode = 201),
          (success = true);
      } else {
        message = "not create";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: video,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
};

export default videoController;
