// import { useState } from "react";
const useAlarm = () => {
    const localAllow = JSON.parse(localStorage.getItem("ping"));
    // const setLocalAllow = JSON.parse(localStorage.setItem("ping", ));

    const audio = new Audio("/ping.mp3");

    const audioPlay = () => {
        audio.play().catch((error) => {});
    };

    const audioPause = () => {
        audio.pause();
    };
    return { audioPlay, audioPause, localAllow };
};

export default useAlarm;
