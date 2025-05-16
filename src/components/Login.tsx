import { signInWithPopup, auth, db, provider } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import * as StellarSdk from "stellar-sdk";
import { getUserKeypairFromFirestore } from "../firebaseutils/firebaseHelpers";
import { fundTestnetAccount } from "@/utils/fundAccount";

const Login = () => {
  const handleLogin = async () => {
    try {
      // STEP 1: Firebase auth
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in:", user.displayName);

      // STEP 2: Check if existing keypair in Firestore
      const existingKeypair = await getUserKeypairFromFirestore(user.uid);
      if (existingKeypair?.publicKey && existingKeypair?.secretKey) {
        console.log("✅ Found existing wallet:", existingKeypair.publicKey);
        localStorage.setItem("publicKey", existingKeypair.publicKey);
        localStorage.setItem("secretKey", existingKeypair.secretKey);
        return;
      }

      // STEP 3: Generate new Stellar Keypair
      const keypair = StellarSdk.Keypair.random();
      const publicKey = keypair.publicKey();
      const secretKey = keypair.secret();
      console.log("🆕 Generated new wallet:", publicKey);

      // STEP 4: Fund the account on testnet
      await fundTestnetAccount(publicKey);

      // STEP 5: Store to localStorage and Firestore
      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("secretKey", secretKey);

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        publicKey,
        secretKey,
        tokenized: "No",
      });

      console.log("✅ New wallet saved to Firestore");

    } catch (err) {
      console.error("❌ Login or wallet error:", err);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Sign in with Google (Passkey)
      </button>
    </div>
  );
};

export default Login;
