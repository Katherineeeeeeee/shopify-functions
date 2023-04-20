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
  DiscountStatus,
  RequirementType,
  SummaryCard,
  UsageLimitsCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";
import {
  Banner,
  LegacyCard,
  Layout,
  Page,
  TextField,
  PageActions,
  Spinner,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../../hooks";
import { useEffect, useState } from "react";

const todaysDate = new Date();
const METAFIELD_NAMESPACE = "$app:volume-discount";
const METAFIELD_CONFIGURATION_KEY = "function-configuration";

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
  console.log(discountData);
  const configurationInitial = JSON.parse(discountData.metafield.value);

  const authenticatedFetch = useAuthenticatedFetch();

  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const currencyCode = CurrencyCode.Usd;

  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageTotalLimit,
      usageOncePerCustomer,
      startDate,
      endDate,
      configuration,
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
      discountMethod: useField(
        discountData.discount.__typename === "DiscountAutomaticApp"
          ? DiscountMethod.Automatic
          : DiscountMethod.Code
      ),
      discountCode: useField(discountData.discount.title),
      combinesWith: useField(discountData.discount.combinesWith),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageTotalLimit: useField(
        discountData.discount.__typename === "DiscountAutomaticApp"
          ? null
          : discountData.discount.usageLimit
      ),
      usageOncePerCustomer: useField(
        discountData.discount.__typename === "DiscountAutomaticApp"
          ? false
          : discountData.discount.appliesOncePerCustomer
      ),
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
      configuration: {
        quantity: useField(configurationInitial.quantity),
        percentage: useField(configurationInitial.percentage),
      },
    },
    onSubmit: async (form) => {
      const discount = {
        functionId,
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        metafields: [
          {
            namespace: METAFIELD_NAMESPACE,
            key: METAFIELD_CONFIGURATION_KEY,
            type: "json",
            id: discountData.metafield.id,
            value: JSON.stringify({
              quantity: parseInt(form.configuration.quantity),
              percentage: parseFloat(form.configuration.percentage),
            }),
          },
        ],
      };

      let response;
      if (form.discountMethod === DiscountMethod.Automatic) {
        response = await authenticatedFetch("/api/discounts/automatic", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountTitle,
            },
            id: discountData.id,
          }),
        });
      } else {
        response = await authenticatedFetch("/api/discounts/code", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountCode,
              code: form.discountCode,
              appliesOncePerCustomer: form.usageOncePerCustomer,
              usageLimit: form.usageTotalLimit
                ? Number(form.usageTotalLimit)
                : null,
            },
            id: discountData.id,
          }),
        });
      }

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
              discountCode={discountCode}
              discountMethod={discountMethod}
            />
            <LegacyCard title="Volume" sectioned>
              <TextField label="Minimum quantity" {...configuration.quantity} />
              <TextField
                label="Discount percentage"
                {...configuration.percentage}
                suffix="%"
              />
            </LegacyCard>

            {discountMethod.value === DiscountMethod.Code && (
              <UsageLimitsCard
                totalUsageLimit={usageTotalLimit}
                oncePerCustomer={usageOncePerCustomer}
              />
            )}
            <CombinationCard
              combinableDiscountTypes={combinesWith}
              discountClass={DiscountClass.Product}
              discountDescriptor={
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value
              }
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
              discountDescriptor:
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value,
              appDiscountType: "Volume",
              isEditing: true,
            }}
            performance={{
              status: discountData.discount.status,
              usageCount:
                discountData.discount.codeCount ||
                discountData.discount.asyncUsageCount,
            }}
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: usageOncePerCustomer.value,
              totalUsageLimit: usageTotalLimit.value,
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
