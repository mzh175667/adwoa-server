import { Order, Transaction, User, Product } from "../models";
const moment = require("moment");

const dashboardController = {
  async index(req, res, next) {
    var start = moment().startOf("day"); // set to 12:00 am today
    var end = moment().endOf("day"); // set to 23:59 pm today

    console.log("start day", start);
    console.log("end day", end);
    try {
      const user = await User.find().count();
      const order = await Order.find().count();
      const completedOrder = await Order.find({ status: "completed" }).count();
      const todayOrder = await Order.find({
        createdAt: { $gte: start, $lt: end },
      }).count();
      const product = await Product.find().count();
      console.log("User", user);

      const averageCompletedOrders = order / completedOrder;
      console.log("averageCompletedOrders", averageCompletedOrders);
      // if (!user ) {
      //   return res.status(404).json({ message: "404 not found" });
      // }
      // if (!user) {
      //   return res.status(404).json({ message: "404 not found" });
      // }
      // if (!user) {
      //   return res.status(404).json({ message: "404 not found" });
      // }

      const result = {
        status: true,
        users: {
          total: user,
        },
        products: {
          total: product,
        },
        orders: {
          total: {
            orders: order,
            completed: completedOrder,
            today: todayOrder,
          },
          averageCompleted: averageCompletedOrders,
        },
      };

      console.log("result", result);
      res.json(result);
    } catch (err) {
      console.log("catch wala error", err);
      res.json({ error });
    }

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
  },

  //   async index(req, res) {
  //     const orders = await Order.find({ customerId: req.user._id }, null, {
  //       sort: { createdAt: -1 },
  //     });
  //     res.header(
  //       "Cache-Control",
  //       "no-cache, private, no-store, must-revalidate, max-scale=0, post-check=0 pre-check=0"
  //     );
  //     // res.render("customers/orders", { orders: orders, moment: moment });
  //     res.status(201).json({ orders: orders });
  //   },

  //   async show(req, res) {
  //     const order = await Order.findById(req.params.id);
  //     // Authorize user
  //     if (req.user._id.toString() === order.customerId.toString()) {
  //       // res.render("customers/singleOrder", { order });
  //       res.status(201).json({ order });
  //     }
  //     // return res.redirect("/");
  //   },
};

export default dashboardController;
