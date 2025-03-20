import { useState } from "react";
import "./mailList.css";

const MailList = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = () => {
        if (!email) {
            setMessage("Please enter an email address.");
            return;
        }

      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }       
        setMessage("Subscribed successfully! 🎉");
        setEmail(""); 
        hideMessage();        
    };

    // Function to clear the message after 5 seconds
    const hideMessage = () => {
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    return (
        <div className="mail">
            <h1 className="mailTitle">Save time, save money!</h1>
            <span className="mailDesc">Sign up and we will send the best deals to you</span>
            <div className="mailInputContainer">
                <input 
                    type="text" 
                    placeholder="Your Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleClick}>Subscribe</button>
            </div>
            {message && <p className="mailMessage">{message}</p>}
        </div>
    );
};

export default MailList;
