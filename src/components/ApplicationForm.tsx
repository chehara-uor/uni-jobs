import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { type MultiValue } from "react-select";
import {
  Upload,
  Sparkle,
  BanknoteArrowUp,
  MessageCircleQuestionMark,
  User,
  MapPin,
  Mail,
  VenusAndMars,
  GraduationCap,
  BriefcaseBusiness,
  Medal,
  ClockFading,
  DollarSign,
  Languages,
  BookOpenText,
  CalendarCheck,
} from "lucide-react";
import styles from "@styles/application.module.scss";
import type { StylesConfig, GroupBase } from "react-select";

type Education = {
  id: number;
  institution: string;
  period: string;
  certification: string;
  notes: string;
};
type Experience = {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
};
type Award = { id: number; title: string; year: string; issuer: string };
type OptionType = {
  value: string;
  label: string;
};
interface ApplicationFormData {
  name: string;
  email: string;
  ageRange: string;
  gender: string;
  location: string;
  candidate_resume: string;
  currentSalary: string;
  expectedSalary: string;
  content: string;
  jobId: number | null;
  languages: string[];
  experienceLevel: string;
  educationLevels: string[];
  skills: string;
  noticePeriod: string;
  availability: string;
  primaryReason: string;
  howDidYouFind: string;
  referredby: string;
  employmentStatus?: string;
}

interface questionDataType {
  id: number;
  title: string;
  answer: string;
}
type Props = { jobTitle: string };

