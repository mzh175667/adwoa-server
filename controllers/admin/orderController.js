import { Order } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
const orderController = {
  async index(req, res, next) {
    let documents;

    try {
      documents = await Order.find({ status: { $ne: "completed" } })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 })
        .populate("customerId", "-password");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
    // Order.find({ status: { $ne: "completed" } }, null, {
    //   sort: { createdAt: -1 },
    // })
    //   .populate("customerId", "-password")
    //   .exec((err, orders) => {
    //     if (req.xhr) {
    //       return res.status(200).json(orders);
    //     } else {
    //       return res.render("admin/orders");
    //     }
    //   });
  },
};

export default orderController;
