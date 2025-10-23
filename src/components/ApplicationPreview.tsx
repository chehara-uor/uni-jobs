import React, {useState, useEffect} from "react";
import styles from "@styles/application-preview.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BadgeCheck, School, BriefcaseBusiness, Trophy } from "lucide-react";
export interface Education {
  institution: string;
  period: string;
  certification: string;
  notes: string;
}
export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}
export interface Award {
  title: string;
  year: string;
  issuer: string;
}

export interface ApplicationData {
  name: string;
  email: string;
  ageRange: string;
  gender: string;
  content: string;
  location: string;
  languages: string[];
  experienceLevel: string;
  currentSalary: string;
  educationLevels: string[];
  skills: string;
  pythonExperience: string;
  sqlExperience: string;
  netSalary: string;
  employmentStatus: string;
  noticePeriod: string;
  availability: string;
  primaryReason: string;
  howDidYouFind: string;
  referredBy: string;
  linkedIn: string;
  github: string;
  facebook: string;
  twitter: string;
  instagram: string;
  educations: Education[];
  experiences: Experience[];
  awards: Award[];
  urls: string[];
}

export default function ApplicationPreview() {

  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [airtableJobId, setAirtableJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {

    const savedFile = sessionStorage.getItem("uploadedFile");
    const previousUrl = sessionStorage.getItem("tempUrl");
    const airtableJobId = sessionStorage.getItem("tableId");
    const applicationPayload = sessionStorage.getItem("applicationForm");
    const moreDetails = sessionStorage.getItem("applicationPayload");
    const resumeData = sessionStorage.getItem("tempResume");

    if (applicationPayload) {

      setApplicationData(JSON.parse(applicationPayload));
    }
    if (moreDetails) {
      setAboutData(JSON.parse(moreDetails));
      const questions = JSON.parse(moreDetails).questions || [];
    }
    if (savedFile) {
     //console.log("File data URL:", savedFile);
    }
    if (previousUrl) {
      setPreviousUrl(previousUrl);
    }
    if (airtableJobId) {
      setAirtableJobId(airtableJobId);
    }
  }, [])


  const transformToAirtable = (applicationData: any, airtableJobId: string | null) => {
    return {
        Resume_ID: applicationData.jobId, 
        candidate_job_title: [airtableJobId],
        candidate_name: applicationData.name,
        candidate_email: applicationData.email,
        candidate_resume: applicationData.candidate_resume,
        candidate_location: applicationData.location,
        resume_experience: applicationData.experienceLevel,
        resume_current_salary: applicationData.currentSalary,
        resume_expected_salary: applicationData.expectedSalary,
        resume_education_level: applicationData.educationLevels.join(", "),
        resume_language: applicationData.languages.join(", "),
        resume_content: applicationData.content,
        resume_skills: applicationData.skills,
        candidate_job_find: applicationData.howDidYouFind,
        resume_gender: applicationData.gender,
        resume_age: applicationData.ageRange,
        referred_by: applicationData.referredby,
        candidate_availability: applicationData.availability,
        candidate_notice_period: applicationData.noticePeriod,
        candidate_employment_status: applicationData.employmentStatus,
        candidate_reason: applicationData.primaryReason,
    };
  };

  const transformToWordpress = (applicationData: any) => {
    return {
      title: applicationData.name,
      content: applicationData.content,
      status: "publish",
      meta: {
        _applying_for_job_id: sessionStorage.getItem("jobId"),
        _candidate_name: applicationData.name,
        _candidate_email: applicationData.email,
        _candidate_job_find: applicationData.howDidYouFind,
        _candidate_location: applicationData.location,
        _candidate_expected_salary: applicationData.expectedSalary,
        _resume_skills: applicationData.skills,
        _resume_file: applicationData.candidate_resume,
      },
    };
  };

    const saveToAirtable = async (data: any) => {
      const response = await fetch("/api/airtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

      const result = await response.json();
      return result.id || null;
    };

    const saveToWordpress = async (data: any) => {
      const response = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

      const result = await response.json();
      return result.id || null;
  };

  const mailData = (name: string, id: string) => {
    return {
      applicant_name: name,
      job_title: sessionStorage.getItem("jobTitle") || "N/A",
      company_name: "Levein",
      dashboard_url: `"http://remoteweb.test/my-application?auth?=${id}"`,
      support_email: "support@remotejobsinasia.com",
      facebook_url: "https://www.facebook.com/lifeatlevein",
      linkedin_url: "https://www.linkedin.com/company/levein-group/"
    };
  };

  const automateMail = async (data: any) => {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

      await response.json();
      if (response.ok) {
        console.log("Email automation triggered successfully");
      }
  };

  const submitApplication = async () => {
    if (!applicationData) {
      toast.error("No application data found.");
      return;
    }
    if (!airtableJobId) {
      toast.error("No job selected to apply for.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Save to WordPress and get the ID (sequential - await ensures we have the WP id)
      const wpPayload = transformToWordpress(applicationData);
      const wpId = await saveToWordpress(wpPayload);
      if (!wpId) {
        throw new Error("Failed to save to WordPress");
      }
      //console.log("WordPress ID:", wpId);

      // 2) Build Airtable fields and include the WordPress ID we just received
      let fields: any = {};
      const finalData = transformToAirtable(applicationData, airtableJobId);
      fields = { ...fields, ...finalData };
      fields["Resume_ID"] = wpId;

      const questionsData = aboutData?.questions || [];
      questionsData.forEach((q: { title: string; answer: string }, index: number) => {
        fields[`admin_question_${index + 1}`] = q.title;
        const airtable_pattern = ["one", "two", "three", "four", "five"];
        fields[`answer_${airtable_pattern[index]}`] = q.answer;
      });

      const airtablePayload = {
        records: [
          {
            fields,
          },
        ],
      };

      console.log(JSON.stringify(airtablePayload, null, 2));

      // 3) Save to Airtable
      const airtableResultId = await saveToAirtable(airtablePayload);
      if (!airtableResultId) {
        throw new Error("Failed to save to Airtable");
      }
      automateMail(mailData(applicationData?.name, airtableResultId));
      toast.success("Application submitted successfully!");
      sessionStorage.setItem("resumeID", `#${wpId}`);
      sessionStorage.removeItem("applicationForm");
      sessionStorage.removeItem("applicationPayload");
      sessionStorage.removeItem("uploadedFile");
      sessionStorage.removeItem("tempUrl");
      sessionStorage.removeItem("tableId");
      sessionStorage.removeItem("jobId");
      sessionStorage.removeItem("jobTitle");
      // redirect after short delay so toast is visible
      setTimeout(() => (window.location.href = "/interview"), 500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting the application. Please try again.");
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <section
      className={`max-w-7xl mx-auto px-4 py-16 mt-[80px] ${styles.application_preview}`}
    >
      <header className={styles.application_preview__header}>
        {/* <button className={styles.btn__header}>← Edit resume</button> */}
        <h1 className={styles.btn__header__title}>Preview</h1>
        <button
          className={styles.btn__header}
          onClick={submitApplication}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Submitting..." : "Submit Resume →"}
        </button>

        <div className={styles.application_preview__meta}>
          <div className={styles.meta_item}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M8 0C5.243 0 3 2.243 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.757-2.243-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"
                fill="currentColor"
              />
            </svg>
            <span>{applicationData?.location}</span>
          </div>
          <div className={styles.meta_item}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M8 1a7 7 0 100 14A7 7 0 008 1zm.5 7.707V4.5a.5.5 0 10-1 0v4.207l3.646 2.182a.5.5 0 10.5-.866L8.5 8.707z"
                fill="currentColor"
              />
            </svg>
            <span>Member Since 2025</span>
          </div>
        </div>
      </header>

      <div className={styles.application_preview__profile}>
        <div className={styles.avatar}>
          <img
            src="https://img.icons8.com/?size=100&id=108652&format=png&color=000000"
            alt="Profile"
          />
        </div>

        <div className={styles.profile_info}>
          <div className={styles.social_links}>
            <a
              href="#"
              className={`${styles.social_link} ${styles.social_link__facebook}`}
              aria-label="Facebook"
            ></a>
            <a
              href="#"
              className={`${styles.social_link} ${styles.social_link__linkedin}`}
              aria-label="LinkedIn"
            ></a>
            <a
              href="#"
              className={`${styles.social_link} ${styles.social_link__instagram}`}
              aria-label="Instagram"
            ></a>
            <a
              href="#"
              className={`${styles.social_link} ${styles.social_link__github}`}
              aria-label="GitHub"
            ></a>
          </div>

          <h2 className={styles.profile_name}>{applicationData?.name}</h2>
          <p className={styles.profile_email}>{applicationData?.email}</p>
          <a href={previousUrl ? previousUrl : "/"}>
            <button className={styles.btn__download}>← Edit resume</button>
          </a>
        </div>
      </div>

      <nav className={`mb-8 ${styles.application_preview__tabs}`}>
        <ul>
          <li className="capitalize">
            <span>Current Status:</span>{" "}
            {applicationData?.employmentStatus}
          </li>
          <li>
            <span>Availability:</span> {applicationData?.noticePeriod}
          </li>
          <li>
            <span>Primary Reason:</span> {applicationData?.primaryReason}
          </li>
          <li>
            <span>Found Via:</span> {applicationData?.howDidYouFind}
          </li>
        </ul>
      </nav>

      <div className={styles.application_preview__content}>
        <div className={styles.content_left}>
          <section className={styles.section}>
            <h3>Candidates About</h3>
            <p>{applicationData?.content}</p>
          </section>

          <section className={styles.section}>
            <h3>Candidates Education</h3>
            <div className={styles.item}>
              <School />
              {aboutData?.educations.length > 0 && (
                <div className={styles.item}>
                  {aboutData?.educations.map((ed: any, i: number) => (
                    <div key={i} className={styles.card}>
                      <h4>
                        {ed.institution} ({ed.period})
                      </h4>
                      <p>
                        <strong>Certifications:</strong> {ed.certification}
                      </p>
                      {ed.notes && (
                        <p>
                          <strong>Notes:</strong> {ed.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Candidates Experience</h3>
            <div className={styles.item}>
              <BriefcaseBusiness />
              {aboutData?.experiences.length > 0 && (
                <div className={styles.item}>
                  {aboutData.experiences.map((ex: any, i: number) => (
                    <div key={i} className={styles.card}>
                      <h4>
                        {ex.role} at {ex.company} ({ex.period})
                      </h4>
                      <p>{ex.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h3>Candidates Awards</h3>
            <div className={styles.item}>
              <Trophy />
              {aboutData?.awards.map((aw: any, i: number) => (
                <div key={i} className={styles.card}>
                  <h4>
                    {aw.title} ({aw.year})
                  </h4>
                  <p>
                    <strong>Issuer:</strong> {aw.issuer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.content_right}>
          <div className={styles.overview_card}>
            <h3>Candidate Overview</h3>
            <ul>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Experience</strong>
                  <span>{applicationData?.experienceLevel}</span>
                </div>
              </li>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Age</strong>
                  <span>{applicationData?.ageRange}</span>
                </div>
              </li>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Current Salary</strong>
                  <span>{applicationData?.currentSalary}</span>
                </div>
              </li>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Gender</strong>
                  <span>{applicationData?.gender}</span>
                </div>
              </li>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Language</strong>
                  <span>{applicationData?.languages.join(", ")}</span>
                </div>
              </li>
              <li>
                <BadgeCheck />
                <div>
                  <strong>Education Level</strong>
                  <span>{applicationData?.educationLevels.join(", ")}</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
       <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="colored"
          />
    </section>
    
  );
}
