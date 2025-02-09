function clickButton(tag) {
    const button = document.querySelector(`[data-uia="${tag}"]`);
    if (button && button.offsetParent !== null) {
        button.click();
    }
}

function checkButtons() {
    if (document.hidden) return;

    chrome.storage.sync.get(["skipIntro", "nextEpisode"], (data) => {
        if (data.skipIntro) {
            clickButton("player-skip-recap");
            clickButton("player-skip-intro");
        }
        if (data.nextEpisode) {
            clickButton("next-episode-seamless-button-draining");
            clickButton("next-episode-seamless-button");
        }
    });
}

function waitForVideoPlayer() {
    const targetNode = document.querySelector(".watch-video");

    if (targetNode) {

        const observer = new MutationObserver(() => {
            checkButtons();
        });

        observer.observe(targetNode, { childList: true, subtree: true });

        checkButtons();
    } else {
        setTimeout(waitForVideoPlayer, 500);
    }
}

waitForVideoPlayer();