import { Service, User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import serviceSchema from "../validators/serviceSchema";

const serviceController = {
  // store service
  async store(req, res, next) {
    console.log("services", req.body);
    // validation
    const { error } = serviceSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { service_name, user } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      service;

    try {
      service = await Service.create({
        service_name,
        user,
      });
      // .select("-__v -updatedAt");
      if (service) {
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
        data: service,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  //update service
  async update(req, res, next) {
    const { service_name } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      service;

    try {
      service = await Service.findByIdAndUpdate(
        { _id: req.params.id },
        {
          service_name: service_name,
        },
        { new: true }
      ).select("-__v -updatedAt");
      if (service) {
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
        data: service,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  // delete service
  async destroy(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      service;
    try {
      service = await Service.findByIdAndRemove({ _id: req.params.id });
      if (service) {
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
        data: service,
      };
      res.status(statusCode).json(document);
    } catch (error) {
      return next(error);
    }
  },

  // Get all service
  async index(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      service;
    // pagination mongoose pagination
    try {
      service = await Service.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
      if (service) {
        (message = "get all data successfully"),
          (statusCode = 201),
          (success = true);
      } else {
        message = "not create";
        success = false;
        statusCode = 404;
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    document = {
      statusCode,
      success,
      message,
      data: service,
    };
    res.status(statusCode).json(document);
  },

  // get single service
  async show(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      service;
    // pagination mongoose pagination
    try {
      service = await Service.find({ user: req.params.id }).select(
        "-password -updatedAt -__v "
      );
      if (service) {
        (message = "get data successfully"),
          (statusCode = 201),
          (success = true);
      } else {
        message = "not create";
        success = false;
        statusCode = 404;
      }

      // const { password, ...data } = document;
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    document = {
      statusCode,
      success,
      message,
      data: service,
    };
    res.status(statusCode).json(document);
  },
};

export default serviceController;
