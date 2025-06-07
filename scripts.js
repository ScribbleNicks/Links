// Classes
class SocialMediaButtonData {
    constructor(name, iconPNGPath, buttonText, cssClass, link, hotLink) {
        this.name = name;
        this.iconPNGPath = iconPNGPath;
        this.buttonText = buttonText;
        this.cssClass = cssClass;
        this.link = link;
        this.hotLink = hotLink;
    }

    getIconPNG() {
        return `<img class="buttonIcon stickerEffect" src="${this.iconPNGPath}" alt="${this.name} icon">`;
    }

    getBigIconPNG() {
        return `<img class="buttonIcon buttonIconBig stickerEffect" src="${this.iconPNGPath}" alt="${this.name} icon">`;
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
            ${data.getBigIconPNG()} <span class="buttonText">${data.buttonText}</span>
        </a>
    `;
}

function renderRegularButton(data) {
    return `
        <a href="${data.link}" target="_blank" class="button ${data.cssClass} stickerEffect">
            ${data.getIconPNG()} <span class="buttonText regularLinkButtonText">${data.buttonText}</span>
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

function renderLinksSection(hotLinksHtmlString, regularLinksHtmlString, isLiveBannerActive) {
    const liveBannerClass = isLiveBannerActive ? 'live-banner-active' : '';
    return `
        <div class="linksSection ${liveBannerClass}">
            ${hotLinksHtmlString}
            ${regularLinksHtmlString}
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
            item.iconPNGPath,
            item.buttonText,
            item.cssClass,
            item.link,
            item.hotLink
        ));
    } catch (error) {
        console.error("Failed to load social media data:", error);
        containerWrapper.innerHTML = '<p style="color: red; text-align: center;">Failed to load links. Please try again later.</p>';
        return;
    }

    const hotLinks = socialMediaData.filter(item => item.hotLink);
    const regularLinks = socialMediaData.filter(item => !item.hotLink);

    const isLive = true;

    const profileCardHtml = renderProfileCard();
    const liveBannerHtml = renderLiveStatusBanner(isLive);
    const hotLinksHtml = renderHotLinksSection(hotLinks);
    const regularLinksHtml = renderRegularLinksSection(regularLinks);
    const linksSectionHtml = renderLinksSection(hotLinksHtml, regularLinksHtml, isLive);

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