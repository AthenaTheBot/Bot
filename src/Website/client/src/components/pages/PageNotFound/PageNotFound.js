import { Link } from 'react-router-dom';

// Styling
import './PageNotFound.css';

const PageNotFound = () => {
    return (
        <div className="athena-pg-not-found-container">
            <h1>404</h1>
            <p>Ooops! It looks like the page you are trying to access not found!</p>
            <Link className="athena-pg-not-found-btn" to="/">Go back to home</Link>
        </div>
    )
}

export default PageNotFound
