import { useEffect } from 'react';
import $ from 'jquery';

// Syling
import './InputSelect.css';

const InputSelect = ({ onChange, options, id }) => {

    let count = 0;
    useEffect(() => {

        $('.athena-input-selection-main').on('click', function (){
            const slideMenu = $(this).siblings();
            if (slideMenu.hasClass('disabled')) slideMenu.removeClass('disabled');
            else slideMenu.addClass('disabled');
        })
    
        $('.athena-input-selection-slide-option').on('click', function() {
            const currentVal = $(this).text();
            $(this).parent().siblings().text(currentVal);
            $(this).parent().addClass('disabled');
            onChange();
        })

    }, []);

    return (
        <div className="athena-input-selection">
            <div id={id} className="athena-input-selection-main">
                {
                    options.map(option => {
                        if (option.active) return option.content;
                    })
                }
            </div>
            <ul className="athena-input-selection-slide disabled">
                {
                    options.map(option => {
                        return (
                            <li data-id={option.id} key={count++} className="athena-input-selection-slide-option">{option.content}</li>
                        );
                    })
                }
            </ul>
        </div>
    )
}

export default InputSelect
