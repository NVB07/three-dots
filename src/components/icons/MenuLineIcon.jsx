const MenuLineIcon = ({ width = 24, height = 24, color = "currentColor" }) => {
    return (
        <svg viewBox="0 0 24 24" width={width} opacity={0.6} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M4 6H20M4 12H20M4 18H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
        </svg>
    );
};

export default MenuLineIcon;
