import {
  Fitness,
  Payment,
  Personal,
  Profession,
  Review,
  Service,
  Session,
  User,
} from "../models";
const stripe = require("stripe")(
  "sk_test_51Ke1KTHjHBX7BsTL075YAHuruUm8Axbhg4pCx2ac7BzYGA12vk5tvAf2iUhG6qSgMIFAm1nslPxDRatuF96VRLcv00BUgmqIlW"
);

const userMeController = {
  // get
  async show(req, res, next) {
    let documents,
      userPersonal,
      userProfession,
      user,
      userReview,
      userFitness,
      userServices,
      success,
      message = "",
      statusCode,
      customer,
      card,
      userSession,
      payment;
    try {
      user = await User.findById({ _id: req.params.userId }).select(
        "-password -__v -updatedAt"
      );
      if (user) {
        success = true;
        statusCode = 201;
        message = "found";
        userPersonal = await Personal.findOne({
          user: req.params.userId,
        }).select("-__v -updatedAt");
        userProfession = await Profession.findOne({
          user: req.params.userId,
        }).select("-__v -updatedAt");

        userReview = await Review.find({ user: req.params.userId }).select(
          "-__v -updatedAt"
        );
        userFitness = await Fitness.find({ user: req.params.userId }).select(
          "-__v -updatedAt"
        );
        userServices = await Service.find({ user: req.params.userId }).select(
          "-__v -updatedAt"
        );
        userSession = await Session.find({ user: req.params.userId }).select(
          "-__v -updatedAt"
        );
        payment = await Payment.findOne({ user: req.user._id });
        if (payment) {
          customer = await stripe.customers.retrieve(payment.cus_id);
        }
      } else {
        message = "Not Found";
        success = false;
        statusCode = 404;
      }

      documents = {
        statusCode,
        success,
        message,
        personal_info: userPersonal,
        profession_info: userProfession,
        user: user,
        review: userReview,
        fitness: userFitness,
        services: userServices,
        session: userSession,
        stripe: { customer },
      };
    } catch (err) {
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        data: null,
        stack: err.stack,
      });
    }

    res.status(statusCode).json(documents);
  },
};

export default userMeController;
