import React from 'react';
import imageToUse from '../Images/JohnCage.png'
import '../Style/AboutUs.css';

export default function MeetOurTeam2(){
    return(
        <div className='meet-our-team-container'>
            <div className='team-header-container'>
                <h1 id='meet-our-team-header'>Meet Our Team</h1>
            </div>

            <div className='team-container'>
                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Kyle'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Kyle Mason</h2>
                        <p className='dev-role'>Project Manager & Backend Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Demetri'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Demetri</h2>
                        <p className='dev-role'>Backend Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Rayyan'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Rayyan Haque</h2>
                        <p className='dev-role'>Web Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Himil'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Himil Patel</h2>
                        <p className='dev-role'>Web Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Stephen'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Stephen</h2>
                        <p className='dev-role'>Mobile Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={imageToUse} alt='Paul'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Paul</h2>
                        <p className='dev-role'>Database Developer</p>
                    </div>
                </div>

            </div>
        </div>
    )
}