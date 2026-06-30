import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import "./Auth.css";
import toast from "react-hot-toast";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get(`/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm({
          ...res.data,
          dueDate: res.data.dueDate
            ? res.data.dueDate.split("T")[0]
            : "",
        });
      } catch (err) {
        toast.error("Failed to load task");
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axiosInstance.put(
        `/tasks/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task updated successfully");
      navigate("/tasks");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="create-task-page">
      <form className="create-task" onSubmit={handleSubmit}>
        <h1>Edit Task</h1>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button type="submit">
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTask;