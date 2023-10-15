import { useEffect, useRef } from 'react';
import { Card, Button } from "react-bootstrap";
import { websocketURL } from '../Variables/websocketServer';

var ws: WebSocket;

var counter = 65;

// Functions
function WebSocketTest() {

    useEffect(() => {



    }, []);

    // Connects to websocket role for testing. Incomplete currently.
    const connect = function () {
        ws = new WebSocket(websocketURL + ":8080/concert/performer");
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            console.log("Socket connection opened.")
        }

        ws.onmessage = (event: any) => {
            console.log("WebSocket message from Server: ", event.data);
            let newarray = new Uint8Array(event.data);
            console.log("WebSocket message as UInt8Array: ", newarray);
        }
    }

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
            <button onClick={connect}>Connect</button>
        </div>
    );
}

export default WebSocketTest;