﻿'use client'
import React, {useEffect, useState} from 'react';
import InputSendBlock from "@/shared/components/ChatComponents/InputSendBlock/InputSendBlock";
import styles from './page.module.css'
import ChatBlock from "@/shared/components/ChatComponents/ChatBlock/ChatBlock";
import axios from "axios";
import {Message} from "@/entitys/message";
import {RequestDataDto} from "@/DTOs/requestDataDto";


const Chat = () => {
        const [ message, setMessage ] = useState('')
        const [ chatHistory, setChatHistory ] = useState([])
        const [ selectedChat, setSelectedChat ] = useState(null)

        const chatExamples = [
            {
                id: 1,
                chatName: 'DBN assistant'
            },
            {
                id: 2,
                chatName: 'General knowledge DEMO assistant'
            },
            {
                id: 3,
                chatName: 'HelpDesk_assistant'
            },
        ]

        const getMessage = (newMessage) => {
            setMessage(newMessage);
        };

        const updateChatHistory = (message) => {
            setChatHistory(prevHistory => [...prevHistory, message]);
        }
        
        useEffect(() => {
            if (!selectedChat && chatExamples.length > 0) {
                setSelectedChat(chatExamples[0]);
            }
        }, [selectedChat, chatExamples]);

        const sendRequest = async () => {
            if (message.trim() !== "") {
                const newMessage = new Message(chatHistory.length + 1, true, message);
                
                updateChatHistory(newMessage);
                
                const requestData = new RequestDataDto(selectedChat, newMessage);

                setMessage('')
                
                try {
                    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL, requestData);
                    
                    if (response.status === 200) {
                        const botMessage = new Message(response.data.data.id,
                            response.data.data.messageType, response.data.data.message);
                        
                        updateChatHistory(botMessage);
                    }
                    
                } catch (error) {
                    console.log(error);
                }
            }
        }
        
        return (
            <div className={styles.container}>
                <ChatBlock messages={chatHistory}/>
                <InputSendBlock
                    message={message}
                    getMessage={getMessage}
                    sendRequest={sendRequest}
                    chatExamples={chatExamples}
                    setChatHistory = {setChatHistory}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />
            </div>
        );
    }
;

export default Chat;
