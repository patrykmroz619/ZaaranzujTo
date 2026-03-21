import type { TCreditBalance } from "@repo/contracts/credits";
import { creditBalanceSchema } from "@repo/contracts/credits";

import type { TCreditAccountDocument } from "../schemas/credit-account.schema";

export const mapCreditAccountToBalance = (params: {
  account: TCreditAccountDocument;
}): TCreditBalance => {
  const { account } = params;

  return creditBalanceSchema.parse({
    balance: account.balance,
    reserved: account.reserved,
    available: account.balance - account.reserved,
    updatedAt: account.updatedAt.toISOString(),
  });
};

export const mapVirtualZeroBalance = (): TCreditBalance => {
  const nowIso = new Date().toISOString();

  return creditBalanceSchema.parse({
    balance: 0,
    reserved: 0,
    available: 0,
    updatedAt: nowIso,
  });
};
