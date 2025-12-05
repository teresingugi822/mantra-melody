import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

const GENRES = ['soul', 'blues', 'hip-hop', 'reggae', 'pop', 'acoustic'];
const RHYTHMS = ['slow', 'moderate', 'fast'];

export default function CreateScreen() {
  const [mantra, setMantra] = useState('');
  const [genre, setGenre] = useState('soul');
  const [rhythm, setRhythm] = useState('moderate');
  const queryClient = useQueryClient();

  const { mutate: generateSong, isPending } = useMutation({
    mutationFn: () => {
      // First create mantra, then generate song
      return api.createMantra(mantra).then((res) =>
        api.generateSong(res.data.id, genre, rhythm)
      );
    },
    onSuccess: () => {
      Alert.alert('Success', 'Song generation started! Check your library for updates.');
      setMantra('');
      setGenre('soul');
      setRhythm('moderate');
      queryClient.invalidateQueries({ queryKey: ['/api/songs'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to generate song');
    },
  });

  const handleGenerate = () => {
    if (!mantra.trim()) {
      Alert.alert('Error', 'Please enter a mantra');
      return;
    }
    generateSong();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Song</Text>
        <Text style={styles.subtitle}>
          Transform your mantra into a beautiful song
        </Text>

        {/* Mantra Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Mantra</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your mantra, affirmation, or goal..."
            placeholderTextColor="#9ca3af"
            value={mantra}
            onChangeText={setMantra}
            multiline
            numberOfLines={4}
            editable={!isPending}
          />
          <Text style={styles.characterCount}>
            {mantra.length} / 500 characters
          </Text>
        </View>

        {/* Genre Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Genre</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genre}
              onValueChange={setGenre}
              enabled={!isPending}
              style={styles.picker}
            >
              {GENRES.map((g) => (
                <Picker.Item
                  key={g}
                  label={g.charAt(0).toUpperCase() + g.slice(1)}
                  value={g}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Rhythm Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Tempo</Text>
          <View style={styles.rhythmOptions}>
            {RHYTHMS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.rhythmButton,
                  rhythm === r && styles.rhythmButtonActive,
                ]}
                onPress={() => setRhythm(r)}
                disabled={isPending}
              >
                <Text
                  style={[
                    styles.rhythmButtonText,
                    rhythm === r && styles.rhythmButtonTextActive,
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Genre Description */}
        <View style={[styles.section, styles.genreInfo]}>
          <Ionicons
            name="information-circle"
            size={20}
            color="#a855f7"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.genreInfoText}>
            Each genre has its own unique sound and vibe. Choose what resonates
            with your mantra!
          </Text>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, isPending && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Song</Text>
            </>
          )}
        </TouchableOpacity>

        {isPending && (
          <Text style={styles.generatingText}>
            ✨ Generating your unique song with AI-powered lyrics and music...
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  rhythmOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rhythmButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  rhythmButtonActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  rhythmButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  rhythmButtonTextActive: {
    color: '#fff',
  },
  genreInfo: {
    flexDirection: 'row',
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 12,
  },
  genreInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#6b21a8',
  },
  generateButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  generatingText: {
    textAlign: 'center',
    color: '#a855f7',
    marginTop: 16,
    fontSize: 14,
  },
});
