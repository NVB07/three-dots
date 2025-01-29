"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import CloseIcon from "@/components/icons/CloseIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { fireStore } from "@/firebase/config";
import { collection, query, where, limit, getDocs } from "firebase/firestore";

import SearchResults from "./SearchResults";

const Search = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchBlogResults, setSearchBlogResults] = useState([]);
    const [searchUserResults, setSearchUserResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState(false);
    const inputRef = useRef();
    const handleInput = (e) => {
        setSearchValue(e.target.value);
    };
    const removeSearchValue = () => {
        setSearchValue("");
        inputRef.current.focus();
        setSearchBlogResults([]);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && searchValue.trim()) {
            e.preventDefault();
            getSearchBlogs();
        }
    };
    const getSearchBlogs = async () => {
        const queryParam = query(
            collection(fireStore, "blogs"),
            where(
                "post.searchKeywords",
                "array-contains-any",
                searchValue.split(" ").map((keyword) => keyword.toUpperCase())
            )
        );
        const querySnapshot = await getDocs(queryParam);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        setSearchBlogResults(results);
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[520px] sm:px-6 px-4">
                <div className="border border-border flex items-center px-2 rounded-2xl">
                    <SearchIcon />
                    <Input
                        ref={inputRef}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        value={searchValue}
                        className="md:text-sm text-base border-none w-full pl-2 rounded-2xl"
                        placeholder="Tìm kiếm"
                    />
                    {searchValue && (
                        <button onClick={removeSearchValue} className="border-none outline-none cursor-pointer w-5  h-5 flex items-center justify-center">
                            <CloseIcon width={14} className="opacity-50" height={14} />
                        </button>
                    )}
                </div>
                {searchBlogResults.map((item, index) => {
                    return <SearchResults key={index} link={"/blog/" + item.id} authorId={item.author.uid} content={item.post.searchKeywords.join(" ")} />;
                })}
            </div>
        </div>
    );
};

export default Search;
