import "../Style/App.css";
import "../Style/button.css"




//Functions
function buildPath(route: String) {
    return 'http://localhost:5000/' + route;
}

function HomePage() {

    return (
        <div>
            <p>Hello World!</p>
        </div>
    );
}

export default HomePage;

