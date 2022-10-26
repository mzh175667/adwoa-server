import { Order } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const statusController = {
  update(req, res) {
    Order.updateOne(
      { _id: req.body.orderId },
      { status: req.body.status },
      (err, data) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
        console.log("result data", data);
        // Emit event
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderUpdated", {
          id: req.body.orderId,
          status: req.body.status,
        });
        res.status(201).json({ message: "status updated" });
      }
    );
  },
};

export default statusController;
