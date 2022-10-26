import CustomErrorHandler from "../../services/CustomErrorHandler";
const stripe = require("stripe")(
  "sk_test_51Ke1KTHjHBX7BsTL075YAHuruUm8Axbhg4pCx2ac7BzYGA12vk5tvAf2iUhG6qSgMIFAm1nslPxDRatuF96VRLcv00BUgmqIlW"
);
const transferController = {
  //create customers
  async store(req, res, next) {
    let documents;
    console.log("admin controller");
    const { sender, reciver, currency, amount, subamount } = req.body;
    try {
      if (!sender || !reciver || !currency || !amount || !subamount) {
        res.status(500).json("Please add all requirements");
      }
      const balanceTransaction =
        await stripe.customers.createBalanceTransaction(sender, {
          amount: amount,
          currency: currency,
        });
      const balanceReciver = await stripe.customers.createBalanceTransaction(
        reciver,
        { amount: subamount, currency: currency }
      );
      res
        .status(200)
        .json({ reciver: balanceReciver, sender: balanceTransaction });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("users", documents);
    res.status(201).json(documents);
  },

  //get particular customer
  async show(req, res, next) {
    let documents;
    console.log("hello", req.params.id);
    try {
      if (req.params.id) {
        documents = await stripe.customers.retrieve(req.params.id);
      } else {
        return next(CustomErrorHandler.emptyState());
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("users", documents);
    res.status(201).json(documents);
  },
  async update(req, res, next) {
    let documents;
    console.log("admin controller");
    try {
      documents = await stripe.customers.update(req.params.id, {
        balance: req.body.balance,
      });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("user update", documents);
    res.status(201).json(documents);
  },
};

export default transferController;
