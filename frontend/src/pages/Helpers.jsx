import Dropdown from 'react-bootstrap/Dropdown'


export function ActionsDropDown({actions}){
    return (
    <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Actions
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          {actions.map((action) => (
            <Dropdown.Item href="#/action-1">{action}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
    </Dropdown>
    )
}

// export ActionsDropDown