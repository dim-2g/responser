import React from 'react';

export const Nav = () => {
    return (
        <nav>
            <div className="container">
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                        <i className="material-icons medium">cake</i>
                        WebCandy</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="#">Sass</a></li>
                        <li><a href="#">Components</a></li>
                        <li><a href="#">JavaScript</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}