import React, { useState, ChangeEvent } from "react";
import InputField from "../InputField";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import Select, { SingleValue } from "react-select";

interface Skill {
  id: number;
  name: string;
  proficiency: string;
  yearsOfExperience: string;
  certifications: string;
}

interface FormData {
  skills: Skill[];
}

interface SkillsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface ProficiencyOption {
  value: string;
  label: string;
}

interface SkillErrors {
  name?: string;
  yearsOfExperience?: string;
}

const proficiencyOptions: ProficiencyOption[] = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" },
];

const INITIAL_SKILL: Skill = {
  id: 0,
  name: "",
  proficiency: "",
  yearsOfExperience: "",
  certifications: "",
};

const Skills: React.FC<SkillsProps> = ({ formData, setFormData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, SkillErrors>>({});

  const validateSkill = (skill: Skill, index: number): boolean => {
    const skillErrors: SkillErrors = {};
    let hasErrors = false;

    if (!skill.name.trim()) {
      skillErrors.name = "Skill name is required";
      hasErrors = true;
    }

    if (skill.yearsOfExperience) {
      const years = parseFloat(skill.yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        skillErrors.yearsOfExperience = "Please enter a valid number of years (0-50)";
        hasErrors = true;
      }
    }

    setErrors(prev => ({
      ...prev,
      [index]: skillErrors
    }));

    return !hasErrors;
  };

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = { ...updatedSkills[index], [id]: value };
      return { ...prev, skills: updatedSkills };
    });

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], [id]: "" }
    }));
  };

  const handleSelectChange = (
    index: number,
    selectedOption: SingleValue<ProficiencyOption>
  ) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        proficiency: selectedOption?.value || "",
      };
      return { ...prev, skills: updatedSkills };
    });
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...INITIAL_SKILL }],
    }));
    // Open the newly added skill's accordion
    setOpenIndex(formData.skills.length);
  };

  const removeSkill = (index: number) => {
    if (window.confirm("Are you sure you want to remove this skill?")) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index),
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      if (openIndex === index) {
        setOpenIndex(null);
      }
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 text-white rounded-lg max-h-screen overflow-y-auto">
      {formData.skills.map((skill, index) => (
        <div key={index} className="border border-gray-600 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center bg-gray-700 px-4 py-3">
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              className="flex-1 flex justify-between items-center text-lg font-semibold"
            >
              <span>{skill.name || "New Skill"}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-4 text-red-400 hover:text-red-500 transition"
              aria-label="Remove skill"
            >
              <FaTrash />
            </button>
          </div>

          {openIndex === index && (
            <div className="p-4 space-y-4 bg-gray-900">
              <InputField
                id="name"
                label="Skill Name"
                placeholder="Enter skill (e.g., React, Python)"
                value={skill.name}
                onChange={(e) => handleChange(index, e)}
                error={errors[index]?.name}
                required
              />
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium pb-2 block">
                    Proficiency Level <span className="text-red-500">*</span>
                  </label>
                  <Select<ProficiencyOption>
                    value={proficiencyOptions.find(
                      (option) => option.value === skill.proficiency
                    )}
                    onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                    options={proficiencyOptions}
                    className="w-full"
                    classNamePrefix="select"
                    placeholder="Select proficiency level"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#1f2937",
                        borderColor: "#3c4753",
                        color: "white",
                        padding: "4px",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#1f2937",
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? "#374151" : "#1f2937",
                        color: "white",
                      }),
                    }}
                  />
                </div>
                <InputField
                  id="yearsOfExperience"
                  label="Years of Experience"
                  placeholder="e.g., 3"
                  value={skill.yearsOfExperience}
                  onChange={(e) => handleChange(index, e)}
                  error={errors[index]?.yearsOfExperience}
                  type="number"
                  required
                />
              </div>
              <InputField
                id="certifications"
                label="Certifications (Optional)"
                placeholder="Enter relevant certifications"
                value={skill.certifications}
                onChange={(e) => handleChange(index, e)}
                type="textarea"
              />
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full hover:bg-blue-700 transition"
      >
        + Add Skill
      </button>
    </div>
  );
};

export default Skills;