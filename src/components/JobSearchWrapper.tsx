import React, { useState, useEffect } from "react";
import SearchFilterBar from "./SearchFilterBar";
import JobGrid from "@components/Jobs";
import type { JobData } from "@components/Jobs";
interface JobSearchWrapperProps {
  initialData: JobData[];
}

interface APIData {
  id: number;
  title: string;
  slug: string;
  company: string;
  image_url: string;
  job_expires: string;
  job_level: string[];
  job_listing_type: string[];
  job_experience: string[];
}

const JobSearchWrapper: React.FC<JobSearchWrapperProps> = ({ initialData }) => {
    const [jobData, setJobData] = useState<JobData[]>(initialData);
    const transformAPIData = (data: APIData[]) => {
    return data.map((job) => ({
        ...job,
        id: job.id,
        title: job.title,
        slug: job.slug,
        company: job.company,
        image_url: job.image_url,
        date: job.job_expires,
        level: job.job_level,
        type: job.job_listing_type,
        experience: job.job_experience,
    }));
    };
  const handleSearch = async (keyword: string, location: string, industry: string, type: string, level:string, experience:string) => {
    try {
      const res = await fetch(
        `https://unijobs.my.id/wp-json/remoteasia/v2/filters?keyword=${keyword}&location=${location}&industry=${industry}&type=${type}&level=${level}&experience=${experience}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: APIData[] = await res.json();
      const transformedData = transformAPIData(data);
      //console.log("Search results:", transformedData);
      setJobData(transformedData);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <>
      <section className="mt-[80px] hero px-4 py-20 text-center text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="hero-title mb-4">
            Find The Best Paid Internships in Sri Lanka
          </h1>
          <p className="hero-subtitle mb-8">
            Discover top internship opportunities from leading companies across Sri Lanka.
          </p>
        </div>
        <SearchFilterBar onSearch={handleSearch} />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-0">
            <a href="/browse-job-categories" className="btn btn-primary">
              All Categories
            </a>
            <a href="/login" className="btn btn-outline">
              Post a Job
            </a>
          </div>
        </div>
      </section>
      <JobGrid JobData={jobData} />
    </>
  );
};

export default JobSearchWrapper;
