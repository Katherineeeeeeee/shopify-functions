import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Discount,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export default (input: InputQuery): FunctionResult => {
  const discounts: Discount[] = [];

  for (const item of input.cart.lines) {
    const discountData = item.attribute?.value;

    if (!discountData || !(item.merchandise.__typename === "ProductVariant")) {
      continue;
    }

    const [quantity, amount] = discountData
      .split("by")
      .map((s) => parseInt(s, 10));

    if (Number.isNaN(quantity) || Number.isNaN(amount)) {
      continue;
    }

    if (item.quantity >= quantity) {
      discounts.push({
        targets: [
          {
            productVariant: {
              id: item.merchandise.id,
            },
          },
        ],
        value: {
          fixedAmount: {
            amount:
              item.cost.subtotalAmount.amount -
              amount * input.presentmentCurrencyRate,
          },
        },
      });
    }
  }

  if (!discounts.length) {
    return EMPTY_DISCOUNT;
  }

  const result: FunctionResult = {
    discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };

  return result;
};
