import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { AppState } from '../types';
import { INITIAL_STATE } from '../utils/initialState';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to a single document where the entire app state is stored
const stateDocRef = doc(db, 'ranking', 'mainState');


// --- DATA SEEDING (ONE-TIME USE FOR FIRESTORE) ---
export const seedDataToFirebase = async (): Promise<void> => {
  try {
    console.log("Seeding initial data to Firestore...");
    await setDoc(stateDocRef, INITIAL_STATE);
    console.log("Initial data seeded successfully.");
  } catch (error) {
    console.error("Error seeding initial data to Firestore: ", error);
    alert("Ocorreu um erro ao carregar os dados iniciais no banco de dados.");
    throw error;
  }
};

// --- REMOTE DATA RETRIEVAL ---
export const loadStateFromFirebase = async (): Promise<AppState | null> => {
  try {
    const docSnap = await getDoc(stateDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppState;
    } else {
      // Document does not exist
      return null;
    }
  } catch (error) {
    console.error("Could not load state from Firestore", error);
    return null;
  }
};

// --- REMOTE DATA UPDATE FUNCTIONS ---
export const saveStateToFirebase = async (newState: AppState): Promise<void> => {
    try {
        await setDoc(stateDocRef, newState);
    } catch (error) {
        console.error("Could not save state to Firestore", error);
        throw new Error("Não foi possível salvar as alterações no banco de dados.");
    }
};