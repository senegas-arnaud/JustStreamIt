
function SetBaseImage(imgElement, url) {
    imgElement.src = url;
    imgElement.onerror = function() {
        this.src = 'img/Standard_cinema_logo.png';
        this.onerror = null;
    };
}



let movies = [];

fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=11')
    .then(response => response.json())
    .then(data => {
        movies = data.results;
                
        let fetch_count = 0;
        for (let i = 0; i < movies.length; i++) {
            fetch(`http://localhost:8000/api/v1/titles/${movies[i].id}`)
                .then(response => response.json())
                .then(movieDetails => {
                    movies[i] = movieDetails;
                    fetch_count++;
                            
                    if (fetch_count === movies.length) {
                        DisplayMovies();
                    }
                });
        }
    })
    .catch(error => console.error('Erreur:', error));

function DisplayMovies() {
    const bestMovie = movies[0];

    SetBaseImage(document.getElementById('movie-image'), bestMovie.image_url);
    
    document.getElementById('movie-title').textContent = bestMovie.title;
    document.getElementById('movie-description').textContent = bestMovie.description;
    document.getElementById('movie-score').textContent = bestMovie.imdb_score;
        
    document.getElementById('btn-details').addEventListener('click', () => openModal(bestMovie));
    document.getElementById('movie-image').addEventListener('click', () => openModal(bestMovie));
           
    const top_movies = document.querySelectorAll('.top-movie');
    
    for (let i = 0; i < top_movies.length && i < 10; i++) {
        const movie = movies[i + 1];
        const top_movie = top_movies[i];

        const img = top_movie.querySelector('img');
        SetBaseImage(img, movie.image_url);
            
        const title = top_movie.querySelector('.movie-title');
        title.textContent = movie.title;
            
        top_movie.addEventListener('click', () => openModal(movie));
    }
}


function openModal(movie) {
    SetBaseImage(document.getElementById('modal-image'), movie.image_url);
    
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-genres').textContent = movie.genres;
    document.getElementById('modal-date').textContent = movie.date_published;
    document.getElementById('modal-score').textContent = `${movie.imdb_score}/10`;
    document.getElementById('modal-directors').textContent = movie.directors;
    document.getElementById('modal-actors').textContent = movie.actors;
    document.getElementById('modal-duration').textContent = `${movie.duration} minutes`;
    document.getElementById('modal-countries').textContent = movie.countries;
    document.getElementById('modal-boxoffice').textContent = `${movie.worldwide_gross_income} $`;
    document.getElementById('modal-description').textContent = movie.long_description;
            
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
        document.getElementById('modal').classList.add('hidden');
    }

    document.getElementById('close-modal').addEventListener('click', closeModal);

    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });


let SortMovieGenres = [];
let GenresList = [];

fetch('http://localhost:8000/api/v1/genres/?page_size=50')
    .then(response => response.json())
    .then(data => {
        const category = data.results;
        for (let i = 0; i < category.length; i++) {
            GenresList.push(category[i].name);
        }
        let count = 0;
                
        for (let i = 0; i < category.length; i++) {
            fetch(`http://localhost:8000/api/v1/titles/?genre=${category[i].name}&sort_by=-imdb_score&page_size=11`)
                .then(response => response.json())
                .then(movieByGenres => {
                    SortMovieGenres[i] = movieByGenres.results;
                    count++;
                            
                    if (count === category.length) {
    
                        let detailsCount = 0;
                        let totalFilms = 0;
                        for (let i = 0; i < SortMovieGenres.length; i++) {
                            totalFilms += SortMovieGenres[i].length;
                        }

                        for (let j = 0; j < SortMovieGenres.length; j++) {
                            for (let k = 0; k < SortMovieGenres[j].length; k++) {
                                const movieId = SortMovieGenres[j][k].id;
                                        
                                fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
                                    .then(response => response.json())
                                    .then(movieDetails => {
                                        SortMovieGenres[j][k] = movieDetails;
                                        detailsCount++;
                                                
                                        if (detailsCount === totalFilms) {
                                            DisplayMovieByGenres(SortMovieGenres);
                                        }
                                    });
                            }
                        }
                    }
                });
        }
    })
    .catch(error => console.error('Erreur:', error));

        
function DisplayMovieByGenres(SortMovieGenres) {
    const actionMovies = document.querySelectorAll('.action-movie');
    for (let i = 0; i < actionMovies.length && i < 10; i++) {
        const movie = SortMovieGenres[0][i + 1];
        const action = actionMovies[i];
                
        const img = action.querySelector('img');
        SetBaseImage(img, movie.image_url);
                
        const title = action.querySelector('.action-title');
        title.textContent = movie.title;
                
        action.addEventListener('click', () => openModal(movie));
    }
            
    const comedyMovies = document.querySelectorAll('.comedy-movie');
    for (let i = 0; i < comedyMovies.length && i < 10; i++) {
        const movie = SortMovieGenres[5][i + 1];
        const comedy = comedyMovies[i];
                
        const img = comedy.querySelector('img');
        SetBaseImage(img, movie.image_url);
                
        const title = comedy.querySelector('.comedy-title');
        title.textContent = movie.title;
                
        comedy.addEventListener('click', () => openModal(movie));
    }
            
    FillCategorySelect(GenresList);
}


function FillCategorySelect(categories) {
    const select = document.getElementById('category-select');
            
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = categories[i];
        select.appendChild(option);
    }
}
        
function DisplaySelectedCategory(categoryIndex) {
    const allCategoryMovies = document.querySelectorAll('.all-category-movie');
            
    for (let i = 0; i < allCategoryMovies.length && i < 10; i++) {
        const movie = SortMovieGenres[categoryIndex][i + 1];
        const allGenres = allCategoryMovies[i];
                
        const img = allGenres.querySelector('img');
        SetBaseImage(img, movie.image_url);
                
        const title = allGenres.querySelector('.all-category-title');
        title.textContent = movie.title;
                
        allGenres.addEventListener('click', () => openModal(movie));
    }
}
        
document.getElementById('category-select').addEventListener('change', function() {
    const selectedIndex = this.value;
            
    if (selectedIndex !== "") {
        DisplaySelectedCategory(parseInt(selectedIndex));
    }
});
