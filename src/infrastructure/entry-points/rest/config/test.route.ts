import {Router} from "express";
import {TestCtrl} from "../test/test-controller";
import {TYPES} from "../../../../application/config/types";
import {container} from "../../../../application/config/inversify.config";
const router: Router = Router();
/**
 * http://localhost/lead POST
 */
const testCtrl: TestCtrl = container.get<TestCtrl>(TYPES.TestCtrl);

router.get("/", testCtrl.get);
router.post("/", testCtrl.post);

export {router};