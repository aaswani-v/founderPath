import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Spacing, FontSize, FontWeight, BorderRadius, useThemeColors } from '../../theme';
import { useAuthStore } from '../../store';

export const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colors = useThemeColors();
  const { user, updateProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(user?.photoUri);

  const initial = (displayName || user?.email || 'U')[0].toUpperCase();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert('Name required', 'Please enter a display name.');
      return;
    }
    updateProfile(displayName.trim(), photoUri);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[s.title, { color: colors.textPrimary }]}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={[s.saveBtn, { backgroundColor: colors.accent }]}>
            <Text style={s.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <TouchableOpacity onPress={pickImage} style={s.avatarSection} activeOpacity={0.8}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={[s.avatar, { borderColor: colors.accent }]} />
          ) : (
            <View style={[s.avatar, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
              <Text style={s.avatarText}>{initial}</Text>
            </View>
          )}
          <View style={[s.cameraOverlay, { backgroundColor: colors.surfaceDark }]}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </View>
          <Text style={[s.changePhotoText, { color: colors.accent }]}>Change Photo</Text>
        </TouchableOpacity>

        {/* Form */}
        <View style={[s.section, { backgroundColor: colors.surface }]}>
          <View style={[s.fieldRow, { borderBottomColor: colors.divider }]}>
            <Text style={[s.fieldLabel, { color: colors.textMuted }]}>Name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={[s.fieldInput, { color: colors.textPrimary }]}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={s.fieldRow}>
            <Text style={[s.fieldLabel, { color: colors.textMuted }]}>Email</Text>
            <Text style={[s.fieldValue, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
          </View>
        </View>

        {/* Hint */}
        <Text style={[s.hint, { color: colors.textMuted }]}>
          Tap the avatar above to upload a profile photo from your gallery.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  saveBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  saveBtnText: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.bold },

  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  avatarText: { fontSize: 40, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  cameraOverlay: { position: 'absolute', top: 70, right: '35%', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  changePhotoText: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold, marginTop: Spacing.sm },

  section: { borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.lg },
  fieldRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1 },
  fieldLabel: { width: 60, fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },
  fieldInput: { flex: 1, fontSize: FontSize.md, paddingVertical: 0 },
  fieldValue: { flex: 1, fontSize: FontSize.md },
  hint: { fontSize: FontSize.xs, textAlign: 'center', lineHeight: 18 },
});
