document.addEventListener("DOMContentLoaded", () => {
    const skipIntroCheckbox = document.getElementById("skipIntro");
    const nextEpisodeCheckbox = document.getElementById("nextEpisode");


    chrome.storage.sync.get(["skipIntro", "nextEpisode"], (data) => {
        if (data.skipIntro !== undefined) skipIntroCheckbox.checked = data.skipIntro;
        if (data.nextEpisode !== undefined) nextEpisodeCheckbox.checked = data.nextEpisode;
    });


    skipIntroCheckbox.addEventListener("change", (event) => {
        chrome.storage.sync.set({ skipIntro: event.target.checked });
    });

    nextEpisodeCheckbox.addEventListener("change", (event) => {
        chrome.storage.sync.set({ nextEpisode: event.target.checked });
    });

    document.getElementById('donate-btn').addEventListener('click', function() {
        chrome.tabs.create({ 
          url: 'https://www.paypal.me/marijnanth'
        });
      });
});
