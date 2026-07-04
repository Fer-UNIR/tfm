// Pantalla de inventario (Fase 3) conectada al CRUD de productos del backend.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ApiRequestError,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../services/api/productsApi';
import { Product } from '../types/product';

type LoadState = 'loading' | 'success' | 'error';

const formatApiError = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof ApiRequestError) {
    return `${error.message} (${error.code})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const InventoryScreen = () => {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Despensa');
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [unit, setUnit] = useState<string>('ud');
  const [minimumStockInput, setMinimumStockInput] = useState<string>('');

  const loadProducts = useCallback(async () => {
    setLoadState('loading');
    setLoadError(null);

    try {
      const inventory = await fetchProducts();
      setProducts(inventory);
      setLoadState('success');
    } catch (error) {
      setLoadError(
        formatApiError(error, 'No fue posible cargar el inventario de productos.'),
      );
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const canSubmitNewProduct = useMemo(() => {
    return !isCreating && name.trim().length > 0 && category.trim().length > 0 && unit.trim().length > 0;
  }, [category, isCreating, name, unit]);

  const resetProductForm = (): void => {
    setName('');
    setCategory('Despensa');
    setQuantityInput('1');
    setUnit('ud');
    setMinimumStockInput('');
  };

  const handleCreateProduct = async (): Promise<void> => {
    const quantity = Number(quantityInput);
    const minimumStockValue = minimumStockInput.trim();
    const minimumStock = minimumStockValue === '' ? undefined : Number(minimumStockValue);

    if (!Number.isFinite(quantity) || quantity < 0) {
      setActionError('La cantidad debe ser un numero mayor o igual a 0.');
      return;
    }

    if (
      minimumStock !== undefined &&
      (!Number.isFinite(minimumStock) || minimumStock < 0)
    ) {
      setActionError('El stock minimo debe ser un numero mayor o igual a 0.');
      return;
    }

    setIsCreating(true);
    setActionError(null);

    try {
      const createdProduct = await createProduct({
        name: name.trim(),
        category: category.trim(),
        quantity,
        unit: unit.trim(),
        minimumStock,
      });
      setProducts((currentProducts) => [...currentProducts, createdProduct]);
      resetProductForm();
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible crear el producto en este momento.'),
      );
    } finally {
      setIsCreating(false);
    }
  };

  const updateProductQuantity = async (
    product: Product,
    nextQuantity: number,
  ): Promise<void> => {
    if (nextQuantity < 0) {
      return;
    }

    setPendingProductId(product.id);
    setActionError(null);

    try {
      const updatedProduct = await updateProduct(product.id, { quantity: nextQuantity });
      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === updatedProduct.id ? updatedProduct : currentProduct,
        ),
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible actualizar la cantidad del producto.'),
      );
    } finally {
      setPendingProductId(null);
    }
  };

  const handleDeleteProduct = async (productId: number): Promise<void> => {
    setPendingProductId(productId);
    setActionError(null);

    try {
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible eliminar el producto en este momento.'),
      );
    } finally {
      setPendingProductId(null);
    }
  };

  if (loadState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Cargando inventario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadState === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>No se pudo cargar el inventario</Text>
          <Text style={styles.stateText}>{loadError}</Text>
          <Pressable style={styles.buttonPrimary} onPress={() => void loadProducts()}>
            <Text style={styles.buttonPrimaryText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Inventario</Text>
        <Text style={styles.subtitle}>Gestion de productos del hogar (Fase 3)</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuevo producto</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
            style={styles.input}
            editable={!isCreating}
          />
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Categoria"
            style={styles.input}
            editable={!isCreating}
          />
          <TextInput
            value={quantityInput}
            onChangeText={setQuantityInput}
            placeholder="Cantidad"
            style={styles.input}
            keyboardType="numeric"
            editable={!isCreating}
          />
          <TextInput
            value={unit}
            onChangeText={setUnit}
            placeholder="Unidad"
            style={styles.input}
            editable={!isCreating}
          />
          <TextInput
            value={minimumStockInput}
            onChangeText={setMinimumStockInput}
            placeholder="Stock minimo (opcional)"
            style={styles.input}
            keyboardType="numeric"
            editable={!isCreating}
          />
          <Pressable
            style={[styles.buttonPrimary, !canSubmitNewProduct && styles.buttonDisabled]}
            onPress={() => void handleCreateProduct()}
            disabled={!canSubmitNewProduct}
          >
            <Text style={styles.buttonPrimaryText}>
              {isCreating ? 'Guardando...' : 'Crear producto'}
            </Text>
          </Pressable>
        </View>

        {actionError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{actionError}</Text>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.cardTitle}>Productos ({products.length})</Text>
          <Pressable style={styles.buttonSecondary} onPress={() => void loadProducts()}>
            <Text style={styles.buttonSecondaryText}>Recargar</Text>
          </Pressable>
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Inventario vacio</Text>
            <Text style={styles.emptyStateText}>
              Crea tu primer producto para comenzar a gestionar stock.
            </Text>
          </View>
        ) : (
          products.map((product) => {
            const isPending = pendingProductId === product.id;
            const isLowStock =
              product.minimumStock !== null && product.quantity <= product.minimumStock;

            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  {isLowStock && <Text style={styles.lowStockBadge}>Bajo stock</Text>}
                </View>

                <Text style={styles.productMeta}>
                  Categoria: {product.category} | Unidad: {product.unit}
                </Text>
                <Text style={styles.productMeta}>
                  Cantidad: {product.quantity} {product.unit}
                </Text>
                <Text style={styles.productMeta}>
                  Stock minimo:{' '}
                  {product.minimumStock === null ? 'No definido' : product.minimumStock}
                </Text>

                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.buttonSecondary, isPending && styles.buttonDisabled]}
                    disabled={isPending || product.quantity <= 0}
                    onPress={() =>
                      void updateProductQuantity(product, Math.max(0, product.quantity - 1))
                    }
                  >
                    <Text style={styles.buttonSecondaryText}>-1</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.buttonSecondary, isPending && styles.buttonDisabled]}
                    disabled={isPending}
                    onPress={() => void updateProductQuantity(product, product.quantity + 1)}
                  >
                    <Text style={styles.buttonSecondaryText}>+1</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.buttonDanger, isPending && styles.buttonDisabled]}
                    disabled={isPending}
                    onPress={() => void handleDeleteProduct(product.id)}
                  >
                    <Text style={styles.buttonDangerText}>
                      {isPending ? 'Procesando...' : 'Eliminar'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  buttonPrimary: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonSecondaryText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonDanger: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonDangerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 6,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#4B5563',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 7,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  productName: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  lowStockBadge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  productMeta: {
    fontSize: 13,
    color: '#374151',
  },
  actionsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
