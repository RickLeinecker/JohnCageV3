import "../Style/App.css";
import "../Style/button.css"
import "../Style/style.css"
import JohnCage from "../Images/JohnCage.png"
import { useEffect } from "react";


//Functions
function buildPath(route: String) {
    return 'http://localhost:5000/' + route;
}

function HomePage() {

    useEffect(() => {

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.00
        };

        const items = document.querySelectorAll('.intersect');

        //   const active = new IntersectionObserver((entries) => {
        //     let iter:number = 0;
        //     entries.forEach((entry) => {
        //       if (entry.intersectionRatio > options.threshold) {
        //         // Add 'active' class if observation target is inside viewport
        //         console.log("In view Entry's "+iter+" intersection ratio is "+entry.intersectionRatio);
        //         entry.target.classList.add('animateIn');
        //         entry.target.classList.remove('animateOut');
        //       } else {
        //         // Remove 'active' class otherwise
        //         console.log("Out view Entry's "+iter+" intersection ratio is "+entry.intersectionRatio);
        //         entry.target.classList.add('animateOut');
        //         entry.target.classList.remove('animateIn');
        //       }
        //     });
        //   });

        // items.forEach((el) => {
        //     active.observe(el);
        //     });

        const active = function (entries: IntersectionObserverEntry[]) {
            let iter: number = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("Element " + iter + " IS Intersecting");
                    entry.target.classList.add('animateIn');
                    entry.target.classList.remove('animateOut');
                }
                else {
                    console.log("Element " + iter + " is NOT Intersecting");
                    entry.target.classList.add('animateOut');
                    entry.target.classList.remove('animateIn');
                }
                iter++;
            });
        }

        const io2 = new IntersectionObserver(active, options);
        for (let i = 0; i < items.length; i++) {
            io2.observe(items[i]);
        }

    });

    return (
        <div className="container" style={{ padding: " 6% 12%", color: "black" }}>
            <div className="row intersect" id="0">
                <div className="col">
                    <img src={JohnCage} className="johnCageImage"></img>
                </div>
                <div className="col">
                    <div className="row">
                        <h2>John Cage Tribute</h2>
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
            <div className="row blankBuffer">
            </div>
            <div className="row animateIn intersect" id="1">
                <h3>About John Cage 1</h3>
                <br />
                <p>John Cage, in full John Milton Cage, Jr. was an American avant-garde composer whose inventitive compositions and unorthodox ideas profoundly influenced mid-20th century music</p>
                <br />
                <p>While teaching in Seattle (1938-40), Cage organized percussion ensembles to perform his compositions. He experimented with his works for dance and subsequent collaborations with the choreographer and dancer Merce Cunningham sparked a long creative and romantic partnership.</p>
                <br />
                <b>In the following years, Cage turned to Zen Buddhism and other Eastern philosophies which lead to his conclusion that all activities that makes up the music must be seen as part of a single natural process.</b>
            </div>
            <div className="row blankBuffer">
            </div>
            <div className="row animateIn intersect" id="2">
                <h3>About John Cage 2</h3>
                <br />
                <p>John Cage (1912-1992) was a highly influential and innovative figure in the world of contemporary music and art. His works often pushed the boundaries of what could be considered music, challenging traditional notions of composition and performance. Cage's compositions frequently involved elements of chance and randomness, a technique he called "indeterminacy," where the outcome of a performance was not entirely predetermined. He famously composed pieces such as "4'33"," in which the performer remains silent for the specified duration, allowing ambient sounds to become the "music." This conceptual and avant-garde approach to music had a profound impact on the development of experimental and minimalist music.</p>
                <br />
            </div>
            <div className="row blankBuffer">
            </div>
            <div className="row animateIn intersect" id="3">
                <h3>About John Cage 3</h3>
                <br />
                <p>Cage's interests extended beyond just music. He was also an accomplished writer, artist, and philosopher. His writings, including "Silence: Lectures and Writings," were influential in the fields of aesthetics and music theory. Cage's ideas about sound, silence, and the nature of art had a far-reaching influence on various art forms, from visual arts to dance and literature. His exploration of silence as a valid artistic statement challenged conventional thinking about what could be considered art.</p>
                <br />
            </div>
            <div className="row blankBuffer">
            </div>
            <div className="row animateIn intersect" id="4">
                <h3>About John Cage 4</h3>
                <br />
                <p>Cage's legacy continues to inspire contemporary artists, musicians, and thinkers. His philosophy of embracing the inherent unpredictability of life and incorporating it into creative expression is a fundamental aspect of his work. John Cage's impact on the avant-garde and experimental arts cannot be overstated, as he played a pivotal role in redefining the boundaries of music and art in the 20th century, leaving a lasting mark on the world of avant-garde composition and conceptual art. His ability to blur the lines between music, philosophy, and visual arts has made him a significant and enduring figure in the world of contemporary culture.</p>
                <br />
            </div>
        </div>
    );
}

export default HomePage;