import { Session } from "@shopify/shopify-api";

import { CREATE_DISCOUNT } from "../queries/discount.queries.js";
import shopify from "../utils/shopify.js";
import { SHOPIFY_PRODUCT_DISCOUNT_TEST_ID } from "../config/env.js";

export interface CreateDiscountParams {
  name: string;
  quantity: number;
  percentage: number;
}

export async function createDiscount(
  discountData: CreateDiscountParams,
  session: Session
) {
  const client = new shopify.api.clients.Graphql({ session });

  await client.query({
    data: {
      query: CREATE_DISCOUNT,
      variables: {
        discount: {
          functionId: SHOPIFY_PRODUCT_DISCOUNT_TEST_ID,
          metafields: [
            {
              namespace: "$app:volume-discount",
              key: "function-configuration",
              value: `{ "quantity": ${discountData.quantity}, "percentage": ${discountData.percentage} }`,
              type: "json",
            },
          ],
          title: discountData.name,
          startsAt: new Date().toISOString(),
        },
      },
    },
  });
}
