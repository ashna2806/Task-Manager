import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Auth.css"
import toast from "react-hot-toast";
function CreateTask() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
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
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        "/tasks",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task created successfully");
      navigate("/tasks");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to create task"
      );
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
        
      
        <div className="create-task-page">
      <form className="create-task" onSubmit={handleSubmit}>
        <h1>Create Task</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="status"
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <br /><br />

        <select
          name="priority"
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <br /><br />

        <input
          type="date"
          name="dueDate"
          onChange={handleChange}
        />

        <br /><br />

        <button
  type="submit"
  disabled={loading}
>
  {loading ? "Creating Task..." : "Create Task"}
</button>
      </form>
    </div>
    </>
  );
}

export default CreateTask;