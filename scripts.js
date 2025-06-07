// Classes
class SocialMediaButtonData {
    constructor(name, iconSVGPath, buttonText, cssClass, link, viewBox, hotLink) {
        this.name = name;
        this.iconSVGPath = iconSVGPath;
        this.buttonText = buttonText;
        this.cssClass = cssClass;
        this.link = link;
        this.viewBox = viewBox;
        this.hotLink = hotLink; // This line was added
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

function renderLinksSection(hotLinksDataArray, regularLinksDataArray, isLiveBannerActive) {
    const liveBannerClass = isLiveBannerActive ? 'live-banner-active' : '';
    return `
        <div class="linksSection ${liveBannerClass}">
            ${renderHotLinksSection(hotLinksDataArray)}
            ${renderRegularLinksSection(regularLinksDataArray)}
        </div>
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
        .then(rawJsonData => { // Changed parameter name for clarity
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
            // This is the primary fix for the TypeError
            const socialMediaButtons = rawJsonData.map(item =>
                new SocialMediaButtonData(item.name, item.iconSVGPath, item.buttonText, item.cssClass, item.link, item.viewBox, item.hotLink)
            );

            // 2. Prepare hot and regular links data using the new instances
            const hotLinksData = socialMediaButtons.filter(button => button.hotLink);
            const regularLinksData = socialMediaButtons.filter(button => !button.hotLink);

            // 3. Render hot and regular links sections
            const hotLinksHtml = renderHotLinksSection(hotLinksData);
            const regularLinksHtml = renderRegularLinksSection(regularLinksData);

            // 4. Render and append the main links section
            // Note: isLiveBannerActive was passed to renderLinksSection, but its use here is not defined by external calls.
            // If the live banner logic is external, you might manage its visibility directly.
            container.innerHTML += renderLinksSection(hotLinksHtml, regularLinksHtml, false); // Placeholder for isLiveBannerActive

            // 5. Render and append the Live Status Banner (initially hidden)
            // No specific call for getYoutubeLiveStatus or setInterval as per your request
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