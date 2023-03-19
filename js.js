let header = document.querySelector(".header");
let grid = document.querySelector(".grid");
let currency1 = document.querySelector(".currency1");
let currency2 = document.querySelector(".currency2");
let input = document.querySelector(".input");
let output = document.querySelector(".output");
let toggle = document.querySelector(".toggle");

let searchDiv = document.querySelector(".search-input");
let searchDiv2 = document.querySelector(".search-input2");

let chosenCurrency1;
let chosenCurrency2;
let data;
let dataList;

fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
  .then((response) => response.json())
  .then((json) => (data = json));

setTimeout(function () {
  header.innerHTML = `<em>Last Update: ${data[0].exchangedate}</em>`;
  data.forEach((element) => {
    grid.insertAdjacentHTML(
      "beforeend",
      `<div class="grid__item">
                  <div class="grid__cc">${element.cc}</div>
                  <div class="grid__txt">${element.txt}</div>
                  <div class="grid__rate">${element.rate.toFixed(2)}</div>
                </div>`
    );
    let option = document.createElement("option");
    option.innerHTML = element.cc;
    currency1.appendChild(option);
  });

  dataList = new Array();
  data.forEach((element) => {
    if (element.hasOwnProperty("cc")) {
      dataList.push(element.cc);
    }
  });
}, 300);

input.addEventListener("input", () => {
  getResult();
});

toggle.addEventListener("click", () => {
  searchDiv.classList.toggle("order3");
  searchDiv2.classList.toggle("order1");
  getResult();
});

function getResult() {
  if (
    chosenCurrency1 &&
    chosenCurrency2 &&
    !searchDiv.classList.contains("order3")
  ) {
    let result = (chosenCurrency1 / chosenCurrency2) * input.value;
    output.innerHTML = result.toFixed(2);
  } else if (
    chosenCurrency1 &&
    chosenCurrency2 &&
    searchDiv.classList.contains("order3")
  ) {
    let result = (chosenCurrency2 / chosenCurrency1) * input.value;
    output.innerHTML = result.toFixed(2);
  }
}

currency1.addEventListener("keyup", filterArr);
currency2.addEventListener("keyup", filterArr);

currency1.addEventListener("click", () => {
  autocompleteList = document.createElement("DIV");
  autocompleteList.setAttribute("class", "autocomplete");
  currency1.parentNode.appendChild(autocompleteList);
});
currency2.addEventListener("click", () => {
  autocompleteList = document.createElement("div");
  autocompleteList.setAttribute("class", "autocomplete");
  currency2.parentNode.appendChild(autocompleteList);
});

function filterArr(e) {
  inputValue = this.value;
  if (inputValue) {
    this.parentElement.classList.add("active");
    let filteredArr = dataList.filter(function (word) {
      return word.toUpperCase().includes(inputValue.toUpperCase());
    });
    suggestionGenerator(filteredArr);
  } else {
    this.parentElement.classList.remove("active");
  }
}

function suggestionGenerator(wordArray) {
  let suggestionWord = wordArray
    .map(function (word) {
      return "<li>" + word + "</li>";
    })
    .join("");

  if (suggestionWord) {
    autocompleteList.innerHTML = suggestionWord;
  } else {
    autocompleteList.innerHTML = "<li>" + inputValue.value + "</li>";
  }
  Select();
}
function Select() {
  let allAutocompleteItems = autocompleteList.querySelectorAll("li");
  if (searchDiv.classList.contains("active")) {
    allAutocompleteItems.forEach(function (wordItem) {
      wordItem.addEventListener("click", function (e) {
        currency1.value = e.target.textContent;
        searchDiv.classList.remove("active");
        data.forEach((element) => {
          if (element.cc === currency1.value) {
            chosenCurrency1 = element.rate;
          }
        });
      });
    });
  } else if (searchDiv2.classList.contains("active")) {
    allAutocompleteItems.forEach(function (wordItem) {
      wordItem.addEventListener("click", function (e) {
        currency2.value = e.target.textContent;
        searchDiv2.classList.remove("active");
        data.forEach((element) => {
          if (element.cc === currency2.value) {
            chosenCurrency2 = element.rate;
          }
        });
      });
    });
  }
}
