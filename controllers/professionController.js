import { Profession } from "../models";
import professionSchema from "../validators/professionSchema";

const professionController = {
  // create profile
  async store(req, res, next) {
    // validation
    const { error } = professionSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { experience_year, experience_note, qualification } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      profession;

    try {
      profession = await Profession.create({
        experience_year,
        experience_note,
        qualification,
        user: req.user._id,
      });
      if (profession) {
        (message = "create profession info successfully"),
          (statusCode = 201),
          (success = true);
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
      data: profession,
    };
    res.status(statusCode).json(document);
  },
  async index(req, res, next) {
    let document, statusCode, success, message, profession;

    try {
      profession = await Profession.find();
      if (profession) {
        success = true;
        statusCode = 200;
        message = "get all profession info users  successfully";
      } else {
        message = "not found";
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
      data: profession,
    };

    res.status(statusCode).json(document);
  },
  async show(req, res, next) {
    let document, statusCode, success, message, profession;

    try {
      profession = await Profession.find({ user: req.params.userId });
      if (profession) {
        success = true;
        statusCode = 200;
        message = "profession info get successfully";
      } else {
        message = "not found";
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
      data: profession,
    };
    res.status(statusCode).json(document);
  },

  //update profile info
  async update(req, res, next) {
    // Multipart from data
    // handleMultipartData(req, res, async (err) => {

    // validation
    const { error } = professionSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { experience_year, experience_note, qualification } = req.body;

    let document,
      success,
      message = "",
      statusCode,
      profession;

    try {
      profession = await Profession.findOneAndUpdate(
        { _id: req.params.id },
        {
          experience_year,
          experience_note,
          qualification,
          user: req.user._id,
        },
        { new: true }
      );

      if (profession) {
        success = true;
        statusCode = 200;
        message = "profession info update successfully";
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        profession: profession,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
};

export default professionController;
