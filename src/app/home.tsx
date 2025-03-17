// app/client/home.tsx
import { api } from "@/src/services/api";
import { colors, fontFamily } from "@/src/styles/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  imagem: string;
}

export default function ClientHome() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/servico");
      if (response.status === 200) {
        setServicos(response.data.data);
      }
    } catch (error) {
      ToastAndroid.show("Não foi possível carregar os serviços.", 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const renderItem = ({ item }: { item: Servico }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`/service-details/${item.id}` as any)}
    >
      {item.imagem ? (
        <Image source={{ uri: `data:image/jpeg;base64,${item.imagem}` }} style={styles.itemImage} />
      ) : null}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.nome}</Text>
        <Text style={styles.itemDescription}>{item.descricao}</Text>
        <Text style={styles.itemPrice}>{`R$ ${item.preco.toFixed(2)}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Serviços Disponíveis</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList data={servicos} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontFamily: fontFamily.bold, fontSize: 24, marginBottom: 16, color: colors.purple[100] },
  loadingText: { fontFamily: fontFamily.regular, textAlign: "center" },
  itemContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
  itemContent: { flex: 1 },
  itemTitle: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.purple[100] },
  itemDescription: { fontFamily: fontFamily.regular, fontSize: 14, color: "#666" },
  itemPrice: { fontFamily: fontFamily.bold, fontSize: 16, color: colors.purple[100] },
});
