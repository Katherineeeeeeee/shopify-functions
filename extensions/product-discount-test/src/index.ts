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
  const itemsInCart = input.cart.lines.filter(
    (item) =>
      (item.quantity >= configuration.quantity ||
        input.cart.lines.length >= configuration.quantity) &&
      item.merchandise.__typename == "ProductVariant"
  );

  const discountedItems = itemsInCart.map((line) => {
    const variant = line.merchandise;
    if (variant.__typename !== "ProductVariant") throw new Error("");

    return {
      productVariant: {
        id: variant.id,
      },
    };
  });

  if (!discountedItems.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  const result = {
    discounts: [
      {
        targets: discountedItems,
        value: {
          percentage: {
            value: configuration.percentage.toString(),
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };

  return result;
};
