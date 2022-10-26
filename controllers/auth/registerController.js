import Joi, { ref } from "joi";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import registerSchema from "../../validators/registerValidator";
import multer from "multer";
import path from "path";
import fs from "fs";
import { User } from "../../models";
import JwtServices from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";
import SendGridService from "../../services/SendGridService";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("profileImage"); // 5mb

const registerController = {
  async register(req, res, next) {
    // Checklist
    // validate the request
    // authorise the request
    // check if user exist in database already
    // prepare model
    // store in database
    // generate jwt token
    // send response
    // handleMultipartData(req, res, async (err) => {
    // if (err) {
    //   return next(CustomErrorHandler.serverError(err.message));
    // }
    // let filePath;
    // if (req.file) {
    //   filePath = req.file.path;
    // }
    // validation
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // check if user exist in database already
    // try {
    //   const exist = await User.exists({ email: req.body.email });
    //   if (exist) {
    //     return next(
    //       CustomErrorHandler.alreadyExist("This email is already taken.")
    //     );
    //   }
    // } catch (err) {
    //   return next(err);
    // }

    const { email, password, role } = req.body;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

    // prepare model
    const user = new User({
      email,
      password: hashedPassword,
      role,
      register: true,
    });

    let access_token, email_message, data, register;

    try {
      data = await user.save();
      email_message = await SendGridService.sendEmail(req.body.email, next);

      // Token
      access_token = JwtServices.sign({ _id: data._id, role: data.role });
    } catch (err) {
      return next(err);
    }
    const result = {
      message: "success",
      email_message,
      register: true,
      access_token,
      data: data,
    };

    res.json(result);
    // });
  },
};

export default registerController;
