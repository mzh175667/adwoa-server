import { Category, Product } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import categorySchema from "../validators/categoryValidator";

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
}).single("categoryImage"); // 5mb

const categoryController = {
  // store product
  async store(req, res, next) {
    // console.log("req.body", req.body);
    // console.log("req.file", req.file);
    // Multipart from data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath;
      if (req.file) {
        filePath = req.file.path;
      } else {
        filePath = "NA";
      }
      // const filePath = req.file.path;
      // validation
      const { error } = categorySchema.validate(req.body);
      if (error) {
        // Delete the uploading image
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });

        return next(error);
      }

      const { name } = req.body;
      let document;

      // try {
      document = await Category.create({
        name,
        categoryImage: filePath,
      });
      // } catch (err) {
      //   return next(err);
      // }

      res.status(201).json(document);
    });
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
      // console.log("files", req.file);
      // validation
      const { error } = categorySchema.validate(req.body);
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

      const { name } = req.body;
      let document;

      try {
        document = await Category.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            ...(req.file && { categoryImage: filePath }),
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
    const document = await Category.findByIdAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    // image delete
    const imagePath = document._doc.categoryImage;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });

    res.json(document);
  },

  // Get all products
  async index(req, res, next) {
    let documents;
    // pagination mongoose pagination
    try {
      documents = await Category.find()
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
      document = await Category.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(document);
  },

  // Get all categorues with projects
  async products(req, res, next) {
    console.log("dfadf");
    let documents;
    let category;
    // pagination mongoose pagination
    try {
      category = await Category.find().select("_id");
      documents = await Product.find({
        categoryId: { $in: category._id },
      });
      //   .select("-updatedAt -__v")
      //   .sort({ createdAt: -1 })
      //   .populate("category");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
};

export default categoryController;
