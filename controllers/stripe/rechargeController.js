import CustomErrorHandler from "../../services/CustomErrorHandler";
const stripe = require("stripe")(
  "sk_test_51Ke1KTHjHBX7BsTL075YAHuruUm8Axbhg4pCx2ac7BzYGA12vk5tvAf2iUhG6qSgMIFAm1nslPxDRatuF96VRLcv00BUgmqIlW"
);
const rechargeController = {
  //create customers
  async store(req, res, next) {
    let documents, user, charge;
    console.log("admin controller");
    const {
      amount,
      currency,
      source,
      description,
      card_number,
      exp_month,
      exp_year,
      cvc,
    } = req.body;
    try {
      if (!amount || !currency || !description) {
        res.status(500).json("Please add all requirements");
      }

      await stripe.tokens
        .create({
          card: {
            number: parseInt(card_number),
            exp_month: parseInt(exp_month),
            exp_year: parseInt(exp_year),
            cvc: parseInt(cvc),
          },
        })
        .then(async (response) => {
          console.log("res", response);
          console.log("res", response.id);
          if (response) {
            await stripe.customers.createSource(req.params.cus_id, {
              source: response.id,
            });
            charge = await stripe.charges.create({
              amount: amount * 100,
              currency: currency,
              customer: req.params.cus_id,
              source: response.card.id,
              description: description,
            });
          }
        });

      res.status(200).json(charge);
    } catch (err) {
      console.log("err", err);
      res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
        success: false,
        data: null,
        stack: err.stack,
      });
    }
    console.log("users", documents);
    // res.status(201).json(documents);
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

export default rechargeController;
