import { Card, Page, Layout, Button, TextField } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks/index.js";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();

  const [name, setName] = useState("Test discount");
  const [quantity, setQuantity] = useState(1);
  const [percentage, setPercentage] = useState(10);

  const getDiscounts = async () => {
    const res = await fetch("/api/discount/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, quantity, percentage }),
    });
    if (res.ok) {
      setName("Test discount");
      setQuantity(1);
      setPercentage(10);
    }
  };
  return (
    <Page narrowWidth>
      <TitleBar title="Discounts" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card
            sectioned
            primaryFooterAction={{
              content: "Save",
              onAction: getDiscounts,
            }}
          >
            <TextField
              label="Discount name"
              value={name}
              onChange={setName}
              type="text"
            />
            <TextField
              label="Products quantity"
              value={quantity}
              onChange={setQuantity}
              type="number"
              min={1}
              max={100}
            />
            <TextField
              label="Products discount percent"
              suffix="%"
              value={percentage}
              onChange={setPercentage}
              type="number"
              min={1}
              max={100}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
