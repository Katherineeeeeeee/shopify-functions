const GET_DISCOUNTS = `#graphql
  query {
    discountNodes(first: 100) {
      edges {
        node {
          id
          discount {
            ... on DiscountAutomaticApp {
              title
            }
          }
        }
      }
    }
  }
`;

const CREATE_DISCOUNT = `#graphql
  mutation createDiscount($discount: DiscountAutomaticAppInput!) {
    discountAutomaticAppCreate(automaticAppDiscount: $discount) {
      automaticAppDiscount {
        title
      }
    }
  }
`;

export { GET_DISCOUNTS, CREATE_DISCOUNT };
