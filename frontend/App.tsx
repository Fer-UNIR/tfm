import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'inventory' | 'shopping'>('inventory');

  const title = useMemo(() => {
    return activeScreen === 'inventory' ? 'Inventario' : 'Lista de compras';
  }, [activeScreen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.navigationContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tab inventario"
          style={[
            styles.navigationButton,
            activeScreen === 'inventory' && styles.navigationButtonActive,
          ]}
          onPress={() => setActiveScreen('inventory')}
        >
          <Text
            style={[
              styles.navigationButtonText,
              activeScreen === 'inventory' && styles.navigationButtonTextActive,
            ]}
          >
            Inventario
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tab compras"
          style={[
            styles.navigationButton,
            activeScreen === 'shopping' && styles.navigationButtonActive,
          ]}
          onPress={() => setActiveScreen('shopping')}
        >
          <Text
            style={[
              styles.navigationButtonText,
              activeScreen === 'shopping' && styles.navigationButtonTextActive,
            ]}
          >
            Compras
          </Text>
        </Pressable>
      </View>

      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>{title}</Text>
      </View>

      <View style={styles.screenContainer}>
        {activeScreen === 'inventory' ? <InventoryScreen /> : <ShoppingListScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  navigationButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  navigationButtonActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  navigationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  navigationButtonTextActive: {
    color: '#FFFFFF',
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  screenContainer: {
    flex: 1,
  },
});
