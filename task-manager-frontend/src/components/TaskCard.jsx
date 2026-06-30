import "./TaskCard.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

function TaskCard({ task, markComplete, setTasks }) {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const token = localStorage.getItem("token");

      await axiosInstance.delete(`/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) =>
        prevTasks.filter((t) => t._id !== task._id)
      );

      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete task"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <p>
        <strong>Status:</strong>{" "}
        <span className={`status ${task.status}`}>
          {task.status}
        </span>
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>
      </p>

      <p>
        <strong>Due Date:</strong>{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date"}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        <span className="description">
          {task.description}
        </span>
      </p>

      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={() => navigate(`/tasks/edit/${task._id}`)}
        >
          <FaEdit /> Edit
        </button>

        <button
          className="complete-btn"
          onClick={() => markComplete(task._id)}
          disabled={task.status === "completed"}
        >
          <FaCheck /> Complete
        </button>

        <button
          className="dlt-btn"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ClipLoader color="#fff" size={15} />
          ) : (
            <>
              <FaTrash /> Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;