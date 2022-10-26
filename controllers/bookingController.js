import { Personal, Profession, Session, User, Booking } from "../models";
import bookingSchema from "../validators/bookingSchema";

const bookingController = {
  // get  All classes/or bookings
  async index(req, res, next) {},
  
  // book a session
  async store(req, res, next) {
    console.log("req.body", req.body);
    // validation
    const { error } = bookingSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    let document,
      success,
      message = "",
      statusCode,
      booking;
    const { trainerId, sessionId } = req.body;
    // try {
    booking = await Booking.create({
      trainer: trainerId,
      trainee: req.user._id,
      session: sessionId,
    });
    if (booking) {
      (message = "session booked"), (statusCode = 201), (success = true);
    } else {
      message = "not booked";
      success = false;
      statusCode = 404;
    }
    document = {
      statusCode,
      success,
      message,
      data: booking,
    };
    res.status(statusCode).json(document);
    // } catch (err) {
    //   return next(err);
    // }
  },

  async update(req, res, next) {},

  async show(req, res, next) {
  },

  // get trainer booked sessions
  async getByTrainerId(req, res, next) {
    let document,
      personal_info,
      profession_info,
      success,
      message = "",
      statusCode,
      booking;

    try {
      booking = await Booking.find({ trainer: req.params.id })
        .populate({
          path: "trainee",
          model: "User",
          select: "email numReviews averageRating role",
        })
        .populate({
          path: "session",
          model: "Session",
          populate: {
            path: "user",
            model: "User",
            select: "email numReviews averageRating role",
          },
        })
        .select("-updatedAt -__v");
      if (booking) {
        personal_info = await Personal.findOne({ user: req.params.id }).select(
          "-updatedAt -__v"
        );
        profession_info = await Profession.findOne({
          user: req.params.id,
        }).select("-updatedAt -__v");

        message = "get bookings successfully";
        statusCode = 200;
        success = true;
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: {
          booking,
          personal_info,
          profession_info,
        },
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  // get trainee booked sessions
  async getByTraineeId(req, res, next) {
    let document,
      personal_info,
      profession_info,
      success,
      message = "",
      statusCode,
      booking;

    try {
      booking = await Booking.find({ trainee: req.params.id })
        .populate({
          path: "trainer",
          model: "User",
          select: "email numReviews averageRating role",
        })
        .populate({
          path: "session",
          model: "Session",
          populate: {
            path: "user",
            model: "User",
            select: "email numReviews averageRating role",
          },
        })
        .select("-updatedAt -__v");
      if (booking) {
        personal_info = await Personal.findOne({ user: req.params.id }).select(
          "-updatedAt -__v"
        );
        profession_info = await Profession.findOne({
          user: req.params.id,
        }).select("-updatedAt -__v");

        message = "get bookings successfully";
        statusCode = 200;
        success = true;
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: {
          booking,
          personal_info,
          profession_info,
        },
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
};

export default bookingController;
