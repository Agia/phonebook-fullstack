const Entry = ({ name, number, deleteEntry }) => {
    return (
        <div className="entryGroup">
            <p>{name} | {number}</p>
            <button type="button" onClick={deleteEntry}>Delete</button>
        </div>
    )
}

export default Entry;