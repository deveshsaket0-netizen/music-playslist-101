import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="w-3 h-3 rounded-full bg-rust"></span>
          <h1 className="font-serif text-2xl text-ink tracking-tight">Playlist</h1>
        </div>

        <form onSubmit={handleSubmit} className="border border-line p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-5">Log in</h2>

          {error && <p className="text-rust text-sm mb-4">{error}</p>}

          <label className="block text-xs text-muted mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-transparent px-3 py-2 mb-4 text-ink text-sm focus:outline-none focus:border-rust"
            required
          />

          <label className="block text-xs text-muted mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line bg-transparent px-3 py-2 mb-6 text-ink text-sm focus:outline-none focus:border-rust"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-2.5 text-sm tracking-wide hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-sm mt-5 text-center text-muted">
            No account?{" "}
            <Link to="/signup" className="text-ink underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}