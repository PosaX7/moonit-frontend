import { useMemo } from "react";
import { Transaction } from "../services/api";

export default function useSolde(transactions: Transaction[]) {
  const totalRevenus = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "revenu")
      .reduce((acc, tx) => acc + tx.montant, 0);
  }, [transactions]);

  const totalDepenses = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "depense")
      .reduce((acc, tx) => acc + tx.montant, 0);
  }, [transactions]);

  const solde = totalRevenus - totalDepenses;

  return { totalRevenus, totalDepenses, solde };
}
