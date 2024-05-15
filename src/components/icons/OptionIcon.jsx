const OptionIcon = ({ width = 24, height = 24, color = "currentColor" }) => {
    return (
        <svg viewBox="0 0 24 24" width={width} height={height} fill={color} xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M12,10a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM4,14a2,2,0,1,0-2-2A2,2,0,0,0,4,14Zm16-4a2,2,0,1,0,2,2A2,2,0,0,0,20,10Z"></path>
            </g>
        </svg>
    );
};

export default OptionIcon;
