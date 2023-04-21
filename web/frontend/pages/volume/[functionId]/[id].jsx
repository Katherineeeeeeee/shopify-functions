import { useParams } from "react-router-dom";
import { useForm, useField } from "@shopify/react-form";
import { CurrencyCode } from "@shopify/react-i18n";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";

import {
  ActiveDatesCard,
  CombinationCard,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  RequirementType,
  SummaryCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";
import { Banner, Layout, Page, PageActions, Spinner } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../../hooks";
import { useEffect, useState } from "react";

const todaysDate = new Date();

export default function VolumeChange() {
  const authenticatedFetch = useAuthenticatedFetch();
  const { functionId, id } = useParams();

  const [discountData, setDiscountData] = useState();

  useEffect(async () => {
    const res = await authenticatedFetch("/api/discount/find", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const json = await res.json();
    setDiscountData(json.data.discountNode);
  }, []);

  if (!discountData) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "fit-content",
          height: "fit-content",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return <VolumeEdit discountData={discountData} functionId={functionId} />;
}

function VolumeEdit({ discountData, functionId }) {
  const authenticatedFetch = useAuthenticatedFetch();

  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const currencyCode = CurrencyCode.Usd;

  const {
    fields: {
      discountTitle,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      startDate,
      endDate,
    },
    submit,
    submitting,
    dirty,
    reset,
    submitErrors,
    makeClean,
  } = useForm({
    fields: {
      discountTitle: useField(discountData.discount.title),
      discountMethod: useField(DiscountMethod.Automatic),
      combinesWith: useField(discountData.discount.combinesWith),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      startDate: useField(
        discountData.discount.startsAt
          ? new Date(discountData.discount.startsAt)
          : todaysDate
      ),
      endDate: useField(
        discountData.discount.endsAt
          ? new Date(discountData.discount.endsAt)
          : null
      ),
    },
    onSubmit: async (form) => {
      const discount = {
        functionId,
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        title: form.discountTitle,
        id: discountData.id,
      };

      const response = await authenticatedFetch("/api/discounts/automatic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount }),
      });

      const data = (await response.json()).data;
      const remoteErrors = data.discountCreate.userErrors;
      if (remoteErrors.length > 0) {
        return { status: "fail", errors: remoteErrors };
      }

      redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
        name: Redirect.ResourceType.Discount,
      });
      return { status: "success" };
    },
  });

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message, field }, index) => {
              return (
                <li key={`${message}${index}`}>
                  {field.join(".")} {message}
                </li>
              );
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Page
      title="Create volume discount"
      primaryAction={{
        content: "Save",
        onAction: submit,
        disabled: !dirty,
        loading: submitting,
      }}
      secondaryActions={[
        {
          content: "Reset",
          onAction: reset,
          disabled: !dirty,
          loading: submitting,
        },
      ]}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <form onSubmit={submit}>
            <MethodCard
              title="Volume"
              discountTitle={discountTitle}
              discountClass={DiscountClass.Product}
              discountMethod={discountMethod}
              discountMethodHidden={DiscountMethod.Code}
            />

            <CombinationCard
              combinableDiscountTypes={combinesWith}
              discountClass={DiscountClass.Product}
              discountDescriptor={discountTitle.value}
            />
            <ActiveDatesCard
              startDate={startDate}
              endDate={endDate}
              timezoneAbbreviation="EST"
            />
          </form>
        </Layout.Section>
        <Layout.Section secondary>
          <SummaryCard
            header={{
              discountMethod: discountMethod.value,
              discountDescriptor: discountTitle.value,
              appDiscountType: "Volume",
              isEditing: true,
            }}
            performance={{
              status: discountData.discount.status,
              usageCount: discountData.discount.asyncUsageCount,
            }}
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: false,
              totalUsageLimit: false,
            }}
            activeDates={{
              startDate: startDate.value,
              endDate: endDate.value,
            }}
          />
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              disabled: !dirty,
              loading: submitting,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => onBreadcrumbAction(redirect, true),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
