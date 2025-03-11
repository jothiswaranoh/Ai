import React, { ChangeEvent } from "react";
import InputField from "../InputField";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  country: string;
  city: string;
  postalCode: string;
}

interface PersonalDetailsFormProps {
  formData: PersonalDetails;
  setFormData: (data: PersonalDetails) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <form className="space-y-4">
      <div className="flex space-x-4">
        <InputField
          id="firstName"
          label="First Name"
          placeholder="Your first name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <InputField
          id="lastName"
          label="Last Name"
          placeholder="Your last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      
      <InputField
        id="headline"
        label="Headline"
        placeholder="e.g. Product Designer"
        value={formData.headline}
        onChange={handleChange}
        required
      />
      
      <InputField
        id="summary"
        label="Summary"
        placeholder="Write a short summary about yourself"
        value={formData.summary}
        onChange={handleChange}
        type="textarea"
        required
      />
      
      <div className="flex space-x-4">
        <InputField
          id="country"
          label="Country/Region"
          placeholder="Choose your country/region"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <InputField
          id="city"
          label="City"
          placeholder="e.g. San Francisco"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      
      <InputField
        id="postalCode"
        label="Post Code"
        placeholder="Enter your post code"
        value={formData.postalCode}
        onChange={handleChange}
        required
      />
    </form>
  );
};

export default PersonalDetailsForm;
