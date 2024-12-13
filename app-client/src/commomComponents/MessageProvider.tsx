import { createContext, ReactNode, useState, useContext } from "react";

import "./MessageProvider.css";


interface MessageContextType {
    showMessage: (
        message: string,
        messageType?: "normal" | "warning",
        dulation?: number
    ) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(
    undefined
);

interface MessageProviderProps {
    children: ReactNode;
}
export const MessageProvider: React.FC<MessageProviderProps> = ({
    children
}) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("warning");
    const [isVisible, setIsVisible] = useState(false);

    const showMessage = (
        message: string,
        messageType: "normal" | "warning" = "warning",
        dulation: number = 5000
    ) => {
        // メッセージとメッセージタイプを設定
        setMessage(message);
        setMessageType(messageType);

        // 表示させ、dulationミリ秒後に非表示
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), dulation);
    };

    // メッセージタイプごとのクラス
    const messageClassName = (messageType === "normal")
        ? "messageNormal"
        : "messageWarning"
    ;

    return (
        <MessageContext.Provider value={{ showMessage }}>
            {children}
            <div className={`messageCommon ${messageClassName} ${isVisible ? "messageShow" : ""}`}>{message}</div>
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be within a MessageContext!");
    }
    return context;
}
