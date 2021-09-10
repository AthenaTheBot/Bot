import { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Other Compontents
import Navbar from '../../layout/Navbar/Navbar';
import Footer from '../../layout/Footer/Footer';

// Pages
import Privacy from './Pages/Privacy'

// Styling
import './Legal.css';

function Legal({ page }) {

    const [content, setContent] = useState('Loading..');
    const [title, setTitle] = useState('Loading..');

    useEffect(() => {
        // TODO: Privacy Header + MD to html?
        switch(page) {
            case 'privacy':
                setTitle('Privacy Policy');
                setContent(Privacy);
                return;
    
            case 'terms':
                setTitle('Terms Of Service');
                setContent('We are preparing our terms of service..');
                return;
        }
    });

    return (
        <Fragment>
            <Navbar />
                <Helmet>
                    <title>Legal - Athena</title>
                </Helmet>
                <div className="athena-legal-container">
                    <div className="athena-legal-head">
                        <h1 style={{ color: "var(--primary-theme)" }}>{title}</h1>
                    </div>
                    <div className="athena-legal-content">
                        {content}
                    </div>
                </div>
            <Footer />
        </Fragment>
    )
}

export default Legal
