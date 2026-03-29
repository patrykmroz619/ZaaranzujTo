import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";

import { CreditPackagesConfig } from "./config/credit-packages.config";
import { CreditsController } from "./credits.controller";
import { CreditAccountsRepository } from "./repositories/credit-accounts.repository";
import { CreditIdempotencyRepository } from "./repositories/credit-idempotency.repository";
import { CreditLedgerRepository } from "./repositories/credit-ledger.repository";
import { CreditAccount, CreditAccountSchema } from "./schemas/credit-account.schema";
import {
  CreditIdempotencyRecord,
  CreditIdempotencyRecordSchema,
} from "./schemas/credit-idempotency.schema";
import { CreditLedger, CreditLedgerSchema } from "./schemas/credit-ledger.schema";
import { CompensateCreditService } from "./services/compensate-credit.service";
import { ConsumeCreditService } from "./services/consume-credit.service";
import { GetBalanceService } from "./services/get-balance.service";
import { CreditIdempotencyService } from "./services/internal/credit-idempotency.service";
import { CreditsOperationsLogger } from "./services/internal/credits-operations.logger";
import { ReservationTransitionGuard } from "./services/internal/reservation-transition.guard";
import { ListCreditPackagesService } from "./services/list-credit-packages.service";
import { ReserveCreditService } from "./services/reserve-credit.service";
import { TopUpCreditService } from "./services/top-up-credit.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: CreditAccount.name,
        schema: CreditAccountSchema,
      },
      {
        name: CreditLedger.name,
        schema: CreditLedgerSchema,
      },
      {
        name: CreditIdempotencyRecord.name,
        schema: CreditIdempotencyRecordSchema,
      },
    ]),
  ],
  controllers: [CreditsController],
  providers: [
    CreditPackagesConfig,
    CreditAccountsRepository,
    CreditLedgerRepository,
    CreditIdempotencyRepository,
    CreditIdempotencyService,
    ReservationTransitionGuard,
    CreditsOperationsLogger,
    GetBalanceService,
    ListCreditPackagesService,
    TopUpCreditService,
    ReserveCreditService,
    ConsumeCreditService,
    CompensateCreditService,
  ],
  exports: [
    CreditPackagesConfig,
    GetBalanceService,
    TopUpCreditService,
    ReserveCreditService,
    ConsumeCreditService,
    CompensateCreditService,
  ],
})
export class CreditsModule {}
