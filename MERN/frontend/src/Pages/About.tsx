import React from 'react';
import MeetOurTeam from '../Components/MeetOurTeam';
import '../Style/AboutUs.css';

function AboutPage(){
    return(
       <div className='about'>
            <div className='about-layout'>
                <div className='about-us-container'>
                    <h1 id='about-us-header'>About Us</h1>
                    <p className='about-us-body'>
                        Hello, we are a group of students from the University of Central Florida.
                        This is the third iteration of the John Cage Tribute Senior Design Project.
                        With our project we wanted to encapsulate John Cage's philosophy that anything
                        can be music. We worked closely with our Sponsor Richard Leinecker to develop 
                        an application that can be used by anyone to make their own unique piece of music. 
                    </p>
                </div>
                <div className='about-devs-container'>
                    <MeetOurTeam/>
                </div>
            </div>
       </div>
    )
}

export default AboutPage;