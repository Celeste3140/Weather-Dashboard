const cityinputt = document.querySelector("#city-name");
const searchForm = document.querySelector("#Search");
const nowclimatelist = document.querySelector("#current-forecast #conditions");
const currentH3 = document.querySelector("#current-forecast h3");
const historys = document.querySelector("#previous-searches");
const buscoDeAntes = document.querySelector("#previous-searches .card-body");
const DiaCard = document.querySelector("#dailyForcast");
const cincodias = document.querySelector("#fiveDay");

const cityArray = [];

let previousSearch = JSON.parse(localStorage.getItem("searches")); 
if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        } else {
    
            cityArray.push(previousSearch[i]); 
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
            buscoDeAntes.appendChild(searchButton); 
        }
    }
const updateLocalStorage = (city) => {
    
    if (cityArray.includes(city)) {
        return;
    } else {
        cityArray.push(city);

        localStorage.setItem("searches", JSON.stringify(cityArray));
        
        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
   
    const APICity = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=a806183978679594b1bdaa14de2497c0";

    fetch(APICity)
    .then(function (response) {
    
        if (!response.ok) {
            nowclimatelist.innerHTML = "";
            currentH3.textContent = "Never heard of this city 🤨";
            const errorText = document.createElement("li");
            errorText.classList.add("listEl");
            errorText.textContent = "";
            nowclimatelist.appendChild(errorText);
            DiaCard.innerHTML = "";
            
            cincodias.classList.add("hidden");
        } else {
            
            response.json()
        .then(function (data) {
            
            const cityName = data.name;

            
            const APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=a806183978679594b1bdaa14de2497c0`;
            
            
            fetch(APIUrl) 
            .then(function (response) {
                if (response.ok) {
                    
                    response.json()
            .then(function (data) {

                const icon = ("<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon);

                
                currentH3.innerHTML = cityName + " (" + moment().format("MM/DD/YYYY") + ") " + icon;

                const liArray = [];
                
                
                nowclimatelist.innerHTML = "";

                
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
                    nowclimatelist.append(li);
                })

                let dailyArray = [];

                DiaCard.innerHTML = "";

                
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

                
                cincodias.classList.remove("hidden");

                
                dailyArray.forEach(card => {
                    DiaCard.appendChild(card);
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

   
    let searchValue = cityinputt.value.trim("");

    
    if (searchValue === "") {
        currentH3.textContent = "Enter city name please!😗";
        nowclimatelist.innerHTML = "";
        DiaCard.innerHTML = "";
        
        cincodias.classList.add("hidden");
    } else {
        
        callOpenWeather(searchValue);
       
        cityinputt.value = "";
    }
});


updateSearchHistory();


