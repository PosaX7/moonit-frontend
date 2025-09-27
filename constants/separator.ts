import { Transaction } from "../services/api";

// ✅ Fonction pour calculer les totaux
export function calculateTotals(transactions: Transaction[]) {
  let totalRevenus = 0;
  let totalDepenses = 0;

  transactions.forEach((t) => {
    const montant = Number(t.montant) || 0;
    if (t.type === "revenu") {
      totalRevenus += montant;
    } else if (t.type === "depense") {
      totalDepenses += montant;
    }
  });

  const solde = totalRevenus - totalDepenses;
  return { totalRevenus, totalDepenses, solde };
}

// ✅ Fonction pour formater les montants avec séparateur de milliers
export function formatMontant(montant: number) {
  return montant.toLocaleString("fr-FR") + " FCFA";
}
