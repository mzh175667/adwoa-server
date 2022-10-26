import { JWT_SECRET } from "../config";
import { User } from "../models";
import otp from "../models/otp";
import sgMail from "@sendgrid/mail";
import { API_KEY } from "../config/";
class SendGridService {
  static async sendEmail(email, next) {
    const otpCode = Math.floor(10000 + Math.random() * 90000);
    let result;
    // check if otp already exist
    result = await otp
      .findOne({ email: email })
      .limit(1)
      .sort({ $natural: -1 });
    //if exist then update the otp otherwise create new one
    if (result) {
      const upDate = await otp.findByIdAndUpdate(
        { _id: result._id },
        { code: otpCode, expireIn: new Date().getTime() + 60000 }
      );
    } else {
      let data = await User.findOne({ email });
      const otpData = new otp({
        email,
        code: otpCode,
        expireIn: new Date().getTime() + 60000,
      });
      result = await otpData.save();
    }

    if (result) {
      console.log("mailer if");
      mailer(result.email, otpCode);
      console.log("mailer");
      let response = {
        statusCode: 201,
        success: true,
        email: result.email,
        message: "OTP sent to your email, please check your email",
      };
      return response;
    } else {
      return next(new Error("email does not exist!"));
    }
  }
}
//mailer function call
function mailer(email, otp) {
  try {
    const resp = sgMail.setApiKey(API_KEY);

    const message = {
      from: "protechgiant@gmail.com",
      to: { email },
      subject: "OTP Genrate from Wegoze food App",
      text: `Your verification code is ${otp} from wegoze food`,
      html: `<p>Your verification code is  <h4> ${otp} </h4> for wegoze food App </p>`,
    };

    sgMail
      .send(message)
      .then((res) => {
        console.log("Email Send Successfully...", res);
        return res;
      })
      .catch((error) => {
        console.log("error", error.message);
        return next(CustomErrorHandler.serverError());
      });
  } catch (error) {
    console.log("catch error", error);
    return next(CustomErrorHandler.serverError());
  }
}
export default SendGridService;
