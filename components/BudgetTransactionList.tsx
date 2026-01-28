import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  transactions: any[];
};

export default function BudgetTransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return <Text style={{color:"#fff"}}>Aucune transaction pour le moment</Text>;
  }

  return (
    <View>
      {transactions.map(tx => (
        <View key={tx.id} style={styles.row}>
          <Text style={styles.categorie}>{tx.categorie_nom}</Text>
          <Text style={styles.montant}>
            {tx.libelles.reduce((acc: number, l: any) => acc + l.montant, 0)} 
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection:"row", justifyContent:"space-between", padding:12, backgroundColor:"#1e293b", marginBottom:6, borderRadius:8 },
  categorie: { color:"#fff", fontWeight:"600" },
  montant: { color:"#14B8A6", fontWeight:"700" },
});
