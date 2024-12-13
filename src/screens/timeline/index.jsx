import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { v4 as uuid } from "uuid";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../services/api";
import { Context } from "../../context";

import Avaliation from "../../components/avaliation";
import Coment from "../../components/coment";

const Timeline = ({ navigation }) => {
  const { user, setUser } = useContext(Context);

  const [data, setData] = useState([]);
  const [avaliations, setAvaliations] = useState([]);

  const [viewInputSearchMediaMention, setViewInputSearchMediaMention] =
    useState(false);
  const [searchMediaMention, setSearchMediaMention] = useState("");
  const [mediasToMention, setMediasToMention] = useState([]);

  const [contentAvaliation, setContentAvaliation] = useState("");
  const [stars, setStars] = useState(0);
  const [mentionedMedia, setMentionedMedia] = useState(null);

  async function loadData() {
    const avaliations =
      JSON.parse(await AsyncStorage.getItem("avaliations")) || [];
    setAvaliations(avaliations);

    const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];

    const tempComents = comments.map((comment) => ({
      ...comment,
      type: "comment",
    }));
    const tempAvaliation = avaliations.map((avaliation) => ({
      ...avaliation,
      type: "avaliation",
    }));

    setData([...tempAvaliation, ...tempComents]);
  }

  useEffect(() => {
    navigation.addListener("focus", async () => {
      await loadData();
    });

    navigation.addListener("blur", () => {
      setData([]);
      setAvaliations([]);
    });
  }, []);

  function handleSearchMediasMention(text) {
    setSearchMediaMention(text);

    if (!text) {
      setMediasToMention([]);
    } else {
      api
        .get("/search/movie", { params: { query: text } })
        .then((res) => setMediasToMention(res.data.results))
        .catch((error) => console.error(error.data));
    }
  }

  async function handleAvaliate() {
    if (!contentAvaliation)
      return Toast.show({
        type: "error",
        text1: "Informe o conteúdo da avaliação!",
      });

    const avaliation = {
      id: uuid(),
      user_name: user.name,
      user_user: user.user,
      media_id: mentionedMedia.id,
      media_name: mentionedMedia.title,
      media_poster_path: mentionedMedia.poster_path,
      content: contentAvaliation,
      stars,
      amountComents: 0,
      amountLikes: 0,
      created_at: new Date().toLocaleString(),
    };

    const userAvaliations = avaliations.filter(
      (avaliation) => avaliation.user_user === user.user
    );
    const newUser = {
      ...user,
      avaliations: [avaliation, ...userAvaliations],
    };

    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);

    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const newUsers = users.filter((u) => u.user !== user.user);
    await AsyncStorage.setItem("users", JSON.stringify([newUser, ...newUsers]));

    await AsyncStorage.setItem(
      "avaliations",
      JSON.stringify([avaliation, ...avaliations])
    );

    setData([{ ...avaliation, type: "avaliation" }, ...data]);
    setAvaliations([avaliation, ...avaliations]);
    setContentAvaliation("");
    setMentionedMedia(null);
    setStars(0);
    setSearchMediaMention("");
    setViewInputSearchMediaMention(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.mainTimeline}>
          <View style={styles.containerNewAvaliation}>
            <Text style={styles.sectionTitle}>Avalie</Text>
            <TextInput
              style={styles.textArea}
              value={contentAvaliation}
              onChangeText={setContentAvaliation}
              placeholder="O que você acha?"
              placeholderTextColor="#fafafa"
              multiline
              maxLength={360}
            />

            {mentionedMedia && (
              <View>
                <View style={styles.mediaMentioned}>
                  <View style={styles.mediaMentionedContainer}>
                    <View
                      style={[
                        styles.colorMediaMentioned,
                        { backgroundColor: "blueviolet" },
                      ]}
                    >
                      <Ionicons name="film-outline" size={45} color="white" />
                    </View>
                    <View style={styles.infoMediaMentioned}>
                      <Text style={styles.mediaMentionTitle}>Sobre</Text>
                      <Text style={styles.mediaMentionSubtitle}>
                        {mentionedMedia.title}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => setMentionedMedia(null)}
                  >
                    <Ionicons name="trash-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.starsTitle}>Estrelas</Text>
                  <View>
                    <View style={styles.starValue}>
                      <Ionicons name="star" size={24} color="#FFbb00" />
                      <Text style={styles.starsValue}>{stars}</Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#000000"
                      onValueChange={(value) => setStars(value)}
                      step={0.1}
                    />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.footerContainer}>
              <View style={styles.mentionMediaContainer}>
                {viewInputSearchMediaMention && (
                  <View style={styles.searchInputContainer}>
                    <TextInput
                      style={styles.searchInput}
                      value={searchMediaMention}
                      onChangeText={handleSearchMediasMention}
                      placeholder="Nome da mídia"
                      placeholderTextColor="#fafafa"
                    />
                    {searchMediaMention ? (
                      <TouchableOpacity
                        onPress={() => {
                          setMediasToMention([]);
                          setSearchMediaMention("");
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    ) : null}
                    <Ionicons name="search-outline" size={24} color="white" />
                  </View>
                )}
                <View style={styles.mentionedMediaButtonsContainer}>
                  <TouchableOpacity
                    style={styles.mentionMediaButton}
                    onPress={() =>
                      setViewInputSearchMediaMention(
                        !viewInputSearchMediaMention
                      )
                    }
                  >
                    <Ionicons name="videocam-outline" size={24} color="white" />
                    <Text style={styles.mentionMediaButtonText}>
                      Mencionar Mídia
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.avaliarButton}
                    onPress={async () => await handleAvaliate()}
                  >
                    <Text style={styles.avaliarButtonText}>Avaliar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {mediasToMention.length > 0 && (
              <ScrollView style={styles.mediasToMentionContainer}>
                {mediasToMention.map((media) => (
                  <TouchableOpacity
                    key={media.id}
                    style={styles.mediaToMention}
                    onPress={() => {
                      setMentionedMedia(media);
                      setMediasToMention([]);
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/original/${media.backdrop_path}`,
                      }}
                      style={styles.mediaImage}
                    />
                    <Text style={styles.mediaTitle}>{media.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
          <View style={styles.columnsContainer}>
            {data.length > 0 ? (
              data.map((item) =>
                item.type === "avaliation" ? (
                  <Avaliation key={item.id} avaliation={item} />
                ) : (
                  <Coment
                    key={item.id}
                    coment={item}
                    showRedirectToAvaliation
                  />
                )
              )
            ) : (
              <View style={styles.nothingContainer}>
                <Text style={styles.nothingTitle}>
                  Nenhuma avaliação encontrada
                </Text>
                <Text style={styles.nothingSubtitle}>
                  Assim que alguém avaliar algo do seu gosto ou algum seguidor
                  avaliar alguma coisa mostraremos aqui.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timelineContentContainer: {
    width: "100%",
    marginTop: 50,
  },
  containerNewAvaliation: {
    width: "100%",
    height: "auto",
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.205)",
    padding: 15,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
  },
  textArea: {
    width: "100%",
    height: 70,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.205)",
    color: "white",
    fontSize: 18,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  mediaMentioned: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaMentionedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorMediaMentioned: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginRight: 10,
  },
  infoMediaMentioned: {
    marginRight: 20,
  },
  mediaMentionTitle: {
    color: "white",
    fontWeight: "300",
  },
  mediaMentionSubtitle: {
    color: "white",
  },
  removeMediaButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d43253",
    borderRadius: 3,
  },
  starsTitle: {
    color: "white",
    fontWeight: "300",
  },
  starValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsValue: {
    color: "white",
    marginHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mentionMediaContainer: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  mentionedMediaButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  mentionMediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blueviolet",
    borderRadius: 50,
  },
  mentionMediaButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.205)",
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  avaliarButton: {
    backgroundColor: "blueviolet",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
  },
  avaliarButtonText: {
    color: "white",
    fontSize: 16,
  },
  mediasToMentionContainer: {
    marginTop: 20,
    columnGap: 10,
  },
  mediaToMention: {
    width: 375,
    height: 120,
    borderRadius: 3,
    marginBottom: 5,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
    opacity: 0.8,
  },
  mediaTitle: {
    position: "absolute",
    color: "white",
    bottom: 10,
    left: 10,
    fontSize: 16,
  },
  columnsContainer: {
    flexDirection: "column",
  },
  nothingContainer: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  nothingTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
  },
  nothingSubtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Timeline;
