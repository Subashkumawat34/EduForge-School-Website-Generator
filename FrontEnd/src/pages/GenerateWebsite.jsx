import { useState } from "react";
import axios from "axios";
import "../styles/GenerateWebsite.css";

const templates = [
  // Free Templates (Basic Features)
  {
    id: 1,
    name: "Basic School",
    type: "free",
    previewImage: "/assets/school1.jpeg",
    tagline: "Essential School Website",
  },
  // ... (other templates as before)
];

const schoolFormFields = {
  basicInfo: {
    schoolName: "",
    motto: "",
    establishedYear: "",
    principalName: "",
    address: "",
    contactEmail: "",
    phoneNumber: "",
  },
  aboutUs: {
    history: "",
    mission: "",
    vision: "",
    values: "",
    achievements: "",
  },
  academics: {
    curriculum: "",
    gradingSystem: "",
    subjects: [],
    academicCalendar: "",
    examinationPattern: "",
  },
  admissions: {
    process: "",
    eligibility: "",
    feeStructure: "",
    documentsRequired: "",
    scholarshipInfo: "",
  },
  facilities: {
    classrooms: "",
    labs: "",
    library: "",
    sports: "",
    extracurricular: "",
  },
  gallery: {
    images: [],
    videos: [],
  },
  contact: {
    mapEmbed: "",
    inquiryForm: true,
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  },
};

const GenerateWebsite = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(schoolFormFields);
  const [currentSection, setCurrentSection] = useState("basicInfo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [name]: value,
      },
    }));
  };

  const handleArrayInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [field]: value.split(",").map((item) => item.trim()),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/school-websites", {
        templateId: selectedTemplate.id,
        formData,
      });

      if (response.data.success) {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error("Error saving school website:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormSection = () => {
    switch (currentSection) {
      case "basicInfo":
        return (
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                name="schoolName"
                value={formData.basicInfo.schoolName}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Add all other basic info fields similarly */}
          </div>
        );
      case "aboutUs":
        return (
          <div className="form-section">
            <h3>About Our School</h3>
            <div className="form-group">
              <label>History</label>
              <textarea
                name="history"
                value={formData.aboutUs.history}
                onChange={handleInputChange}
              />
            </div>
            {/* Add all other about us fields */}
          </div>
        );
      // Add cases for all other sections
      default:
        return null;
    }
  };

  return (
    <div className="generate-website-container">
      {!selectedTemplate ? (
        <>
          <h2 className="section-title">Select a School Website Template</h2>
          <div className="template-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${template.type}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="template-image"
                />
                <div className="template-content">
                  <h3>{template.name}</h3>
                  <p className="tagline">{template.tagline}</p>
                  <span
                    className={`price-tag ${
                      template.type === "free" ? "free" : ""
                    }`}
                  >
                    {template.type === "free" ? "FREE" : "PREMIUM"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : submitSuccess ? (
        <div className="success-message">
          <h2>Website Created Successfully!</h2>
          <p>Your school website has been generated and saved.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedTemplate(null);
              setSubmitSuccess(false);
              setFormData(schoolFormFields);
            }}
          >
            Create Another Website
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="website-form">
          <div className="form-header">
            <h2>
              Configuring: {selectedTemplate.name}
              <span className={`template-type ${selectedTemplate.type}`}>
                {selectedTemplate.type.toUpperCase()}
              </span>
            </h2>
            <p>Fill in all sections to generate your school website</p>
          </div>

          <div className="form-navigation">
            {Object.keys(schoolFormFields).map((section) => (
              <button
                key={section}
                type="button"
                className={`nav-btn ${
                  currentSection === section ? "active" : ""
                }`}
                onClick={() => setCurrentSection(section)}
              >
                {section
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </button>
            ))}
          </div>

          {renderFormSection()}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedTemplate(null)}
            >
              Back to Templates
            </button>
            <button
              type="submit"
              className={`btn ${
                selectedTemplate.type === "free" ? "btn-primary" : "btn-premium"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Generate Website"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GenerateWebsite;
