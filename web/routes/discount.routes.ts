import { Router } from "express";
import {
  runDiscountMutation,
  runDiscountQuery,
} from "../services/discount.service.js";
import {
  CREATE_AUTOMATIC_MUTATION,
  UPDATE_AUTOMATIC_MUTATION,
} from "../queries/discount.queries.js";

const discountRouter = Router();

discountRouter.post("/discounts/automatic", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_AUTOMATIC_MUTATION);
});

discountRouter.post("/discount/find", async (req, res) => {
  await runDiscountQuery(req, res);
});

discountRouter.patch("/discounts/automatic", async (req, res) => {
  await runDiscountMutation(req, res, UPDATE_AUTOMATIC_MUTATION);
});

export { discountRouter };
