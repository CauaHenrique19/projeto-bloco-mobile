import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    'language': 'pt-BR'
  },
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWM1MWE0OTNkY2Y5NzliOWVlNWNkNzlmMmExMmQ3YSIsIm5iZiI6MTcyNzQwMjE4NC4xOTc0NTUsInN1YiI6IjY0MTVlNTc2ZTljMGRjMDBhNDBiNWIxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M0EGrp8VhfKadEcbjhj5Uz5HMvCxK6ElP030coJGQaU",
  },
  validateStatus: () => true,
});

export default api;
