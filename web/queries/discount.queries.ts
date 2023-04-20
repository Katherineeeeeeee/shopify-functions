const CREATE_CODE_MUTATION = `#graphql
  mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {
    discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

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

const UPDATE_CODE_MUTATION = `#graphql
  mutation UpdateCodeDiscount($id: ID!, $discount: DiscountCodeAppInput!) {
    discountCreate: discountCodeAppUpdate(id: $id, codeAppDiscount: $discount) {
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
      metafield(
        namespace: "$app:volume-discount"
        key: "function-configuration"
      ) {
        value
        id
      }
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
        ... on DiscountCodeApp {
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
          usageLimit
          appliesOncePerCustomer
          codeCount
        }
      }
    }
  }
`;

export {
  CREATE_CODE_MUTATION,
  CREATE_AUTOMATIC_MUTATION,
  UPDATE_AUTOMATIC_MUTATION,
  UPDATE_CODE_MUTATION,
  GET_DISCOUNT_QUERY,
};
