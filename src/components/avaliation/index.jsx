import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

import AvaliationSVG from "../../assets/avaliation";

import { Context } from "../../context";

const Avaliation = ({ avaliation }) => {
  const { user } = useContext(Context);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState([]);
  const [amountLikes, setAmountLikes] = useState(0);
  const [amountComents, setAmountComents] = useState(0);
  const [scale] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const getData = async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("mylikes")) || [];
    const existentLike = likes.find((l) => l.avaliation_id === avaliation.id);
    setAmountLikes(
      likes.filter((like) => like.avaliation_id === avaliation.id).length
    );

    const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];
    setAmountComents(
      comments.filter((comment) => comment.avaliation_id === avaliation.id)
        .length
    );

    if (existentLike) {
      setLiked(true);
      setLike(existentLike);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLike = async () => {
    const likes = JSON.parse(await AsyncStorage.getItem("mylikes")) || [];
    if (liked) {
      const newLikes = likes.filter((l) => l.avaliation_id !== avaliation.id);
      await AsyncStorage.setItem("mylikes", JSON.stringify(newLikes));
      setLiked(false);
    } else {
      const newLike = { user_id: user.id, avaliation_id: avaliation.id };
      await AsyncStorage.setItem(
        "mylikes",
        JSON.stringify([...likes, newLike])
      );
      setLiked(true);
    }
  };

  const handleHover = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.avaliation, { transform: [{ scale }] }]}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
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

      {/*    <View style={styles.linksAvaliationContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={30}
            color={liked ? "red" : "white"}
          />
        </TouchableOpacity>
        {user.id !== avaliation.user_id && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("User", { username: avaliation.user_user })
            }
          >
            <Ionicons name="person-outline" size={30} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AvaliationDetails", { id: avaliation.id })
          }
        >
          <Ionicons name="add-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>*/}
    </Animated.View>
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
    marginLeft: 10,
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
    paddingVertical: 10,
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
  },
});

export default Avaliation;
