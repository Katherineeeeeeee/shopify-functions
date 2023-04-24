import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Target,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const QUANTITY = 2;

export default (input: InputQuery): FunctionResult => {
  const targets: Target[] = [];

  for (const line of input.cart.lines) {
    if (
      line.merchandise.__typename !== "ProductVariant" ||
      !line.merchandise.product.isDiscounted
    ) {
      continue;
    }

    if (line.quantity >= QUANTITY + 1) {
      targets.push({
        productVariant: {
          id: line.merchandise.id,
          quantity: Math.floor(line.quantity / (QUANTITY + 1)),
        },
      });
    }
  }

  if (!targets.length) {
    return EMPTY_DISCOUNT;
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts: [
      {
        targets,
        value: {
          percentage: {
            value: 100,
          },
        },
      },
    ],
  };
};
