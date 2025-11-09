import React from 'react'
import Hero from "./Hero";
import Features from "./Features";
import ExploreJobs from "./ExploreJobs";
import GetAttraction from "./GetAttraction";
import AboutSection from "./AboutSection";
import OurRecruiters from "./OurRecruiters";
import Newsletter from "./Newsletter";

function HomePage() {
  return (
    <div className=" scroll-smooth">
        <Hero />
        <Features />
        <ExploreJobs />
        <GetAttraction />
        <AboutSection />
        <OurRecruiters />
        <Newsletter />
    </div>
  )
}

export default HomePage