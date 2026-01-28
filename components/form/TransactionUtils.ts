import { TransactionFormValues } from "./TransactionTypes";

export function isTransactionValid(data: TransactionFormValues): boolean {
  if (!data.categorieNom.trim()) return false;
  if (!data.libelles || data.libelles.length === 0) return false;

  const total = data.libelles.reduce(
    (sum, l) => sum + Number(l.montant || 0),
    0
  );

  return total > 0;
}

export function createEmptyLibelle() {
  return { nom: "", montant: 0 };
}
