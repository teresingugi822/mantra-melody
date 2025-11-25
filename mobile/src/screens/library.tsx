import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen() {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: songs, isLoading } = useQuery({
    queryKey: ['/api/songs'],
    queryFn: () => api.getSongs(),
    refetchInterval: 2000,
  });

  const { mutate: deleteSong } = useMutation({
    mutationFn: (id: string) => api.deleteSong(id),
    onSuccess: () => {
      Alert.alert('Success', 'Song deleted');
      queryClient.invalidateQueries({ queryKey: ['/api/songs'] });
      setShowModal(false);
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert('Delete Song', 'Are you sure you want to delete this song?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Delete', onPress: () => deleteSong(id), style: 'destructive' },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  const readySongs = songs?.data?.filter((s: any) => s.status === 'completed') || [];
  const generatingSongs = songs?.data?.filter(
    (s: any) => s.status === 'generating'
  ) || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Ready Songs */}
        {readySongs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Ready to Play</Text>
            {readySongs.map((song: any) => (
              <TouchableOpacity
                key={song.id}
                style={styles.songCard}
                onPress={() => {
                  setSelectedSong(song);
                  setShowModal(true);
                }}
              >
                <View style={styles.songCardContent}>
                  <Ionicons name="musical-note" size={32} color="#a855f7" />
                  <View style={styles.songCardText}>
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <Text style={styles.songGenre}>{song.genre}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#a855f7" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Generating Songs */}
        {generatingSongs.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Generating</Text>
            {generatingSongs.map((song: any) => (
              <View key={song.id} style={[styles.songCard, styles.generatingCard]}>
                <View style={styles.songCardContent}>
                  <ActivityIndicator color="#a855f7" />
                  <View style={styles.songCardText}>
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <Text style={styles.songGenre}>{song.genre}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {readySongs.length === 0 && generatingSongs.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No songs yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first mantra to get started!
            </Text>
          </View>
        )}
      </View>

      {/* Song Detail Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSong && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{selectedSong.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(selectedSong.id)}
                  >
                    <Ionicons name="trash" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Genre</Text>
                    <Text style={styles.detailValue}>{selectedSong.genre}</Text>
                  </View>

                  {selectedSong.lyrics && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Lyrics</Text>
                      <Text style={styles.lyricsText}>{selectedSong.lyrics}</Text>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.statusText}>Completed</Text>
                    </View>
                  </View>

                  {selectedSong.audioUrl && (
                    <TouchableOpacity style={styles.playButton}>
                      <Ionicons name="play" size={24} color="#fff" />
                      <Text style={styles.playButtonText}>Play Song</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  songCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  generatingCard: {
    opacity: 0.7,
  },
  songCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songCardText: {
    marginLeft: 12,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  songGenre: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  lyricsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  playButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a855f7',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
