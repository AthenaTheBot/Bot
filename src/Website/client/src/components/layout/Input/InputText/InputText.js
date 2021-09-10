import { Fragment, useState } from 'react';

// Styling
import './InputText.css';

const Input = ({ placeHolder,  value, onChange, id }) => {
    
    const [text, setText] = useState(value);

    return (
        <Fragment>
            <input 
                id={id} 
                className="athena-input-text" 
                type="text" 
                placeholder={placeHolder} 
                value={text} 
                onChange={(e) => { 
                        setText(e.currentTarget.value);
                        onChange();
                    }} 
                />
        </Fragment>
    )
}

export default Input
