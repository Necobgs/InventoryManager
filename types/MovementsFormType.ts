export default interface MovementsFormType {
    inventory: {
        id: number,
        title: string;
    } | null,
    operation: {
        id: number,
        title: string;
    } | null,
    quantity: number,
    qty_product: number,
    price_per_unity: number,
    value: number,
}