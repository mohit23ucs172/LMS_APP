import React from 'react'
import Hero from '../../components/students/Hero.jsx'
import Company from '../../components/students/Company.jsx'
import CoursesSection from '../../components/students/CoursesSection.jsx';
import TestimonialsSection from '../../components/students/TestimonialsSection.jsx';
import CallToAction from '../../components/students/CallToAction.jsx';
import Footer from '../../components/students/Footer.jsx';
const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
    <Hero />
    <Company />
    <CoursesSection/>
    <TestimonialsSection />
    <CallToAction />
    <Footer />
    </div>
  )
}

export default Home