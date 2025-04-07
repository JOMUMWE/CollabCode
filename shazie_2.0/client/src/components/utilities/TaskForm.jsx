import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TaskForm({ projectId, onTaskAdded, userid }) {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);

  const validateEmail = async (email) => {
    try {
      const response = await axios.get("/validateEmailForProject", {
        params: { email, projectId },
      });
      setEmailValid(true);
      return response.data.userId;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to validate email");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdBy = userid; // Replace with the logged-in user's ID
      const userId = await validateEmail(assignedTo);
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await axios.post("/addTask", {
        projectId,
        taskName,
        status,
        dueDate,
        createdBy,
        assignedTo,
      });

      toast.success("Task added successfully!");
      setTaskName("");
      setStatus("Pending");
      setDueDate("");
      setAssignedTo("");
      setEmailValid(null);
      onTaskAdded(response.data.task); // Notify parent component
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded text-black h-full w-full"
    >
      <h3 className="text-lg font-semibold mb-4">Add Task</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="input input-primary bg-white text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-primary bg-white text-black"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input input-primary bg-white text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Assign To (Email)
        </label>
        <input
          type="email"
          value={assignedTo}
          onChange={(e) => {
            setAssignedTo(e.target.value);
            setEmailValid(null); // Reset validation state
          }}
          placeholder="Enter email of the user"
          className={`input input-primary bg-white text-black ${
            emailValid === false ? "border-red-500" : ""
          }`}
        />
        {emailValid === false && (
          <p className="text-red-500 text-sm mt-1">
            Invalid email or not part of the team
          </p>
        )}
      </div>
      <div className="flex flex-row justify-between items-center">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-sm"
        >
          {loading ? "Adding Task..." : "Add Task"}
        </button>
        <form method="dialog">
          <button className="btn btn-sm ">Close</button>
        </form>
      </div>
    </form>
  );
}
