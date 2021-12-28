import anime from "./anime.js";
let a = anime({
    targets: "#christof",
    keyframes: [
        { translateY: Math.floor(Math.random() * 200) },
        { rotateZ: Math.floor(Math.random() * 360) },
        { translateX: Math.floor(Math.random() * 200) },
        { rotateZ: Math.floor(Math.random() * 360) },
        { translateY: Math.floor(Math.random() * 200) },
        { rotateZ: Math.floor(Math.random() * 360) },
        { translateX: 0 },
        { rotateZ: 0 },
        { translateY: 0 },
    ],
    duration: 4000,
    easing: "easeOutElastic(1, .8)",
    loop: true,
});
document.querySelector("h1")?.addEventListener("click", () => {
    a.pause();
});