export default function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    email: "",
    ageRange: "",
    gender: "",
    location: "",
    candidate_resume: "",
    currentSalary: "",
    expectedSalary: "",
    content: "",
    jobId: null,
    languages: [],
    experienceLevel: "",
    educationLevels: [],
    skills: "",
    noticePeriod: "",
    availability: "",
    primaryReason: "",
    howDidYouFind: "",
    referredby: "",
    employmentStatus: "Yes",
  });
  // Dynamic sections
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);

  const [file, setFile] = useState<File | null>(null);

  const [jobTitle, setJobTitle] = useState<string>("None");
  const [jobId, setJobId] = useState<number | null>(null);
  const [isVisibleEdu, setIsVisibleEdu] = useState(true);
  const [isVisibleExp, setIsVisibleExp] = useState(true);
  const [isVisibleAward, setIsVisibleAward] = useState(true);
  const [hideMethod, setHideMethod] = useState("display");
  const [questionData, setQuestionData] = useState<questionDataType[]>([]);

  const languageOptions: OptionType[] = [
    { value: "English", label: "English" },
    { value: "Sinhala", label: "Sinhala" },
    { value: "Tamil", label: "Tamil" },
  ];

  const educationOptions: OptionType[] = [
    { value: "Advanced Level", label: "Advanced Level" },
    { value: "Pursuing a Degree", label: "Pursuing a Degree" },
    { value: "Bachelor’s Degree", label: "Bachelor's Degree" },
    {
      value: "Diploma / HND / CIMA / ACCA",
      label: "Diploma / HND / CIMA / ACCA",
    },
    { value: "MSc (Postgraduate)", label: "MSc (Postgraduate)" },
    { value: "MBBS", label: "MBBS" },
  ];

  useEffect(() => {
    const storedTitle = sessionStorage.getItem("jobTitle");
    const storedId = sessionStorage.getItem("jobId");
    if (storedTitle && storedId) {
      setJobTitle(storedTitle);
      setJobId(Number(storedId));
    }
  }, []);

  // Check Any Custom Questions Availability
  const checkCustomQuestions = async () => {
    if (jobId) {
      try {
        await axios
          .get(
            `https://unijobs.my.id/wp-json/remoteasia/v2/questions/?job-id=${jobId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const normalized = response.data.map((q: any) => ({
              ...q,
              answer: q.answer ?? "",
            }));
            setQuestionData(normalized);
            setFormData({ ...formData, jobId: jobId });
            //console.log("Custom questions:", normalized);
          });
      } catch (error) {
        console.error("Error sending mail:", error);
      }
    }
  };

  useEffect(() => {
    checkCustomQuestions();
  }, [jobId]);

  const getElementStyle = (isVisible: boolean): React.CSSProperties => {
    if (isVisible) {
      return {};
    }

    switch (hideMethod) {
      case "display":
        return { display: "none" } as React.CSSProperties;
      case "visibility":
        return { visibility: "hidden" as React.CSSProperties["visibility"] };
      case "opacity":
        return {
          opacity: 0,
          transition: "opacity 0.5s ease-in-out",
        } as React.CSSProperties;
      case "height":
        return {
          maxHeight: "0px",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        } as React.CSSProperties;
      default:
        return {};
    }
  };
  // Handlers for dynamic add/remove
  const addEducation = () => {
    setIsVisibleEdu(false);
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now(),
        institution: "",
        period: "",
        certification: "",
        notes: "",
      },
    ]);
  };
  const removeEducation = (id: number) => {
    setEducations((prev) => prev.filter((e) => e.id !== id));
    if (educations.length === 1) {
      setIsVisibleEdu(true);
    }
  };

  const addExperience = () => {
    setIsVisibleExp(false);
    setExperiences((prev) => [
      ...prev,
      { id: Date.now(), role: "", company: "", period: "", description: "" },
    ]);
  };
  const removeExperience = (id: number) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (experiences.length === 1) {
      setIsVisibleExp(true);
    }
  };

  const addAward = () => {
    setIsVisibleAward(false);
    setAwards((prev) => [
      ...prev,
      { id: Date.now(), title: "", year: "", issuer: "" },
    ]);
  };
  const removeAward = (id: number) => {
    setAwards((prev) => prev.filter((a) => a.id !== id));
    if (awards.length === 1) {
      setIsVisibleAward(true);
    }
  };

  // const [formData, setFormData] = useState(() => {
  // const saved = sessionStorage.getItem("applicationForm");
  //   return saved ? JSON.parse(saved) : { name: "", email: "" };
  // });

  useEffect(() => {
    sessionStorage.setItem("applicationForm", JSON.stringify(formData));
    // sessionStorage.setItem("questionsData", JSON.stringify(questionData));
  }, [formData, questionData]);

  const handleUpload = async () => {
    if (!file) return;

    const fileData = new FormData();
    fileData.append("file", file);
    const username = "induvara";
    const appPassword = "Kqe4 fED9 b1jr C2Fp ditw tiqX";
    const token = btoa(`${username}:${appPassword}`);

    const res = await fetch(
      "https://unijobs.my.id/wp-json/remoteasia/v1/upload-resume",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
        },
        body: fileData,
      }
    );

    const data = await res.json();
    if (data.success && data.file_url) {
      //console.log("Final uploaded file URL:", data.file_url);
      sessionStorage.setItem("resumeUrl", data.file_url);
      setFormData({ ...formData, candidate_resume: data.file_url });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [file]);

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      form: formData,
      questions: questionData,
      awards: awards,
      experiences: experiences,
      educations: educations,
    };
    if (payload) {
      window.location.href = "/application-preview";
    }

    sessionStorage.setItem("applicationPayload", JSON.stringify(payload));
    console.log("Submitting application payload:", payload);
    // TODO: integrate submission logic
  };

  const handleAnswerChange = (index: number, value: string) => {
    setQuestionData((prevData) =>
      prevData.map((q, i) => (i === index ? { ...q, answer: value } : q))
    );
  };

  const customStyles: StylesConfig<OptionType, true, GroupBase<OptionType>> = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #e81b39" : "1px solid #e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #e5e7eb" : "none",
      "&:hover": {
        border: "1px solid #e5e7eb",
      },
      minHeight: "40px",
      borderRadius: "8px",
      overflow: "hidden",
    }),
  };

  return (
    <form
      className={`max-w-7xl mx-auto px-4 ${styles.application_form}`}
      onSubmit={handleSubmit}
    >
      <div className="mb-6 p-4 bg-blue-100 rounded">
        Submit your resume below to apply for the job{" "}
        <strong>{jobTitle}</strong>.
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={styles.field}>
          <label htmlFor="name">
            <User size={16} className={styles.label_icon} />
            Your name<span className={styles.req}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            placeholder="John Doe"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">
            <Mail size={16} className={styles.label_icon} />
            Your email<span className={styles.req}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            placeholder="john@example.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="age">
            <CalendarCheck size={16} className={styles.label_icon} />
            Candidate Age<span className={styles.req}>*</span>
          </label>
          <select
            name="ageRange"
            required
            value={formData.ageRange}
            onChange={(e) =>
              setFormData({ ...formData, ageRange: e.target.value })
            }
          >
            <option value="">Choose an age...</option>
            <option>18-22 Years</option>
            <option>23-28 Years</option>
            <option>29-33 Years</option>
            <option>34-40 Years</option>
            <option>41-45 Years</option>
            <option>46-50 Years</option>
            <option>Above 50 Years</option>
            {/* … */}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="gender">
            <VenusAndMars size={16} className={styles.label_icon} />
            Gender<span className={styles.req}>*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            required
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select a gender...</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="location">
            <MapPin size={16} className={styles.label_icon} />
            Location<span className={styles.req}>*</span>
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            required
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          >
            <option value="">Select a location...</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Matale">Matale</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Galle">Galle</option>
            <option value="Matara">Matara</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Mannar">Mannar</option>
            <option value="Vavuniya">Vavuniya</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Ampara">Ampara</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Badulla">Badulla</option>
            <option value="Moneragala">Moneragala</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Kegalle">Kegalle</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="language">
            <Languages size={16} className={styles.label_icon} />
            Candidate Language<span className={styles.req}>*</span>
          </label>
          <Select<OptionType, true>
            isMulti
            styles={customStyles}
            options={languageOptions}
            required
            value={languageOptions.filter((o) =>
              formData.languages.includes(o.value)
            )}
            onChange={(selected: MultiValue<OptionType>) =>
              setFormData({
                ...formData,
                languages: selected.map((option) => option.value),
              })
            }
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="experience">
            <ClockFading size={16} className={styles.label_icon} />
            Candidate Experience<span className={styles.req}>*</span>
          </label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) =>
              setFormData({ ...formData, experienceLevel: e.target.value })
            }
            required
          >
            <option value="">Choose an experience...</option>
            <option value="0-1 Year">0-1 Year</option>
            <option value="1-3 Years">1-3 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="6-9 Years">6-9 Years</option>
            <option value="Over 10 Years">Over 10 Years</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="education">
            <BookOpenText size={16} className={styles.label_icon} />
            Candidate Education Level<span className={styles.req}>*</span>
          </label>
          <Select<OptionType, true>
            isMulti
            required
            styles={customStyles}
            options={educationOptions}
            value={educationOptions.filter((o) =>
              formData.educationLevels.includes(o.value)
            )}
            onChange={(selected: MultiValue<OptionType>) =>
              setFormData({
                ...formData,
                educationLevels: selected.map((option) => option.value),
              })
            }
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="expected">
            <DollarSign size={16} className={styles.label_icon} />
            Candidate Current Salary<span className={styles.req}>*</span>
          </label>
          <select
            name="currentSalary"
            value={formData.currentSalary}
            onChange={(e) =>
              setFormData({ ...formData, currentSalary: e.target.value })
            }
            required
          >
            <option value="">Choose an expected salary...</option>
            <option value="0 - 100,000 LKR">0 - 100,000 LKR</option>
            <option value="100,000 LKR to 300,000 LKR">
              100,000 LKR to 300,000 LKR
            </option>
            <option value="300,000 LKR to 500,000 LKR">
              300,000 LKR to 500,000 LKR
            </option>
            <option value="Above 500,000 LKR">Above 500,000 LKR</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="salary">
            <BanknoteArrowUp size={16} className={styles.label_icon} />
            Net LKR take home per month (numbers only)
            <span className={styles.req}>*</span>
          </label>
          <input
            type="number"
            name="expectedSalary"
            required
            placeholder="50000"
            onChange={(e) =>
              setFormData({ ...formData, expectedSalary: e.target.value })
            }
          />
        </div>

        <div className={`${styles.field} md:col-span-2`}>
          <label className="block text-sm font-medium mb-2">
            Upload Resume/CV <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <Upload className="w-6 h-6 text-gray-500 mb-2" />
            <p className="text-gray-500 text-sm">
              Click to upload or drag & drop
            </p>
            <p className="text-gray-400 text-xs">PDF, DOCX, or DOC</p>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </label>

          {file && (
            <p className="mt-2 text-sm text-green-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <div className={`md:col-span-2 ${styles.field}`}>
          <label>Skills (optional)</label>
          <input
            type="text"
            value={formData.skills}     
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
            placeholder="Comma separated, max 6"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="md:col-span-2">
          <label>
            Resume Content<span>*</span>
          </label>
          <textarea
            name="content"
            rows={6}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-y
                       text-gray-900 placeholder-gray-500
                       sm:text-base"
          ></textarea>
        </div>
      </div>

      {/* Questions sections */}
      {questionData && (
        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-6">
          <h3 className="col-span-1 md:col-span-2 text-[#e81b39]">
            <strong>Please answer the following questions:</strong>
          </h3>
          {questionData.map((question, index) => (
            <div key={index} className={styles.field}>
              <label htmlFor={`question-${index}`}>
                <MessageCircleQuestionMark
                  size={16}
                  className={styles.label_icon}
                />
                {question.title}
                <span className={styles.req}>*</span>
              </label>
              <input
                id={`question-${index}`}
                type="text"
                required
                value={question.answer ?? ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer Here...`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Common Q sections */}

      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-6">
        <h3 className="col-span-1 md:col-span-2 text-[#e81b39]">
          <strong>Hold on!..,💡</strong>
        </h3>
        <div className={styles.field}>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Sparkle size={16} className={styles.label_icon} />
            Are you employed at present?
          </label>

          <div className="flex items-center gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="employmentStatus"
                value="Yes"
                defaultChecked
                onChange={(e) =>
                  setFormData({ ...formData, employmentStatus: e.target.value })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="employmentStatus"
                value="No"
                onChange={(e) =>
                  setFormData({ ...formData, employmentStatus: e.target.value })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="expected">
            <Sparkle size={16} className={styles.label_icon} />
            Notice Period<span className={styles.req}></span>
          </label>
          <select
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={(e) =>
              setFormData({ ...formData, noticePeriod: e.target.value })
            }
            required
          >
            <option value="">Choose an option...</option>
            <option value="Less than 1 week">Less than 1 Week</option>
            <option value="Less than 1 month">Less than 1 Month</option>
            <option value="1-2 Months">1 - 2 Months</option>
            <option value="2-3 Months">2 - 3 Months</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="availability">
            <Sparkle size={16} className={styles.label_icon} />
            Availability for this job<span className={styles.req}></span>
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={(e) =>
              setFormData({ ...formData, availability: e.target.value })
            }
            required
          >
            <option value="">Choose an option...</option>
            <option value="Full time">Full Time</option>
            <option value="Part time">Part Time</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="primaryReason">
            <Sparkle size={16} className={styles.label_icon} />
            Primary Reason to look for a new Job?
            <span className={styles.req}></span>
          </label>
          <select
            name="primaryReason"
            value={formData.primaryReason}
            onChange={(e) =>
              setFormData({ ...formData, primaryReason: e.target.value })
            }
            required
          >
            <option value="">Choose an option...</option>
            <option value="Better Learning">Better Learning</option>
            <option value="Better Management">Better Management</option>
            <option value="Better Pay">Better Pay</option>
            <option value="Career Change">Career Change</option>
            <option value="Contract Ended">Contract Ended</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="howDidYouFind">
            <Sparkle size={16} className={styles.label_icon} />
            How did you find this job?<span className={styles.req}></span>
          </label>
          <select
            name="howDidYouFind"
            value={formData.howDidYouFind}
            onChange={(e) =>
              setFormData({ ...formData, howDidYouFind: e.target.value })
            }
            required
          >
            <option value="">Choose an option...</option>
            <option value="Google search">Google search</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
            <option value="TopJobs.lk">TopJobs.lk</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Friend">Friend</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="Referredby">
            <Sparkle size={16} className={styles.label_icon} />
            Referred By? (optional)<span className={styles.req}></span>
          </label>
          <input
            type="text"
            name="referredby"
            value={formData.referredby}
            placeholder="John Doe"
            onChange={(e) =>
              setFormData({ ...formData, referredby: e.target.value })
            }
          />
        </div>
      </div>

      {/* Dynamic sections */}

      <div className={styles.dynamic_section}>
        <div className={styles.card_header}>
          <h3>Education</h3>
          <button
            type="button"
            onClick={addEducation}
            className={styles.add_btn}
          >
            + Add Education
          </button>
        </div>
        <div
          className={styles.card_placeholder}
          style={getElementStyle(isVisibleEdu)}
        >
          <GraduationCap size={75} color="#6b7280" />
          <p className="text-gray-500 text-sm">
            Add your educational background, including institutions, periods,
            certifications, and any additional notes.
          </p>
        </div>
        {educations.map((ed, i) => (
          <div key={ed.id} className={styles.dynamic_card}>
            <h4>
              Education {i + 1}{" "}
              <button
                type="button"
                onClick={() => removeEducation(ed.id)}
                className={`${styles.add_btn} ml-4`}
              >
                Remove
              </button>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={styles.field}>
                <label>Institution</label>
                <input
                  value={ed.institution}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducations((prev) =>
                      prev.map((x) =>
                        x.id === ed.id ? { ...x, institution: val } : x
                      )
                    );
                  }}
                  placeholder="University name"
                />
              </div>
              <div className={styles.field}>
                <label>Start/End Date</label>
                <input
                  value={ed.period}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducations((prev) =>
                      prev.map((x) =>
                        x.id === ed.id ? { ...x, period: val } : x
                      )
                    );
                  }}
                  placeholder="e.g. 2018 - 2022"
                />
              </div>
              <div className={styles.field}>
                <label>Certification(s)</label>
                <input
                  value={ed.certification}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducations((prev) =>
                      prev.map((x) =>
                        x.id === ed.id ? { ...x, certification: val } : x
                      )
                    );
                  }}
                  placeholder="Degree, certifications, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label>Notes (optional)</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-y
                       text-gray-900 placeholder-gray-500
                       sm:text-base"
                  value={ed.notes}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducations((prev) =>
                      prev.map((x) =>
                        x.id === ed.id ? { ...x, notes: val } : x
                      )
                    );
                  }}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Similar blocks for Experience and Awards */}
      <div className={styles.dynamic_section}>
        <div className={styles.card_header}>
          <h3>Experience</h3>
          <button
            type="button"
            onClick={addExperience}
            className={styles.add_btn}
          >
            + Add Experience
          </button>
        </div>
        <div
          className={styles.card_placeholder}
          style={getElementStyle(isVisibleExp)}
        >
          <BriefcaseBusiness size={75} color="#6b7280" />
          <p className="text-gray-500 text-sm">
            Add your work experience, including roles, companies, periods, and
            descriptions.
          </p>
        </div>
        {experiences.map((exp, i) => (
          <div key={exp.id} className={styles.dynamic_card}>
            <h4>
              Experience {i + 1}{" "}
              <button
                type="button"
                className={`${styles.add_btn} ml-4`}
                onClick={() => removeExperience(exp.id)}
              >
                Remove
              </button>
            </h4>
            {/* fields: role, company, period, description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={styles.field}>
                <label>Role</label>
                <input
                  value={exp.role}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExperiences((prev) =>
                      prev.map((x) =>
                        x.id === exp.id ? { ...x, role: val } : x
                      )
                    );
                  }}
                  placeholder="Job title"
                />
              </div>
              <div className={styles.field}>
                <label>Company</label>
                <input
                  value={exp.company}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExperiences((prev) =>
                      prev.map((x) =>
                        x.id === exp.id ? { ...x, company: val } : x
                      )
                    );
                  }}
                  placeholder="Company name"
                />
              </div>
              <div className={styles.field}>
                <label>Period</label>
                <input
                  value={exp.period}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExperiences((prev) =>
                      prev.map((x) =>
                        x.id === exp.id ? { ...x, period: val } : x
                      )
                    );
                  }}
                  placeholder="e.g. Jan 2020 - Dec 2022"
                />
              </div>
              <div className="md:col-span-2">
                <label>Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-y
                       text-gray-900 placeholder-gray-500
                       sm:text-base"
                  value={exp.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExperiences((prev) =>
                      prev.map((x) =>
                        x.id === exp.id ? { ...x, description: val } : x
                      )
                    );
                  }}
                  placeholder="Describe your responsibilities..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dynamic_section}>
        <div className={styles.card_header}>
          <h3>Awards</h3>
          <button
            type="button"
            onClick={addAward}
            className={`${styles.add_btn} ml-4`}
          >
            + Add Awards
          </button>
        </div>
        <div
          className={styles.card_placeholder}
          style={getElementStyle(isVisibleAward)}
        >
          <Medal size={75} color="#6b7280" />
          <p className="text-gray-500 text-sm">
            Add your awards and recognitions, including titles, years, and
            issuing organizations.
          </p>
        </div>
        {awards.map((aw, i) => (
          <div key={aw.id} className={styles.dynamic_card}>
            <h4>
              Award {i + 1}{" "}
              <button type="button" onClick={() => removeAward(aw.id)}>
                Remove
              </button>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={styles.field}>
                <label>Title</label>
                <input
                  value={aw.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAwards((prev) =>
                      prev.map((x) =>
                        x.id === aw.id ? { ...x, title: val } : x
                      )
                    );
                  }}
                  placeholder="Award name"
                />
              </div>
              <div className={styles.field}>
                <label>Year</label>
                <input
                  value={aw.year}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAwards((prev) =>
                      prev.map((x) =>
                        x.id === aw.id ? { ...x, year: val } : x
                      )
                    );
                  }}
                  placeholder="e.g. 2023"
                />
              </div>
              <div className={styles.field}>
                <label>Issuer</label>
                <input
                  value={aw.issuer}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAwards((prev) =>
                      prev.map((x) =>
                        x.id === aw.id ? { ...x, issuer: val } : x
                      )
                    );
                  }}
                  placeholder="Organization"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className={styles.btn_submit}>
        Preview →
      </button>
    </form>
  );
}
