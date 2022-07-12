const cityNameInput = document.querySelector("#city-name");
const searchForm = document.querySelector("#Search");
const currentConditionsUl = document.querySelector("#current-forecast #conditions");
const currentConditionsH3 = document.querySelector("#current-forecast h3");
const previousSearches = document.querySelector("#previous-searches");
const previousSearchContainer = document.querySelector("#previous-searches .card-body");
const dailyCardContainer = document.querySelector("#dailyForcast");
const fiveDayHeader = document.querySelector("#fiveDay");

const localCityArray = [];

let previousSearch = JSON.parse(localStorage.getItem("searches"));

if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        } else {
    
            localCityArray.push(previousSearch[i]);
        }
    }
}

const updateSearchHistory = () => {
    previousSearch = JSON.parse(localStorage.getItem("searches"));

    const existingButtons = document.querySelectorAll("#previous-searches button");

        for (let i = 0; i < previousSearch.length; i++) {
            const searchButton = document.createElement("button");
            searchButton.classList.add("m-2", "btn", "btn-light");
            searchButton.dataset.city = previousSearch[i];
            searchButton.textContent = previousSearch[i];
            searchButton.addEventListener("click", (event) => {
                
                callOpenWeather(event.target.dataset.city);
            })
            previousSearchContainer.appendChild(searchButton); 
        }
    }
const updateLocalStorage = (city) => {
    
    if (localCityArray.includes(city)) {
        return;
    } else {
        localCityArray.push(city);

        localStorage.setItem("searches", JSON.stringify(localCityArray));
        
        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
   
    const apiUrlCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0656324568a33303c80afd015f0c27f8";

    fetch(apiUrlCoords)
    .then(function (response) {
    
        if (!response.ok) {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Never heard of this city 🤨";
            const errorText = document.createElement("li");
            errorText.classList.add("listEl");
            errorText.textContent = "";
            currentConditionsUl.appendChild(errorText);
            dailyCardContainer.innerHTML = "";
            
            fiveDayHeader.classList.add("hidden");
        } else {
            
            response.json()
        .then(function (data) {
            
            const cityName = data.name;

            
            const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=0656324568a33303c80afd015f0c27f8`;
            
            
            fetch(oneCallUrl)
            .then(function (response) {
                if (response.ok) {
                    
                    response.json()
            .then(function (data) {

                const icon = ("<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon);

                
                currentConditionsH3.innerHTML = cityName + " (" + moment().format("MM/DD/YYYY") + ") " + icon;

                const liArray = [];
                
                
                currentConditionsUl.innerHTML = "";

                
                for (let i = 0; i < 4; i++) {
                    const li = document.createElement("li");
                    li.classList.add("listEl");
                    li.classList.add("mb-2");
                    liArray.push(li);
                }

               
                liArray[0].innerHTML = "Temperature: " + Math.floor(data.current.temp) + " &deg;F" ;
                liArray[1].textContent = "Humidity: " + data.current.humidity + "%";
                liArray[2].textContent = "Wind Speed: " + Math.floor(data.current.wind_speed) + " MPH";

                
                const uvi = Math.floor(data.current.uvi);

                
                if (uvi <= 2) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-info uv">${uvi}</button>`;
                } else if (uvi > 2 && uvi <= 5) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-success uv">${uvi}</button>`;
                } else if (uvi > 5 && uvi <= 8) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-warning uv">${uvi}</button>`;
                } else {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-danger uv">${uvi}</button>`;
                }

                
                liArray.forEach(li => {
                    currentConditionsUl.append(li);
                })

                let dailyArray = [];

                dailyCardContainer.innerHTML = "";

                
                for (let i = 0; i < 5; i++) {
                    const dailyCard = document.createElement("div");
            
                    
                    dailyCard.innerHTML = `
                    <div id=cincoCard class="p-2 m-2 card">
                        <h5>${moment().add(i + 1, "days").format("MM/DD/YYYY")}</h5>
                        <ul id=cincoCard>
                            <li id=cincoCard><img src='https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png' alt="Weather icon" class="mx-auto" id=cincoCard></li>
                            <li id=cincoCard>Temp: ${Math.floor(data.daily[i].temp.day)} &deg;F</li>
                            <li id=cincoCard>Humidity: ${data.daily[i].humidity}%</li>
                        </ul>
                    </div>`;

                    
                    dailyArray.push(dailyCard);
                }

                
                fiveDayHeader.classList.remove("hidden");

                
                dailyArray.forEach(card => {
                    dailyCardContainer.appendChild(card);
                })
                
                updateLocalStorage(cityName);
            })
        }
        })
    })
}
})   
}


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

   
    let searchValue = cityNameInput.value.trim("");

    
    if (searchValue === "") {
        currentConditionsH3.textContent = "Enter city name please!😗";
        currentConditionsUl.innerHTML = "";
        dailyCardContainer.innerHTML = "";
        
        fiveDayHeader.classList.add("hidden");
    } else {
        
        callOpenWeather(searchValue);
       
        cityNameInput.value = "";
    }
});


updateSearchHistory();


callOpenWeather("Washington D.C.");