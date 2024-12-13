import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import api from "../../services/api";

const DetailedMedia = () => {
  const route = useRoute();
  const { id } = route.params;
  const [media, setMedia] = useState(null);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    api
      .get(`/movie/${id}`, { params: { append_to_response: "credits" } })
      .then((res) => {
        setMedia(res.data);
        const actors = res.data.credits.cast.slice(0, 10);
        setActors(actors);
      })
      .catch((error) => console.error(error.message));
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {media && (
        <View>
          <Image
            style={styles.imageDetailedMedia}
            source={{
              uri: `https://image.tmdb.org/t/p/original/${media.backdrop_path}`,
            }}
          />
          <View style={styles.mediaDetailedContainer}>
            <Image
              style={styles.imagePosterMedia}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${media.poster_path}`,
              }}
            />
            <View style={styles.detailedMediaInfo}>
              <View>
                <Text style={styles.detailedMediaTitle}>{media.title}</Text>
                <Text style={styles.detailedMediaResume}>{media.tagline}</Text>
              </View>
              <View style={styles.detailedMediaOverview}>
                <View style={styles.infoContainer}>
                  <Ionicons name="alarm" size={20} color="#fafafa" />
                  <Text style={styles.runtime}>{media.runtime} min</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Ionicons name="star" size={20} color="yellow" />
                  <Text style={styles.average}>{media.vote_average}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.synopsisContainer}>
            <Text style={styles.detailedMediaSynopsis}>{media.overview}</Text>
          </View>
          <View style={styles.detailedMediaActors}>
            {actors.map((actor) => (
              <View key={actor.id} style={styles.actorContainer}>
                <Image
                  style={styles.actorImage}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original/${actor.profile_path}`,
                  }}
                />
                <Text style={styles.actorName}>{actor.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#0f0f0f",
  },
  imageDetailedMedia: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    marginBottom: 20,
  },
  mediaDetailedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePosterMedia: {
    width: 120,
    height: 180,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  detailedMediaInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  detailedMediaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fafafa",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
  },
  runtime: {
    color: "#fafafa",
  },
  average: {
    color: "#fafafa",
  },
  detailedMediaResume: {
    color: "grey",
    marginBottom: 10,
  },
  detailedMediaOverview: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
  },
  synopsisContainer: {
    marginBottom: 20,
  },
  detailedMediaSynopsis: {
    fontSize: 16,
    color: "#fafafa",
  },
  detailedMediaActors: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actorContainer: {
    alignItems: "center",
    marginBottom: 15,
    width: "30%",
  },
  actorImage: {
    width: 120,
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  actorName: {
    fontSize: 14,
    textAlign: "center",
    color: "#fafafa",
  },
});

export default DetailedMedia;
