// Pantalla inicial de Fase 1 que muestra el estado de conectividad con backend.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_BASE_URL } from '../config/env';
import { fetchHealthCheck } from '../services/api/healthApi';
import { HealthCheckResponse } from '../types/health';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

export const HomeScreen = () => {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [healthResponse, setHealthResponse] = useState<HealthCheckResponse | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHealth = useCallback(async () => {
    setLoadState('loading');
    setErrorMessage(null);

    try {
      const response = await fetchHealthCheck();
      setHealthResponse(response);
      setLoadState('success');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible conectar con el backend.';
      setErrorMessage(message);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>SmartPantry - Fase 1</Text>
        <Text style={styles.subtitle}>
          Pantalla base preparada para consumir el backend NestJS.
        </Text>
        <Text style={styles.backendUrl}>Backend: {API_BASE_URL}</Text>

        {loadState === 'loading' && (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.statusText}>Verificando /api/v1/health...</Text>
          </View>
        )}

        {loadState === 'success' && healthResponse && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health Check</Text>
            <Text style={styles.cardText}>
              API status: {healthResponse.data.status}
            </Text>
            <Text style={styles.cardText}>
              SQLite status: {healthResponse.data.database}
            </Text>
            <Text style={styles.cardMeta}>
              Timestamp: {healthResponse.meta.timestamp}
            </Text>
          </View>
        )}

        {loadState === 'error' && (
          <View style={styles.cardError}>
            <Text style={styles.cardTitle}>No conectado</Text>
            <Text style={styles.cardText}>{errorMessage}</Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={() => void loadHealth()}>
          <Text style={styles.buttonText}>Reintentar health check</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#374151',
  },
  backendUrl: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardError: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardText: {
    fontSize: 14,
    color: '#1F2937',
  },
  cardMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
