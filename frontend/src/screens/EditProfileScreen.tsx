import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "../styles/stylesProfile";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { useUserProfile } from "../context/UserProfileContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  
  const {
    profile,
    updateProfileImage,
    updateCoverImage,
    removeProfileImage,
    toggleShowFavorites,
    toggleShowStats,
    reloadProfile,  
  } = useUserProfile();
  
  const { currentUser } = useAuth();

  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [favoritesBrand, setFavoritesBrand] = useState(profile?.favoritesBrand || '');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setFavoritesBrand(profile.favoritesBrand || '');
    }
  }, [profile]);

  const handleSave = async () => {
    console.log('Salvando perfil...');
    console.log('Bio:', bio);
    console.log('Location:', location);
    console.log('FavoritesBrand:', favoritesBrand);
    
    HapticFeedback.success();
    
    try {
      if (!profile) {
        console.error('Profile não existe');
        return;
      }

      const updatedProfile = {
        ...profile,                    
        bio: bio.trim(),               
        location: location.trim(),     
        favoritesBrand: favoritesBrand.trim(), 
        updatedAt: new Date().toISOString(),
      };

      console.log('Salvando perfil completo:', updatedProfile);

      const STORAGE_KEY = `@CarShowroom:userProfile:${currentUser?.email}`;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      
      console.log('Perfil salvo com sucesso!');
      
      await reloadProfile();
      console.log('Context recarregado!');
      
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  const handleUpdateProfileImage = async () => {
    HapticFeedback.medium();
    await updateProfileImage();
  };

  const handleUpdateCoverImage = async () => {
    HapticFeedback.medium();
    await updateCoverImage();
  };

  const handleRemoveProfileImage = () => {
    HapticFeedback.warning();
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover sua foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            HapticFeedback.delete();
            await removeProfileImage();
          },
        },
      ]
    );
  };

  if (!profile || !currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textPrimary }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.accent} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.light();
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.backButton}
        >
          <Ionicons name="checkmark" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity
              onPress={handleUpdateCoverImage}
              activeOpacity={0.8}
              style={{ height: 200, backgroundColor: colors.accent, position: 'relative' }}
            >
              {profile.coverImage ? (
                <Image
                  source={{ uri: profile.coverImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="image-outline" size={60} color="rgba(255,255,255,0.3)" />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                    Adicionar Capa
                  </Text>
                </View>
              )}
              
              <View style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                backgroundColor: 'rgba(0,0,0,0.7)',
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: -60, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={handleUpdateProfileImage}
                activeOpacity={0.8}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 4,
                  borderColor: colors.background,
                }}
              >
                {profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    style={{ width: 112, height: 112, borderRadius: 56 }}
                  />
                ) : (
                  <Text style={{ fontSize: 48, fontWeight: '700', color: '#fff' }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
                  </Text>
                )}
                
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: colors.accent,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.background,
                }}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>

              {profile.profileImage && (
                <TouchableOpacity
                  onPress={handleRemoveProfileImage}
                  style={{
                    marginTop: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.accent }}>
                    Remover foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: 8,
                }}>
                  Bio
                </Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Conte um pouco sobre você e sua paixão por carros..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    color: colors.textPrimary,
                    fontSize: 14,
                    minHeight: 100,
                    textAlignVertical: 'top',
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                />
                <Text style={{
                  fontSize: 11,
                  color: colors.textTertiary,
                  marginTop: 4,
                  textAlign: 'right',
                }}>
                  {bio.length}/200
                </Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: 8,
                }}>
                  Localização
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}>
                  <Ionicons name="location" size={20} color={colors.textSecondary} />
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Cidade, Estado"
                    placeholderTextColor={colors.textTertiary}
                    style={{
                      flex: 1,
                      color: colors.textPrimary,
                      fontSize: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                    }}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: 8,
                }}>
                  Marca Favorita
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}>
                  <Ionicons name="star" size={20} color={colors.accent} />
                  <TextInput
                    value={favoritesBrand}
                    onChangeText={setFavoritesBrand}
                    placeholder="Ferrari, Porsche, Lamborghini..."
                    placeholderTextColor={colors.textTertiary}
                    style={{
                      flex: 1,
                      color: colors.textPrimary,
                      fontSize: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                    }}
                  />
                </View>
              </View>

              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: colors.textPrimary,
                    marginLeft: 8,
                  }}>
                    Privacidade
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    HapticFeedback.toggle();
                    toggleShowFavorites();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.glassBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons
                      name={profile.showFavorites ? "heart" : "heart-outline"}
                      size={20}
                      color={colors.textSecondary}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.textPrimary,
                      }}>
                        Mostrar Favoritos
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                      }}>
                        {profile.showFavorites ? 'Público' : 'Privado'}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    width: 50,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: profile.showFavorites ? colors.accent : colors.inputBackground,
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}>
                    <View style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: '#fff',
                      alignSelf: profile.showFavorites ? 'flex-end' : 'flex-start',
                    }} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    HapticFeedback.toggle();
                    toggleShowStats();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons
                      name={profile.showStats ? "stats-chart" : "stats-chart-outline"}
                      size={20}
                      color={colors.textSecondary}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.textPrimary,
                      }}>
                        Mostrar Estatísticas
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                      }}>
                        {profile.showStats ? 'Público' : 'Privado'}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    width: 50,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: profile.showStats ? colors.accent : colors.inputBackground,
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}>
                    <View style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: '#fff',
                      alignSelf: profile.showStats ? 'flex-end' : 'flex-start',
                    }} />
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: colors.accent,
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#fff',
                }}>
                  Salvar Alterações
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}