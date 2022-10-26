import { Personal, Profession, Session, User } from "../models";
import onlineSchema from "../validators/sessionValidators/online";
import physicalSchema from "../validators/sessionValidators/physicalSchema";
import recordedSchema from "../validators/sessionValidators/recordedSchema";
import sessionSchema from "../validators/sessionValidators/sessionSchema";

const sessionController = {
  // get  All classes/or sessions
  async index(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      classes,
      session_user,
      profession_info,
      personal_info;
    let user;
    let user_ids;
    try {
      classes = await Session.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 })
        .populate({ path: "user" });

      if (classes) {
        session_user = await Session.find();

        if (session_user) {
          user_ids = session_user.map((item) => item.user);
          personal_info = await Personal.find({ user: { $in: user_ids } });
          profession_info = await Profession.find({ user: { $in: user_ids } });
        }
        success = true;
        statusCode = 200;
        message = "all classes get successfully";
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
          classes,
          personal_info,
          profession_info,
        },
      };

      res.status(statusCode).json(document);
    } catch (error) {
      return next(error);
    }
  },
  // create session
  async store(req, res, next) {
    console.log("req.body", req.body);
    const {
      session_title,
      class_title,
      select_date,
      class_time,
      duration,
      equipment,
      session_type,
      sports,
      category,
      details,
      price,
      no_of_slots,
      image,
    } = req.body;
    const {
      videoLink,
      recordCategory,
      videoTitle,
      no_of_play,
      desc,
      lat,
      lng,
      meetingLink,
    } = session_type;
    // validation
    const { error } = sessionSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    let err;
    console.log("sessiontype", session_type.type);
    if (session_type.type === "online") {
      const { error } = onlineSchema.validate({ meetingLink });
      err = error;
    } else if (session_type.type === "physical") {
      const { error } = physicalSchema.validate({ lat, lng });
      err = error;
    } else if (session_type.type === "recorded") {
      const { error } = recordedSchema.validate({
        videoLink,
        recordCategory,
        videoTitle,
        no_of_play,
        desc,
      });
      err = error;
    }
    if (err) {
      console.log("helllo", err);
      return next(err);
    }
    let document,
      success,
      message = "",
      statusCode,
      session;

    try {
      session = await Session.create({
        session_title,
        class_title,
        select_date,
        class_time,
        duration,
        equipment,
        session_type,
        sports,
        category,
        details,
        price,
        no_of_slots,
        user: req.user._id,
        image,
      });
      if (session) {
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
        data: session,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
  async update(req, res, next) {
    const {
      session_title,
      class_title,
      select_date,
      class_time,
      duration,
      equipment,
      session_type,
      sports,
      category,
      details,
      price,
      no_of_slots,
      image,
    } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      session;

    try {
      session = await Session.findByIdAndUpdate(
        { _id: req.params.id },
        {
          session_title: session_title,
          class_title: class_title,
          select_date: select_date,
          class_time: class_time,
          duration: duration,
          equipment: equipment,
          session_type: session_type,
          sports: sports,
          category: category,
          details: details,
          price: price,
          no_of_slots: no_of_slots,
          image: image,
        },
        { new: true }
      );
      if (session) {
        (message = "update session successfully"),
          (statusCode = 200),
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
        data: session,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      session;

    try {
      document = await Session.findByIdAndDelete(
        { _id: req.params.id },
        { new: true }
      );
      if (session) {
        (message = "delete session successfully"),
          (statusCode = 200),
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
        data: session,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    let document,
      personal_info,
      profession_info,
      success,
      message = "",
      statusCode,
      session;

    try {
      session = await Session.findById({ _id: req.params.id })
        .populate("user")
        .select("-updatedAt -__v");
      if (session) {
        personal_info = await Personal.findOne({ user: session.user }).select(
          "-updatedAt -__v"
        );
        profession_info = await Profession.findOne({
          user: session.user,
        }).select("-updatedAt -__v");

        message = "get session successfully";
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
          session,
          personal_info,
          profession_info,
        },
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  // get trainer booked session
  async getByTrainerId(req, res, next) {
    let document,
      personal_info,
      profession_info,
      success,
      message = "",
      statusCode,
      session;

    try {
      session = await Session.find({ user: req.params.id })
        .populate("user")
        .select("-updatedAt -__v");
      if (session) {
        personal_info = await Personal.findOne({ user: req.params.id }).select(
          "-updatedAt -__v"
        );
        profession_info = await Profession.findOne({
          user: req.params.id,
        }).select("-updatedAt -__v");

        message = "get session successfully";
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
          session,
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

export default sessionController;
