const displayDiv = document.querySelector("#display-color");
const inputColor = document.querySelector(".input-color");
const button = document.querySelector(".btn");
const selectedOption = document.getElementById("option-box");

const imageEl = document.createElement("img");
imageEl.classList = "image-theme";
button.addEventListener("click", function () {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${inputColor.value.slice(
      1
    )}&format=json&mode=${selectedOption.value}&count=5`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status:${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      imageEl.src = data.image.bare;
      displayDiv.appendChild(imageEl);
      console.log(data);

      const hexDiv = document.createElement("div");

      data.colors.forEach((color) => {
        const colorCodeEl = document.createElement("div");
        colorCodeEl.classList.add("color-code");
        colorCodeEl.textContent = color.hex.value;
        hexDiv.appendChild(colorCodeEl);
      });

      displayDiv.appendChild(hexDiv);
    })
    .catch((error) => console.error("Fetch error:", error));
  // console.log(inputColor.value);
  // console.log(selectedOption.value);
});
