import { User } from "../../models";
import Joi, { ref } from "joi";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      res.json(user);
    } catch (err) {
      return next(err);
    }
  },

  // Edit name
  async editName(req, res, next) {
    const { name } = req.body;
    let document;

    try {
      document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }

    res.status(201).json(document);
  },

  // Edit email
  async editEmail(req, res, next) {
    // Validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { email } = req.body;
    let document;

    try {
      document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          email,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }

    res.status(201).json(document);
  },

  // Edit Phone
  async editPhone(req, res, next) {
    const { phone } = req.body;
    let document;

    try {
      document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          phone,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }

    res.status(201).json(document);
  },

  // Edit Password
  async editPassword(req, res, next) {
    // Validation

    const { password } = req.body;
    let document;
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds
    try {
      document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          password: hashedPassword,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }

    res.status(201).json(document);
  },
};

export default userController;
