import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import "./Navbar.css";


function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="logo-container">
        <img
          src="/favicon.svg"
          alt="Task Manager Logo"
          className="logo"
        />
        <h2>Task Manager</h2>
      </div>

      {!isAuthenticated ? (
        <div className="nav-right">
          <h3><Link to="/login">Login</Link></h3>
          <h3><Link to="/register">Register</Link></h3>
        </div>
      ) : (
        <div className="nav-right">
          <h3><Link to="/">Dashboard</Link></h3>
          <h3><Link to="/tasks">Tasks</Link></h3>
          <h3><Link to="/create-task">Create Task</Link></h3>

          <Link to="/profile" className="profile-link">
            <div className="profile-avatar-nav">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </Link>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
export default Navbar;