import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Media = ({ media, redirect }) => {
  const navigation = useNavigation();

  const handlePress = (e) => {
    if (redirect) {
      navigation.navigate("DetailedMedia", { id: media.id });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.media}>
      <View style={styles.mediaImageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${media.poster_path}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.mediaInfoContainer}>
        <Text style={styles.title}>{media.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  media: {
    width: 300,
    height: 500,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "column",
    backgroundColor: "#000",
    marginVertical: 10,
    transform: [{ scale: 1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  mediaImageContainer: {
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 3,
  },
  mediaInfoContainer: {
    height: 100,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    padding: 15,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Media;
