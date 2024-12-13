import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../../services/api";
import Media from "../../components/media";
import Loading from "../../components/loading";

const Catalog = () => {
  const [loading, setLoading] = useState(true);
  const [medias, setMedias] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [actualPage, setActualPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    api
      .get("/discover/movie", { params: { page: actualPage } })
      .then((res) => {
        const newMedias = [...medias, ...res.data.results];
        setMedias(newMedias);
        setFilteredMedias(newMedias);
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch((error) => console.error(error.message));
  }, [actualPage]);

  function handleSearch(search) {
    setSearchString(search);
    const mediasSearched = medias.filter((media) =>
      media.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMedias(mediasSearched);
  }

  return (
    <View style={styles.catalogContainer}>
      {loading && <Loading />}
      <View style={styles.mediasCatalogContainer}>
        <View style={styles.headerMediasCatalogContainer}>
          <Text style={styles.headerText}>Todas as nossas mídias</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Pesquisar"
              value={searchString}
              onChangeText={handleSearch}
              placeholderTextColor={"#fafafa"}
            />
            <Ionicons name="search-outline" style={styles.icon} />
          </View>
        </View>
        {searchString && filteredMedias.length > 0 && (
          <View style={styles.headerSearchResult}>
            <Text style={styles.resultText}>
              Resultados para "{searchString}"
            </Text>
          </View>
        )}
        {filteredMedias.length === 0 && !loading && (
          <View style={styles.notResultContainer}>
            <Ionicons name="search-outline" style={styles.notFoundIcon} />
            <Text style={styles.notFoundText}>
              Nenhum Resultado para "{searchString}"
            </Text>
            <Text style={styles.notFoundMessage}>
              Digite outro nome, talvez você encontre o que procura.
            </Text>
          </View>
        )}
        <FlatList
          data={filteredMedias}
          renderItem={({ item }) => (
            <Media key={item.id} media={item} redirect />
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.mediasMainCatalogContainer}
        />
        {actualPage < totalPages && !searchString && (
          <View style={styles.loadMoreButton}>
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => setActualPage(actualPage + 1)}
            >
              <Text style={styles.loadMoreBtnText}>Carregar Mais</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  catalogContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mediasCatalogContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerMediasCatalogContainer: {
    width: "100%",
  },
  headerText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#1f1f1f",
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fafafa",
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    fontSize: 24,
    color: "rgba(128, 128, 128, 0.678)",
    marginRight: 20,
  },
  headerSearchResult: {
    marginBottom: 10,
  },
  resultText: {
    fontWeight: "300",
    color: "#fff",
    fontSize: 20,
  },
  notResultContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundIcon: {
    fontSize: 150,
    color: "rgba(128, 128, 128, 0.322)",
    marginBottom: 20,
  },
  notFoundText: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
  },
  notFoundMessage: {
    fontSize: 18,
    color: "#fff",
  },
  mediasMainCatalogContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  loadMoreButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "blueviolet",
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  loadMoreBtnText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default Catalog;
