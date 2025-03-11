import React, { useState, ChangeEvent } from "react";
import InputField from "../InputField";
import { FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectEntry {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string;
  projectUrl: string;
}

interface FormData {
  projects: ProjectEntry[];
}

interface ProjectProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface ProjectErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
}

const INITIAL_PROJECT: ProjectEntry = {
  id: 0,
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  technologies: "",
  projectUrl: "",
};

const Project: React.FC<ProjectProps> = ({ formData, setFormData }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState<ProjectEntry>(INITIAL_PROJECT);
  const [errors, setErrors] = useState<ProjectErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateFields = (): boolean => {
    const newErrors: ProjectErrors = {};
    
    if (!newEntry.name.trim()) {
      newErrors.name = "Project Name is required";
    }
    
    if (!newEntry.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!newEntry.startDate) {
      newErrors.startDate = "Start Date is required";
    }
    
    if (!newEntry.endDate) {
      newErrors.endDate = "End Date is required";
    }

    // Validate that end date is not before start date
    if (newEntry.startDate && newEntry.endDate && new Date(newEntry.endDate) < new Date(newEntry.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (newEntry.projectUrl && !/^https?:\/\/(?:www\.)?[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]?$/i.test(newEntry.projectUrl)) {
      newErrors.projectUrl = "Enter a valid URL (https://example.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProject = () => {
    if (!validateFields()) return;

    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      if (editingIndex !== null) {
        updatedProjects[editingIndex] = newEntry;
      } else {
        updatedProjects.push(newEntry);
      }
      return { ...prev, projects: updatedProjects };
    });

    setNewEntry(INITIAL_PROJECT);
    setEditingIndex(null);
    setErrors({});
  };

  const editEntry = (index: number) => {
    setEditingIndex(index);
    setNewEntry(formData.projects[index]);
    setErrors({});
  };

  const deleteEntry = (index: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
      
      if (editingIndex === index) {
        setEditingIndex(null);
        setNewEntry(INITIAL_PROJECT);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Display existing project entries */}
      <div className="grid grid-cols-1 gap-4">
  {formData.projects
    .filter((project) => project.name.trim() !== "" || project.description.trim() !== "")
    .map((project, index) => (
      <div key={`project-${index}`} className="bg-gray-800 p-4 rounded-lg shadow-md text-white relative">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm">{project.description}</p>
        <p className="text-sm">
          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
        </p>
        {project.technologies && (
          <p className="text-sm italic">Tech: {project.technologies}</p>
        )}
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 flex items-center mt-2 hover:text-blue-500"
          >
            <FaExternalLinkAlt className="mr-1" /> Visit Project
          </a>
        )}
        <div className="flex justify-end space-x-2 mt-2">
          <button 
            className="text-blue-400 hover:text-blue-500" 
            onClick={() => editEntry(index)}
            aria-label="Edit project"
          >
            <FaEdit />
          </button>
          <button 
            className="text-red-400 hover:text-red-500" 
            onClick={() => deleteEntry(index)}
            aria-label="Delete project"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    ))}
</div>

      {/* Form for adding/editing projects */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl text-white font-semibold">
          {editingIndex !== null ? "Edit Project" : "Add Project"}
        </h2>
        <div className="space-y-3 mt-3">
          <InputField
            id="name"
            label="Project Name"
            placeholder="Enter project name"
            value={newEntry.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputField
            id="description"
            label="Description"
            placeholder="Enter project description"
            value={newEntry.description}
            onChange={handleChange}
            error={errors.description}
            type="textarea"
            required
          />
          <div className="flex space-x-4">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={newEntry.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              value={newEntry.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
            />
          </div>
          <InputField
            id="technologies"
            label="Technologies Used"
            placeholder="Enter technologies (comma-separated)"
            value={newEntry.technologies}
            onChange={handleChange}
          />
          <InputField
            id="projectUrl"
            label="Project URL"
            placeholder="https://yourproject.com"
            value={newEntry.projectUrl}
            onChange={handleChange}
            error={errors.projectUrl}
            type="url"
          />
        </div>
        <button
          onClick={saveProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 w-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={Object.keys(errors).length > 0}
        >
          {editingIndex !== null ? "Update Project" : "+ Add Project"}
        </button>
      </div>
    </div>
  );
};

export default Project;
