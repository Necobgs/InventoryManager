export const parseCurrency = (value: string): number => {
  // Remove tudo que não é número ou vírgula
  const cleaned = value.replace(/[^0-9,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};