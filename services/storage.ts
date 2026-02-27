// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  username: string;
  email: string;
  password: string;
};

// Clés de stockage
const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';

// Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return [];
  }
};

// Sauvegarder un nouvel utilisateur
export const saveUser = async (user: User): Promise<boolean> => {
  try {
    const users = await getUsers();
    
    // Vérifier si l'email existe déjà
    const emailExists = users.some(u => u.email === user.email);
    if (emailExists) {
      return false;
    }
    
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    return false;
  }
};

// Vérifier les identifiants de connexion
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return null;
  }
};

// Récupérer l'utilisateur connecté
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
    return null;
  }
};

// Déconnecter l'utilisateur
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};