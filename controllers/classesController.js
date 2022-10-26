import errorHandler from "../middlewares/errorHandler";
import { Classes } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import classesSchema from "../validators/classesSchema";

const classesController = {
  // create classes
  async store(req, res, next) {
    const { error } = classesSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { class_name, class_des, class_format, class_links, class_type } =
      req.body;
    let document,
      success,
      message = "",
      statusCode,
      classes;
    try {
      const classesSave = new Classes({
        class_name: class_name,
        class_des: class_des,
        class_format: class_format,
        class_links: class_links,
        class_type: class_type,
      });
      classes = await classesSave.save();
      if (classes) {
        success = true;
        statusCode = 201;
        message = "classes created successfully";
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
    } catch (error) {
      return next(error);
    }
    document = {
      statusCode,
      success,
      message,
      data: classes,
    };

    res.status(statusCode).json(document);
  },
  // get classes
  async show(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      classes;
    try {
      classes = await Classes.findById({ _id: req.params.id });
      if (classes) {
        success = true;
        statusCode = 200;
        message = "get classes info successfully";
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: classes,
      };

      res.status(statusCode).json(document);
    } catch (error) {
      return next(error);
    }
  },
  // get  All classes
  async index(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      classes;
    try {
      classes = await Classes.find();
      if (classes) {
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
        data: classes,
      };

      res.status(statusCode).json(document);
    } catch (error) {
      return next(error);
    }
  },
  // delete classes
  async destroy(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      classes;
    try {
      classes = await Classes.findyIdAndDelete({ _id: req.prams.id });
      console.log("delete", classes);
      if (classes == null) {
        success = true;
        statusCode = 200;
        message = "delete classes  successfully";
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: classes,
      };

      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },
  // update classes
  async update(req, res, next) {
    const { class_name, class_des, class_format, class_links, class_type } =
      req.body;
    let document,
      success,
      message = "",
      statusCode,
      classes;
    try {
      classes = await Classes.findByIdAndUpdate(
        { _id: req.params.id },
        {
          class_name: class_name,
          class_des: class_des,
          class_format: class_format,
          class_links: class_links,
          class_type: class_type,
        },
        { new: true }
      );
      if (classes) {
        success = true;
        statusCode = 200;
        message = "update classes  successfully";
      } else {
        message = "not found";
        success = false;
        statusCode = 404;
      }
      document = {
        statusCode,
        success,
        message,
        data: classes,
      };

      res.status(statusCode).json(document);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
  },
};

export default classesController;
