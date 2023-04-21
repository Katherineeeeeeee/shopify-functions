const CREATE_AUTOMATIC_MUTATION = `#graphql
  mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
    discountCreate: discountAutomaticAppCreate(
      automaticAppDiscount: $discount
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const UPDATE_AUTOMATIC_MUTATION = `#graphql
  mutation UpdateAutomaticDiscount(
    $id: ID!
    $discount: DiscountAutomaticAppInput!
  ) {
    discountCreate: discountAutomaticAppUpdate(
      id: $id
      automaticAppDiscount: $discount
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const GET_DISCOUNT_QUERY = `#graphql
  query GetDiscountNode($id: ID!) {
    discountNode(id: $id) {
      id
      discount {
        __typename
        ... on DiscountAutomaticApp {
          title
          startsAt
          endsAt
          combinesWith {
            productDiscounts
            orderDiscounts
            shippingDiscounts
          }
          asyncUsageCount
          status
        }
      }
    }
  }
`;

export {
  CREATE_AUTOMATIC_MUTATION,
  UPDATE_AUTOMATIC_MUTATION,
  GET_DISCOUNT_QUERY,
};
