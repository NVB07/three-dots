const UserIcon = ({ width = 24, height = 24, color = "currentColor", solid = false }) => {
    if (solid) {
        return (
            <svg viewBox="0 0 24 24" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <circle cx="12" cy="6" r="4" fill={color}></circle>
                    <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" fill={color}></path>
                </g>
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" opacity={0.6} width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <circle cx="12" cy="6" r="4" stroke={color} strokeWidth="1.5"></circle>
                <path
                    d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                    stroke={color}
                    strokeWidth="1.5"
                ></path>
            </g>
        </svg>
    );
};

export default UserIcon;
