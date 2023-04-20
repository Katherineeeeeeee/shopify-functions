import { Router } from "express";
import { Session } from "@shopify/shopify-api";
import {
  CreateDiscountParams,
  createDiscount,
} from "../services/discount.service.js";
import shopify from "../utils/shopify.js";

const discountRouter = Router();

discountRouter.use("/discount/create", (req, res, next) => {
  const body = req.body;

  if (
    body.name &&
    typeof body.name === "string" &&
    body.quantity &&
    body.percentage &&
    typeof body.percentage == "number"
  ) {
    res.locals.discountData = {
      percentage: body.percentage,
      quantity: parseInt(body.quantity, 10),
      name: body.name,
    };
    next();
  } else {
    res.sendStatus(503);
  }
});

discountRouter.post("/discount/create", async (req, res) => {
  const session = res.locals.shopify.session as Session;

  const discountData = res.locals.discountData as CreateDiscountParams;

  await createDiscount(discountData, session);

  res.sendStatus(201);
});

export { discountRouter };
