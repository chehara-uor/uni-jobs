import React, { useEffect } from "react";
import "@styles/postjobs.module.scss";
import { useState, useRef } from "react";

type FormData = {
  jobTitle: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions: string;
  jobSalary: string;
  GrossSalary: string;
  jobLevel: string;
  jobExperience: string;
  jobDescription: string;
  jobTags: string;
  jobGender: string;
  closingDate: string;
  applicationEmail: string;
  companyName: string;
  companyTagline: string;
  featured_media: number;
  companyLocation: string;
  companyMobile: string;
  companyWebsite: string;
  companyCategory: string;
  companyTeamSize: string;
  companyLinkedIn: string;
  companyTwitter: string;
  companyDescription: string;
  jobIndustry: string;
  jobQualification: string;
};

type ApiPayload = {
  title: string;
  content: string;
  status: string;
  featured_media: number;
  meta: {
    _job_location: string;
    _application: string;
    _company_name: string;
    _company_website: string;
    _company_linkedin: string;
    _company_tagline: string;
    _company_twitter: string;
    _job_expires: string;
    job_salary: string;
    _featured: string;
    _filled: string;
  };
  "job-types": number[];
  "job-categories": number[];
  job_listing_gender: number[];
  job_listing_salary: number[];
  job_listing_experience: number[];
  job_listing_industry: number[];
  job_listing_qualification: number[];
  job_listing_career_level: number[];
};

