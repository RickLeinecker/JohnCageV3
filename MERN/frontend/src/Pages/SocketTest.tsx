import { useEffect, useState } from 'react';
import { Card, Button, Form } from "react-bootstrap";
import { websocketURL } from '../Variables/websocketServer';

var ws: WebSocket;

var counter = 65;

// Functions
function SocketTest() {

    const [messageTest, setMessageText] = useState<string>('');
    const [connectionText, setConnectionText] = useState<string>('');
    const [extra, setExtra] = useState<number>(0);

    // Sends example binary data for testing mixer and streaming.
    const sendData = function () {
        const array = new Uint8Array([0, 0, counter, 0, counter]);
        counter++;

        console.log("Sending Data to WebSocket server.");
        //console.log(array);
        ws.send(array);
    }

    // Send a general message/header using the typed in text.
    const sendMessage = function () {
        console.log(messageTest);

        const array = new Uint8Array(15);
        for (var i = 0; i < messageTest.length && i < array.length - 1; ++i) {
            let char = messageTest.charCodeAt(0);
            if (0 <= char && char <= 255) {
                array[i] = messageTest.charCodeAt(i);
            }

        }
        array[array.length - 1] = 0;
        counter++;

        console.log("Sending Header to WebSocket server.");
        console.log(array);
        ws.send(array);
    }

    // Connects to websocket role for testing. Incomplete currently.
    const connect = function () {
        let connectionURL = websocketURL + connectionText;
        console.log(connectionURL);
        ws = new WebSocket(connectionURL);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            console.log("Socket connection opened.")
        }

        ws.onmessage = (event: any) => {
            let newarray = new Uint8Array(event.data);
            console.log("WebSocket message as UInt8Array: ", newarray);

            var enc = new TextDecoder("utf-8");
            console.log("WebSocket message as string: ", enc.decode(newarray));
        }
    }

    const setst = function () {
        setExtra(4);
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
                <Button onClick={sendData}>Send Binary Data</Button>
                <br />
                <Form.Group>
                    <Form.Control value={connectionText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setConnectionText(e.target.value)} placeholder="Connection URL" />
                </Form.Group>
                <Button onClick={connect}>Connect</Button>
                <br />
                <Form.Group>
                    <Form.Control value={messageTest} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setMessageText(e.target.value)} placeholder="Message" />
                </Form.Group>
                <Button onClick={sendMessage}>Send Message</Button>
                <Button onClick={setst}>ChangeRawData</Button>
                <br />
            </Card>
        </div>
    );
}

export default SocketTest;