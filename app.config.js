// Expo app config with Google Maps API key from .env
// A Expo CLI carrega variáveis do .env em process.env para este arquivo

/** @type {import('@expo/config').ExpoConfig} */
module.exports = () => {
  const GOOGLE_MAPS_API_KEY = process.env.Google_Maps_API || process.env.GOOGLE_MAPS_API || process.env.GOOGLE_MAPS_KEY;

  return {
    expo: {
      name: "Bookly",
      slug: "Bookly",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "bookly",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        // Necessário para Google Maps nativo no iOS
        config: GOOGLE_MAPS_API_KEY
          ? { googleMapsApiKey: GOOGLE_MAPS_API_KEY }
          : undefined,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        // Necessário para Google Maps nativo no Android
        config: GOOGLE_MAPS_API_KEY
          ? { googleMaps: { apiKey: GOOGLE_MAPS_API_KEY } }
          : undefined,
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff",
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        GOOGLE_MAPS_API_KEY,
        eas: {
          projectId: "local",
        },
      },
    },
  };
};
