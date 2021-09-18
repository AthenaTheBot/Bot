// Modules
import { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import $ from 'jquery'

// Other Comp
import Navbar from '../../layout/Navbar/Navbar';
import Footer from '../../layout/Footer/Footer';
import Loader from '../../layout/Loader/Loader';
import Command from './Command/Command';

// Styling
import './Commands.css';

const Commands = () => {

    // General Variables
    let commandKeyCount = 0;
    let categoryKeyCount = 0;

    const [categories, setCategories] =  useState([]);

    const [newCategories, setNewCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/commands').then(res => res.json()).then(res => {
            setNewCategories(res.data);
            setCategories(res.data);
            setLoading(false);
        });
    }, []);

    const loadCategory = (e) => {
        const selectedCategory = e.currentTarget.dataset.category;
        let newData
        if (selectedCategory === 'All') newData = categories;
        else {

            let updateArray = [];
            updateArray.push(categories);
            newData = updateArray.filter(x => x.category !== selectedCategory);
    
            for(var i = 0; i < newData.length; i++) {
                newData[i].commands = [];
            }
    
            newData.push(categories.find(x => x.category === selectedCategory));
        }

        const category = document.getElementsByClassName('category');

        for(var t = 0; t < category.length; t++) {
            category[t].classList = ['category'];
        }

        setNewCategories(newData);
        e.currentTarget.classList.add('activeCategory');

        $('.command .command-active').removeClass('command-active');
    }

    return (
        <Fragment>
            <Helmet>
                <title>Commands - Athena</title>
            </Helmet>
            <Navbar activeElement="commands" />
            <div className="command-page-header">
                <h1 style={{color: 'var(--primary-theme)'}}>Commands</h1>
                <p>List of all commands that is currently running on Athena.</p>
            </div>
            <main>
                <div className="commands-container">
                    <div className="categories">
                        <h5 onClick={loadCategory} className="category activeCategory" data-category="All">All</h5>
                        {
                            categories.map(d => {
                                categoryKeyCount++
                                return <h5 onClick={loadCategory} key={categoryKeyCount} className="category" data-category={d.category}>{d.category}</h5>
                            })
                        }
                    </div>
                    <div className="commands">
                        <Loader active={loading} coverAllPage={false} />
                        {
                            newCategories.map(d => {
                                const commands = d.commands.map(command => {
                                    commandKeyCount++
                                    return (
                                        <Command 
                                            name={command.name}
                                            usage={command.usage}
                                            description={command.description}
                                            reqPerms={command.required_perms}
                                            reqBotPerms={command.required_bot_perms}
                                            key={commandKeyCount}
                                        />
                                    )
                                })

                                return commands;
                            })
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </Fragment>
    )
}

export default Commands;