import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProjectsForm(props) {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    teamId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/projects", formData);
      toast.success("Project created successfully!");
      // Reset form
      setFormData({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        teamId: "",
      });
      props.fun(!props);
    } catch (error) {
      toast.error("Error creating project");
      console.error(error);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900"
          >
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea bg-white text-black border-2 border-gray-300"
          />
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-900"
          >
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-900"
          >
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-900"
          >
            Team Name
          </label>
          <input
            type="text"
            name="teamName"
            value={formData.teamId}
            onChange={handleChange}
            required
            className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Project
        </button>
      </form>
    </div>
  );
}
