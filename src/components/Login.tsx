import { signInWithPopup, auth, provider } from "../firebase";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in as:", user.displayName);
    } catch (err) {
      console.error("Login failed:", err);
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
