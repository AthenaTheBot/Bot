import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Styling
import './Error.css';

const Error = () => {
    return (
        <div className="athena-error-container">
            <Helmet>
                <title>Ooops! - Athena</title>
            </Helmet>
            <h1>Ooops!</h1>
            <p>It looks like an un expected error occured on our site. Please give us some time to solve the issue!</p>
            <Link className="athena-error-btn" to="/">Go back to home</Link>
        </div>
    )
}

export default Error
