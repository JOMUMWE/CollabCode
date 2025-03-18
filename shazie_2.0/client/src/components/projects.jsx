import ProjectsForm from "./ProjectsForm";
import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import axios from "axios";
import TaskForm from "./utilities/TaskForm";

export default function Projects(props) {
  const [active, setActive] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = props.user.id;
        const { data } = await axios.get(`/getProjects?userId=${userId}`);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [props]);

  const handleTaskAdded = (projectId, task) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId
          ? { ...project, tasks: [...project.tasks, task] }
          : project
      )
    );
  };
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Projects
          </h1>
        </div>
      </header>
      <main className="bg-white mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {project.projectName}
                </h2>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-500">
                  Start Date: {new Date(project.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  End Date:{" "}
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Ongoing"}
                </p>
                <TaskForm
                  projectId={project._id}
                  onTaskAdded={(task) => handleTaskAdded(project._id, task)}
                  userid = {props.user.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects available</p>
        )}
      </main>
      <div className="bg-white mx-auto md:py-10 sm:py-16 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {active ? "" : <ProjectsForm fun={setActive} act={active} />}
        <button
          onClick={() => {
            setActive(!active);
          }}
          className={
            active
              ? "bg-indigo-600 flex w-36 justify-center items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
              : "bg-indigo-400 flex w-42 justify-center items-center rounded-md px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          }
        >
          {active ? (
            <PlusIcon className="w-4 h-4 mr-1" />
          ) : (
            <span className="loading loading-infinity loading-xs mr-2"></span>
          )}
          {active ? "Create Project" : "Creating a project"}
        </button>
      </div>
    </div>
  );
}
