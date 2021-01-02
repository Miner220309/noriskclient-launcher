import React from 'react';
// @ts-ignore
import SkinRender from 'minerender/src/skin/index.js';

export const LandingPage = () => {

    const script = React.createElement('script', {src: "https://cdn.jsdelivr.net/gh/InventivetalentDev/MineRender@1.4.6/dist/skin.min.js"}, '');
    const title = React.createElement('h1', {id: 'gay'}, 'My First React Code');

    const skinRender = new SkinRender({}, document.getElementById("gay"));
    console.log(skinRender)
    console.log(skinRender.element)
    //TODO DOESNT WORK FUCKER
    // skinRender.render({username: "NoRiskk"})


    return (
        <div>
            {script}
            hihihihi
            {title}
        </div>
    )
}
