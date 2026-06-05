import React from "react";

const MessageItem = ({ item, sender }) => {
    const isMe = item.sender === sender;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                padding: "10px",
                alignItems: "flex-end",
            }}
        >
            {/* Avatar */}
            {!isMe && (
                <img
                    src={item.avatar}
                    // src="https://res.cloudinary.com/dieiwsp2i/image/upload/v1757690807/Screenshot_2025-09-12_222631_spgnju.png" // fallback nếu chưa có avatar
                    alt="avatar"
                    style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        marginRight: "8px",
                    }}
                />
            )}

            {/* Bubble */}
            <div
                style={{
                    backgroundColor: isMe ? "#dcf8c6" : "#ffffff",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    maxWidth: "60%",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
            >

                <p style={{ margin: "5px 0 0", fontSize: "15px" }}>
                    {item.message}
                </p>
            </div>

            {/* Avatar nếu là mình */}
            {isMe && (
                <img
                    // src="https://res.cloudinary.com/ds4oggqzq/image/upload/v1753583209/dr3jpg_gil8fr.jpg"
                    src={item.avatar}
                    alt="avatar"
                    style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        marginLeft: "8px",
                    }}
                />
            )}
        </div>
    );
};

export default MessageItem;