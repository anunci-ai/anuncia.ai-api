import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeSubscribeToPlanController } from "../factories/make-subscribe-to-plan-controller";
import { makeCancelSubscriptionController } from "../factories/make-cancel-subscription-controller";

const subscriptionsRoutes = Router();

subscriptionsRoutes.post("/", auth, adaptRoute(makeSubscribeToPlanController()));
subscriptionsRoutes.patch("/:subscriptionId/cancel", auth, adaptRoute(makeCancelSubscriptionController()));

export { subscriptionsRoutes };
