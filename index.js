const countriesURL = "https://restcountries.com/v3.1/all?name";

let selectedCountry;
function getCountries(url) {
  // takes URL as argument. uses fetch to get the countries + a variety of .then and catch. error thrown if response not ok
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

getCountries(countriesURL).then((countries) => {
  //invokes get countries and sets up subsequent steps with data (adding submit form)

  const searchForm = document.getElementById("search-form"); // finds and stores a referece to the html form element with id search form
  searchForm.addEventListener("submit", function (event) {
    // adds event listener to the search form. when someone submits a country, the below happens
    event.preventDefault();
    const countryName = document.getElementById("country-input").value; //retrieves the value entered in the input field and stores it in the countryName variable
    selectedCountry = searchCountry(countryName, countries);
    searchForm.reset(); // invokes searchCountry function, and passes the countryname and countries array as arguments
  });

  function searchCountry(name, countries) {
    // takes in country name that we inputting and returns the data
    const country = countries.find(
      // uses array find method to search for a country whose common name matches the entered name
      (countryData) =>
        countryData.name.common.toLowerCase() === name.toLowerCase() // case insensitive
    );

    if (country) {
      selectedCountry = country;
      console.log(country);
      const cardContainer = document.querySelector(".card-container");
      const newCard = newCountryCard(selectedCountry);
      cardContainer.appendChild(newCard);
      // Display the country information on your webpage or perform other actions
      // console.log(country);
    } else {
      window.alert("That's not a country name silly. Try again!");
      // console.log("Country not found"); //if no country is found it returns country not found
    }
  }
});

function newCountryCard(selectedCountry) {
  const saveButton = document.createElement("button");
  saveButton.className = "save";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
  saveCountry(selectedCountry);
    const saveBar = document.querySelector("#saveBar");
    saveBar.textContent = "";
    saveButton.textContent = "Country Saved!";
  });

  const toggleButton = document.createElement("button"); // toggle to display coat of arms/size/could be anything**
  toggleButton.className = "toggle";
  toggleButton.textContent = "Coat of Arms";

  const hiddenContainer = document.createElement("div");
  hiddenContainer.style.display = "none";

  const pic = document.createElement("img");
  pic.className = "coat";
  pic.src = selectedCountry.coatOfArms.png;
  pic.alt = "Image of Coat of Arms"

  hiddenContainer.appendChild(pic);

  let visible = false;
  toggleButton.addEventListener("mouseover", (e) => {
    visible = !visible;
    hiddenContainer.style.display = visible ? "block" : "none";
  });

  const deleteButton = document.createElement("button"); //creates delete button to get rid of card container
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", (e) => {
    cardContainer.remove();
  });
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  const img = document.createElement("img");
  img.className = "flag";
  img.src = selectedCountry.flags.png;

  const h2 = document.createElement("h2");
  h2.textContent = selectedCountry.name.common;

  const population = document.createElement("p");
  const populationNumber = selectedCountry.population;
  const commaPopulation = populationNumber.toLocaleString();
  population.textContent = `Population: ${commaPopulation}`;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${selectedCountry.capital}`;

  const languages = document.createElement("p");
  languages.textContent = `Languages: ${Object.values(
    selectedCountry.languages
  ).join (", ")}`;

  const currency = document.createElement("span");
  const firstCurrencyKey = Object.keys(selectedCountry.currencies)[0];
  const firstCurrency = selectedCountry.currencies[firstCurrencyKey];
  currency.innerHTML = `Currency: ${firstCurrency.name}<br><br>Symbol: ${firstCurrency.symbol}`;

  const subRegion = document.createElement("p");
  subRegion.textContent = `Region: ${selectedCountry.subregion}`;

  const size = document.createElement("p");
  const sizeNumber = selectedCountry.area;
  const commaSize = sizeNumber.toLocaleString();
  size.innerHTML = `Size: ${commaSize} km&sup2`;

  cardContainer.appendChild(img);
  cardContainer.appendChild(h2);
  cardContainer.appendChild(population);
  cardContainer.appendChild(capital);
  cardContainer.appendChild(languages);
  cardContainer.appendChild(currency);
  cardContainer.appendChild(subRegion);
  cardContainer.appendChild(size);
  cardContainer.appendChild(deleteButton);
  cardContainer.appendChild(toggleButton);
  cardContainer.appendChild(saveButton);
  cardContainer.appendChild(hiddenContainer);

  return cardContainer;
}

function saveCountry(selectedCountry) {
  //accessing local storage and naming the container that it was stored in "savedCountries"
  let savedCountries = JSON.parse(localStorage.getItem("savedCountries"));

  if (!savedCountries) {
    savedCountries = [];
  }
  //you're pushing the selectedCountry into the array, javaScript infers that it's an array based on the operations performed on it
  savedCountries.push(selectedCountry);
  //you're placing the selectedCountry in local storage in a format that the local storage can read i.e. JSON.stringify;
  localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  console.log(savedCountries);
}
//function to create the buttons to click out of and open the countries in the saveBar
document.addEventListener("DOMContentLoaded", (e) => {
  const saveBar = document.querySelector("#saveBar"); //accessing saveBar element in html
  const savedCountries = JSON.parse(localStorage.getItem("savedCountries")); //accessing local storage

  //if else statement saying if the local storage array "savedCountries" has data inside of it(not empty), then it will perform the following:
  if (savedCountries && savedCountries.length > 0) {
    //looping through the savedCountries array that creates div for the name, open button, and delete button.
    savedCountries.forEach((selectedCountry, index) => {
      const savedCountryDiv = document.createElement("div");
      savedCountryDiv.className = "savedCountryDiv";

      const countryName = document.createElement("span");
      countryName.textContent = selectedCountry.name.common;

      const openButton = document.createElement("button");
      openButton.textContent = "Open";

      openButton.addEventListener("click", () => {
        const cardContainer = document.querySelector(".card-container");
        const savedCard = newCountryCard(selectedCountry);
        cardContainer.appendChild(savedCard);
        console.log(selectedCountry);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", (e) => {
        //deletes item of the array based on the index
        deleteSavedItem(index);
        savedCountryDiv.remove(); //removes the entire div from the saveBar
      });

      savedCountryDiv.appendChild(countryName);
      savedCountryDiv.appendChild(openButton);
      savedCountryDiv.appendChild(deleteButton);
      saveBar.appendChild(savedCountryDiv);
    });
  } else {
    saveBar.textContent = "No Saved Countries";
  }
});

function deleteSavedItem(index) {
  //accesses the saved countries array from local storage
  const savedCountries = JSON.parse(localStorage.getItem("savedCountries"));
  //uses the splice method to remove the item at the index it's in
  savedCountries.splice(index);
  //updates the modified savedCountries array in local storage
  localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
}
