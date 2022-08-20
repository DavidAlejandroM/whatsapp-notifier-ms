import {readdirSync} from "fs";
import {Request, Response, Router} from "express";
import dotenv from "dotenv";

const router: Router = Router();
const PATH_ROUTES = __dirname;

dotenv.config();

function removeExtension(fileName: string): string {
    return <string>fileName.split(".").shift();
}

function loadRouter(file: string): void {
    const name = removeExtension(file);
    if (name !== "routes-config") {
        import(`./${file}`).then((routerModule) => {
            console.log("cargado", name);
            router.use(`/${process.env.CONTEXT_API || 'api'}/${name}`, routerModule.router);
        });
    }
}

router.get("/", (req: Request, res: Response) => {
    res.status(200).send("CLEAN");
})

console.info(`api context: /${process.env.CONTEXT_API || 'api'}/`)

readdirSync(PATH_ROUTES).filter((file) => loadRouter(file));

export default router;