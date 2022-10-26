import { FIREBASE_TOKEN } from "../config";
import admin from "firebase-admin";
import serviceAccount from "../food-app-69e18-firebase-adminsdk-24cyc-46dcb2530f.json";
import CustomErrorHandler from "./CustomErrorHandler";
import { options } from "joi";
import { Notif_Tokens } from "../models";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class FirebaseService {
  static async sendNotificationToSpecificUser(next, userId, options) {
    let result;
    try {
      result = await Notif_Tokens.findOne({ customer: userId });
      if (!result) {
        return next(
          CustomErrorHandler.wrongCredentials("notif token not found")
        );
      }
      console.log("result", result);
      if (result.notif_token !== "" || result.token !== null) {
        admin
          .messaging()
          .send({
            token: result.notif_token,
            data: {
              customData: "Wegoz",
              id: "1",
              ad: "Nouman",
            },
            android: {
              notification: {
                body: options.body,
                title: options.title,
                color: "#ffffff",
                priority: "high",
                sound: "default",
                vibrateTimingsMillis: [200, 500, 800],
              },
            },
          })
          .then((msg) => {
            console.log("msg", msg);
          })
          .catch((err) => {
            return next(err);
          });
      }
    } catch (err) {
      return next(err);
    }
  }
}

export default FirebaseService;
