import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

import { Context } from "../../context";

import AvaliationSVG from "../../assets/avaliation";

const Avaliation = ({ avaliation }) => {
  const { user } = useContext(Context);

  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState([]);

  const [amountLikes, setAmountLikes] = useState(0);
  const [amountComents, setAmountComents] = useState(0);

  const [viewButtons, setViewButtons] = useState(false);

  const navigation = useNavigation();

  const getData = async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];
    const existentMyLike = likes.find(
      (l) => l.avaliation_id === avaliation.id && user.id === l.user_id
    );

    setAmountLikes(
      likes.filter((like) => like.avaliation_id === avaliation.id).length
    );

    const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];
    setAmountComents(
      comments.filter((comment) => comment.avaliation_id === avaliation.id)
        .length
    );

    if (existentMyLike) {
      setLiked(true);
      setLike(existentMyLike);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLike = async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("likes")) || [];

    if (liked) {
      const index = likes.findIndex(
        (l) => l.avaliation_id === avaliation.id && user.id === l.user_id
      );
      likes.splice(index, 1);
      await AsyncStorage.setItem("likes", JSON.stringify(likes));
      setLiked(false);
      setAmountLikes(amountLikes - 1);
    } else {
      const newLike = { user_id: user.id, avaliation_id: avaliation.id };
      await AsyncStorage.setItem("likes", JSON.stringify([...likes, newLike]));
      setLiked(true);
      setAmountLikes(amountLikes + 1);
    }

    setViewButtons(false);
  };

  return (
    <TouchableOpacity
      style={styles.avaliation}
      onPress={() => setViewButtons(!viewButtons)}
    >
      <View style={styles.headerAvaliation}>
        <View style={styles.infoUser}>
          <AvaliationSVG />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{avaliation.user_name}</Text>
            <Text style={styles.userUser}>@{avaliation.user_user}</Text>
          </View>
        </View>
        <View style={styles.infoPost}>
          <Text style={styles.postDate}>{avaliation.created_at}</Text>
        </View>
      </View>

      <View style={styles.contentAvaliation}>
        <Text style={styles.textContent}>{avaliation.content}</Text>
      </View>

      <View style={styles.footerAvaliation}>
        <View style={styles.infoMedia}>
          <View style={styles.filmIcon}>
            <Ionicons name="film" size={30} color="white" />
          </View>
          <View style={styles.infoFooter}>
            <Text style={styles.footerTitle}>Sobre</Text>
            <Text style={styles.footerText}>
              {avaliation.media_name.length > 18
                ? `${avaliation.media_name.substring(0, 20)}...`
                : avaliation.media_name}
            </Text>
          </View>
        </View>

        <View style={styles.infoAvaliation}>
          <View style={styles.amountComents}>
            <Ionicons name="chatbubble" size={20} color="white" />
            <Text style={styles.amountComentsText}>{amountComents}</Text>
          </View>
          <View style={styles.amountLikes}>
            <Ionicons name="heart" size={20} color="white" />
            <Text style={styles.amountLikesText}>{amountLikes}</Text>
          </View>
        </View>
      </View>
      {viewButtons && (
        <View style={styles.linksAvaliationContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={30}
              color={liked ? "red" : "white"}
            />
          </TouchableOpacity>
          {user.user !== avaliation.user_user && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setViewButtons(false);
                navigation.navigate("Profile", { user: avaliation.user_user });
              }}
            >
              <Ionicons name="person-outline" size={30} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setViewButtons(false);
              navigation.navigate("DetailedAvaliation", { id: avaliation.id });
            }}
          >
            <Ionicons name="add-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avaliation: {
    height: "auto",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.205)",
    borderRadius: 5,
    marginBottom: 5,
    position: "relative",
    padding: 10,
  },
  headerAvaliation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  infoUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fafafa",
  },
  userUser: {
    fontSize: 14,
    color: "#fafafa",
  },
  infoPost: {
    backgroundColor: "blueviolet",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  postDate: {
    color: "white",
    fontSize: 12,
  },
  contentAvaliation: {
    fontSize: 16,
    marginVertical: 10,
  },
  textContent: {
    color: "#fafafa",
  },
  filmIcon: {
    padding: 5,
    backgroundColor: "blueviolet",
    borderRadius: 5,
  },
  footerAvaliation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  infoMedia: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoFooter: {
    marginLeft: 10,
  },
  footerTitle: {
    fontWeight: "bold",
    color: "#fafafa",
  },
  footerText: {
    color: "#fafafa",
  },
  infoAvaliation: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountComents: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "blueviolet",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    gap: 5,
  },
  amountComentsText: {
    color: "#fafafa",
  },
  amountLikesText: {
    color: "#fafafa",
  },
  amountLikes: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "blueviolet",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    gap: 5,
  },
  linksAvaliationContainer: {
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

export default Avaliation;
