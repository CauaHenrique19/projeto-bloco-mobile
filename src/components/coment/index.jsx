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
import ComentSVG from "../../assets/coment";

const Coment = ({ coment, showRedirectToAvaliation }) => {
  const { user } = useContext(Context);
  const navigation = useNavigation();

  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState([]);
  const [amountLikes, setAmountLikes] = useState(0);
  const [viewButtons, setViewButtons] = useState(false);

  async function loadData() {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];
    const existentMyLike = likes.find(
      (l) => l.coment_id === coment.id && user.id === l.user_id
    );
    setAmountLikes(likes.filter((like) => like.coment_id === coment.id).length);

    if (existentMyLike) {
      setLiked(true);
      setLike(existentMyLike);
    }
  }

  useEffect(() => {
    loadData();
  }, [coment]);

  async function handleLike() {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];

    if (liked) {
      const index = likes.findIndex(
        (l) => l.coment_id === coment.id && user.id === l.user_id
      );
      likes.splice(index, 1);
      await AsyncStorage.setItem("likes", JSON.stringify(likes));
      setLiked(false);
      setAmountLikes(amountLikes - 1);
    } else {
      const newLike = { user_id: user.id, coment_id: coment.id };
      await AsyncStorage.setItem("likes", JSON.stringify([...likes, newLike]));
      setLiked(true);
      setAmountLikes(amountLikes + 1);
    }

    setViewButtons(false);
  }

  return (
    <TouchableOpacity
      onPress={() => setViewButtons(!viewButtons)}
      key={coment.id}
      style={styles.coment}
    >
      <View style={styles.headerComent}>
        <View style={styles.infoUser}>
          <Icon name="chatbox" size={55} color="blueviolet" />
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
            <Icon name="film" size={30} color="white" />
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
            <Icon name="heart" size={20} color="white" />
            <Text style={styles.amountText}>{amountLikes}</Text>
          </View>
        </View>
      </View>
      {viewButtons && (
        <View style={styles.linksComentContainer}>
          <TouchableOpacity
            onPress={async () => await handleLike()}
            style={styles.button}
          >
            <Icon
              name={liked ? "heart" : "heart-outline"}
              size={30}
              style={liked ? { animation: "heart 0.5s" } : {}}
              color={liked ? "red" : "#fff"}
            />
          </TouchableOpacity>
          {user.user !== coment.user_user && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("User", { user: coment.user_user })
              }
            >
              <Icon name="person-outline" size={30} color="#fff" />
            </TouchableOpacity>
          )}
          {showRedirectToAvaliation && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("DetailedAvaliation", {
                  id: coment.avaliation_id,
                })
              }
            >
              <ComentSVG />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  coment: {
    height: "auto",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.205)",
    borderRadius: 5,
    marginBottom: 5,
    position: "relative",
    padding: 10,
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
    marginLeft: 5,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fafafa",
  },
  userUser: {
    fontSize: 14,
    color: "#fafafa",
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
    color: "#fafafa",
  },
  footerComent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoMedia: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorComent: {
    padding: 5,
    backgroundColor: "blueviolet",
    borderRadius: 5,
  },
  infoFooter: {
    marginLeft: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#fafafa",
  },
  mediaName: {
    fontSize: 12,
    color: "#fafafa",
  },
  amountLikes: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "blueviolet",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    gap: 5,
  },
  amountText: {
    fontSize: 14,
    color: "#fafafa",
  },
  linksComentContainer: {
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
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fafafa",
  },
});

export default Coment;
