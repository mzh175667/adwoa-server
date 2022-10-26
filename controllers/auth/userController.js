import { OAuth2Client } from "google-auth-library";
import { API_KEY } from "../../config";
import { User } from "../../models";
import sgMail from "@sendgrid/mail";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import Otp from "../../models/otp";
import bcrypt from "bcrypt";
import SendGridService from "../../services/SendGridService";

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
  // Check otp exist in this particular email or not
  async codeVerify(req, res, next) {
    try {
      let data = await Otp.findOne({
        email: req.body.email,
        code: req.body.code,
      })
        .limit(1)
        .sort({ $natural: -1 });

      if (data) {
        const date = new Date();
        const currenTime = date.getTime();

        console.log("db expireIn", data.expireIn);
        const diff = data.expireIn - currenTime;

        if (diff < 0) {
          return next(CustomErrorHandler.wrongCredentials("token expired"));
        } else {
          let user;
          if (req.body.type == "verification") {
            user = {
              emailVerified: true,
            };
          }
          if (req.body.type == "forgot_password") {
            user = {
              reset_password: true,
            };
          }
          const result = await User.findOneAndUpdate(
            { email: data.email },
            user,
            { new: true }
          );

          res.status(201).json({ message: "verified" });
        }
      } else {
        return next(CustomErrorHandler.notFound("verification code incorrect"));
      }
    } catch (error) {
      return next(error);
    }
  },

  // otp send in email (one time password ) for verification
  async emailSend(req, res, next) {
    const response = await SendGridService.sendEmail(req.body.email, next);
    res.status(201).json(response);
  },

  // otp resend in email (one time password ) for verification
  async resendEmail(req, res, next) {
    const response = await SendGridService.sendEmail(req.body.email, next);
    res.status(201).json(response);
  },

  // otp (one time password) check expire and update password
  async changePassword(req, res, next) {
    // try {
    const findData = await User.findOne({ email: req.body.email });

    if (findData.reset_password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedPassword, reset_password: false }
        // { reset_password: false }
      );
      res.status(201).json({ message: "password updated" });
    } else {
      return next(CustomErrorHandler.notFound("unable to change password"));
    }
    // const data = await Otp.find({
    //   email: req.body.email,
    //   code: req.body.code,
    // });
    // if (data) {
    //   const date = new Date();
    //   const currenTime = date.getTime();
    //   const diff = data[0].expireIn - currenTime;
    //   console.log("time", diff);
    //   if (diff < 0) {
    //     console.log("data...");
    //     return next(new Error("token expire"));
    //   }

    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const user = await User.findOneAndUpdate(
    //   { email: req.body.email },
    //   { password: hashedPassword },
    //   { reset_password: false }
    // );
    // if (user) {
    //   const RemoveOtp = await Otp.findOneAndDelete(
    //     user.email,
    //     function (err, obj) {
    //       if (err) throw err;
    //       console.log("1 document deleted");
    //     }
    //   );
    //   console.log("...", RemoveOtp);
    // }
    // console.log("user", user);
    // res.status(201).json("Update Success");

    // }
    // else {
    //   return next(new Error("Invalid Otp"));
    // }
    // } catch (error) {
    //   return next(error);
    // }
  },

  // Get all users
  async index(req, res, next) {
    let documents;
    // pagination mongoose pagination
    try {
      documents = await User.find({ role: { $eq: "customer" } })
        .select("-updatedAt -__v -password")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  // update Role / Status ======>> "trainee" || "trainer"
  async updateRole(req, res, next) {
    const { role } = req.body;
    console.log("req.body", role);
    let document;
    try {
      document = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          role: role,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }

    res.status(201).json(document);
  },
};

// function mailer(email, otp) {
//   try {
//     const resp = sgMail.setApiKey(API_KEY);
//     console.log("resp", resp);
//     const message = {
//       from: "hamzaameen8079@gmail.com",
//       to: { email },
//       subject: "OTP Genrate from Wegoze food App",
//       text: `Your verification code is ${otp} from wegoze food`,
//       html: `<p>Your verification code is  <h4> ${otp} </h4> for wegoze food App </p>`,
//     };
//     console.log("message", message);
//     sgMail
//       .send(message)
//       .then((res) => {
//         console.log("Email Send Successfully...", res);
//         return res;
//       })
//       .catch((error) => {
//         console.log("error", error.message);
//         return next(CustomErrorHandler.serverError());
//       });
//   } catch (error) {
//     console.log("catch error", error);
//     return next(CustomErrorHandler.serverError());
//   }
// }
export default userController;
