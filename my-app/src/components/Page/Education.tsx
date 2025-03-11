import React, { useState, ChangeEvent } from "react";
import InputField from "../InputField"; // Reusable input component
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Education {
  id: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface FormData {
  education: Education[];
}

interface EducationProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Education: React.FC<EducationProps> = ({ formData, setFormData }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEntry, setNewEntry] = useState<Education>({
    id: 0,
    school: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });
  const [errors, setErrors] = useState<Partial<Education>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewEntry({ ...newEntry, [id]: value });
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateFields = (): boolean => {
    const newErrors: Partial<Education> = {};
    if (!newEntry.school) newErrors.school = "School is required";
    if (!newEntry.degree) newErrors.degree = "Degree is required";
    if (!newEntry.fieldOfStudy) newErrors.fieldOfStudy = "Field of Study is required";
    if (!newEntry.startYear) newErrors.startYear = "Start Year is required";
    if (!newEntry.endYear) newErrors.endYear = "End Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEducation = () => {
    if (!validateFields()) return;

    setFormData((prev) => {
      const updatedEducation = [...prev.education];
      if (editingIndex !== null) {
        updatedEducation[editingIndex] = newEntry;
      } else {
        updatedEducation.push(newEntry);
      }
      return { ...prev, education: updatedEducation };
    });

    setNewEntry({ id: 0, school: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" });
    setEditingIndex(null);
    setErrors({});
  };

  const editEntry = (index: number) => {
    setEditingIndex(index);
    setNewEntry(formData.education[index]);
  };

  const deleteEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Display existing education entries */}
      <div className="grid grid-cols-1 gap-4">
       
			{formData.education
  .filter((edu) => edu.degree.trim() !== "" || edu.school.trim() !== "")
  .map((edu, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-white relative">
            <h3 className="text-lg font-semibold">{edu.school}</h3>
            <p className="text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
            <p className="text-sm">{edu.startYear} - {edu.endYear}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button className="text-blue-400 hover:text-blue-500" onClick={() => editEntry(index)}>
                <FaEdit />
              </button>
              <button className="text-red-400 hover:text-red-500" onClick={() => deleteEntry(index)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form for adding/editing education */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl text-white font-semibold">{editingIndex !== null ? "Edit Education" : "Add Education"}</h2>
        <div className="space-y-3 mt-3">
          <InputField id="school" placeholder="School / University" label="School / University" value={newEntry.school} onChange={handleChange} error={errors.school} />
          <InputField id="degree" placeholder="Degree" label="Degree" value={newEntry.degree} onChange={handleChange} error={errors.degree} />
          <InputField id="fieldOfStudy" placeholder="Field of Study" label="Field of Study" value={newEntry.fieldOfStudy} onChange={handleChange} error={errors.fieldOfStudy} />
          <div className="flex space-x-4">
            <InputField id="startYear" placeholder="Start Year" label="Start Year" value={newEntry.startYear} onChange={handleChange} error={errors.startYear} />
            <InputField id="endYear" placeholder="End Year" label="End Year" value={newEntry.endYear} onChange={handleChange} error={errors.endYear} />
          </div>
        </div>
        <button
          onClick={saveEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 w-full hover:bg-blue-700 transition"
        >
          {editingIndex !== null ? "Update Education" : "+ Add Education"}
        </button>
      </div>
    </div>
  );
};

export default Education;