export default function PostJobForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    if (userName) {
      setCurrentUser(userName);
    }
  }, []);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobLocation: "",
    jobType: "",
    jobTypeOptions: "",
    jobSalary: "",
    GrossSalary: "",
    jobLevel: "",
    jobExperience: "",
    jobDescription: "",
    jobTags: "",
    jobGender: "",
    closingDate: "",
    applicationEmail: "",
    companyName: "",
    companyTagline: "",
    companyLocation: "",
    companyMobile: "",
    companyWebsite: "",
    featured_media: 0,
    companyCategory: "",
    companyTeamSize: "",
    companyLinkedIn: "",
    companyTwitter: "",
    companyDescription: "",
    jobIndustry: "",
    jobQualification: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      const maxBytes = 2 * 1024 * 1024; // 2MB
      const allowed = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];
      if (file.size > maxBytes) {
        alert("Logo must be under 2 MB.");
        e.target.value = ""; // reset the input
        return;
      }
      if (!allowed.includes(file.type)) {
        alert("Please upload a valid image file.");
        e.target.value = "";
        return;
      }
    }
    setFile(file);
  };

  function transformFormData(formData: FormData): ApiPayload {
    return {
      title: formData.jobTitle,
      content: `<p>${formData.jobDescription}</p>`,
      status: "draft",
      featured_media: formData.featured_media,
      meta: {
        _job_location: formData.jobLocation,
        _application: formData.applicationEmail,
        _company_name: formData.companyName,
        _company_website: formData.companyWebsite,
        _company_linkedin: formData.companyLinkedIn,
        _company_tagline: formData.companyTagline,
        _company_twitter: formData.companyTwitter,
        _job_expires: formData.closingDate,
        job_salary: formData.GrossSalary,
        _featured: "0",
        _filled: "0",
      },
      "job-types": formData.jobType ? [parseInt(formData.jobType, 10)] : [],
      "job-categories": formData.jobTypeOptions
        ? [parseInt(formData.jobTypeOptions, 10)]
        : [],
      job_listing_gender: formData.jobGender
        ? [parseInt(formData.jobGender, 10)]
        : [],
      job_listing_salary: formData.jobSalary
        ? [parseInt(formData.jobSalary, 10)]
        : [],
      job_listing_experience: formData.jobExperience
        ? [parseInt(formData.jobExperience, 10)]
        : [],
      job_listing_industry: formData.jobIndustry
        ? [parseInt(formData.jobIndustry, 10)]
        : [],
      job_listing_qualification: formData.jobQualification
        ? [parseInt(formData.jobQualification, 10)]
        : [],
      job_listing_career_level: formData.jobLevel
        ? [parseInt(formData.jobLevel, 10)]
        : [],
    };
  }

  const saveJobToWordpress = async (payload: ApiPayload) => {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save job");
    } else {
      console.log("Job created successfully:", await response.json());
    }
  };

  const handleJobSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = transformFormData(formData);

    console.log(payload);
    saveJobToWordpress(payload);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-[80px] py-16">
      <div className="mb-6 p-4 bg-blue-100 rounded">
        You are currently signed in as <strong>{currentUser}</strong>.
      </div>

      <form className="space-y-6" onSubmit={handleJobSubmit}>
        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block mb-1 font-semibold">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            required
            placeholder="Enter job title"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>

        {/* Location, Job type, Salary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location" className="block mb-1 font-semibold">
              Location <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder='e.g. "London"'
              className="w-full border border-gray-300 rounded px-3 py-2"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave this blank if the location is not important
            </p>
          </div>

          <div>
            <label htmlFor="jobType" className="block mb-1 font-semibold">
              Job Type
            </label>
            <select
              name="jobType"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobType}
              required
              onChange={handleChange}
            >
              <option value="">Select job type</option>
              <option value="2">Contract - Full time</option>
              <option value="3">Contract - Part time</option>
              <option value="5">Freelance</option>
              <option value="6">Internship</option>
              <option value="4">Permanent - Full time</option>
            </select>
          </div>

          <div>
            <label htmlFor="jobSalary" className="block mb-1 font-semibold">
              Job Salary <span className="text-gray-400">(optional)</span>
            </label>
            <select
              name="jobSalary"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobSalary}
              onChange={handleChange}
            >
              <option value="">Choose a salary...</option>
              <option value="191">0 - 100,000 LKR</option>
              <option value="192">100,000 LKR - 200,000 LKR</option>
              <option value="702">200,000 LKR - 300,000 LKR</option>
              <option value="703">300,000 LKR - 400,000 LKR</option>
              <option value="218">400,000 LKR - 500,000 LKR</option>
              <option value="219">Above 500,000 LKR</option>
            </select>
          </div>
        </div>

        {/* Career level, Experience, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="careerLevel" className="block mb-1 font-semibold">
              Job Career Level <span className="text-gray-400">(optional)</span>
            </label>
            <select
              value={formData.jobLevel}
              className="w-full border border-gray-300 rounded px-3 py-2"
              name="jobLevel"
              onChange={handleChange}
            >
              <option value="">Select career level</option>
              <option value="128">Intern</option>
              <option value="127">Senior</option>
              <option value="100">Lead</option>
              <option value="6945">Executive</option>
            </select>
          </div>

          <div>
            <label htmlFor="experience" className="block mb-1 font-semibold">
              Job Experience <span className="text-gray-400">(optional)</span>
            </label>
            <select
              name="jobExperience"
              value={formData.jobExperience}
              className="w-full border border-gray-300 rounded px-3 py-2"
              onChange={handleChange}
            >
              <option value="">Select job experience</option>
              <option value="130">0-2 years</option>
              <option value="129">2-4 years</option>
              <option value="58">5-10 years</option>
              <option value="248">10+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="block mb-1 font-semibold">
              Job Gender <span className="text-gray-400">(optional)</span>
            </label>
            <select
              name="jobGender"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobGender}
              onChange={handleChange}
            >
              <option value="">Choose a Gender</option>
              <option value="101">Male</option>
              <option value="75">Female</option>
            </select>
          </div>
        </div>

        {/* Industry, Qualification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobIndustry" className="block mb-1 font-semibold">
              Job Industry <span className="text-gray-400">(optional)</span>
            </label>
            <select
              name="jobIndustry"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobIndustry}
              onChange={handleChange}
            >
              <option value="">Choose a Job Industry</option>
              <option value="96">Information Technology</option>
              <option value="137">Marketing</option>
              <option value="138">Finance</option>
              <option value="139">HR</option>
              <option value="562">Projects</option>
              <option value="561">Sales</option>
              <option value="560">Administration and Secretarial</option>
              <option value="563">Customer Service</option>
              <option value="7736">Medical</option>
            </select>
          </div>

          <div>
            <label htmlFor="qualification" className="block mb-1 font-semibold">
              Job Qualification{" "}
              <span className="text-gray-400">(optional)</span>
            </label>
            <select
              name="jobQualification"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobQualification}
              onChange={handleChange}
            >
              <option value="">Choose a Job Qualification</option>
              <option value="60">Bachelor's Degree</option>
              <option value="208">Master's Degree</option>
              <option value="136">Diploma / HND / CIMA / ACCA</option>
              <option value="7741">MBBS</option>
              <option value="135">Pursuing a Degree</option>
            </select>
          </div>
        </div>

        {/* Job Tags */}
        <div>
          <label htmlFor="jobTags" className="block mb-1 font-semibold">
            Job tags <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="jobTags"
            placeholder="e.g. PHP, Social Media, Management"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.jobTags}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-400 mt-1">
            Comma separate tags, such as required skills or technologies, for
            this job.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expect job type */}
          <div>
            <label htmlFor="expectJobType" className="block mb-1 font-semibold">
              Working Type
            </label>
            <select
              name="jobTypeOptions"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.jobTypeOptions}
              onChange={handleChange}
            >
              <option value="">Choose a Working Type</option>
              <option value="85">On-site</option>
              <option value="87">Remote</option>
              <option value="131">Hybrid</option>
            </select>
          </div>

          {/* Closing Date */}
          <div>
            <label htmlFor="closingDate" className="block mb-1 font-semibold">
              Closing date <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="date"
              name="closingDate"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.closingDate}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-400 mt-1">
              Deadline for new applicants.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            name="jobDescription"
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
            value={formData.jobDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Application Email/URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="applicationEmail"
              className="block mb-1 font-semibold"
            >
              Application email/URL
            </label>
            <input
              type="email"
              name="applicationEmail"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.applicationEmail}
              onChange={handleChange}
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block mb-1 font-semibold">
              Gross Salary <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="GrossSalary"
              placeholder="e.g. 20000"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.GrossSalary}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="companyName" className="block mb-1 font-semibold">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="companyTagline"
              className="block mb-1 font-semibold"
            >
              Company Tagline <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="companyTagline"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyTagline}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="companyLocation"
              className="block mb-1 font-semibold"
            >
              Company Location
            </label>
            <input
              type="text"
              name="companyLocation"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyLocation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company Mobile, Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
            <label htmlFor="companyMobile" className="block mb-1 font-semibold">
              Company Mobile
            </label>
            <input
              type="tel"
              id="companyMobile"
              className="w-full border border-gray-300 rounded px-3 py-2"
              ref={companyMobile}
              onChange={() => setFormData({ ...formData, companyMobile: companyMobile.current?.value || "" })}
            />
          </div> */}
          <div>
            <label
              htmlFor="companyWebsite"
              className="block mb-1 font-semibold"
            >
              Company Website <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              name="companyWebsite"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyWebsite}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company Logo */}
        <div>
          <label htmlFor="companyLogo" className="block mb-1 font-semibold">
            Company Logo <span className="text-gray-400">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="companyLogo"
            className="w-full"
            accept="image/*"
            onChange={handleLogoChange} // no value prop here
          />
          <p className="text-xs text-gray-400 mt-1">Maximum file size: 2 MB.</p>
        </div>

        {/* Company Category, Team Size, LinkedIn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="companyCategory"
              className="block mb-1 font-semibold"
            >
              Select Your Company Category
            </label>
            <select
              name="companyCategory"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyCategory}
              onChange={handleChange}
            >
              <option value="">Choose an option...</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div>
            <label
              htmlFor="companyTeamSize"
              className="block mb-1 font-semibold"
            >
              Company Team Size
            </label>
            <select
              name="companyTeamSize"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyTeamSize}
              onChange={handleChange}
            >
              <option value="">Choose an option...</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="companyLinkedIn"
              className="block mb-1 font-semibold"
            >
              Company LinkedIn <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              name="companyLinkedIn"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.companyLinkedIn}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company Twitter */}
        <div>
          <label htmlFor="companyTwitter" className="block mb-1 font-semibold">
            Company Twitter <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="companyTwitter"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.companyTwitter}
            onChange={handleChange}
          />
        </div>

        {/* Company Description */}
        <div>
          <label
            htmlFor="companyDescription"
            className="block mb-1 font-semibold"
          >
            Company Description
          </label>
          <textarea
            name="companyDescription"
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
            value={formData.companyDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 border border-[#e81b39] text-[#e81b39] rounded hover:bg-[#fce4e4] transition"
          >
            Preview
          </button>
          {/* <button
            type="submit"
            className="px-6 py-2 bg-[#e81b39] text-white rounded hover:bg-[#c72a3b]-600 transition"
          >
            Save Draft
          </button> */}
        </div>
      </form>
    </section>
  );
}
