const NotificationsBar = ({message, messageLevel}) => {
    if (message === null) {
        return null
    }

    const notificationStyle = {
        color: messageLevel,
        background: 'lightgray',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default NotificationsBar