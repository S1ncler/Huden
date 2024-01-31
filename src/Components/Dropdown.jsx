import React, {useState} from 'react'

function Dropdown({options, data, defaultSlected, handleSelectData, setValue, handleSelectedPrincipio}) {
  const [show, setShow]= useState(false);
  const [selected, setSecelted]= useState(defaultSlected);
  const handleSelectOptions = (status) => {
    setSecelted(status);
    setValue(status)
    setShow(!show);
  };
  const handleSelected = (status) => {
    setSecelted(status.name);
    setShow(!show);
    handleSelectData(status)
    handleSelectedPrincipio(status)
  };
  return (
    <div className="dropdown">
      <button
        type="button"
        className={`btn dropdown-toggle btn-light`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={()=>setShow(!show)}
        style={{width:'100%'}}
      >
        {options ? selected : selected}
      </button>
      <div style={{position: 'absolute', zIndex: 1,}}>
        {show &&
            <ul className="list-group">
              {options?
              <>
              {options.map((option, index) => (
                <li key={index} className={`list-group-item`}>
                  <button type="button" className="btn" onClick={() => handleSelectOptions(option)}>
                    {option}
                  </button>
                </li>
              ))}
              </>
              :
              <>
              {data?.map((data, index) => (
                <li key={index} className={`list-group-item`}>
                  <button type="button" className="btn" onClick={() => handleSelected(data)}>
                    {data.name}
                  </button>
                </li>
              ))}
              </>
              }
            </ul>
          }
      </div>
    </div>
  )
}

export default Dropdown
