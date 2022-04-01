import React, { Component } from 'react';

// positioning of parent element must be non static

const Tooltip = ({text="Tooltip Text", className="", show=false, type="success"}) => {
    return (
        <div className={`tooltip-container ${className} ${show?"show":""} ${type}`}>
            <div className="tooltip-text-container"><span>{text}</span></div>
            <span className="tooltip-pointer"/>
        </div>
    );
}
 
export {Tooltip};