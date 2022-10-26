import { Challenge, User } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import productSchema from "../validators/productValidator";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); // 5mb

const challengeController = {
  // store challenge
  async store(req, res, next) {
    const {
      title,
      nOfOrder,
      pointsEarned,
      validDate,
      startDate,
      endDate,
      shortDes,
      desc,
    } = req.body;
    let document;
    let challenge;
    // try {
    // challenge = await Challenge.create({
    //   customerId: req.user._id,
    // });
    // }
    // try {
    document = await Challenge.create({
      title,
      nOfOrder,
      pointsEarned,
      validDate,
      startDate,
      endDate,
      shortDes,
      desc,
    });

    // } catch (err) {
    //   return next(err);
    // }
    const user = await User.updateMany(
      { role: "customer" },
      { $set: { challengeId: document._id, challengeStatus: true } }
    );

    res.status(201).json(document);
  },

  //update product
  update(req, res, next) {
    // Multipart from data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }

      // validation
      const { error } = productSchema.validate(req.body);
      if (error) {
        // Delete the uploading image
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }

        return next(error);
      }

      const { name, price, size, categoryId } = req.body;
      let document;

      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
            categoryId,
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },

  // delete product
  async destroy(req, res, next) {
    const document = await Challenge.findByIdAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    // image delete
    // const imagePath = document._doc.image;
    // fs.unlink(`${appRoot}/${imagePath}`, (err) => {
    //   if (err) {
    //     return next(CustomErrorHandler.serverError());
    //   }
    // });

    res.json(document);
  },

  // Get all challenges
  async index(req, res, next) {
    console.log("hello brother");
    let documents;
    // pagination mongoose pagination
    try {
      documents = await Challenge.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  // get single product
  async show(req, res, next) {
    let document;
    // pagination mongoose pagination
    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log(document);
    return res.json(document);
  },

  // get single product
  async prod(req, res, next) {
    console.log("fsdf");
    let document;
    // pagination mongoose pagination
    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    console.log(document);
    return res.json(document);
  },
};

export default challengeController;
