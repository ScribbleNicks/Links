// Classes
class SocialMediaButtonData {
    constructor(name, iconSVGPath, buttonText, cssClass, link) {
        this.name = name; // e.g., "Twitch"
        this.iconSVGPath = iconSVGPath; // Only the path part of the SVG
        this.buttonText = buttonText;
        this.cssClass = cssClass; // e.g., "twitchButton"
        this.link = link;
    }

    getIconSVG() {
        return `<svg class="buttonIcon stickerEffect" viewBox="0 0 24 24" fill="currentColor"><path d="${this.iconSVGPath}"></path></svg>`;
    }
}

// Live Updates


// HTML Functions
function renderProfileCard() {
    return `
        <div class="profileCard stickerEffect">
            <img src="Images/Profile Card/banner.png" alt="Banner Image" class="bannerImage">
            <img src="Images/Profile Card/profilePic.png" alt="Profile Picture" class="profilePicture stickerEffect">
            <h1 class="username">Scribble Nicks</h1>
            <p class="description">Just a little doodle guy who likes to play games and make things.</p>
        </div>
    `;
}

function renderLiveStatusBanner(isVisible = false) {
    const hiddenClass = isVisible ? '' : 'hidden';
    return `
        <div class="liveStatusBanner stickerEffect ${hiddenClass}">
            <p>🔴 LIVE NOW!</p>
        </div>
    `;
}

function renderHotLinkButton(data) {
    return `
        <a href="${data.link}" target="_blank" class="button hotLinkButton ${data.cssClass} stickerEffect">
            ${data.getIconSVG()}
            <span class="buttonText">${data.buttonText}</span>
        </a>
    `;
}

function renderRegularButton(data) {
    return `
        <a href="${data.link}" target="_blank" class="button ${data.cssClass} stickerEffect">
            ${data.getIconSVG()}
            <span class="buttonText">${data.buttonText}</span>
        </a>
    `;
}

function renderHotLinksSection(hotLinksDataArray) {
    let hotLinksHtml = hotLinksDataArray.map(data => renderHotLinkButton(data)).join('');
    return `<div class="hotLinksSection">${hotLinksHtml}</div>`;
}

function renderRegularLinksSection(regularLinksDataArray) {
    let regularLinksHtml = regularLinksDataArray.map(data => renderRegularButton(data)).join('');
    return `<div class="regularLinksSection">${regularLinksHtml}</div>`;
}

function renderLinksSection(hotLinksDataArray, regularLinksDataArray, isLiveBannerActive) {
    const liveBannerClass = isLiveBannerActive ? 'live-banner-active' : '';
    return `
        <div class="linksSection ${liveBannerClass}">
            ${renderHotLinksSection(hotLinksDataArray)}
            ${renderRegularLinksSection(regularLinksDataArray)}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const containerWrapper = document.querySelector('.containerWrapper');

    let socialMediaData = [];
    try {
        const response = await fetch('data/socialMediaData.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        socialMediaData = data.map(item => new SocialMediaButtonData(
            item.name,
            item.iconSVGPath,
            item.buttonText,
            item.cssClass,
            item.link
        ));
    } catch (error) {
        console.error("Failed to load social media data:", error);
        containerWrapper.innerHTML = '<p style="color: red; text-align: center;">Failed to load links. Please try again later.</p>';
        return;
    }

    const hotLinks = socialMediaData.slice(0, 3);
    const regularLinks = socialMediaData.slice(3);

    const isLive = false; 

    const profileCardHtml = renderProfileCard();
    const liveBannerHtml = renderLiveStatusBanner(isLive);
    const linksSectionHtml = renderLinksSection(hotLinks, regularLinks, isLive);

    containerWrapper.innerHTML = `
        <div class="container stickerEffect">
            <div class="profileCardWrapper">
                ${profileCardHtml}
            </div>
            ${liveBannerHtml}
            ${linksSectionHtml}
        </div>
    `;
});