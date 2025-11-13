import { useLanguage } from "../hooks/useLanguage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const Login = ({ language }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loadAllData } = useApp();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Login failed");
      }
      // Load all data (user, modelRegistration, recommendations) immediately
      await loadAllData();
      // Redirect to dashboard after login
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {language === "en" ? "Login" : "लगइन"}
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "en" ? "Email" : "इमेल"}
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "en" ? "Password" : "पासवर्ड"}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading
              ? language === "en"
                ? "Logging in..."
                : "लगइन हुँदैछ..."
              : language === "en"
              ? "Login"
              : "लगइन"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
