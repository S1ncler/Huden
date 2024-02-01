import React from 'react'
import { useResumeContext } from '../Hooks/useResumeContext';

export const FormItem = ({title, value, setValue}) => {
  return (
    <div>
      <span className="text-center">{title}</span>
      <form class="form">
        <input type="text" class="form-control" id="floatingInputInvalid" value={value} onChange={e=>setValue(e.target.value)} placeholder={value}/>
      </form>
    </div>
  )
}
