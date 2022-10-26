import { User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";

const trainer = async (req, res, next) => {
  console.log("req", req.user);
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (user.role === "trainer") {
      next();
    } else {
      //   return next(CustomErrorHandler.unAuthorized());
      res.status(401).json({ message: "only trainer can access this route" });
    }
  } catch (error) {
    return next(CustomErrorHandler.serverError());
  }
};

export default trainer;
