const RemoveButton = ({removeFunc}) => {
  return (
    <button onClick={removeFunc}>Remove</button>
  )
}

const Person = ({name, number, remover}) => {
    return (
      <tr>
        <td>{name}</td>
        <td>{number}</td>
        <td><RemoveButton removeFunc={remover}/></td>
      </tr>
    )
}
  
const PhoneBook = ({persons, filter, personRemover}) => {
    let filteredPersons = persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase()))
    return (
      <>
        <h2> Numbers </h2>
        <table>
          <tbody>
            {filteredPersons.map((person) =>
              <Person key={person}
                      name={person.name}
                      number={person.number}
                      remover={personRemover(person.id)}
              />
            )}
          </tbody>
        </table>
      </>
    )
}

export default PhoneBook