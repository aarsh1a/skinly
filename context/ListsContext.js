import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListsContext = createContext();

const STORAGE_KEY = '@skinly_lists';

// Default Favorites list - cannot be deleted
const DEFAULT_LISTS = [
    {
        id: 'favorites',
        name: 'Favorites',
        icon: 'heart',
        color: '#EC4899',
        isDefault: true,
        products: [],
        createdAt: new Date().toISOString(),
    },
];

export const ListsProvider = ({ children }) => {
    const [lists, setLists] = useState(DEFAULT_LISTS);
    const [isLoading, setIsLoading] = useState(true);

    // Load lists from storage on mount
    useEffect(() => {
        loadLists();
    }, []);

    // Save lists to storage whenever they change
    useEffect(() => {
        if (!isLoading) {
            saveLists();
        }
    }, [lists, isLoading]);

    const loadLists = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure Favorites always exists
                const hasFavorites = parsed.some(l => l.id === 'favorites');
                if (!hasFavorites) {
                    setLists([DEFAULT_LISTS[0], ...parsed]);
                } else {
                    setLists(parsed);
                }
            }
        } catch (error) {
            console.error('Error loading lists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveLists = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
        } catch (error) {
            console.error('Error saving lists:', error);
        }
    };

    // Create a new list
    const createList = (name, icon = 'list', color = '#8B5CF6') => {
        const newList = {
            id: `list_${Date.now()}`,
            name,
            icon,
            color,
            isDefault: false,
            products: [],
            createdAt: new Date().toISOString(),
        };
        setLists(prev => [...prev, newList]);
        return newList;
    };

    // Delete a list (cannot delete Favorites)
    const deleteList = (listId) => {
        if (listId === 'favorites') {
            console.warn('Cannot delete the Favorites list');
            return false;
        }
        setLists(prev => prev.filter(l => l.id !== listId));
        return true;
    };

    // Add product to a list
    const addProductToList = (listId, product) => {
        setLists(prev => prev.map(list => {
            if (list.id === listId) {
                // Check if product already exists
                const exists = list.products.some(p => p.id === product.id);
                if (exists) return list;

                return {
                    ...list,
                    products: [...list.products, {
                        ...product,
                        savedAt: new Date().toISOString(),
                    }],
                };
            }
            return list;
        }));
    };

    // Remove product from a list
    const removeProductFromList = (listId, productId) => {
        setLists(prev => prev.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    products: list.products.filter(p => p.id !== productId),
                };
            }
            return list;
        }));
    };

    // Check which lists contain a product
    const getListsForProduct = (productId) => {
        return lists.filter(list =>
            list.products.some(p => p.id === productId)
        ).map(l => l.id);
    };

    // Check if product is saved to any list
    const isProductSaved = (productId) => {
        return lists.some(list =>
            list.products.some(p => p.id === productId)
        );
    };

    // Toggle product in a list
    const toggleProductInList = (listId, product) => {
        const list = lists.find(l => l.id === listId);
        if (!list) return;

        const exists = list.products.some(p => p.id === product.id);
        if (exists) {
            removeProductFromList(listId, product.id);
        } else {
            addProductToList(listId, product);
        }
    };

    // Get a specific list by ID
    const getList = (listId) => {
        return lists.find(l => l.id === listId);
    };

    const value = {
        lists,
        isLoading,
        createList,
        deleteList,
        addProductToList,
        removeProductFromList,
        getListsForProduct,
        isProductSaved,
        toggleProductInList,
        getList,
    };

    return (
        <ListsContext.Provider value={value}>
            {children}
        </ListsContext.Provider>
    );
};

export const useLists = () => {
    const context = useContext(ListsContext);
    if (!context) {
        throw new Error('useLists must be used within a ListsProvider');
    }
    return context;
};

export default ListsContext;
