
import { Button, Stack, Navbar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function NavigationBar() {

  const navigate = useNavigate();

  return (
    <div className="NavigationBar">
      <Navbar bg="navigationBar" sticky="top">
        <Navbar.Brand>
          John Cage Tribute
        </Navbar.Brand>
        <Stack direction="horizontal" gap={4}>
          <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
          <Button variant="secondary" onClick={() => navigate("/Listen")}>Listen</Button>
          <Button variant="secondary" onClick={() => navigate("/Record")}>Record</Button>
          <Button variant="secondary" onClick={() => navigate("/Concerts")}>Concerts</Button>
        </Stack>
      </Navbar>
    </div>
  );
}

export default NavigationBar;