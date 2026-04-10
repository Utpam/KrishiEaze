import { View, Text, StyleSheet } from "react-native";

export default function ListingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Listings (Empty)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F5",
  },
  text: {
    fontSize: 18,
    color: "#8e8e8e",
  },
});
