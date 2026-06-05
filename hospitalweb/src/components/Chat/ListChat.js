import React, { useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, docSnap } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../configs/firebase";
import { MyUserContext } from "../../configs/MyContexts";
import Apis, { endpoints } from "../../configs/Apis";

const ListChat = () => {

    const [user] = useContext(MyUserContext);

    const [chats, setChats] = useState([]);



    const navigate = useNavigate();

    useEffect(() => {

        if (!user?.id) return;

        const q = query(
            collection(db, "Chats"),
            where("users", "array-contains", String(user.id))
        );

        const unsub = onSnapshot(q, async (snapshot) => {

            console.log("DOC COUNT =", snapshot.docs.length);

            let result = [];

            for (const chatDoc of snapshot.docs) {

                const data = chatDoc.data();

                console.log("CHAT DATA =", data);







                const friendId = data.users.find(
                    id => id && id !== String(user.id)
                );



                try {

                    const res = await Apis.get(endpoints.usersChat(friendId));





                    const lastMess = data.conversation?.[data.conversation.length - 1]?.id;
                    let isMe = "";
                    if (lastMess === user.id) isMe = "T";


                    console.log("id = ", lastMess);
                    console.log("isMe =", isMe);



                    result.push({
                        friend: res.data,
                        isMe,

                        lastMessage: data.conversation?.[data.conversation.length - 1]?.message
                    });


                } catch (err) {
                    console.log("LOAD CHAT ERROR:", err);
                }
            }

            setChats(result);

        });

        return () => unsub();


    }, [user]);

    return (
        <div className="container mt-3">

            <h3>List Chat</h3>

            {
                chats.length === 0 &&
                <p>Không có cuộc trò chuyện nào</p>
            }

            {
                chats.map((chat, index) => (


                    <div
                        key={index}
                        onClick={() =>
                            navigate(`/chat/${chat.friend.id}`, {
                                state: { seen: 1 }
                            })
                        }
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: chat.isMe === "T" ? "normal" :
                                chat.lastMessage?.seen
                                    ? "normol"
                                    : "bold"
                            // fontWeight:
                            //     chat.lastMessage?.seen
                            //         ? "normol"
                            //         : "bold"




                        }}
                    >

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>

                            <img
                                src={chat.friend.avatar}
                                alt=""
                                width="50"
                                height="50"
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />

                            <div>

                                <h5>
                                    {chat.friend.lastName} {chat.friend.firstName}
                                </h5>


                                {chat.isMe === "T" ?

                                    <p style={{ margin: 0 }}>
                                        {"Bạn: " + chat.lastMessage}
                                    </p>

                                    : <p style={{ margin: 0 }}>
                                        {chat.lastMessage}
                                    </p>
                                }
                                {/* <p style={{ margin: 0 }}>
                                    {chat.lastMessage}
                                </p> */}

                            </div>

                        </div>

                    </div>

                ))
            }

        </div>
    );
};

export default ListChat;