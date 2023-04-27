const Form = ({ name, number, addEntry, handleNameInput, handleNumberInput }) => {
    return (
        <form onSubmit={addEntry}>
            <label>Name</label>
            <input value={name} onChange={handleNameInput}/>
            <label>Number</label>
            <input value={number} onChange={handleNumberInput}/>
            <button type="submit">Add</button>
        </form>
    )
}

export default Form
