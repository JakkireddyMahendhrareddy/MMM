import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while the request is in progress
    setError(""); // Clear any previous errors

    try {
      // Make the POST request to register the user
      const response = await axios.post("http://localhost:5001/api/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        // If registration is successful, navigate to the home page or login page
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed"); // Display error message
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          Register
        </h2>
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="text"
          placeholder="Name"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
