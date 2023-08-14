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
    selectedCountry = searchCountry(countryName, countries); // invokes searchCountry function, and passes the countryname and countries array as arguments
    newCountryCard(selectedCountry);
  });


  function searchCountry(name, countries) {
    // takes in country name that we inputting and returns the data
    const country = countries.find(
      // uses array find method to search for a country whose common name matches the entered name
      (countryData) =>
        countryData.name.common.toLowerCase() === name.toLowerCase() // case insensitive
    );

    if (country) {
      selectedCountry = country
      console.log(country);
      const cardContainer = document.querySelector('.card-container');
      const newCard = newCountryCard(selectedCountry);
      cardContainer.appendChild(newCard);
      // Display the country information on your webpage or perform other actions
     // console.log(country);
    } else {
      console.log("Country not found"); //if no country is found it returns country not found
    }
  }
});

function newCountryCard(selectedCountry) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  const img = document.createElement("img");
  img.src = selectedCountry.flags.png;
  const h2 = document.createElement("h2");
  h2.textContent = selectedCountry.name.common;
  const population = document.createElement("p");
  population.textContent = "Population:" + selectedCountry.population;

  cardContainer.appendChild(img);
  cardContainer.appendChild(h2);
  cardContainer.appendChild(population);

  return cardContainer;
}

//  
// }
//countries.population
//countries.name.common
//countries.capital [0]
//countries.currencies
//countries.continents

