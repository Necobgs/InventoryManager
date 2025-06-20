export default interface MovementsFormType {
    inventory: {
        id: number,
        title: string;
    } | null,
    quantity: number,
}