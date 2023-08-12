const makeupURL = "http://makeup-api.herokuapp.com/api/v1/products.json";

function getMakeup(url) {
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

const makeupResponse = getMakeup(makeupURL);

makeupResponse.then((makeup) => {
  for (let i = 0; i < makeup.length; i++) {
    console.log(makeup[i]);
  }
});
