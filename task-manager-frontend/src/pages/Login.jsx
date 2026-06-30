import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";  

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", form);

      toast.success("Login successful!");
      login(res.data.token);

      console.log("Stored token:", localStorage.getItem("token"));
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1><br />

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={15} /> : "Login"}
          </button>

          <p className="register">
            Don't have an account?{" "}
            <Link to="/register" className="link">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
