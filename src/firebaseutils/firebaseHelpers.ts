import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
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

export async function saveFounderToFirestore(founder) {
  // Basic validation: stop saving if key fields are missing or empty
  if (
    !founder ||
    !founder.publicKey || founder.publicKey.trim() === "" ||
    !founder.name || founder.name.trim() === ""
  ) {
    console.warn("Founder data is empty or invalid. Skipping save:", founder);
    return; // Skip saving empty founder
  }

  const ref = doc(db, "founders", founder.publicKey);
  await setDoc(ref, founder, { merge: true });
}


async function updateFounderTokenizedStatus(founderId: string | undefined, tokenized: boolean) {
  if (!founderId) throw new Error("Founder ID is required");

  const founderRef = doc(db, "founders", founderId);
  await updateDoc(founderRef, { tokenized });
}