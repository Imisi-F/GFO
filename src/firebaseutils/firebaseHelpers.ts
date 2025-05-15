import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export async function getUserKeypairFromFirestore(uid: string) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        publicKey: data.publicKey,
        secretKey: data.secretKey, // Use only in testnet / secure context
      };
    } else {
      console.warn("No user data found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user keypair from Firestore:", error);
    return null;
  }
}
