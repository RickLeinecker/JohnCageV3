import { useEffect, useRef } from 'react';
import { Card, Button } from "react-bootstrap";
import { websocketURL } from '../Variables/websocketServer';

// Functions
function SocketTest() {

    useEffect(() => {

        // What is this?
        const ws = new WebSocket(websocketURL + ":8080");

        ws.onopen = () => {
            console.log("Ehhlo")
        }

        ws.onmessage = (event: any) => {
            console.log(event.data);
            const array = new Float32Array(3);
            for (var i = 0; i < array.length; ++i) {
                array[i] = i / 2;
            }
            ws.send(array);
            ws.send("Frontend");
        }

        // Causes error.
        // ws.send("message");

    }, []);

    return (
        <div className="WebSocket">
            <Card
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Card.Title>WebSocket Page</Card.Title>
            </Card>
        </div>
    );
}

export default SocketTest;