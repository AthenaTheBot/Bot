import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { BiCaretDown } from 'react-icons/bi';
import $ from 'jquery';

// Styling
import './Profile.css';

const Profile = ({ drodpownOptions }) => {

    let count = 0;
    const [cookies] = useCookies(0);

    useEffect(() => {
        const effectFunc = async () => {
            if (!cookies?.session) {
                const btn = document.getElementById('log-btn');
                btn.classList = ['loginBtn'];
            }
            else {
                const userData = await fetch('/api/users/@me').then(res => res.json()).then(res => res.data).catch(err => {});
                if (!userData || !userData?.id) return;
                document.getElementById('profile').classList = ['profile'];
                document.getElementById('profile-avatar').src = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : `/assets/images/default.png`;
                document.getElementById('profile-username').textContent = userData.username.lenth < 15 ? userData.username.slice(0, 15) : userData.username;
            }
        }

        effectFunc();
    }, []);

    const toggleDropdown = () => {
        if ($('.dropdown').hasClass('disabled')) {

            $('.dropdown-icon').addClass('profile-dropdown-icon-collapsed');
            $('.dropdown').removeClass('disabled');
        }
        else {

            $('.dropdown-icon').removeClass('profile-dropdown-icon-collapsed');
            $('.dropdown').addClass('disabled');
        }
    }

    return (
        <Fragment>
            <div className="profile-part">
                <div id="profile" className="profile disabled" onClick={toggleDropdown}>
                    <img id="profile-avatar" src="/assets/images/default.png" alt="Profile" />
                    <p id="profile-username">User</p>
                    <BiCaretDown className="dropdown-icon" />
                </div>
                <a id="log-btn" className="loginBtn disabled" href="/oauth/login">Login</a>
            </div>
            <div className="dropdown disabled">
                    <ul>
                        {
                            drodpownOptions?.map(option => {
                                if (option.reload) {
                                    return (
                                        <a key={count++} href={option.url}><li>{option.content}</li></a>
                                    )
                                }
                                else {
                                    return (
                                    <Link key={count++} to={option.url}><li>{option.content}</li></Link>
                                )
                                }
                            })
                        }
                        <a href="/oauth/logout"><li>Logout</li></a>
                    </ul>
                </div>
        </Fragment>
    )
}

export default Profile
