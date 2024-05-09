import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Message() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const getMessages = async () => {
    try {
      const res = await api.get(`messages/?receiver=${id}`);
      setMessages(res.data);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => getMessages(), 2000); // Fetch data every 5 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []);

  const payload = {
    content: message,
    receiver: id,
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("messages/", payload);
      console.log("response", res);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="container">
      <div className="messages-container">
        {messages &&
          messages.length > 0 &&
          messages.map((sms) => <li key={message.id}>{sms.content}</li>)}
      </div>
      <form className="send-message" onSubmit={handleSubmit}>
        <div className="message-content">
          <textarea
            name="message"
            id="message"
            placeholder="send message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button>Send</button>
        </div>
      </form>
    </div>
  );
}
