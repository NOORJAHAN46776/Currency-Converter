const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".fa-arrow-right-arrow-left");

// Populate dropdowns with countryList
for (let select of dropdowns) {
  for (let code in countryList) {
    let option = document.createElement("option");
    option.value = code;
    option.innerText = code;
    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;
    select.append(option);
  }
  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Update flag icon
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  element.parentElement.querySelector("img").src =
    `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch and update exchange rate
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value) || 1;
  amount.value = amtVal;

  const URL = `${BASE_URL}?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    let res = await fetch(URL);
    if (!res.ok) throw new Error("Fetch failed");
    let data = await res.json();

    let rate = data.rates[toCurr.value];
    if (!rate) {
      msg.innerText = "Conversion rate not available!";
      return;
    }

    msg.innerText = `${amtVal} ${fromCurr.value} = ${rate.toFixed(2)} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = "Error fetching exchange rate!";
    console.error(err);
  }
}

// Swap currencies
swapIcon.addEventListener("click", () => {
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// On page load
window.addEventListener("load", updateExchangeRate);

// On button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});