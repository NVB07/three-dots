import ChatIcon from "@/components/icons/ChatIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import ChevronRight from "@/components/icons/ChevronRight";
import CircleIcon from "@/components/icons/CircleIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import ImageAddIcon from "@/components/icons/ImageAddIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";
import Logo from "@/components/icons/Logo";
import MenuLineIcon from "@/components/icons/MenuLineIcon";
import OptionIcon from "@/components/icons/OptionIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import UserIcon from "@/components/icons/UserIcon";
import WriteBlogIcon from "@/components/icons/WriteBlogIcon";

const Iconpage = () => {
    return (
        <main>
            <ChatIcon />
            <CheckIcon />
            <ChevronRight />
            <CircleIcon />
            <CloseIcon />
            <CommentIcon />
            <div className="flex w-72 justify-between relative h-14 *:relative">
                <FacebookIcon />
                <GithubIcon />
                <GoogleIcon />
            </div>
            <HeartIcon />
            <HomeIcon />
            <ImageAddIcon />
            <LoadingIcon />
            <Logo />
            <MenuLineIcon />
            <OptionIcon />
            <SearchIcon />
            <ShareIcon />
            <UserIcon />
            <TrashIcon />
            <WriteBlogIcon />
        </main>
    );
};

export default Iconpage;
