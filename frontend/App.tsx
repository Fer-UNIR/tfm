import { StatusBar } from 'expo-status-bar';
import { InventoryScreen } from './src/screens/InventoryScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <InventoryScreen />
    </>
  );
}
