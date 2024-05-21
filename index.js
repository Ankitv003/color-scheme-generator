const displayDiv = document.querySelector(".display-color");
const inputColor = document.querySelector(".input-color");
fetch(
  `https://www.thecolorapi.com/scheme?hex=${inputColor}&format=json&mode=analogic&count=5`,
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
  .then((data) => console.log(data))
  .catch((error) => console.error("Fetch error:", error));
