import { Goal, User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import goalSchema from "../validators/goalSchema";

const goalController = {
  // store goal
  async store(req, res, next) {
    console.log("goal", req.body);
    // validation
    const { error } = goalSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { goal_name, user } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      goal;

    try {
      goal = await Goal.create({
        goal_name,
        user,
      });
      // .select("-__v -updatedAt");
      if (goal) {
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
        data: goal,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  //update goal
  async update(req, res, next) {
    const { goal_name } = req.body;
    let document,
      success,
      message = "",
      statusCode,
      goal;

    try {
      goal = await Goal.findByIdAndUpdate(
        { _id: req.params.id },
        {
          goal_name: goal_name,
        },
        { new: true }
      ).select("-__v -updatedAt");
      if (goal) {
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
        data: goal,
      };
      res.status(statusCode).json(document);
    } catch (err) {
      return next(err);
    }
  },

  // delete goal
  async destroy(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      goal;
    try {
      goal = await Goal.findByIdAndRemove({ _id: req.params.id });
      if (goal) {
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
        data: goal,
      };
      res.status(statusCode).json(document);
    } catch (error) {
      return next(error);
    }
  },

  // Get all goal
  async index(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      goal;
    // pagination mongoose pagination
    try {
      goal = await Goal.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
      if (goal) {
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
      data: goal,
    };
    res.status(statusCode).json(document);
  },

  // get single goal
  async show(req, res, next) {
    let document,
      success,
      message = "",
      statusCode,
      goal;

    // pagination mongoose pagination
    try {
      goal = await Goal.find({ user: req.params.id }).select(
        "-password -updatedAt -__v "
      );
      if (goal) {
        (message = "get data successfully"),
          (statusCode = 201),
          (success = true);
      } else {
        message = "not found";
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
      data: goal,
    };
    res.status(statusCode).json(document);
  },
};

export default goalController;
