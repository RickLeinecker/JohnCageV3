import React, {useState} from 'react';
import MeetOurTeam from '../Components/MeetOurTeam';
import MeetOurTeam2 from '../Components/MeetOurTeam2';
import MeetOurTeam3 from '../Components/MeetOurTeam3';
import '../Style/AboutUs.css';

function AboutPage(){
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

    const goToTeam = (component: string) => {
      setSelectedComponent(component);
    };
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
                <div className='button-container'>
                    <button onClick ={() =>goToTeam('MeetOurTeam')}>Show Version 1</button>
                    <button onClick ={() =>goToTeam('MeetOurTeam2')}>Show Version 2</button>
                    <button onClick ={() =>goToTeam('MeetOurTeam3')}>Show Version 3</button>
                </div>
                <div className='about-devs-container'>
                    {selectedComponent === 'MeetOurTeam' && <MeetOurTeam/>}
                    {selectedComponent === 'MeetOurTeam2' && <MeetOurTeam2/>}
                    {selectedComponent === 'MeetOurTeam3' && <MeetOurTeam3/>}
                </div>
            </div>
       </div>
    )
}

export default AboutPage;