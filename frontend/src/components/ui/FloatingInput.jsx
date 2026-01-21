import React from "react";

const FloatingInput = ({ id, label, type = "text", ...props }) => (
    <div className="lr-input-group">
        <input
            id={id}
            type={type}
            placeholder=" "
            className="lr-input peer"
            autoComplete="off"
            {...props}
        />
        <label htmlFor={id} className="lr-label">
            {label}
        </label>
    </div>
);

export default FloatingInput;
