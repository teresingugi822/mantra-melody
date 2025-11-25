import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/auth';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { data: songs, isLoading } = useQuery({
    queryKey: ['/api/songs'],
    queryFn: () => api.getSongs(),
  });

  const readySongs = songs?.data?.filter((s: any) => s.status === 'completed') || [];
  const generatingSongs = songs?.data?.filter((s: any) => s.status === 'generating') || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, {user?.email}</Text>
          <Text style={styles.subtitle}>Continue your musical journey</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#a855f7" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="musical-notes"
          label="Total Songs"
          value={songs?.data?.length || 0}
        />
        <StatCard
          icon="checkmark-circle"
          label="Ready"
          value={readySongs.length}
        />
        <StatCard
          icon="hourglass"
          label="Generating"
          value={generatingSongs.length}
        />
      </View>

      {/* Recent Songs */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#a855f7" style={styles.loader} />
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Songs</Text>
          {readySongs.length > 0 ? (
            readySongs.slice(0, 5).map((song: any) => (
              <View key={song.id} style={styles.songCard}>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songGenre}>{song.genre}</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play-circle" size={32} color="#a855f7" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No songs yet. Create your first one!</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="#a855f7" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a855f7',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  songInfo: {
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
  playButton: {
    marginLeft: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  loader: {
    marginVertical: 40,
  },
});
