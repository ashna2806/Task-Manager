import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import DashboardCard from "../components/DashboardCard";
import "../App.css";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaCheck
} from "react-icons/fa";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  fetchTasks();
}, []);

if (loading) {
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
if (error) return <h2>{error}</h2>;


  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
  <>
    <div className="dashboard-header">
      <h1>Welcome Back</h1>
      <p>Manage your tasks efficiently</p>
    </div>

    <div className="dashboard-container">
  <DashboardCard
    icon={<FaTasks />}
    title="Total Tasks"
    value={total}
  />

  <DashboardCard
    icon={<FaCheckCircle />}
    title="Completed Tasks"
    value={completed}
  />

  <DashboardCard
    icon={<FaClock />}
    title="Pending Tasks"
    value={pending}
  />
</div>

    <div className="progress-section">
      <h2>Task Progress</h2>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${
              total > 0
                ? Math.round((completed / total) * 100)
                : 0
            }%`,
          }}
        ></div>
      </div>

      <p>
        {total > 0
          ? Math.round((completed / total) * 100)
          : 0}
        % Completed
      </p>
    </div>

    <div className="recent-tasks">
      <h2>Recent Tasks</h2>

      {tasks.slice(0, 5).map((task) => (
        <div key={task._id} className="recent-task-item">
          <span>{task.title}</span>
          <span>{task.status}</span>
        </div>
      ))}
    </div>
  </>
);
}

export default Dashboard;