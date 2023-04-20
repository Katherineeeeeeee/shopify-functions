import { Request, Response } from "express";
import shopify from "../utils/shopify.js";
import { GET_DISCOUNT_QUERY } from "../queries/discount.queries.js";

export const runDiscountMutation = async (
  req: Request,
  res: Response,
  mutation: string
) => {
  const graphqlClient = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const data = await graphqlClient.query({
      data: {
        query: mutation,
        variables: req.body,
      },
    });

    res.send(data.body);
  } catch (error) {
    res.status(500).send({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const runDiscountQuery = async (req: Request, res: Response) => {
  const id = req.body.id;
  if (!id) {
    return res.sendStatus(404);
  }
  const graphqlClient = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const data = await graphqlClient.query({
      data: {
        query: GET_DISCOUNT_QUERY,
        variables: { id: `gid://shopify/DiscountAutomaticNode/${id}` },
      },
    });

    res.send(data.body);
  } catch (error) {
    res.status(500).send({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
