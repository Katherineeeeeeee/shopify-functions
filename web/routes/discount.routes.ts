import { Router } from "express";
import {
  runDiscountMutation,
  runDiscountQuery,
} from "../services/discount.service.js";
import {
  CREATE_AUTOMATIC_MUTATION,
  CREATE_CODE_MUTATION,
  UPDATE_AUTOMATIC_MUTATION,
  UPDATE_CODE_MUTATION,
} from "../queries/discount.queries.js";

const discountRouter = Router();

discountRouter.post("/discounts/code", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_CODE_MUTATION);
});

discountRouter.post("/discounts/automatic", async (req, res) => {
  await runDiscountMutation(req, res, CREATE_AUTOMATIC_MUTATION);
});

discountRouter.post("/discount/find", async (req, res) => {
  await runDiscountQuery(req, res);
});

discountRouter.patch("/discounts/code", async (req, res) => {
  await runDiscountMutation(req, res, UPDATE_CODE_MUTATION);
});

discountRouter.patch("/discounts/automatic", async (req, res) => {
  await runDiscountMutation(req, res, UPDATE_AUTOMATIC_MUTATION);
});

export { discountRouter };
