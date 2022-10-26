import { Order, Transaction } from "../models";
// const moment = require("moment");

const orderController = {
  async store(req, res, next) {
    const {
      phone,
      address,
      items,
      totalPrice,
      totalQty,
      cardNumber,
      cvv,
      cardExpiryDate,
    } = req.body;
    console.log(req.body);

    // const order = new Order({
    //   customerId: req.user._id,
    //   items,
    //   totalQty,
    //   totalPrice,
    //   phone,
    //   address,
    // })
    //   .save()
    //   .then((result) => {
    //     console.log("result", result);
    //     Order.populate(result, { path: "customerId" }, (err, placeOrder) => {
    //       // delete req.session.cart;
    //       // // Emit
    //       // const eventEmitter = req.app.get("eventEmitter");
    //       // eventEmitter.emit("orderPlaced", placeOrder);

    //       console.log("order palces", placeOrder);
    //       res.status(201).json({ message: "Order placed successfully" });
    //     });
    //   })
    //   .catch((err) => {
    //     return next(err);
    //   });
    let orders;
    let transactions;
    let totalSales = 0;
    try {
      orders = await Order.create({
        customerId: req.user._id,
        items,
        totalQty,
        totalPrice,
      });
      console.log("orders", orders);
      if (orders) {
        console.log("iff k andr");

        transactions = await Transaction.create({
          phone,
          address,
          cardNumber,
          cardExpiryDate,
          cvv,
          customer: req.user._id,
          order: orders._id,
        });
      } else {
        console.log("errrrr");
      }
      console.log("order transactions", transactions);

      res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
      return next(err);
    }
  },

  async index(req, res) {
    const orders = await Order.find({ customerId: req.user._id }, null, {
      sort: { createdAt: -1 },
    });
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-scale=0, post-check=0 pre-check=0"
    );
    // res.render("customers/orders", { orders: orders, moment: moment });
    res.status(201).json({ orders: orders });
  },

  async show(req, res) {
    const order = await Order.findById(req.params.id);
    // Authorize user
    if (req.user._id.toString() === order.customerId.toString()) {
      // res.render("customers/singleOrder", { order });
      res.status(201).json({ order });
    }
    // return res.redirect("/");
  },
};

export default orderController;
