import { useEffect, useState, useContext } from "react";
import axiosInstance from "../services/axiosInstance";
import { ClipLoader } from "react-spinners";
import {
FaUser,
FaEnvelope,
FaCalendarAlt,
FaSignOutAlt,
FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";
import toast from "react-hot-toast";

function Profile() {
const [user, setUser] = useState(null);
const [editing, setEditing] = useState(false);
const [newName, setNewName] = useState("");

const [updating, setUpdating] = useState(false);
const [deleting, setDeleting] = useState(false);

const navigate = useNavigate();
const { logout } = useContext(AuthContext);

useEffect(() => {
const fetchUser = async () => {
try {
const token = localStorage.getItem("token");

    const res = await axiosInstance.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data);
    setNewName(res.data.name);
  } catch (err) {
    console.log(err);
  }
};

fetchUser();

}, []);

const handleLogout = () => {
logout();
navigate("/login");
};

const handleDeleteAccount = async () => {
const confirmDelete = window.confirm(
"This will permanently delete your account and all tasks. Continue?"
);

if (!confirmDelete) return;

setDeleting(true);

try {
  const token = localStorage.getItem("token");

  await axiosInstance.delete("/auth/delete-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  toast.success("Account deleted successfully");

  setTimeout(() => {
    logout();
    navigate("/register");
  }, 1500);

} catch (err) {
  toast.error("Failed to delete account");
} finally {
  setDeleting(false);
}


};

const handleUpdate = async () => {
setUpdating(true);

try {
  const token = localStorage.getItem("token");

  const res = await axiosInstance.put(
    "/users/me",
    { name: newName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setUser(res.data);
  setEditing(false);

  toast.success("Profile updated successfully");

} catch (err) {
  toast.error("Failed to update profile");
} finally {
  setUpdating(false);
}


};

if (!user){
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <ClipLoader color="#3c6a73" size={60} />
    </div>
  );
}

return ( 
<div className="profile-page">
<div className="profile-container"> <h1>My Profile</h1>

  <div className="profile-avatar">
    {user.name.charAt(0).toUpperCase()}
  </div>

  {editing ? (
    <div>
      <input
        className="profile-input"
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <button
  className="update-profile-btn"
  onClick={handleUpdate}
  disabled={updating}
>
  {updating ? <ClipLoader color="#fff" size={15} /> : "Update Profile"}
</button>
    </div>
  ) : (
    <>
      <p>
        <FaUser /> <strong>Name:</strong> {user.name}
      </p>

      <button
        className="edit-profile-btn"
        onClick={() => setEditing(true)}
      >
        Edit Profile
      </button>
    </>
  )}

  <p>
    <FaEnvelope /> <strong>Email:</strong> {user.email}
  </p>

  <p>
    <FaCalendarAlt /> <strong>Member Since:</strong>{" "}
    {new Date(user.createdAt).toLocaleDateString()}
  </p>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    <FaSignOutAlt /> Logout
  </button>

  <button
  className="delete-account-btn"
  onClick={handleDeleteAccount}
  disabled={deleting}
>
  {deleting ? <ClipLoader color="#fff" size={15} /> : <><FaTrash /> Delete Account</>}
</button>
</div>
</div>
);
}

export default Profile;
