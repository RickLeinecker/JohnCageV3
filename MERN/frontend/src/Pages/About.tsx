import React, {useState} from 'react';
import MeetOurTeamV1 from '../Components/MeetOurTeamV1';
import MeetOurTeamV2 from '../Components/MeetOurTeamV2';
import MeetOurTeamV3 from '../Components/MeetOurTeamV3';
import '../Style/AboutUs.css';

function AboutPage(){
    const [selectedComponent, setSelectedComponent] = useState<string | null>('MeetOurTeamV3'); 
    // Set 'MeetOurTeamV3' as the default value


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
                    <button
                        className={selectedComponent === 'MeetOurTeamV3' ? 'selected' : ''}
                        onClick={() => goToTeam('MeetOurTeamV3')}>
                    Show Version 3
                    </button>
                    <button
                        className={selectedComponent === 'MeetOurTeamV2' ? 'selected' : ''}
                        onClick={() => goToTeam('MeetOurTeamV2')}>
                    Show Version 2
                    </button>
                    <button
                        className={selectedComponent === 'MeetOurTeamV1' ? 'selected' : ''}
                        onClick={() => goToTeam('MeetOurTeamV1')}>
                        Show Version 1
                    </button>
                </div>
                <div className='about-devs-container'>
                    {selectedComponent === 'MeetOurTeamV3' && <MeetOurTeamV3/>}
                    {selectedComponent === 'MeetOurTeamV2' && <MeetOurTeamV2/>}
                    {selectedComponent === 'MeetOurTeamV1' && <MeetOurTeamV1/>}
                </div>
            </div>
       </div>
    )
}

export default AboutPage;