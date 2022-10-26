// import { Order } from "../../models";
import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
const usersController = {
  async index(req, res, next) {
    let documents;
    let ids = [];

    try {
      documents = await User.find({ role: { $ne: "admin" } }).select(
        " -password -__v -createdAt"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("users", documents);
    res.status(201).json(documents);
  },
  async updateAccountStatus(req, res, next) {
    let documents;

    try {
      documents = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { accountVerified: req.body.accountVerified },
        { new: true }
      ).select(" -password -__v -createdAt");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("user update", documents);
    res.status(201).json(documents);
  },
  async updateTrainerStatus(req, res, next) {
    let documents;

    try {
      documents = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { trainerVerified: req.body.trainerVerified },
        { new: true }
      ).select(" -password -__v -createdAt");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("user update", documents);
    res.status(201).json(documents);
  },
};
export default usersController;
