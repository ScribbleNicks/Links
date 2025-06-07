// Classes
class SocialMediaButtonData {
    constructor(name, iconSVGPath, buttonText, cssClass, link, viewBox) {
        this.name = name;
        this.iconSVGPath = iconSVGPath;
        this.buttonText = buttonText;
        this.cssClass = cssClass;
        this.link = link;
        this.viewBox = viewBox;
    }

    getIconSVG() {
        return `<svg class="buttonIcon stickerEffect" viewBox="${this.viewBox}" fill="currentColor"><path d="${this.iconSVGPath}"></path></svg>`;
    }

    getBigIconSVG() {
        return `<svg class="buttonIcon buttonIconBig stickerEffect" viewBox="${this.viewBox}" fill="currentColor"><path d="${this.iconSVGPath}"></path></svg>`;
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
    fetch('data/socialMediaData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.querySelector('.containerWrapper');
            if (!container) {
                console.error("Error: '.containerWrapper' not found in the DOM.");
                return;
            }

            const linksSection = document.createElement('div');
            linksSection.className = 'linksSection';

            const hotLinksSection = document.createElement('div');
            hotLinksSection.className = 'hotLinksSection';
            const regularLinksSection = document.createElement('div');
            regularLinksSection.className = 'regularLinksSection';

            data.forEach(item => {
                const buttonData = new SocialMediaButtonData(item.name, item.iconSVGPath, item.buttonText, item.cssClass, item.link, item.viewBox);

                if (item.hotLink) {
                    hotLinksSection.innerHTML += renderHotLinkButton(buttonData);
                } else {
                    regularLinksSection.innerHTML += renderRegularButton(buttonData);
                }
            });

            linksSection.appendChild(hotLinksSection);
            linksSection.appendChild(regularLinksSection);
            container.appendChild(linksSection);
        })
        .catch(error => {
            console.error("Failed to load social media links:", error);
            const container = document.querySelector('.containerWrapper');
            if (container) {
                container.innerHTML = "<p>Failed to load links. Please try again later.</p>";
            }
        });
});