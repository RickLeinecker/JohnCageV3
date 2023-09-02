import "../Style/App.css";
import "../Style/button.css"
import JohnCage from "../Images/JohnCage.png"
import { useEffect, useState } from "react";
const ServerURL = "http://localhost";

//Functions
function buildPath(route: String) {
    return ServerURL + ':5000' + route;
}

function HomePage() {

    const [resText, setResText] = useState<string>('');

    // Basic API test: If the page does not display hellow world as response text, API prob unconnected.
    useEffect(() => {
        const helloWorld = async function () {
            try {
                const response = await fetch(buildPath("/"), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
                setResText("API Response Text: " + await response.text());
            }
            catch (e) {
                if (e instanceof Error) {
                    alert(e.toString());
                }
                return;
            }
        };

        helloWorld();
    }, []);

    return (
        <div className="container" style={{ padding: " 6% 12%", color: "white" }}>
            <div className="row">
                <div className="col">
                    <img src={JohnCage} style={{ width: "300px", height: "300px" }}></img>
                </div>
                <div className="col">
                    <div className="row">
                        <h2>{resText}</h2>
                    </div>
                    <br />
                    <div className="row">
                        <h2><i>"Everything we do is music."</i></h2>
                    </div>
                    <br />
                    <div className="row">
                        <p>In honor of John Cage, this project was made in order to express his quote “Everything we do is music”. You and up to 4 other friends can sign up and schedule a session. From there, everyone in the session can take a recording of any sound and mix them all into one song called a concert. It can be any sound such as waves of a beach, birds chirping, sound of a metro passing by, and so much more.</p>
                    </div>
                </div>
            </div>
            <div className="row"><br /></div>
            <div className="row">
                <h3>About John Cage</h3>
                <br />
                <p>John Cage, in full John Milton Cage, Jr. was an American avant-garde composer whose inventitive compositions and unorthodox ideas profoundly influenced mid-20th century music</p>
                <br />
                <p>While teaching in Seattle (1938-40), Cage organized percussion ensembles to perform his compositions. He experimented with his works for dance and subsequent collaborations with the choreographer and dancer Merce Cunningham sparked a long creative and romantic partnership.</p>
                <br />
                <b>In the following years, Cage turned to Zen Buddhism and other Eastern philosophies which lead to his conclusion that all activities that makes up the music must be seen as part of a single natural process.</b>
            </div>
        </div>
    );
}

export default HomePage;

