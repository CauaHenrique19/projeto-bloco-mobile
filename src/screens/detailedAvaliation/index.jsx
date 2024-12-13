import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuid } from "uuid";

import { Context } from "../../context";

import AvaliationSVG from "../../assets/avaliation";
import Loading from "../../components/loading";
import Coment from "../../components/coment";

const DetailedAvaliation = ({ navigation }) => {
  const { user } = useContext(Context);
  const route = useRoute();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [avaliationDetailed, setAvaliationDetailed] = useState({});
  const [contentComent, setContentComent] = useState("");
  const [coments, setComents] = useState([]);
  const [like, setLike] = useState([]);
  const [liked, setLiked] = useState(false);

  const [amountLikes, setAmountLikes] = useState(0);
  const [amountComents, setAmountComents] = useState(0);

  const [viewButton, setViewButton] = useState(false);

  const loadData = async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];
    const existentMyLike = likes.find(
      (l) => l.avaliation_id === id && user.id === l.user_id
    );

    if (existentMyLike) {
      setLiked(true);
      setLike(existentMyLike);
    } else {
      setLiked(false);
      setLike([]);
    }

    setAmountLikes(likes.filter((like) => like.avaliation_id === id).length);

    const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];
    setAmountComents(
      comments.filter((comment) => comment.avaliation_id === id).length
    );

    const avaliations =
      JSON.parse(await AsyncStorage.getItem("avaliations")) || [];
    const avaliation = avaliations.find((avaliation) => avaliation.id === id);

    if (avaliation) {
      setAvaliationDetailed(avaliation);
      setLoading(false);

      const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];
      const commentsAvaliation = comments.filter(
        (coment) => coment.avaliation_id === id
      );

      setComents(commentsAvaliation);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", async () => {
      await loadData();
    });

    navigation.addListener("blur", () => {
      setViewButton(false);
      setComents([]);
      setLiked(false);
      setLike([]);
    });
  }, [id]);

  async function handleLike() {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];

    if (liked) {
      const index = likes.findIndex(
        (l) => l.avaliation_id === id && user.id === l.user_id
      );
      likes.splice(index, 1);
      await AsyncStorage.setItem("likes", JSON.stringify(likes));
      setLiked(false);
      setAmountLikes(amountLikes - 1);
    } else {
      const newLike = { user_id: user.id, avaliation_id: id };
      await AsyncStorage.setItem("likes", JSON.stringify([...likes, newLike]));
      setLiked(true);
      setAmountLikes(amountLikes + 1);
    }

    setViewButton(false);
  }

  async function handleComent() {
    const coment = {
      id: uuid(),
      user_id: user.id,
      avaliation_id: id,
      user_name: user.name,
      user_user: user.user,
      media_name: avaliationDetailed.media_name,
      content: contentComent,
      amountLikes: 0,
      created_at: new Date().toLocaleString(),
    };

    const existentComments =
      JSON.parse(await AsyncStorage.getItem("comments")) || [];
    await AsyncStorage.setItem(
      "comments",
      JSON.stringify([coment, ...existentComments])
    );

    setComents([coment, ...coments]);
    setContentComent("");
    setAmountComents(amountComents + 1);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => setViewButton(!viewButton)}
          style={styles.avaliationContainer}
        >
          <View style={styles.headerComent}>
            <View style={styles.userInfo}>
              <AvaliationSVG />
              <View>
                <Text style={styles.userName}>
                  {avaliationDetailed.user_name}
                </Text>
                <Text style={styles.userHandle}>
                  @{avaliationDetailed.user_user}
                </Text>
              </View>
            </View>
            <View style={styles.postInfo}>
              <Text style={styles.postDate}>
                {avaliationDetailed.created_at}
              </Text>
            </View>
          </View>
          <Text style={styles.contentComent}>{avaliationDetailed.content}</Text>
          <View style={styles.footerComent}>
            <View style={styles.mediaInfo}>
              <View style={styles.colorComent}>
                <Ionicons name="film-outline" size={30} color="white" />
              </View>
              <View style={styles.mediaTextContainer}>
                <Text style={styles.mediaAboutText}>Sobre</Text>
                <Text style={styles.mediaName}>
                  {avaliationDetailed.media_name}
                </Text>
              </View>
            </View>
            <View style={styles.avaliationInfo}>
              <View style={styles.countContainer}>
                <Ionicons name="chatbubble" size={20} color="white" />
                <Text style={styles.countText}>{amountComents}</Text>
              </View>
              <View style={styles.countContainer}>
                <Ionicons name="heart" size={20} color="white" />
                <Text style={styles.countText}>{amountLikes}</Text>
              </View>
            </View>
          </View>
          {viewButton && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={async () => await handleLike()}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={30}
                  color={liked ? "red" : "white"}
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.formComent}>
          <TextInput
            style={styles.commentInput}
            value={contentComent}
            onChangeText={setContentComent}
            placeholder="O que você acha?"
            placeholderTextColor="#888"
            multiline
            maxLength={360}
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleComent}>
            <Ionicons name="chatbox" size={20} color="white" />
            <Text style={styles.commentButtonText}>Comentar</Text>
          </TouchableOpacity>
        </View>

        {coments.length > 0 && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>Comentários</Text>
            {coments.map((coment) => (
              <Coment key={coment.id} coment={coment} />
            ))}
          </View>
        )}

        {coments.length === 0 && (
          <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsTitle}>
              Nenhum comentário encontrado
            </Text>
            <Text style={styles.noCommentsText}>
              Assim que alguém comentar mostraremos aqui pra você.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  avaliationContainer: {
    width: "100%",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    marginBottom: 5,
  },
  headerComent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
  userHandle: {
    color: "gray",
    marginLeft: 10,
  },
  postInfo: {
    backgroundColor: "blueviolet",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  postDate: {
    color: "white",
    fontSize: 12,
  },
  contentComent: {
    color: "white",
    padding: 10,
    fontSize: 16,
  },
  footerComent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 10,
  },
  mediaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorComent: {
    padding: 5,
    backgroundColor: "blueviolet",
    borderRadius: 5,
    marginRight: 10,
  },
  mediaTextContainer: {
    justifyContent: "center",
  },
  mediaAboutText: {
    color: "#fafafa",
    fontWeight: "bold",
  },
  mediaName: {
    color: "#fafafa",
  },
  avaliationInfo: {
    flexDirection: "row",
    gap: 5,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "blueviolet",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 30,
    borderRadius: 50,
    gap: 5,
  },
  countText: {
    color: "#fafafa",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  likeButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fafafa",
  },
  formComent: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 5,
    marginBottom: 15,
  },
  commentTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: "#2f2f2f",
    color: "white",
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  commentButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "blueviolet",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  commentButtonText: {
    color: "white",
    marginLeft: 10,
  },
  commentsSection: {
    marginBottom: 15,
  },
  commentsSectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  noCommentsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  noCommentsTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
  },
  noCommentsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  mediaContainer: {
    marginBottom: 20,
  },
  mediaTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DetailedAvaliation;
