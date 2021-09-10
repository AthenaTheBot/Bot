import { useEffect } from 'react';

// Styling
import './Loader.css';

const Loader = ({ active, coverAllPage }) => {

    useEffect(() => {
        if (!active) {
            document.getElementById('loader').classList.add('disabled');
        }
        else {
            document.getElementById('loader').classList.remove('disabled');
        }

        if (coverAllPage) {
            document.getElementById('loader').classList.add('cover');
        }
        else {
            document.getElementById('loader').classList.remove('cover');
        }
    })

    return (
        <div id="loader">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
              <div className="bounce4"></div>
            </div>
        </div>
    )
}

export default Loader
