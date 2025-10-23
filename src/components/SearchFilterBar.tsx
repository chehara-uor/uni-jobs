import React, { useState, useEffect } from "react";

interface SearchFilterBarProps {
    onSearch: (keyword: string, location: string, industry: string, type: string, level: string, experience: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [experience, setExperience] = useState('');
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // Reset visibility based on screen size
      if (desktop) {
        setShowMobileDrawer(false);
      } else {
        setShowAdvanced(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAdvancedFilters = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDesktop) {
      setShowAdvanced((prev) => !prev);
    } else {
      setShowMobileDrawer(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location, industry, type ,level, experience);
  };

  const handleReset = () => {
        setKeyword('');
        setLocation('');
        setIndustry('');
        setType('');
        setLevel('');
        setExperience('');
        setTimeout(() => {
            onSearch(keyword, location, industry, type ,level, experience);
        }, 300);

    };

     const handleMobileFilters = () => {
      setShowMobileDrawer(false);
      onSearch(keyword, location, industry, type, level, experience);
    };

  return (
    <section className="filter-bar py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-md overflow-hidden filter-wrapper">
          <form className="flex flex-col lg:flex-row gap-4 items-center p-4" onSubmit={handleSubmit}>
            {/* Keyword + Location */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex-1 min-w-0">
                <label className="sr-only" htmlFor="keyword">Job title or keywords</label>
                <div className="input-group">
                  <span className="input-icon">
                    <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="M16 16l4 4"></path></svg>
                  </span>
                  <input id="keyword" type="text" placeholder="Job title or keywords" className="filter-input w-full" value={keyword}  onChange={(e) => setKeyword(e.target.value)}/>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <label className="sr-only" htmlFor="location">Location</label>
                <div className="input-group">
                  <span className="input-icon">
                    <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
                  </span>
                  <input id="location" type="text" placeholder="Anywhere" className="filter-input w-full"  value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start lg:items-center">
              <div className="flex gap-2 flex-wrap">
                <button type="button" className="btn btn-secondary" onClick={toggleAdvancedFilters}>
                  Filters {showAdvanced ? <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" x="0" y="0" viewBox="0 0 24 24" ><g><path d="M17.293 15.207 12 9.914l-5.293 5.293-1.414-1.414L10.586 8.5a2 2 0 0 1 2.828 0l5.293 5.293Z" data-name="01 align center" fill="#000000" opacity="1" data-original="#000000" ></path></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" x="0" y="0" viewBox="0 0 24 24"><g><path d="M12 15.5a1.993 1.993 0 0 1-1.414-.585L5.293 9.621l1.414-1.414L12 13.5l5.293-5.293 1.414 1.414-5.293 5.293A1.993 1.993 0 0 1 12 15.5Z" data-name="01 align center" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>} 
                </button>
                <button type="submit" className="btn btn-primary">Search</button>
                <button type="reset" className="text-sm p-2 text-orange-600 cursor-pointer clear_button" onClick={handleReset} >Clear</button>
              </div>
            </div>

            {/* Advanced Filters - Desktop */}
            {isDesktop && showAdvanced && (
              <div className="advanced-filters w-full mt-4 lg:flex flex-wrap gap-4">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold mb-1" htmlFor="department">Department / Specialism</label>
                  <select id="department" className="filter-select w-full" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="">All Departments</option>
                    <option value="administration-and-secretarial">Administration and Secretarial</option>
                    <option value="finance">Finance</option>
                    <option value="hr">HR</option>
                    <option value="information-technology">Information Technology</option>
                    <option value="medical">Medical</option>
                    <option value="projects">Projects</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold mb-1" htmlFor="experience">Experience Level</label>
                  <select id="experience" className="filter-select w-full" value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="">Any</option>
                    <option value="intern">Intern</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold mb-1" htmlFor="experience">Experience Level</label>
                  <select id="experience" className="filter-select w-full" value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="">Any</option>
                    <option value="1-2-years">0-2 years</option>
                    <option value="2-4-years">2-4 years</option>
                    <option value="5-10-years">5-10 years</option>
                    <option value="10-years">10+ years</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold mb-1" htmlFor="contract">Contract Type</label>
                  <select id="contract" className="filter-select w-full" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Any</option>
                    <option value="full-time">Contract - Full time</option>
                    <option value="part-time">Contract - Part time</option>
                    <option value="internship">Internship</option>
                    <option value="permanent-full-time">Permanent - Full time</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
            )}
          </form>

          {/* Mobile Drawer */}
          {showMobileDrawer && (
            <div
              className="mobile-drawer fixed inset-0 bg-black/40 backdrop-blur-sm z-30 mt-[85px]"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains("mobile-drawer")) {
                    setShowMobileDrawer(false);
                }
                }}
            >
              <div className="drawer-panel bg-white w-80 h-full p-6 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowMobileDrawer(false)} aria-label="Close filters">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" htmlFor="mobile-department">Department / Specialism</label>
                    <select id="mobile-department" className="filter-select w-full" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                        <option value="">All Departments</option>
                        <option value="administration-and-secretarial">Administration and Secretarial</option>
                        <option value="finance">Finance</option>
                        <option value="hr">HR</option>
                        <option value="information-technology">Information Technology</option>
                        <option value="medical">Medical</option>
                        <option value="projects">Projects</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" htmlFor="mobile-experience">Experience Level</label>
                    <select id="mobile-experience" className="filter-select w-full" value={experience} onChange={(e) => setExperience(e.target.value)}>
                        <option value="">Any</option>
                        <option value="1-2-years">0-2 years</option>
                        <option value="2-4-years">2-4 years</option>
                        <option value="5-10-years">5-10 years</option>
                        <option value="10-years">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" htmlFor="mobile-contract">Contract Type</label>
                    <select id="mobile-contract" className="filter-select w-full" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Any</option>
                        <option value="intern">Intern</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" htmlFor="mobile-work-mode">Work Mode</label>
                    <select id="mobile-work-mode" className="filter-select w-full">
                      <option value="">Any</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </select>
                  </div>
                  <div>
                    <button className="btn btn-primary w-full" onClick={handleMobileFilters}>Apply Filters</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchFilterBar;
