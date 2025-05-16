import { signInWithPopup, auth, db, provider } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import * as StellarSdk from "stellar-sdk";
import { getUserKeypairFromFirestore } from "../firebaseutils/firebaseHelpers";
import { fundTestnetAccount } from "@/utils/fundAccount";

const Login = () => {

  const handleLogin = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const keypair = await getUserKeypairFromFirestore(currentUser.uid);
        console.log("Keypair from Firestore:", keypair?.publicKey);
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Logged in:", user.displayName);

      // STEP 1: Generate Stellar Keypair
      const keypair = StellarSdk.Keypair.random();
      const publicKey = keypair.publicKey();
      const secretKey = keypair.secret();

      console.log("Stellar Wallet:", publicKey);
      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("secretKey", secretKey); // store to firebase lol


      // STEP 2: Fund it using Friendbot (testnet only)
      await fundTestnetAccount(publicKey);

      // STEP 3: Save wallet to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        publicKey,
        secretKey,
        tokenized: "No",
      });

      console.log("Wallet saved to Firestore");
    } catch (err) {
      console.error("Login or wallet error:", err);
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

// import { signInWithPopup, auth, provider } from "../firebase";

// const Login = () => {
//   const handleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       console.log("Logged in as:", user.displayName);
//     } catch (err) {
//       console.error("Login failed:", err);
//     }
//   };

//   return (
//     <div className="flex justify-center mt-20">
//       <button 
//         className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         onClick={handleLogin}
//       >
//         Sign in with Google (Passkey)
//       </button>
//     </div>
//   );
// };

// export default Login;