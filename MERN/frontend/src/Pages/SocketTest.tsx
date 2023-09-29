import { useEffect, useRef } from 'react';
import { Card, Button } from "react-bootstrap";
import { websocketURL } from '../Variables/websocketServer';

var ws: WebSocket;

var counter = 0;

// Functions
function SocketTest() {

    useEffect(() => {

        ws = new WebSocket(websocketURL + ":8080");
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

    const send = function () {
        const array = new Uint8Array(4);
        for (var i = 0; i < array.length; ++i) {
            array[i] = counter;
        }
        counter++;

        console.log("Sending Data to WebSocket server.");
        console.log(array);
        ws.send(array);
        counter++;
    }

    return (
        <div className="WebSocket">
            <Card
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Card.Title>WebSocket Page</Card.Title>
                <Button onClick={send}>Send Binary Data</Button>
            </Card>
        </div>
    );
}

export default SocketTest;