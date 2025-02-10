waitForVideoPlayer();
waitForTimebar();

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
        const observer = new MutationObserver(() => {
            if (document.querySelector(".watch-video")) {
                waitForVideoPlayer();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function showTimeElapsed(timelineKnob) {
    const initialValueNow = timelineKnob.getAttribute('aria-valuenow');
    let leftTimeContainer = document.querySelector('.elapsed-time-container');

    if (leftTimeContainer) {
        const currentTime = leftTimeContainer.innerHTML;
        const newTime = formatTime(initialValueNow);

        if (currentTime !== newTime) {
            leftTimeContainer.innerHTML = newTime;
        }
        return;
    }

    leftTimeContainer = document.createElement('div');
    leftTimeContainer.className = 'elapsed-time-container';
    leftTimeContainer.style.paddingRight = '1rem';
    leftTimeContainer.style.marginTop = 'auto';
    leftTimeContainer.innerHTML = formatTime(initialValueNow);

    const timeline = document.querySelector('[data-uia="timeline-bar"');

    if (timeline) {
        let wrapper = document.createElement("div");
        wrapper.id = "wrapper";

        timeline.parentNode.insertBefore(wrapper, timeline);

        wrapper.appendChild(leftTimeContainer);
        wrapper.appendChild(timeline);

        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'space-between';
        wrapper.style.fontSize = '1.6rem';

        timeline.style.marginTop = 'auto';
    }
}

function waitForTimebar() {
    const timelineKnob = document.querySelector('[data-uia="timeline-knob"]');
    if (timelineKnob) {
        timelineKnob.style.display = 'flex';
        timelineKnob.style.flexDirection = 'row';
        const observer = new MutationObserver(() => {
            const currentValue = timelineKnob.getAttribute('aria-valuenow');
            const formattedTime = formatTime(currentValue);

            let leftTimeContainer = document.querySelector('.elapsed-time-container');
            if (leftTimeContainer && leftTimeContainer.innerHTML !== formattedTime) {
                leftTimeContainer.innerHTML = formattedTime;
            }
        });

        observer.observe(timelineKnob, {
            attributes: true,
            attributeFilter: ['aria-valuenow'],
        });

        showTimeElapsed(timelineKnob);
    } else {
        const observer = new MutationObserver(() => {
            if (document.querySelector('[data-uia="timeline-knob"]')) {
                waitForTimebar();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}
