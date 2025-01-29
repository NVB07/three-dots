const Moon = ({ width = 24, height = 24, color = "currentColor", style = "" }) => {
    return (
        <svg viewBox="0 0 24 24" className={style} width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </g>
        </svg>
    );
};

const Sun = ({ width = 24, height = 24, color = "currentColor", style = "" }) => {
    return (
        <svg viewBox="0 0 24 24" width={width} className={style} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </g>
        </svg>
    );
};
const Auto = ({ width = 24, height = 24, color = "currentColor", style = "" }) => {
    return (
        <svg x="0" y="0" viewBox="0 0 57.376 57.376" width={width} className={style} height={height} xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g>
                <path
                    d="M28.689 0C12.87 0 0 12.869 0 28.688c0 15.818 12.87 28.688 28.689 28.688 15.817 0 28.686-12.869 28.686-28.688S44.507 0 28.689 0zm0 54.375C14.524 54.375 3 42.852 3 28.687 3 14.523 14.524 2.999 28.689 2.999c14.163 0 25.686 11.523 25.686 25.688S42.853 54.375 28.689 54.375z"
                    fill={color}
                    opacity="1"
                ></path>
                <path
                    d="M31.341 14.779c-.221-.506-.848-.916-1.399-.916h-2.575c-.553 0-1.178.41-1.396.918L15.912 38.053c-.219.506.051.918.604.918h4.099c.553 0 1.164-.418 1.366-.932l1.36-3.459c.202-.514.813-.93 1.366-.93h7.751c.554 0 1.17.414 1.377.926l1.41 3.467c.207.512.824.928 1.377.928h4.24c.553 0 .821-.41.602-.918L31.341 14.779zm-.762 14.192h-4.135c-.553 0-.837-.418-.636-.932l2.321-5.939c.201-.516.529-.516.733-.002l2.35 5.943c.201.514-.08.93-.633.93z"
                    fill={color}
                    opacity="1"
                ></path>
            </g>
        </svg>
    );
};

export { Moon, Sun, Auto };
