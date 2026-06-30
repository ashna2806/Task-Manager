import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import TaskCard from "../components/TaskCard";
import "../components/TaskCard.css";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to fetch tasks"
        );
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

  if (error) {
    return <h2>{error}</h2>;
  }

  if (tasks.length === 0) {
    return <h2>No tasks found</h2>;
  }
  const completedCount = tasks.filter(
  (task) => task.status === "completed"
).length;

const pendingCount = tasks.filter(
  (task) => task.status === "pending"
).length;

const highCount = tasks.filter(
  (task) => task.priority === "high"
).length;
const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "all"
      ? true
      : filter === "high"
      ? task.priority === "high"
      : task.status === filter;

  return matchesSearch && matchesFilter;
});
const markComplete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axiosInstance.put(
      `/tasks/${id}`,
      { status: "completed" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks((prevTasks) => 
      prevTasks.map((task) =>
        task._id === id
          ? { ...task, status: "completed" }
          : task
      )
    );
    toast.success("Task marked as completed!");
  } catch (err) {
    toast.error(
    err.response?.data?.message ||
    "Failed to update task"
  );
  }
};


  return (
    <>
   <br></br><center> <h1>TASKS</h1></center>
   <br></br>
   <br></br>
   <div className="search-container">
  <FaSearch className="search-icon" />
   <input type="text"
      placeholder= "Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className= "search-input"
    />
    </div>
    <div className="filter-buttons">
 <button
  className={filter === "all" ? "active-filter" : ""}
  onClick={() => setFilter("all")}
>
  All ({tasks.length})
</button>
  <button className={filter === "completed" ? "active-filter" : ""}
   onClick={() => setFilter("completed")}>
    Completed ({completedCount})
  </button>

  <button className={filter === "pending" ? "active-filter" : ""}
   onClick={() => setFilter("pending")}>
    Pending ({pendingCount})
  </button>

  <button className={filter === "high" ? "active-filter" : ""}
  onClick={() => setFilter("high")}>
    High Priority ({highCount})
  </button>
 
</div>
   <div className="task-card-container">
  {filteredTasks.map((task) => (
  <TaskCard
  key={task._id}
  task={task}
  markComplete={markComplete}
  setTasks={setTasks}
/>
))}
</div>
    </>
  );
}


export default Tasks;