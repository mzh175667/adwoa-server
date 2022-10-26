import { Notif_Tokens } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import FirebaseService from "../services/FirebaseService";

const notificationController = {
  async store(req, res, next) {
    let result;
    const { token } = req.body;
    // check if notif_token exist in database already
    // try {
    // const exist = await Notif_Tokens.exists({ notif_token: token });
    result = await Notif_Tokens.findOne({ customer: req.user._id });
    let message;
    if (!result) {
      // return next(
      //   CustomErrorHandler.wrongCredentials("notif token not found")
      // );
      await Notif_Tokens.create({
        customer: req.user._id,
        notif_token: token,
      });
      message = "token stored";
    } else {
      message = "token already exist with this user";
    }

    // if (exist) {
    // return next(
    // FirebaseService.sendNotificationToSpecificUser(next, req.user._id, {
    //   title: "Wegoz App",
    //   body: "Toke found for this app",
    // });
    // );
    // }

    res.status(201).json({ message });
    // } catch (err) {
    //   return next(err);
    // }
  },
};

export default notificationController;
