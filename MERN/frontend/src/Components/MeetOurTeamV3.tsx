import React from 'react';
import Rayyan_img from '../Images/Rayyan.png';
import Kyle_img from '../Images/Kyle.png';
import Paul_img from '../Images/Paul.png';
import Himil_img from '../Images/Himil.jpg';
import Demetri_img from '../Images/demetri.jpg';
import imageToUse from '../Images/default-image.jpg';
import '../Style/AboutUs.css';

export default function MeetOurTeamV3(){
    return(
        <div className='meet-our-team-container'>
            <div className='team-header-container'>
                <h1 id='meet-our-team-header'>Meet Our Team</h1>
            </div>

            <div className='team-container'>
                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={Kyle_img} alt='Kyle'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Kyle Mason</h2>
                        <p className='dev-role'>Project Manager & Backend Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={Demetri_img} alt='Demetri'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Demetri</h2>
                        <p className='dev-role'>Backend Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={Rayyan_img} alt='Rayyan'></img>
                    </div>
                    <div className='dev-details-container'>
                        <h2 className='dev-name'>Rayyan Haque</h2>
                        <p className='dev-role'>Web Developer</p>
                    </div>
                </div>

                <div className='dev-container'>
                    <div className='dev-image-container'>
                        <img className='team-pic' src={Himil_img} alt='Himil'></img>
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
                        <img className='team-pic' src={Paul_img} alt='Paul'></img>
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