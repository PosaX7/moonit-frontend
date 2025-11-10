// hooks/useSolde.ts
import { useMemo } from "react";
import { Transaction } from "../services/api";

export default function useSolde(transactions: Transaction[]) {
  const { totalRevenus, totalDepenses, solde } = useMemo(() => {
    const revenus = transactions
      .filter((tx) => tx.position === "revenu" && tx.statut === "validee")
      .reduce((sum, tx) => sum + tx.montant_total, 0);

    const depenses = transactions
      .filter((tx) => tx.position === "depense" && tx.statut === "validee")
      .reduce((sum, tx) => sum + tx.montant_total, 0);

    return {
      totalRevenus: revenus,
      totalDepenses: depenses,
      solde: revenus - depenses,
    };
  }, [transactions]);

  return { totalRevenus, totalDepenses, solde };
}