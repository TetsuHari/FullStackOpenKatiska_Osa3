export const AddNewPersonForm = ({newName, newNumber, onNameInput, onNumberInput, onSubmit}) => {
    return (
      <form>
        <div>
          name: <input value={newName} onChange={onNameInput} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberInput} />
        </div>
        <div>
          <button type="submit" onClick={onSubmit}>add</button>
        </div>
      </form>
    )
}
  
export const FilterForm = ({filter, onFilterInput}) => {
    return (
      <div>
        filter shown with <input value={filter} onChange={onFilterInput} />
      </div>
    )
}

