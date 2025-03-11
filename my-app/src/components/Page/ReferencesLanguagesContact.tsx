import React from "react";
import InputField from "../InputField";
import Select from "react-select";

interface Language {
  id: number;
  name: string;
  proficiency: string;
}

interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
}

interface References {
  referenceName: string;
  languages: Language[];
  contact: Contact;
}

interface ReferencesLanguagesContactProps {
  formData: References;
  setFormData: (data: References) => void;
}

interface ProficiencyOption {
  value: string;
  label: string;
}

const ReferencesLanguagesContact: React.FC<ReferencesLanguagesContactProps> = ({ formData, setFormData }) => {
  const { referenceName, languages, contact } = formData;

  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData({ ...formData, languages: updatedLanguages });
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: languages.length + 1,
      name: "",
      proficiency: "Beginner"
    };
    setFormData({
      ...formData,
      languages: [...languages, newLanguage],
    });
  };

  const proficiencyOptions: ProficiencyOption[] = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Fluent", label: "Fluent" },
  ];

  return (
    <div className="p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6">
      {/* Contact Information Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="email"
            type="email"
            placeholder="Email Address"
            label="Email Address"
            value={contact.email}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, email: e.target.value } })
            }
            required
          />
          <InputField
            id="phone"
            type="tel"
            placeholder="Phone Number"
            label="Phone Number"
            value={contact.phone}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, phone: e.target.value } })
            }
            required
          />
          <InputField
            id="linkedin"
            type="url"
            placeholder="LinkedIn Profile"
            label="LinkedIn Profile"
            value={contact.linkedin}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, linkedin: e.target.value } })
            }
          />
          <InputField
            id="github"
            type="url"
            placeholder="GitHub Profile"
            label="GitHub Profile"
            value={contact.github}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, github: e.target.value } })
            }
          />
          <InputField
            id="portfolio"
            type="url"
            placeholder="Portfolio/Website"
            label="Portfolio/Website"
            value={contact.portfolio}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, portfolio: e.target.value } })
            }
          />
          <InputField
            id="address"
            placeholder="Address (Optional)"
            label="Address (Optional)"
            value={contact.address}
            onChange={(e) =>
              setFormData({ ...formData, contact: { ...contact, address: e.target.value } })
            }
          />
        </div>
      </div>
      {/* Languages Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Languages</h2>
        {languages.map((lang, index) => (
          <div key={lang.id} className="space-y-2 mb-4">
            <InputField
              id={`language-${index}`}
              placeholder="Language Name"
              label="Language Name"
              value={lang.name}
              onChange={(e) => handleLanguageChange(index, "name", e.target.value)}
              required
            />
            <Select<ProficiencyOption>
              options={proficiencyOptions}
              value={proficiencyOptions.find((option) => option.value === lang.proficiency)}
              onChange={(selectedOption) => 
                handleLanguageChange(index, "proficiency", selectedOption?.value || "Beginner")
              }
              className="text-black"
              classNamePrefix="select"
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
        ))}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          onClick={addLanguage}
          type="button"
        >
          + Add Language
        </button>
      </div>

      {/* References Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4">References</h2>
        <InputField
          id="referenceName"
          placeholder="Reference Name"
          label="Reference Name"
          value={referenceName}
          onChange={(e) => setFormData({ ...formData, referenceName: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default ReferencesLanguagesContact;