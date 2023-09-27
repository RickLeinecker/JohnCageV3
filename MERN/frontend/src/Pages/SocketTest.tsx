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
            console.log("Ehhlo")
        }

        ws.onmessage = (event: any) => {
            console.log("WebSocket message from Server: ", event.data);
            let newarray = new Uint8Array(event.data);
            console.log("WebSocket message as UInt8Array: ", newarray);
        }

    }, []);

    const send = function () {
        const array2 = new Uint8Array(4);
        // console.log(array2);
        for (var i = 0; i < array2.length; ++i) {
            array2[i] = counter;
        }
        counter++;

        const array3 = new Uint16Array(3);
        // console.log(array3);
        for (var i = 0; i < array3.length; ++i) {
            array3[i] = 3;
        }
        // var newdataview = new DataView(array.buffer);
        // console.log(newdataview);
        // console.log(newdataview.getFloat32(0, true));
        // console.log(newdataview.getFloat32(4, true));
        // console.log(newdataview.getFloat32(8, true));

        console.log("Sending Data to WebSocket server.");
        console.log(array2);
        ws.send(array2);
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