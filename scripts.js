// Classes
class SocialMediaButtonData {
    constructor(name, iconSVGPath, buttonText, cssClass, link, viewBox, hotLink) {
        this.name = name;
        this.iconSVGPath = iconSVGPath;
        this.buttonText = buttonText;
        this.cssClass = cssClass;
        this.link = link;
        this.viewBox = viewBox;
        this.hotLink = hotLink;
    }

    getIconSVG() {
        return `<svg class="buttonIcon stickerEffect" viewBox="${this.viewBox}" fill="currentColor"><path d="${this.iconSVGPath}"></path></svg>`;
    }

    getBigIconSVG() {
        return `<svg class="buttonIcon buttonIconBig stickerEffect" viewBox="${this.viewBox}" fill="currentColor"><path d="${this.iconSVGPath}"></path></svg>`;
    }
}


// Live Updates (This section remains as you provided it, blank)


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
            ${data.getBigIconSVG()}
            <span class="buttonText">${data.buttonText}</span>
        </a>
    `;
}

function renderRegularButton(data) {
    return `
        <a href="${data.link}" target="_blank" class="button regularButton ${data.cssClass} stickerEffect">
            ${data.getIconSVG()}
            <span class="buttonText">${data.buttonText}</span>
            <span class="buttonArrow"></span>
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

// FIX: This function now expects the already-rendered HTML strings for the sections.
function renderLinksSection(hotLinksHtmlString, regularLinksHtmlString, isLiveBannerActive) {
    const liveBannerClass = isLiveBannerActive ? 'live-banner-active' : '';
    return `
        <div class="linksSection ${liveBannerClass}">
            ${hotLinksHtmlString}  ${regularLinksHtmlString} </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch social media data first
    fetch('data/socialMediaData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(rawJsonData => {
            const container = document.querySelector('.containerWrapper');
            if (!container) {
                console.error("Error: '.containerWrapper' not found in the DOM.");
                return;
            }

            // Clear existing content to ensure a clean slate for dynamic rendering
            container.innerHTML = '';

            // 1. Render and append the Profile Card
            container.innerHTML += renderProfileCard();

            // Transform raw JSON objects into SocialMediaButtonData instances
            const socialMediaButtons = rawJsonData.map(item =>
                new SocialMediaButtonData(item.name, item.iconSVGPath, item.buttonText, item.cssClass, item.link, item.viewBox, item.hotLink)
            );

            // 2. Prepare hot and regular links data using the new instances
            const hotLinksData = socialMediaButtons.filter(button => button.hotLink);
            const regularLinksData = socialMediaButtons.filter(button => !button.hotLink);

            // 3. Render hot and regular links sections
            // These now correctly produce the HTML strings
            const hotLinksHtml = renderHotLinksSection(hotLinksData);
            const regularLinksHtml = renderRegularLinksSection(regularLinksData);

            // 4. Render and append the main links section
            // FIX: Pass the HTML strings directly to renderLinksSection
            container.innerHTML += renderLinksSection(hotLinksHtml, regularLinksHtml, false);

            // 5. Render and append the Live Status Banner (initially hidden)
            container.innerHTML += renderLiveStatusBanner(false);
        })
        .catch(error => {
            console.error("Failed to load social media links:", error);
            const container = document.querySelector('.containerWrapper');
            if (container) {
                // Display a fallback message if data fails to load
                container.innerHTML = "<p>Failed to load links. Please try again later.</p>";
            }
        });
});