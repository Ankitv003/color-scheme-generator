const inputColor = document.querySelector(".input-color");
const formButton = document.querySelector(".btn");
const selectedOption = document.getElementById("option-box");
let coloursArr = [];

formButton.addEventListener("click", function (e) {
  e.preventDefault();
  fetchColors();
});

document.addEventListener("DOMContentLoaded", function () {
  fetchColors();
});

function fetchColors() {
  const colorHex = inputColor.value.slice(1);
  const mode = selectedOption.value;

  fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${mode}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((colourData) => {
      coloursArr = colourData.colors.map((colour) => colour.hex.value);
      renderScheme();
    })
    .catch((error) => console.error("Fetch error:", error));
}

function renderScheme() {
  coloursArr.forEach((colour, index) => {
    const i = index + 1;
    const colourColumn = document.getElementById(`colour-column-${i}`);
    const colourDiv = document.getElementById(`colour-${i}`);
    const colourText = document.getElementById(`colour-${i}-text`);

    colourColumn.dataset.colour = colour;
    colourDiv.style.backgroundColor = colour;
    colourText.textContent = colour;
    colourColumn.removeEventListener("click", copyHexCode);
    colourColumn.addEventListener("click", copyHexCode);
  });
}
function copyHexCode(event) {
  const hexCode = event.currentTarget.dataset.colour;
  if (hexCode) {
    navigator.clipboard
      .writeText(hexCode)
      .then(() => {
        const message = document.createElement("div");
        message.textContent = `Copied ${hexCode}😁`;
        message.classList.add("copy-message");
        document.body.appendChild(message);

        // Remove the message after a certain duration (e.g., 2 seconds)
        setTimeout(() => {
          document.body.removeChild(message);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  }
}

/**
 * Utility function to calculate the current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode.
 */
function calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
}) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
 * Utility function to update the button text and aria-label.
 */
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "🌙" : "🌞";
  // use an aria-label if you are omitting text on the button
  // and using a sun/moon icon, for example
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
 * Utility function to update the theme setting on the html tag
 */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

/**
 * On page load:
 */

/**
 * 1. Grab what we need from the DOM and system settings on page load
 */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Work out the current site settings
 */
let currentThemeSetting = calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
});

/**
 * 3. Update the theme setting and button text accoridng to current settings
 */
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
 * 4. Add an event listener to toggle the theme
 */
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
});
