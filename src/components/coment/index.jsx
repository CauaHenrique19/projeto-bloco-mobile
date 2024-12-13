import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Context } from "../../context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Coment = ({ coment }) => {
  const { user } = useContext(Context);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState([]);
  const [amountLikes, setAmountLikes] = useState(0);
  const navigation = useNavigation();

  useEffect(async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("mylikes")) || [];
    const existentLike = likes.find((l) => l.coment_id === coment.id);
    setAmountLikes(likes.filter((like) => like.coment_id === coment.id).length);
    if (existentLike) {
      setLiked(true);
      setLike(existentLike);
    }
  }, [coment]);

  async function handleLike() {
    const likes = JSON.parse(await AsyncStorage.getItem("mylikes")) || [];

    if (liked) {
      const newLikes = likes.filter((l) => l.coment_id !== coment.id);
      await AsyncStorage.setItem("mylikes", JSON.stringify(newLikes));
      setLiked(false);
      setAmountLikes(amountLikes - 1);
    } else {
      const newLike = { user_id: user.id, coment_id: coment.id };
      await AsyncStorage.setItem(
        "mylikes",
        JSON.stringify([...likes, newLike])
      );
      setLiked(true);
      setAmountLikes(amountLikes + 1);
    }
  }

  return (
    <View key={coment.id} style={styles.coment}>
      <View style={styles.headerComent}>
        <View style={styles.infoUser}>
          <Icon name="chatbox" size={30} color="blueviolet" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{coment.user_name}</Text>
            <Text style={styles.userUser}>@{coment.user_user}</Text>
          </View>
        </View>
        <View style={styles.infoPost}>
          <Text style={styles.postDate}>{coment.created_at}</Text>
        </View>
      </View>

      <Text style={styles.contentComent}>{coment.content}</Text>

      <View style={styles.footerComent}>
        <View style={styles.infoMedia}>
          <View style={[styles.colorComent, { backgroundColor: "blueviolet" }]}>
            <Icon name="film-outline" size={25} color="#fff" />
          </View>
          <View style={styles.infoFooter}>
            <Text style={styles.footerText}>Sobre</Text>
            <Text style={styles.mediaName}>
              {coment.media_name.length > 18
                ? `${coment.media_name.substring(0, 17)}...`
                : coment.media_name}
            </Text>
          </View>
        </View>
        <View style={styles.infoComent}>
          <View style={styles.amountLikes}>
            <Icon name="heart" size={20} color="red" />
            <Text style={styles.amountText}>{amountLikes}</Text>
          </View>
        </View>
      </View>

      <View style={styles.linksComentContainer}>
        <TouchableOpacity
          onPress={async () => await handleLike()}
          style={styles.likeButton}
        >
          <Icon
            name={liked ? "heart" : "heart-outline"}
            size={30}
            style={liked ? { animation: "heart 0.5s" } : {}}
            color={liked ? "red" : "#fff"}
          />
        </TouchableOpacity>
        {user.id !== coment.user_id && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("User", { user: coment.user_user })
            }
          >
            <Icon name="person-outline" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailedAvaliation", {
              id: coment.avaliation_id,
            })
          }
        >
          <ImageBackground
            source={require("../../assets/DarkGradient07.png")} // Adicione a imagem conforme necessário
            style={styles.iconBackground}
          >
            <Icon name="document-text-outline" size={30} color="#fff" />
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coment: {
    width: "90%",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 10,
    position: "relative",
  },
  headerComent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  infoUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userUser: {
    fontSize: 14,
    color: "gray",
  },
  infoPost: {
    alignItems: "flex-end",
  },
  postDate: {
    backgroundColor: "blueviolet",
    color: "#fff",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
  },
  contentComent: {
    fontSize: 14,
    marginVertical: 10,
  },
  footerComent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  infoMedia: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorComent: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  infoFooter: {
    marginLeft: 10,
  },
  footerText: {
    fontSize: 14,
    color: "gray",
  },
  mediaName: {
    fontSize: 12,
    color: "#fafafa",
  },
  amountLikes: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#fafafa",
  },
  linksComentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 5,
    display: "none",
  },
  likeButton: {
    marginBottom: 10,
  },
  iconBackground: {
    padding: 10,
    borderRadius: 50,
  },
});

export default Coment;
