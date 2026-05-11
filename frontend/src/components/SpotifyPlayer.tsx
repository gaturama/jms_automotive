import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { configService } from "../service/config.service";
import { HapticFeedback } from "../utils/Haptics";

export const SpotifyPlayer: React.FC = () => {
  const { colors } = useTheme();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await configService.getConfig();
      setPlaylistUrl(config.spotifyPlaylistUrl);
      setPlaylistName(config.spotifyPlaylistName);
    } catch (error) {
      console.error("Erro ao carregar config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSpotify = async () => {
    if (!playlistUrl) return;
    HapticFeedback.medium();

    const spotifyAppUrl = playlistUrl.replace(
      "https://open.spotify.com/",
      "spotify://",
    );

    try {
      const canOpen = await Linking.canOpenURL(spotifyAppUrl);
      if (canOpen) {
        await Linking.openURL(spotifyAppUrl);
      } else {
        await Linking.openURL(playlistUrl);
      }
    } catch {
      await Linking.openURL(playlistUrl);
    }
  };

  if (isLoading) return null;
  if (!playlistUrl) return null;

  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#1DB954",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
      onPress={handleOpenSpotify}
      activeOpacity={0.85}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="musical-notes" size={26} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.8)",
            fontWeight: "600",
            marginBottom: 2,
          }}
        >
          OUÇA NO SPOTIFY
        </Text>
        <Text
          style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}
          numberOfLines={1}
        >
          {playlistName}
        </Text>
      </View>

      <Ionicons name="open-outline" size={20} color="#fff" />
    </TouchableOpacity>
  );
};
