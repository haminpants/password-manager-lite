import { useState } from "react";
import { Toggle } from "./Toggle";

export default function ToggleTheme(){
    
    console.log("ToggleTheme Loaded")
    const [lightMode, setLightMode] = useState(false);

    function toggleTheme() {
        setLightMode(prev => {
            const nextTheme = !prev;

            document.documentElement.classList.toggle(
                "light",
                nextTheme
            );
            return nextTheme;
        });
    }

    return (
        <Toggle
            on ={lightMode}
            onToggle={toggleTheme}
        />
    )

}    

