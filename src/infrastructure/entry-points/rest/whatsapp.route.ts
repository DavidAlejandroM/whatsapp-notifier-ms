import {Router} from "express";
import {TestCtrl} from "./test/test-controller";
import {TYPES} from "../../../application/config/types";
import {container} from "../../../application/config/inversify.config";
import {WhatsappController} from "./whatsapp/whatsapp-controller";
const router: Router = Router();
/**
 * http://localhost/lead POST
 */
const controller: WhatsappController = container.get<WhatsappController>(TYPES.WhatsappController);

router.post("/", controller.post);

export {router};