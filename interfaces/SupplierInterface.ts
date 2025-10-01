export interface SupplierInterface {
    id: number,
    name: string,
    cnpj: string,
    phone: string,
    enabled:boolean,
}

export type SupplierForm = Omit<SupplierInterface, "id">;