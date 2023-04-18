import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  ProductVariant,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {
  quantity: number;
  percentage: number;
};

export default (input: InputQuery): FunctionResult => {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  if (!configuration.quantity || !configuration.percentage) {
    return EMPTY_DISCOUNT;
  }
  const targetsLines = input.cart.lines.filter(
    (line) =>
      line.quantity >= configuration.quantity &&
      line.merchandise.__typename == "ProductVariant"
  );

  const targets = targetsLines.map((line) => {
    const variant = line.merchandise;
    if (variant.__typename !== "ProductVariant") throw new Error("");

    return {
      productVariant: {
        id: variant.id,
      },
    };
  });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets,
        value: {
          percentage: {
            value: configuration.percentage.toString(),
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};
