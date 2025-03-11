import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PersonalDetailsForm from "./components/Page/PersonalDetailsForm";
import Skills from "./components/Page/Skills";
import Education from "./components/Page/Education";
import { useLocation, useNavigate } from "react-router-dom";
import Project from "./components/Page/Projects";
import WorkExperience, { FormData as WorkExperienceFormData } from "./components/Page/WorkExperience";
import ReferencesLanguagesContact from "./components/Page/ReferencesLanguagesContact";
import FileUpload from "./components/FileUpload";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  country: string;
  city: string;
  postalCode: string;
}

interface SkillEntry {
  id: number;
  name: string;
  proficiency: string;
  yearsOfExperience: string;
  certifications: string;
}

interface EducationEntry {
  id: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface ProjectEntry {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string;
  projectUrl: string;
}

interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
}

interface Language {
  id: number;
  name: string;
  proficiency: string;
}

interface References {
  referenceName: string;
  languages: Language[];
  contact: Contact;
}

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "Personal Details";

  useEffect(() => {
    document.title = `Profile - ${activeTab}`;
  }, [activeTab]);

  const setActiveTab = (tab: string) => {
    navigate(`?tab=${tab}`, { replace: true });
  };

  const [personalDetails, setPersonalDetails] = useState<{ formData: PersonalDetails }>({
    formData: {
      firstName: "",
      lastName: "",
      headline: "",
      summary: "",
      country: "",
      city: "",
      postalCode: "",
    }
  });

  const [skillsData, setSkillsData] = useState<{ skills: SkillEntry[] }>({
    skills: [
      {
        id: 1,
        name: "",
        proficiency: "",
        yearsOfExperience: "",
        certifications: ""
      }
    ]
  });

  const [educationData, setEducationData] = useState<{ education: EducationEntry[] }>({
    education: [
      {
        id: 1,
        school: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: ""
      }
    ]
  });

  const [projectsData, setProjectsData] = useState<{ projects: ProjectEntry[] }>({
    projects: [
      {
        id: 1,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        technologies: "",
        projectUrl: ""
      }
    ]
  });

  const [workExperience, setWorkExperience] = useState<WorkExperienceFormData>({
    workExperience: [
      {
        id: 1,
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        duration: "",
        description: "",
        location: "",
        achievements: ""
      }
    ]
  });

  const [referencesData, setReferencesData] = useState<{ formData: References }>({
    formData: {
      referenceName: "",
      languages: [{ id: 1, name: "", proficiency: "Beginner" }],
      contact: {
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        portfolio: "",
        address: ""
      }
    }
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    let url = `${import.meta.env.VITE_BASE_URL}/api/v1/resumes`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      console.log(response);

      let datum = await response.json();
      const data = datum.data;
      setPersonalDetails({
        formData: {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          headline: data.headline || "", // Use headline instead of category
          summary: data.summary || "",
          country: data.country || "",
          city: data.city || "",
          postalCode: data.postal_code || "",
        }
      });

      setSkillsData({
        skills: data.skills?.map((skill: any, index: number) => ({
          id: index + 1,
          name: skill.name || "",
          proficiency: skill.proficiency || "",
          yearsOfExperience: skill.years_of_experience || "",
          certifications: "", // No certifications available in the given data
        })) || [],
      });

      setEducationData({
        education: data.education?.map((edu: any, index: number) => ({
          id: index + 1,
          school: edu.institution || "",
          degree: edu.degree || "",
          fieldOfStudy: edu.field_of_study || "",
          startYear: edu.start_year || "",
          endYear: edu.end_year || "",
        })) || [],
      });

      setProjectsData({
        projects: data.projects?.map((project: any, index: number) => ({
          id: index + 1,
          name: project.title || "",
          description: project.description || "",
          startDate: project.start_date || "",
          endDate: project.end_date || "",
          technologies: project.technologies || "",
          projectUrl: project.project_url || "",
        })) || [],
      });
      debugger;
      setWorkExperience({
        workExperience: data.work_experience?.map((exp: any, index: number) => ({
          id: index + 1,
          company: exp.company || "",
          role: exp.title || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          duration: exp.years || "",
          description: exp.description || "",
          location: exp.location || "",
          achievements: exp.achievements || ""
        })) || []
      });

      setReferencesData({
        formData: {
          referenceName: "", // No reference name provided in the API response
          languages: data.languages || [],
          contact: {
            email: data.email || "",
            phone: data.phone || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolio: data.portfolio || "",
            address: data.address || "",
          },
        },
      });


    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted");
  };

  const tabs = [
    "Personal Details",
    "Skills",
    "Education",
    "Projects",
    "Work Experience",
    "References/Contact",
  ];

  const currentIndex = tabs.indexOf(activeTab);

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };





  return (
    <div className="bg-[#111418] text-white min-h-screen">
      <Header />
      <main className="flex-grow px-6 py-5 flex justify-center min-h-screen">
        <section className="flex w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
          <div className="w-px bg-[#293038] mx-4"></div>
          <div className="flex-1 p-4 max-w-4xl">
            <div className="flex flex-col">
              <div className="flex justify-between mb-6">
                <button
                  className="px-4 py-2 rounded-lg font-medium transition bg-gray-700 text-gray-300 hover:bg-gray-600"
                  onClick={handlePrevious}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleNext}
                >
                   <ChevronRight size={24} />
                </button>
              </div>
            </div>
            {activeTab === "Personal Details" && (
              <>
                <FileUpload onFileUpload={handleFileUpload} />
                <PersonalDetailsForm
                  formData={personalDetails.formData}
                  setFormData={(data) => setPersonalDetails({ formData: data })}
                />
              </>
            )}
            {activeTab === "Skills" && (
              <Skills
                formData={skillsData}
                setFormData={setSkillsData}
              />
            )}
            {activeTab === "Education" && (
              <Education
                formData={educationData}
                setFormData={setEducationData}
              />
            )}
            {activeTab === "Projects" && (
              <Project
                formData={projectsData}
                setFormData={setProjectsData}
              />
            )}
            {activeTab === "Work Experience" && (
              <WorkExperience
                formData={workExperience}
                setFormData={setWorkExperience}
              />
            )}
            {activeTab === "References/Contact" && (
              <ReferencesLanguagesContact
                formData={referencesData.formData}
                setFormData={(data) => setReferencesData({ formData: data })}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
