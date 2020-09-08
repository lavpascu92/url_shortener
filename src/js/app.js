// DECLARE VARIABLES
const arrOfColors = ['#2191fb', '#ba274a', '#190b75', '#e55381', '#685762', '#474a2c', '#59a96a', '#6a7fdb'];

const formEl = document.getElementById('form');
const textInputEl = document.getElementById('text-input');
const errorAlertSpan = document.getElementById('error-alert');
const spanEl = document.getElementById('generated-url');
const copyBtnEl = document.getElementById('copy-btn');

const preloaderSpanEl = document.getElementById('preloader');
// Regex for testing if valid URL
const validUrlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

// EVENT LISTENERS
formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const textValue = textInputEl.value;
    // Test if the submitted url is a valid link
    let isValidUrl = validUrlRegex.test(textValue);
    if (!isValidUrl) {
        errorAlertSpan.classList.add('visible');
        textInputEl.classList.add('error');

    } else {
        errorAlertSpan.classList.remove('visible');
        textInputEl.classList.remove('error');
        generateShortUrl(textValue);
        showPreloader(true);
    }
    // Reset tooltip on the copy btn
    copyBtnEl.title = "Copy here!";
});

copyBtnEl.addEventListener('click', function () {
    // Get the child of the span->> the anchor link generated before
    let linkEl = spanEl.childNodes[0];
    let linkElValue = linkEl.innerHTML;
    copyUrlToClipboard(linkElValue);
    // Set tooltip to 'copied!' on the copy btn
    copyBtnEl.title = "Copied!";
});


// FUNCTIONS

// FETCH POST REQUEST FROM rel.ink API
async function generateShortUrl(url) {
    try {
        const result = await fetch('https://rel.ink/api/links/', {
            method: 'POST',
            body: JSON.stringify({
                url: url
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await result.json();
        const shortUrl = `https://rel.ink/${data.hashid}`;
        displayToPage(shortUrl);
        showPreloader(false);
    } catch (error) {
        console.error(`Error: ${error}`);
    }

}
// DISPLAY THE SHORTENED URL
function displayToPage(url) {
    spanEl.innerHTML = `<a id="link" href="${url}" target="_blank" class="generated-url-link">${url}</a>`;
    // Get the anchor link after is generated
    let generatedLink = document.getElementById('link');
    // Style the link with random colors
    generatedLink.style.color = pickRandomColors(arrOfColors);
}

// COPY TO CLIPBOARD THE SHORTENED URL
function copyUrlToClipboard(url) {
    // Create a texarea element
    let textarea = document.createElement('textarea');
    // Give the texarea elem the text from url
    textarea.innerHTML = url;
    // Add the texarea with the url text to body
    document.body.appendChild(textarea);
    // Select the text inside the elem
    textarea.select();
    // Copy the selected text to clipboard
    let result = document.execCommand('copy');
    // Remove the textarea from body
    document.body.removeChild(textarea);

    return result;
}
// Picks random colors from array to differentiate the shortened links when generating them
function pickRandomColors(arrOfColors) {
    let randIdx = Math.floor(Math.random() * arrOfColors.length + 1);
    return arrOfColors[randIdx];
}
// Preloader animation when fetching from API
function showPreloader(boolean) {
    if (boolean) {
        preloaderSpanEl.style.display = "inline";
        spanEl.style.display = "none";
    } else {
        preloaderSpanEl.style.display = "none";
        spanEl.style.display = "inline";

    }
}