import React, { useEffect } from 'react';

const BackgroundSound = (props: any) => {
    useEffect(() => {
        if (!props.name)
            return;
        // Create a new Audio object with the background sound file
        const audio = new Audio(`/ayat/${props.surat}/${props.name}.mp3`);

        // Set the audio to loop
        audio.loop = false;

        // Play the audio when the component mounts
        audio.play().catch(error => {
            // Handle autoplay issues in some browsers (optional)
            console.error('Autoplay prevented:', error);
        });

        // Cleanup: stop the audio when the component unmounts
        return () => {
            audio.pause();
        };
    }, [props.name]);

    return null; // This component doesn't render any UI
};

export default BackgroundSound;