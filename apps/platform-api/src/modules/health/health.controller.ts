import { Controller, Get } from "@nestjs/common";

type THealthResponse = {
  status: "ok";
};

@Controller("health")
export class HealthController {
  @Get("/")
  getHealth(): THealthResponse {
    return {
      status: "ok",
    };
  }
}
