import { useState } from "react";
import { useRef   } from "react";
import useInput     from "./hooks/useInput";

const EventSourcing = () => {

    const [messages, setMessages] = useState([]);
    const userInput = useInput("");
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState("");

    if(!connected) {
        return (
            <div className="form">
                <input  placeholder="Enter your name"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="userText" />
                <button onClick={connect} className="btn" >ENTER</button>
            </div>
        );
    }

    const sendMessage = async () => {
        const message = {username, textMessage:userInput.val, id:Date.now(), event: "message"};
        socket.current.send(JSON.stringify(message));
    }
    
    function connect() {
        socket.current = new WebSocket("ws://localhost:5000");
        socket.current.onopen = () => {
            setConnected(true);
            const msg = {
                event: "connection", username: username, id: Date.now(),
            };
            socket.current.send(JSON.stringify(msg));
            console.log("WebSocket connection set up !");
        };
        socket.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            setMessages(previous => [msg, ...previous]);
        };
        socket.current.onclose = () => {
            console.log("Socket closed !");
        };
        socket.current.onerror = () => {
            console.log("Connection error !");
        };
    }
    
    return (
        <div>
            <div>
                <div className="form">
                    <input type="text" onChange={userInput.onValueChange} className="userText" />
                    <button className="btn margined" onClick={() => sendMessage()} >SEND</button>
                </div>
                <div className="messages">
                    { messages.length
                        ? messages.map(
                            m =>
                            <div className="borderedMessage" key={m.id}>
                                { m.event === 'connection' 
                                    ? <div className="loginLbl"><h3><center>User {m.username} logged in !</center></h3></div>
                                    : <div>
                                        <h4 className="smallLetters">
                                            <b><i>{new Date(m.id).toLocaleString()}</i></b>
                                        </h4>
                                        <p className="leftMargined"><b>{m.username}:</b> {m.textMessage}</p>
                                      </div>
                                }
                            </div>)
                        : <h3 className="centered">No messages found !</h3>
                    }
                </div>
            </div>
        </div>
    )
}
export default EventSourcing;
