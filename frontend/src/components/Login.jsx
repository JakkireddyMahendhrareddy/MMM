import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while the request is in progress
    setError(""); // Clear any previous errors

    try {
      // Make the POST request to login the user
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        // If login is successful, store the token in local storage (or context)
        localStorage.setItem("token", response.data.token);

        // Optionally, you can also save user info in context if needed
        // const { name, email } = response.data.user;

        // Navigate to the home page
        navigate("/");
      } else {
        setError(response.data.message || "Login failed"); // Display error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error, please try again later.");
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Login
        </h2>
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
