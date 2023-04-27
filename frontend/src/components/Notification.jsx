const Notification = ({ message, alertShow }) => {

    if(message === null) {
        return null
    }

    let variant = ''
    if (message === 'This entry has already been deleted from the server.') {
        variant = 'error'
    } else {
        variant = 'success'
    }
        return (
            <div>
                {alertShow && <div className={`${variant}`}>{message}</div>}
            </div>
        )
}

export default Notification