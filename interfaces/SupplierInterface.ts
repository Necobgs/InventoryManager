import { RootInterface } from "./RootInterface";

export interface SupplierInterface extends RootInterface {
    name: string,
    cnpj: string,
    phone: string,
    cep: string,
    enabled:boolean,
}

export interface SupplierFilter {
    name: string,
    cnpj: string,
    enabled?: boolean
}

export type SupplierForm = Omit<SupplierInterface, "id">;

export type SupplierPartial = Partial<SupplierInterface>;