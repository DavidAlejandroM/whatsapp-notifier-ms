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
router.get("/", controller.getQr);
router.get("/html", controller.getQrHtml);
router.get("/create", controller.getCreateClient);
router.get("/logout", controller.logout)

export {router};