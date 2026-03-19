import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { StatsProvider } from "./src/context/StatsContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { RootStackParamList } from "./src/navigation/types";
import { SplashScreen } from "./src/components/SplashScreen";
import { FavoritesProvider } from "./src/components/Favorites";
import { RatingsProvider } from "./src/context/RatingsContext";
import { NavigationContainer } from "@react-navigation/native";
import { UnsplashProvider } from "./src/context/UnsplashContext";
import { UserProfileProvider } from "./src/context/UserProfileContext";
import { ViewHistoryProvider } from "./src/context/ViewHistoryContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import StatsScreen from "./src/screens/StatsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CompareScreen from "./src/screens/CompareScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ChatbotScreen from "./src/screens/ChatbotScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import AdminPanelScreen from "./src/screens/AdminPanelScreen";
import CarDetailsScreen from "./src/screens/CarDetailsScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import AdminCarFormScreen from "./src/screens/AdminCarFormScree";
import PublicProfileScreen from "./src/screens/PublicProfileScreen";
import DeveloperSettingsScreen from "./src/screens/DeveloperSettingsScreen";
import NotificationSettingsScreen from "./src/screens/NotificationSettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const __DEV__ = process.env.NODE_ENV === "development";

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return (
      <ThemeProvider>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <RatingsProvider>
            <UnsplashProvider>
              <ViewHistoryProvider>
                <NotificationProvider>
                  <StatsProvider>
                    <UserProfileProvider>
                      <NavigationContainer>
                        <Stack.Navigator
                          initialRouteName="Login"
                          screenOptions={{ animation: "fade" }}
                          id={undefined}
                        >
                          <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="CarDetails"
                            component={CarDetailsScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Favorites"
                            component={FavoritesScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Compare"
                            component={CompareScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="History"
                            component={HistoryScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="NotificationSettings"
                            component={NotificationSettingsScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Stats"
                            component={StatsScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="PublicProfile"
                            component={PublicProfileScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="EditProfile"
                            component={EditProfileScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="Chatbot"
                            component={ChatbotScreen}
                            options={{ headerShown: false }}
                          />
                          {__DEV__ && (
                            <Stack.Screen
                              name="DeveloperSettings"
                              component={DeveloperSettingsScreen}
                              options={{ headerShown: false }}
                            />
                          )}
                          <Stack.Screen
                            name="AdminPanel"
                            component={AdminPanelScreen}
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="AdminCarForm"
                            component={AdminCarFormScreen}
                            options={{ headerShown: false }}
                          />
                        </Stack.Navigator>
                      </NavigationContainer>
                    </UserProfileProvider>
                  </StatsProvider>
                </NotificationProvider>
              </ViewHistoryProvider>
            </UnsplashProvider>
          </RatingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
