import {Param} from "./param";

export interface ParamRepository {
    getAll(): Promise<Array<Param>>;

    get(key: string): Promise<Param>;

    getAllByLikeKey(key: string): Promise<Array<Param>>

    save(param: Param): Promise<Param>;
}