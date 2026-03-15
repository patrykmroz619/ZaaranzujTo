import { getRequestConfig } from "next-intl/server";

const LOCALE = "pl";

export default getRequestConfig(async () => {
  return {
    locale: LOCALE,
    messages: (await import("./messages/pl.json")).default,
  };
});
