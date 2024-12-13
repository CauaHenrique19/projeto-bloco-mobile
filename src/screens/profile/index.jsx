import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import Loading from "../../components/loading";
import Avaliation from "../../components/avaliation";
import Coment from "../../components/coment";

import { Context } from "../../context";
import { toBase64 } from "../../utils";
import DefaultUserImage from "../../assets/user-image.png";

const Profile = ({ navigation }) => {
  const route = useRoute();
  const { user: userParam } = route.params;
  const { user: userContext } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [onEdit, setOnEdit] = useState(false);

  const [user, setUser] = useState();
  const [userNotExists, setUserNotExists] = useState();
  const [data, setData] = useState([]);

  const [following, setFollowing] = useState(false);

  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");

  const [amountFollowers, setAmountFollowers] = useState(0);
  const [amountFollowing, setAmountFollowing] = useState(0);

  async function loadData() {
    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const findedUser = users.find((u) => u.user === userParam);

    if (findedUser) {
      setUser(findedUser);
      setUserNotExists(false);
      setName(findedUser.name);
      setBiography(findedUser.biography);

      setImage(findedUser.image);
      setLoading(false);

      const tempAvaliations = findedUser.avaliations.map((avaliation) => ({
        ...avaliation,
        type: "avaliation",
      }));

      const comments = JSON.parse(await AsyncStorage.getItem("comments")) || [];
      const commentsUser = comments.filter((c) => c.user_id === findedUser.id);
      const tempComments = commentsUser.map((comment) => ({
        ...comment,
        type: "coment",
      }));

      setData([...tempAvaliations, ...tempComments]);

      const follows = JSON.parse(await AsyncStorage.getItem("follows")) || [];
      const follow = follows.find(
        (f) =>
          f.following_user_id === findedUser.id && f.user_id === userContext.id
      );

      setAmountFollowers(
        follows.filter((follow) => follow.following_user_id === findedUser.id)
          .length
      );
      setAmountFollowing(
        follows.filter((follow) => follow.user_id === findedUser.id).length
      );

      if (follow) {
        setFollowing(true);
      }
    } else {
      setUserNotExists(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener("focus", async () => {
      await loadData();
    });

    navigation.addListener("blur", () => {
      setData([]);
    });
  }, [userParam]);

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  async function handleFollow() {
    const follow = { user_id: userContext.id, following_user_id: user.id };
    const follows = JSON.parse(await AsyncStorage.getItem("follows")) || [];

    if (following) {
      const followsFiltered = follows.filter(
        (follow) => follow.following_user_id !== user.id
      );
      await AsyncStorage.setItem("follows", JSON.stringify(followsFiltered));
      setAmountFollowers(amountFollowers - 1);
      setFollowing(false);
    } else {
      const newFollows = [...follows, follow];
      await AsyncStorage.setItem("follows", JSON.stringify(newFollows));
      setAmountFollowers(amountFollowers + 1);
      setFollowing(true);
    }
  }

  async function handleEdit() {
    const helpUser = { ...user };
    const newUser = Object.assign(helpUser, {
      name,
      biography,
      image,
    });

    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);

    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const newUsers = users.filter((u) => u.user !== user.user);
    await AsyncStorage.setItem("users", JSON.stringify([newUser, ...newUsers]));
    setOnEdit(false);
  }

  function getImage() {
    if (image?.startsWith("file://") || image?.startsWith("content://")) {
      return { uri: image };
    } else if (image) {
      return image;
    } else {
      return DefaultUserImage;
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (userNotExists) {
    return (
      <View style={styles.containerUserNotExists}>
        <Text style={styles.userNotExistsText}>Este usuário não existe!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.profileContainer}>
      <View>
        <View style={styles.imageUserContainer}>
          <Image source={getImage()} style={styles.userImage} />
          {onEdit && (
            <View style={styles.editImageButtonContainer}>
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={async () => await pickImageFromCamera()}
              >
                <Ionicons name="camera" color="#fafafa" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={async () => await pickImageFromGallery()}
              >
                <Ionicons name="images" color="#fafafa" size={20} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          {onEdit ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.editInput}
              placeholder="Seu nome"
            />
          ) : (
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.user}</Text>
            </View>
          )}

          <View style={styles.followContainer}>
            <Text style={styles.followText}>{amountFollowing} Seguindo</Text>
            <Text style={styles.followText}>{amountFollowers} Seguidores</Text>

            {userContext && userContext.user === user.user ? (
              <TouchableOpacity
                onPress={() => setOnEdit(!onEdit)}
                style={styles.editProfileButton}
              >
                <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFollow}
                style={[
                  styles.followButton,
                  following ? styles.followingButton : null,
                ]}
              >
                <Text style={styles.followButtonText}>
                  {following ? "Deixar de seguir" : "Seguir"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {!onEdit ? (
            <Text style={styles.biography}>{biography || "Sem Biografia"}</Text>
          ) : (
            <TextInput
              value={biography}
              onChangeText={setBiography}
              style={styles.biographyInput}
              multiline
              placeholder="Sua biografia"
              placeholderTextColor="#fafafa"
            />
          )}

          {onEdit && (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                style={styles.saveEditButton}
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={() => {
                  setOnEdit(false);
                  setImage(user.image);
                }}
              >
                <Text style={styles.editButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.profileInteractionsContainer}>
        <View style={styles.avaliationsColumn}>
          {data?.length > 0 ? (
            data.map((item) =>
              item.type === "avaliation" ? (
                <Avaliation key={item.id} avaliation={item} />
              ) : (
                <Coment key={item.id} coment={item} showRedirectToAvaliation />
              )
            )
          ) : (
            <View style={styles.nothingContainer}>
              <Text style={styles.nothingText}>
                Esse usuário não realizou avaliações
              </Text>
            </View>
          )}
        </View>

        {/*
            <View style={styles.comentColumn}>
            {coments?.length > 0 ? (
                coments.map((coment) => <Coment key={coment.id} coment={coment} />)
            ) : (
                <View style={styles.nothingContainer}>
                <Text style={styles.nothingText}>
                    Esse usuário não realizou comentários
                </Text>
                </View>
            )}
            </View>
            */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  containerUserNotExists: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  userNotExistsText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  imageUserContainer: {
    width: 230,
    height: 230,
    alignSelf: "center",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: 230,
    height: 230,
    borderRadius: 115,
  },
  editImageButtonContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 5,
  },
  editImageButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 25,
  },
  editImageButtonText: {
    color: "white",
  },
  userInfo: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  name: {
    color: "white",
    fontSize: 18,
  },
  username: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  followContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  followText: {
    color: "white",
    marginRight: 10,
  },
  editProfileButton: {
    marginLeft: "auto",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "blueviolet",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: "blueviolet",
  },
  followButton: {
    marginLeft: "auto",
    backgroundColor: "blueviolet",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "rgba(138, 43, 226, 0.5)",
  },
  followButtonText: {
    color: "white",
  },
  biography: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  editInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    borderColor: "rgba(128, 128, 128, 0.205)",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#333",
    color: "#fafafa",
    marginBottom: 10,
  },
  biographyInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    borderColor: "rgba(128, 128, 128, 0.205)",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#333",
    color: "#fafafa",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveEditButton: {
    backgroundColor: "blueviolet",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelEditButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
  },
  profileInteractionsContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  avaliationsColumn: {
    flex: 1,
    marginRight: 5,
  },
  comentColumn: {
    flex: 1,
    marginLeft: 5,
  },
  nothingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  nothingText: {
    color: "white",
    textAlign: "center",
  },
});

export default Profile;
