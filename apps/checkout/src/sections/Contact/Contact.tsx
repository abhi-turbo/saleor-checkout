import { useCheckout } from "@hooks/useCheckout";
import { getDataWithToken, getQueryVariables } from "@lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import { AnonymousCustomerForm } from "./AnonymousCustomerForm";
import { SignInForm } from "./SignInForm";
import { SignedInUser } from "./SignedInUser";
import { useAuthState } from "@saleor/sdk";
import {
  useCheckoutCustomerAttachMutation,
  useCheckoutCustomerDetachMutation,
} from "@graphql";
import { ResetPassword } from "./ResetPassword";

type Section = "signedInUser" | "anonymousUser" | "signIn" | "resetPassword";

export const Contact = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("anonymousUser");

  const changeSection = (section: Section) => () => setCurrentSection(section);

  const isCurrentSection = (section: Section) => currentSection === section;

  const [, customerAttatch] = useCheckoutCustomerAttachMutation();
  const [, customerDetach] = useCheckoutCustomerDetachMutation();

  const { authenticated, user } = useAuthState();
  const { checkout, loading } = useCheckout();

  const passwordResetToken = getQueryVariables().passwordResetToken;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (passwordResetToken) {
      setCurrentSection("resetPassword");
      return;
    }

    if (authenticated || checkout.user) {
      setCurrentSection("signedInUser");

      if (authenticated) {
        customerAttatch(
          getDataWithToken({
            customerId: user?.id as string,
          })
        );
      }

      return;
    }

    setCurrentSection("anonymousUser");
    customerDetach(getDataWithToken());
  }, [loading, checkout, authenticated, passwordResetToken]);

  return (
    <div>
      {isCurrentSection("anonymousUser") && (
        <AnonymousCustomerForm onSectionChange={changeSection("signIn")} />
      )}

      {isCurrentSection("signIn") && (
        <SignInForm onSectionChange={changeSection("anonymousUser")} />
      )}

      {isCurrentSection("signedInUser") && (
        <SignedInUser onSectionChange={changeSection("anonymousUser")} />
      )}

      {isCurrentSection("resetPassword") && (
        <ResetPassword onSectionChange={changeSection("signIn")} />
      )}
    </div>
  );
};
