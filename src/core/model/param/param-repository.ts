import {Param} from "./param";

export interface ParamRepository {
    getAll(): Promise<Array<Param>>;

    get(key: string): Promise<Param>;

    save(param: Param): Promise<Param>;
}