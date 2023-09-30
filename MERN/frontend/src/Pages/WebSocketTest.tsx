import { useEffect, useRef } from 'react';
import { Card, Button } from "react-bootstrap";
import { websocketURL } from '../Variables/websocketServer';

var ws: WebSocket;

var counter = 65;

// Functions
function WebSocketTest() {

    useEffect(() => {

        ws = new WebSocket(websocketURL + ":8080/concert/audience");
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            console.log("Socket connection opened.")
        }

        ws.onmessage = (event: any) => {
            console.log("WebSocket message from Server: ", event.data);
            let newarray = new Uint8Array(event.data);
            console.log("WebSocket message as UInt8Array: ", newarray);
        }

    }, []);

    return (
        <div className="WebSocket">
            <Card
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Card.Title>WebSocketTest Page</Card.Title>
                See console for listen.
            </Card>
        </div>
    );
}

export default WebSocketTest;