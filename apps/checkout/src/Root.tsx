import "@/index.css";

import { createClient, Provider as UrqlProvider } from "urql";
import { ErrorBoundary } from "react-error-boundary";
import { I18nProvider } from "@react-aria/i18n";
import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";

import { Checkout } from "@/Checkout";
import { getCurrentRegion } from "@/lib/regions";
import { envVars, getQueryVariables } from "@/lib/utils";
import { AppConfigProvider } from "@/providers/AppConfigProvider";
import { ErrorsProvider } from "@/providers/ErrorsProvider";
import { OrderConfirmation } from "@/OrderConfirmation";
import { PageNotFound } from "@/sections/PageNotFound";

const authorizedFetch = createFetch();

const client = createClient({
  url: envVars.apiUrl,
  suspense: true,
  requestPolicy: "cache-first",
  fetch: authorizedFetch,
});

// temporarily need to use @apollo/client because saleor sdk
// is based on apollo. to be changed
const saleorClient = createSaleorClient({
  apiUrl: envVars.apiUrl,
  channel: "default-channel",
});

export const Root = () => {
  const orderToken = getQueryVariables().orderToken;

  return (
    // @ts-ignore React 17 <-> 18 type mismatch
    <SaleorProvider client={saleorClient}>
      <I18nProvider locale={getCurrentRegion()}>
        <UrqlProvider value={client}>
          <AppConfigProvider>
            <ErrorsProvider>
              <div className="app">
                {/* @ts-ignore React 17 <-> 18 type mismatch */}
                <ErrorBoundary FallbackComponent={PageNotFound}>
                  {orderToken ? (
                    <OrderConfirmation orderToken={orderToken} />
                  ) : (
                    <Checkout />
                  )}
                </ErrorBoundary>
              </div>
            </ErrorsProvider>
          </AppConfigProvider>
        </UrqlProvider>
      </I18nProvider>
    </SaleorProvider>
  );
};
