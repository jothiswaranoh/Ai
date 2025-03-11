import React, { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../InputField";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

export interface WorkExperienceEntry {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  location: string;
  achievements: string;
}

export interface FormData {
  workExperience: WorkExperienceEntry[];
}

export interface WorkExperienceProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface WorkExperienceErrors {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  achievements?: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ formData, setFormData }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState<Omit<WorkExperienceEntry, 'id'>>({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    duration: "",
    description: "",
    location: "",
    achievements: ""
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<WorkExperienceErrors>({});

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewExperience(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [id]: "" }));

    // Update duration automatically when start or end date changes
    if (id === "startDate" || id === "endDate") {
      const startDate = id === "startDate" ? value : newExperience.startDate;
      const endDate = id === "endDate" ? value : newExperience.endDate;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = endDate.toLowerCase() === "present" ? new Date() : new Date(endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let duration = "";
        if (years > 0) {
          duration += `${years} year${years > 1 ? 's' : ''}`;
        }
        if (remainingMonths > 0) {
          duration += `${years > 0 ? ' ' : ''}${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        }
        
        setNewExperience(prev => ({ ...prev, duration }));
      }
    }
  };

  const validateFields = (): boolean => {
    const newErrors: WorkExperienceErrors = {};
    
    if (!newExperience.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!newExperience.role.trim()) {
      newErrors.role = "Role is required";
    }
    
    if (!newExperience.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!newExperience.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (newExperience.startDate && newExperience.endDate && 
        newExperience.endDate.toLowerCase() !== "present") {
      const start = new Date(newExperience.startDate);
      const end = new Date(newExperience.endDate);
      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }
    
    if (!newExperience.description.trim()) {
      newErrors.description = "Description is required";
    } else if (newExperience.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!newExperience.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveExperience = () => {
    if (!validateFields()) return;

    const updatedExperiences = [...formData.workExperience];
    
    if (editingIndex !== null) {
      updatedExperiences[editingIndex] = { 
        ...newExperience, 
        id: formData.workExperience[editingIndex].id 
      };
    } else {
      updatedExperiences.push({ 
        ...newExperience, 
        id: (formData.workExperience.length + 1) 
      });
    }
    
    setFormData({ workExperience: updatedExperiences });
    setEditingIndex(null);
    setNewExperience({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      duration: "",
      description: "",
      location: "",
      achievements: ""
    });
    setErrors({});
  };

  const editExperience = (index: number) => {
    const experience = formData.workExperience[index];
    setNewExperience({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate,
      endDate: experience.endDate,
      duration: experience.duration,
      description: experience.description,
      location: experience.location,
      achievements: experience.achievements
    });
    setEditingIndex(index);
    setErrors({});
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
      <div className="space-y-4">
        {formData.workExperience
        .filter((experience) => experience.company.trim() !== "" || experience.role.trim() !== "")
        .map((experience, index) => (
          <div key={experience.id} className="relative">
            <motion.div
              className="cursor-pointer p-4 bg-gray-800 rounded-lg flex justify-between items-center"
              onClick={() => toggleExpand(experience.id)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{experience.company} - {experience.role}</span>
                <span className="text-sm text-gray-400">{experience.location} • {experience.duration}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editExperience(index);
                  }}
                  className="text-blue-400 hover:text-blue-500 transition"
                  type="button"
                >
                  Edit
                </button>
              </div>
            </motion.div>
            {expanded === experience.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-gray-900 rounded-lg mt-2"
              >
                <p className="whitespace-pre-wrap">{experience.description}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl text-white font-semibold">
          {editingIndex !== null ? "Edit Experience" : "Add Experience"}
        </h2>
        <div className="space-y-3 mt-3">
          <InputField
            id="company"
            label="Company"
            placeholder="Company name"
            value={newExperience.company}
            onChange={handleChange}
            error={errors.company}
            required
          />
          <InputField
            id="role"
            label="Role"
            placeholder="Your job title"
            value={newExperience.role}
            onChange={handleChange}
            error={errors.role}
            required
          />
          <InputField
            id="location"
            label="Location"
            placeholder="City, Country"
            value={newExperience.location}
            onChange={handleChange}
            error={errors.location}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={newExperience.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              placeholder="Or type 'Present' for current job"
              value={newExperience.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
            />
          </div>
          <InputField
            id="description"
            label="Description"
            placeholder="Describe your responsibilities and achievements"
            value={newExperience.description}
            onChange={handleChange}
            error={errors.description}
            type="textarea"
            required
          />
          <InputField
            id="achievements"
            label="Achievements"
            placeholder="List your key achievements"
            value={newExperience.achievements}
            onChange={handleChange}
            error={errors.achievements}
            type="textarea"
            required
          />
        </div>
        <button
          onClick={saveExperience}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 w-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={Object.keys(errors).length > 0}
        >
          {editingIndex !== null ? "Update Experience" : "+ Add Experience"}
        </button>
      </div>
    </div>
  );
};

export default WorkExperience;
