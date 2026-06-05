import React, { useState, useEffect, useContext, useRef } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    updateDoc,
    addDoc,
    Timestamp,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import { db } from "../../configs/firebase";
import { MyUserContext } from "../../configs/MyContexts";
import MessageItem from "./MessageItem";

const Chat = () => {
    const { friendId } = useParams();
    const location = useLocation();
    const seen = location.state?.seen;
    // seen =1
    const [user] = useContext(MyUserContext);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const messagesEndRef = useRef(null);

    // id người gửi
    const sender = String(user?.id);

    // id người nhận
    const receiver = String(friendId);

    // Query lấy cả 2 chiều chat
    const q = query(
        collection(db, "Chats"),
        where("chatters", "in", [
            `${sender}xx${receiver}`,
            `${receiver}xx${sender}`,
        ])
    );


    // GỬI TIN NHẮN

    const handleSubmit = async () => {
        if (!message.trim()) return;

        try {
            const newMessage = {
                message: message.trim(),
                sender,
                id: user.id,
                name: user.firstName + " " + user.lastName,
                avatar: user.avatar,
                seen: false,

                timestamp: Timestamp.now(),
            };

            const querySnapshot = await getDocs(q);

            // Đã tồn tại chat
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];

                const oldConversation =
                    docSnap.data().conversation || [];

                await updateDoc(docSnap.ref, {
                    conversation: [
                        ...oldConversation,
                        newMessage,
                    ],
                    updatedAt: Timestamp.now(),
                });
            }

            // Chưa có chat
            else {
                await addDoc(collection(db, "Chats"), {
                    chatters: `${sender}xx${receiver}`,

                    users: [sender, receiver],

                    conversation: [newMessage],
                    seen: false,

                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });
            }

            setMessage("");
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    // real time
    useEffect(() => {
        const unsub = onSnapshot(q, async (snapshot) => {
            let allMessages = [];

            for (const docSnap of snapshot.docs) {
                const conversation =
                    docSnap.data().conversation || [];

                // update seen
                const updatedConversation =
                    conversation.map((m) => {
                        if (seen === 1) {
                            return {
                                ...m,
                                seen: true,
                            };
                        }

                        return m;
                    });

                // lưu firestore
                await updateDoc(docSnap.ref, {
                    conversation:
                        updatedConversation,
                });

                allMessages = [
                    ...allMessages,
                    ...updatedConversation,
                ];
            }

            // sort theo thời gian
            allMessages.sort(
                (a, b) =>
                    a.timestamp?.seconds -
                    b.timestamp?.seconds
            );

            setMessages(allMessages);
        });

        return () => unsub();
    }, [sender, receiver]);


    // Tự động cuộn

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            <h2 style={{ marginBottom: 20 }}>
                Chat
            </h2>

            {/* MESSAGE BOX */}
            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px",
                    marginBottom: "20px",
                    borderRadius: "10px",
                }}
            >
                {messages.map((item, index) => (
                    <MessageItem
                        key={index}
                        item={item}
                        sender={sender}

                    />
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <input
                type="text"
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
                placeholder="Type a message..."
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit();
                    }
                }}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                }}
            />

            {/* BUTTON */}
            <button
                onClick={handleSubmit}
                style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Send
            </button>
        </div>
    );
};

export default Chat;


