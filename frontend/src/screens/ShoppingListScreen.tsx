// Pantalla de lista de compras (Fase 4) conectada al backend.
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
  fetchProducts,
} from '../services/api/productsApi';
import {
  addLowStockItems,
  createShoppingListItem,
  deleteShoppingListItem,
  fetchShoppingList,
  purchaseShoppingListItem,
} from '../services/api/shoppingListApi';
import { Product } from '../types/product';
import { ShoppingListItem } from '../types/shopping-list';

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

export const ShoppingListScreen = () => {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState<string | null>(null);
  const [isAddingManual, setIsAddingManual] = useState<boolean>(false);
  const [isSyncingLowStock, setIsSyncingLowStock] = useState<boolean>(false);
  const [isPurchasingAll, setIsPurchasingAll] = useState<boolean>(false);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [pendingLowStockProductId, setPendingLowStockProductId] = useState<number | null>(
    null,
  );

  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [unitInput, setUnitInput] = useState<string>('ud');

  const loadData = useCallback(async () => {
    setLoadState('loading');
    setLoadError(null);

    try {
      const [items, inventoryProducts] = await Promise.all([
        fetchShoppingList(),
        fetchProducts(),
      ]);
      setShoppingItems(items);
      setProducts(inventoryProducts);
      setLoadState('success');
    } catch (error) {
      setLoadError(
        formatApiError(error, 'No fue posible cargar la lista de compras en este momento.'),
      );
      setLoadState('error');
    }
  }, []);

  const reloadShoppingItems = useCallback(async () => {
    const items = await fetchShoppingList();
    setShoppingItems(items);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const lowStockProducts = useMemo(() => {
    return products.filter(
      (product) => product.minimumStock !== null && product.quantity <= product.minimumStock,
    );
  }, [products]);

  const selectedProduct = useMemo(() => {
    if (selectedProductId === null) {
      return null;
    }

    return products.find((product) => product.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const canSubmitManualItem = useMemo(() => {
    return (
      !isAddingManual &&
      selectedProductId !== null &&
      quantityInput.trim().length > 0 &&
      unitInput.trim().length > 0
    );
  }, [isAddingManual, quantityInput, selectedProductId, unitInput]);

  const upsertShoppingItem = useCallback((item: ShoppingListItem): void => {
    setShoppingItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (currentItem) => currentItem.id === item.id,
      );

      if (existingIndex === -1) {
        return [...currentItems, item];
      }

      return currentItems.map((currentItem) =>
        currentItem.id === item.id ? item : currentItem,
      );
    });
  }, []);

  const getLowStockSuggestedQuantity = useCallback((product: Product): number => {
    if (product.minimumStock === null) {
      return 1;
    }

    return Math.max(product.minimumStock - product.quantity, 1);
  }, []);

  const handleSelectProduct = (product: Product): void => {
    setSelectedProductId(product.id);
    setUnitInput(product.unit);
    setActionError(null);
  };

  const handleAddManualItem = async (): Promise<void> => {
    const quantity = Number(quantityInput);

    if (selectedProductId === null) {
      setActionError('Debes seleccionar un producto para agregar a la lista.');
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setActionError('La cantidad debe ser un numero mayor a 0.');
      return;
    }

    setIsAddingManual(true);
    setActionError(null);
    setActionInfo(null);

    try {
      const item = await createShoppingListItem({
        productId: selectedProductId,
        quantity,
        unit: unitInput.trim(),
      });
      upsertShoppingItem(item);

      setQuantityInput('1');
      setActionInfo(
        `Producto "${item.productName}" agregado a pendientes con ${item.quantity} ${item.unit}.`,
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible agregar el producto a la lista de compras.'),
      );
    } finally {
      setIsAddingManual(false);
    }
  };

  const handleAddSingleLowStock = async (product: Product): Promise<void> => {
    const quantityToAdd = getLowStockSuggestedQuantity(product);

    setPendingLowStockProductId(product.id);
    setActionError(null);
    setActionInfo(null);

    try {
      const item = await createShoppingListItem({
        productId: product.id,
        quantity: quantityToAdd,
        unit: product.unit,
      });
      upsertShoppingItem(item);
      setActionInfo(
        `Producto bajo stock "${product.name}" agregado con ${quantityToAdd} ${product.unit}.`,
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible agregar el producto bajo stock seleccionado.'),
      );
    } finally {
      setPendingLowStockProductId(null);
    }
  };

  const handleSyncLowStock = async (): Promise<void> => {
    setIsSyncingLowStock(true);
    setActionError(null);
    setActionInfo(null);

    try {
      const result = await addLowStockItems();
      await reloadShoppingItems();
      setActionInfo(
        `Sincronizacion completada: ${result.addedItems} agregados, ${result.updatedItems} actualizados.`,
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible sincronizar productos bajo stock.'),
      );
    } finally {
      setIsSyncingLowStock(false);
    }
  };

  const handlePurchaseItem = async (item: ShoppingListItem): Promise<void> => {
    setPendingItemId(item.id);
    setActionError(null);
    setActionInfo(null);

    try {
      const result = await purchaseShoppingListItem(item.id, {
        purchasedQuantity: item.quantity,
      });

      setShoppingItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === result.productId
            ? {
                ...product,
                quantity: result.newInventoryQuantity,
              }
            : product,
        ),
      );
      setActionInfo(
        `Compra registrada. Inventario del producto #${result.productId}: ${result.newInventoryQuantity}.`,
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible marcar el producto como comprado.'),
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handlePurchaseAll = async (): Promise<void> => {
    if (shoppingItems.length === 0 || isPurchasingAll) {
      return;
    }

    setIsPurchasingAll(true);
    setActionError(null);
    setActionInfo(null);

    const totalItems = shoppingItems.length;
    let purchasedCount = 0;
    const failedItems: string[] = [];

    for (const item of shoppingItems) {
      try {
        await purchaseShoppingListItem(item.id, {
          purchasedQuantity: item.quantity,
        });
        purchasedCount += 1;
      } catch {
        failedItems.push(item.productName);
      }
    }

    await loadData();

    if (purchasedCount > 0) {
      setActionInfo(
        `Compra masiva completada: ${purchasedCount} de ${totalItems} pendientes marcados como comprados.`,
      );
    }

    if (failedItems.length > 0) {
      setActionError(
        `No se pudieron marcar ${failedItems.length} pendientes: ${failedItems.join(', ')}.`,
      );
    }

    setIsPurchasingAll(false);
  };

  const handleDeleteItem = async (itemId: number): Promise<void> => {
    setPendingItemId(itemId);
    setActionError(null);
    setActionInfo(null);

    try {
      await deleteShoppingListItem(itemId);
      setShoppingItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== itemId),
      );
    } catch (error) {
      setActionError(
        formatApiError(error, 'No fue posible eliminar el producto de la lista de compras.'),
      );
    } finally {
      setPendingItemId(null);
    }
  };

  if (loadState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Cargando lista de compras...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadState === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>No se pudo cargar la lista de compras</Text>
          <Text style={styles.stateText}>{loadError}</Text>
          <Pressable style={styles.buttonPrimary} onPress={() => void loadData()}>
            <Text style={styles.buttonPrimaryText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Lista de compras</Text>
        <Text style={styles.subtitle}>Gestion de compras del hogar (Fase 4)</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Agregar producto manualmente</Text>
          <Text style={styles.helperText}>Selecciona un producto del inventario:</Text>
          {products.length === 0 ? (
            <Text style={styles.helperText}>
              No hay productos disponibles para agregar manualmente.
            </Text>
          ) : (
            <View style={styles.selectorContainer}>
              {products.map((product) => {
                const isSelected = selectedProductId === product.id;

                return (
                  <Pressable
                    key={product.id}
                    accessibilityRole="button"
                    style={[
                      styles.selectorButton,
                      isSelected && styles.selectorButtonSelected,
                    ]}
                    disabled={isAddingManual}
                    onPress={() => handleSelectProduct(product)}
                  >
                    <Text
                      style={[
                        styles.selectorButtonText,
                        isSelected && styles.selectorButtonTextSelected,
                      ]}
                    >
                      Seleccionar {product.name}
                    </Text>
                    <Text
                      style={[
                        styles.selectorButtonMetaText,
                        isSelected && styles.selectorButtonTextSelected,
                      ]}
                    >
                      #{product.id} - {product.unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.helperText}>
            Producto seleccionado:{' '}
            {selectedProduct ? `${selectedProduct.name} (#${selectedProduct.id})` : 'Ninguno'}
          </Text>

          <TextInput
            value={quantityInput}
            onChangeText={setQuantityInput}
            placeholder="Cantidad"
            style={styles.input}
            keyboardType="numeric"
            editable={!isAddingManual}
          />
          <TextInput
            value={unitInput}
            onChangeText={setUnitInput}
            placeholder="Unidad"
            style={styles.input}
            editable={!isAddingManual}
          />

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.buttonPrimary, !canSubmitManualItem && styles.buttonDisabled]}
              onPress={() => void handleAddManualItem()}
              disabled={!canSubmitManualItem}
            >
              <Text style={styles.buttonPrimaryText}>
                {isAddingManual ? 'Guardando...' : 'Agregar producto'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.buttonSecondary, isSyncingLowStock && styles.buttonDisabled]}
              onPress={() => void handleSyncLowStock()}
              disabled={isSyncingLowStock}
            >
              <Text style={styles.buttonSecondaryText}>
                {isSyncingLowStock ? 'Sincronizando...' : 'Agregar bajo stock'}
              </Text>
            </Pressable>
          </View>
        </View>

        {actionError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{actionError}</Text>
          </View>
        )}

        {actionInfo && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{actionInfo}</Text>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.cardTitle}>Pendientes ({shoppingItems.length})</Text>
          <View style={styles.listHeaderActions}>
            <Pressable
              style={[
                styles.buttonSecondary,
                (shoppingItems.length === 0 || isPurchasingAll) && styles.buttonDisabled,
              ]}
              onPress={() => void handlePurchaseAll()}
              disabled={shoppingItems.length === 0 || isPurchasingAll}
            >
              <Text style={styles.buttonSecondaryText}>
                {isPurchasingAll ? 'Comprando...' : 'Marcar todos comprados'}
              </Text>
            </Pressable>
            <Pressable style={styles.buttonSecondary} onPress={() => void loadData()}>
              <Text style={styles.buttonSecondaryText}>Recargar</Text>
            </Pressable>
          </View>
        </View>

        {shoppingItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Lista de compras vacia</Text>
            <Text style={styles.emptyStateText}>
              Agrega productos manualmente o sincroniza desde bajo stock.
            </Text>
          </View>
        ) : (
          shoppingItems.map((item) => {
            const isPending = pendingItemId === item.id;

            return (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemMeta}>Producto #{item.productId}</Text>
                <Text style={styles.itemMeta}>
                  Cantidad: {item.quantity} {item.unit}
                </Text>

                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.buttonSecondary, isPending && styles.buttonDisabled]}
                    onPress={() => void handlePurchaseItem(item)}
                    disabled={isPending || isPurchasingAll}
                  >
                    <Text style={styles.buttonSecondaryText}>
                      {isPending ? 'Procesando...' : 'Marcar comprado'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.buttonDanger, isPending && styles.buttonDisabled]}
                    onPress={() => void handleDeleteItem(item.id)}
                    disabled={isPending || isPurchasingAll}
                  >
                    <Text style={styles.buttonDangerText}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Productos con bajo stock ({lowStockProducts.length})
          </Text>
          {lowStockProducts.length === 0 ? (
            <Text style={styles.helperText}>No hay productos bajo stock en este momento.</Text>
          ) : (
            lowStockProducts.map((product) => (
              <View key={product.id} style={styles.lowStockRow}>
                <Text style={styles.helperText}>
                  #{product.id} {product.name} - {product.quantity}/{product.minimumStock}{' '}
                  {product.unit}
                </Text>
                <Pressable
                  style={[
                    styles.buttonSecondary,
                    pendingLowStockProductId === product.id && styles.buttonDisabled,
                  ]}
                  onPress={() => void handleAddSingleLowStock(product)}
                  disabled={pendingLowStockProductId === product.id}
                >
                  <Text style={styles.buttonSecondaryText}>
                    {pendingLowStockProductId === product.id ? 'Agregando...' : 'Agregar'}
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
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
    gap: 10,
    paddingHorizontal: 24,
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
  selectorContainer: {
    gap: 8,
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 2,
  },
  selectorButtonSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  selectorButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectorButtonMetaText: {
    fontSize: 12,
    color: '#4B5563',
  },
  selectorButtonTextSelected: {
    color: '#1E3A8A',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  listHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 7,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemMeta: {
    fontSize: 13,
    color: '#374151',
  },
  helperText: {
    fontSize: 13,
    color: '#4B5563',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  buttonPrimary: {
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
  infoBox: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    padding: 10,
  },
  infoText: {
    color: '#1E3A8A',
    fontSize: 13,
  },
});
