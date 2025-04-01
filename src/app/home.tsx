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
  imagem: string | null;
  prestador: {
    id: number;
    nome: string;
  };
}

export default function ClientHome() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/servico");
      console.log('Resposta da API:', response.data); // Para debug
      if (response.status === 200) {
        setServicos(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      ToastAndroid.show("Não foi possível carregar os serviços.", 2000);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const renderItem = ({ item }: { item: Servico }) => {
    // Verifica se a imagem precisa do prefixo base64
    const imageUri = item.imagem
      ? item.imagem.startsWith('data:image')
        ? item.imagem
        : `data:image/jpeg;base64,${item.imagem}`
      : null;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => router.push(`/service-details/${item.id}`)}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.descricao || "Sem descrição"}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{`R$ ${item.preco.toFixed(2)}`}</Text>
            <Text style={styles.cardDuration}>{`${item.duracao} min`}</Text>
          </View>
          <Text style={styles.providerName}>Por: {item.prestador.nome}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Serviços Disponíveis</Text>

      {isLoading && !refreshing ? (
        <Text style={styles.loadingText}>Carregando serviços...</Text>
      ) : servicos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  header: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    marginBottom: 20,
    color: colors.purple[100],
    textAlign: 'center',
  },
  loadingText: {
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    marginTop: 20,
    color: colors.gray[500],
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    marginTop: 20,
    color: colors.gray[500],
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray[200],
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.gray[500],
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.purple[100],
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardPrice: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.purple[100],
  },
  cardDuration: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  providerName: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.gray[600],
    fontStyle: 'italic',
  },
});