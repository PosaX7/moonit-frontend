export type TransactionMode = "budget" | "suivi";

export type TransactionPosition = "depense" | "revenu";

export type Libelle = {
  nom: string;
  montant: number;
};

export type TransactionFormValues = {
  position: TransactionPosition;
  categorieNom: string;
  date: Date;
  libelles: Libelle[];
  commentaire?: string;
};

export type TransactionFormProps = {
  visible: boolean;
  mode: TransactionMode;
  onSubmit: (data: TransactionFormValues) => void;
  onClose: () => void;
};
