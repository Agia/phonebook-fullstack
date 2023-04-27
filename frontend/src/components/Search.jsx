const Search = ({ search, handleSearch }) => {
    return (
        <fieldset>
            <label>Search</label>
            <input id='searchInput' type="search" value={search} onChange={handleSearch}/>
        </fieldset>
    )
}

export default Search