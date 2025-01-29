"use client";
import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const ProgressBar = ({ children }) => {
    return (
        <>
            {children}
            <Next13ProgressBar height="2px" color="var(--progress)" options={{ showSpinner: false }} showOnShallow />
        </>
    );
};

export default ProgressBar;
