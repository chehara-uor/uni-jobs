export interface JobData {
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string;
  image_url: string;
  job_expires: string;
  job_genders: string[];
  job_qualification: string[];
  job_level: string[];
  job_category: string[];
  job_industries: string[];
  job_salary: string[];
  job_specialsum: string[];
  job_listing_type: string[];
  job_experience: string[];
  job_description: string;
  job_requirements: string;
  job_benefits: string;
  airtable_resume_id: string;
};

export interface Categories{
    id: number;
    name: string;
    count: number;
    slug: string;
    svg: string | null;
}

// export interface JobCardData {
//   id: number;
//   title: string;
//   company: string;
//   image_url: string;
//   date: string;
//   level: string;
//   type: string;
//   experience: string[];
//   slug: string;
// }