import { Payment, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
const stripe = require("stripe")(
  "sk_test_51Ke1KTHjHBX7BsTL075YAHuruUm8Axbhg4pCx2ac7BzYGA12vk5tvAf2iUhG6qSgMIFAm1nslPxDRatuF96VRLcv00BUgmqIlW"
);
const usersController = {
  //create customers
  async store(req, res, next) {
    let documents;
    let user;
    console.log("admin controller");
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return next(CustomErrorHandler.serverError());
      }
      documents = await stripe.customers.create({
        name: name,
        email: email,
        phone: phone,
      });
      if (documents) {
        const isExist = await Payment.findOne({ user: req.user._id });
        if (!isExist) {
          user = await Payment.create({
            user: req.user._id,
            cus_id: documents.id,
          });
        } else {
          user = await Payment.updateOne(
            { user: req.user._id },
            {
              cus_id: documents.id,
            },
            { new: true }
          );
        }
        return res.status(201).json({
          message: "Stripe customer created successfully...",
          statusCode: 201,
          success: true,
          data: documents,
          error: null,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
        statusCode: 500,
        success: false,
        data: null,
        stack: err.stack,
      });
    }
  },
  //get all customers
  async index(req, res, next) {
    let documents;
    console.log("admin controller");
    try {
      documents = await stripe.customers.list({});
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
  //update customer
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
  async destroy(req, res, next) {
    let documents;
    console.log("admin controller");
    try {
      documents = await stripe.customers.del(req.params.id);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log("user update", documents);
    res.status(201).json(documents);
  },

  async balance(req, res, next) {
    let documents;
    console.log("balance transaction");
    try {
      // documents = await stripe.customers.del(req.params.id);
      documents = await stripe.customers.retrieveBalanceTransaction(
        req.params.cus_id,
        req.params.balance_tr_id
      );
    } catch (err) {
      res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
        success: false,
        data: null,
        stack: err.stack,
      });
    }
    console.log("user update", documents);
    res.status(201).json(documents);
  },
};

export default usersController;
