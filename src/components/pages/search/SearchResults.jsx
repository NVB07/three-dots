import Image from "next/image";
import Link from "next/link";

const SearchResults = ({ photoURL, displayName, content }) => {
    return (
        <div className="">
            {/* <Image src={""}/> */}
            <Link href={"#"}>{displayName}</Link>
            <p>{content}</p>
        </div>
    );
};

export default SearchResults;
