const API_KEY = "55729347";
const API_URL_Search = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const searchInput = document.getElementById("search_input");
const card = document.querySelector('.movie_cards');

document.querySelector(".search").addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query) {
        await getMovies(API_URL_Search + encodeURIComponent(query));
    }
});

async function getMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            showMovies(data.Search);
        } else {
            console.error(data.Error);
            card.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function showMovies(movies) {
    card.innerHTML = ""; // Clear previous results

    const moviePromises = movies.map(async (movie) => {
        const movieData = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        return movieData.json();
    });

    const movieDetails = await Promise.all(moviePromises);
    movieDetails.forEach(movie_display);
}

function movie_display(imovie) {
    const movieElm = document.createElement("div");
    movieElm.classList.add("movie-card");
    movieElm.innerHTML = `
        <div class="cards">
            <img src="${imovie.Poster}" alt="Poster" class="movie-poster" />
            <div class="movie-description">
                <span class="movie-title"><b>Title:</b> <span class="value">${imovie.Title}</span></span>
                <span class="movie-title"><b>Rating:</b> <span class="value">${imovie.imdbRating}</span></span>
                <span class="movie-title"><b>Director:</b> <span class="value">${imovie.Director}</span></span>
                <span class="movie-title"><b>Release Date:</b> <span class="value">${imovie.Released}</span></span>
                <span class="movie-title"><b>Genre:</b> <span class="value">${imovie.Genre}</span></span>
            </div>
        </div>`;
    card.appendChild(movieElm);
}
