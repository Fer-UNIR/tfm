import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from './App';

jest.mock('./src/screens/InventoryScreen', () => {
  const { Text } = require('react-native');
  return {
    InventoryScreen: () => <Text>Pantalla inventario mock</Text>,
  };
});

jest.mock('./src/screens/ShoppingListScreen', () => {
  const { Text } = require('react-native');
  return {
    ShoppingListScreen: () => <Text>Pantalla compras mock</Text>,
  };
});

describe('App navigation', () => {
  it('navega entre inventario y compras', async () => {
    const { getByText, getByLabelText, queryByText } = await render(<App />);

    expect(getByText('Pantalla inventario mock')).toBeTruthy();
    expect(queryByText('Pantalla compras mock')).toBeNull();

    fireEvent(getByLabelText('Tab compras'), 'onPress');

    await waitFor(() => {
      expect(getByText('Pantalla compras mock')).toBeTruthy();
      expect(queryByText('Pantalla inventario mock')).toBeNull();
    });

    fireEvent(getByLabelText('Tab inventario'), 'onPress');

    await waitFor(() => {
      expect(getByText('Pantalla inventario mock')).toBeTruthy();
    });
  });
});
