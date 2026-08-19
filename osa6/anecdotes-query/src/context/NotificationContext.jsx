import { createContext, useContext, useState } from "react";

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, setNotification] = useState(null)
    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const UseNotification = () => {
    return useContext(NotificationContext)
}