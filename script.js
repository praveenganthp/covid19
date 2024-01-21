document.addEventListener("DOMContentLoaded", function () {
  const covidContainer = document.getElementById("covid-container");

  const covid19ApiUrl =
    "https://data.covid19india.org/csv/latest/raw_data1.csv";

  // fetch data from covid19url
  fetch(covid19ApiUrl)
    .then((response) => response.text()) // Process response as text
    .then((data) => {
      const parsedData = parseCSV(data); // Parse CSV data into an array
      displayCovid19(parsedData);
    })
    .catch((error) => console.error("Error fetching details:", error));

  function parseCSV(csv) {
    // Split CSV into rows and parse each row into an object
    const rows = csv.split("\n");
    const header = rows[0].split(",");
    return rows.slice(1).map((row) => {
      const values = row.split(",");
      return header.reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});
    });
  }

 function displayCovid19(covid19) {
   covidContainer.innerHTML = "";

   let currentRow;
   let cardCount = 0;

   // Filter entries with nationality as "India"
   const indiaData = covid19.filter(
     (entry) => entry.Nationality && entry.Nationality.toLowerCase() === "india"
   );


   for (const stateData of indiaData) {
     const card = createCard(stateData);

     if (cardCount % 3 === 0) {
       // Create a new row for every 3 cards
       currentRow = document.createElement("div");
       currentRow.classList.add("row", "mb-3");
       covidContainer.appendChild(currentRow);
     }

     currentRow.appendChild(card);
     cardCount++;
   }
 }

  function createCard(stateData) {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-3");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card", "h-100", "card-body");

    cardBody.innerHTML = `
      <h5 class="card-title">Patient ${stateData["Patient Number"]}</h5>
    <p class="card-text">State: ${stateData["State Patient Number"] ||" N/A"}</p>
    <p class="card-text">Date Announced: ${stateData["Date Announced"]}</p>
    <p class="card-text">Age Bracket: ${stateData["Age Bracket"]}</p>
    <p class="card-text">Gender: ${stateData["Gender"]}</p>
    <p class="card-text">City: ${stateData["Detected City"]}</p>
    <p class="card-text">State: ${stateData["Detected State"]}</p>
    <p class="card-text">Status: ${stateData["Current Status"]}</p>
    <p class="card-text">Notes: ${stateData["Notes"]}</p>
    <p class="card-text">Nationality: ${stateData["Nationality"]}</p>
  `;

    card.appendChild(cardBody);
    return card;
  }
});
