
function SetBaseImage(imgElement, url) {
    imgElement.src = url;
    imgElement.onerror = function() {
        this.src = 'img/Standard_cinema_logo.png';
        this.onerror = null;
    };
}



let movies = [];
let topRatedMovies = []

fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=56')
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
           
    topRatedMovies = movies.slice(1);
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
            fetch(`http://localhost:8000/api/v1/titles/?genre=${category[i].name}&sort_by=-imdb_score&page_size=56`)
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
    if (!SortMovieGenres[categoryIndex]) return;

    allCategoryPage = 1;

    const cardsSelector = '.all-category-movie';
    const titleSelector = '.all-category-title';
    const cards = document.querySelectorAll(cardsSelector);
    const itemsPerPage = cards.length;

    const maxPage = Math.ceil(SortMovieGenres[categoryIndex].length / itemsPerPage);

    DisplayPage(SortMovieGenres[categoryIndex], allCategoryPage, cardsSelector, titleSelector);

    document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
}
        
document.getElementById('category-select').addEventListener('change', function() {
    const selectedIndex = this.value;
    
    if (selectedIndex !== "") {
        currentCategoryIndex = parseInt(selectedIndex);
        allCategoryPage = 1;
        DisplaySelectedCategory(parseInt(selectedIndex));
    }
});

let topPage = 1;
let actionPage = 1;
let comedyPage = 1;
let allCategoryPage = 1;
let currentCategoryIndex = -1;

function DisplayPage(movieSelector, pageNumber, cardsSelector, titleSelector) {
    const cards = document.querySelectorAll(cardsSelector);
    const itemsPerPage = cards.length;
    const startIndex = (pageNumber - 1) * itemsPerPage;

    for (let i = 0; i < itemsPerPage; i++) {
        const movieIndex = startIndex + i;
        const card = cards[i];

        if (movieIndex < movieSelector.length) {
            const movie = movieSelector[movieIndex];

            const title = card.querySelector(titleSelector);
            title.textContent = movie.title;

            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            const img = newCard.querySelector('img');
            SetBaseImage(img, movie.image_url);

            newCard.addEventListener('click', () => openModal(movie));
        } else {
            const img = card.querySelector('img');
            img.src = '';
            const title = card.querySelector(titleSelector);
            title.textContent = '';
            
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        }
    }
}

document.getElementById('top-next').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.top-movie').length;
    const maxPage = Math.ceil(topRatedMovies.length / itemsPerPage);
    if (topPage < maxPage) {
        topPage++;
        DisplayPage(topRatedMovies, topPage, '.top-movie', '.movie-title');
        document.getElementById('top-page-info').textContent = `${topPage}/${maxPage}`;
    }
});

document.getElementById('top-prev').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.top-movie').length;
    const maxPage = Math.ceil(topRatedMovies.length / itemsPerPage);
    if (topPage > 1) {
        topPage--;
        DisplayPage(topRatedMovies, topPage, '.top-movie', '.movie-title');
        document.getElementById('top-page-info').textContent = `${topPage}/${maxPage}`;
    }
});

document.getElementById('action-next').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.action-movie').length;
    const maxPage = Math.ceil((SortMovieGenres[0].length) / itemsPerPage);
    
    if (actionPage < maxPage) {
        actionPage++;
        DisplayPage(SortMovieGenres[0], actionPage, '.action-movie', '.action-title');
        document.getElementById('action-page-info').textContent = `${actionPage}/${maxPage}`;
    }
});

document.getElementById('action-prev').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.action-movie').length;
    const maxPage = Math.ceil((SortMovieGenres[0].length) / itemsPerPage);
    if (actionPage > 1) {
        actionPage--;
        DisplayPage(SortMovieGenres[0], actionPage, '.action-movie', '.action-title');
        document.getElementById('action-page-info').textContent = `${actionPage}/${maxPage}`;
    }
});

document.getElementById('comedy-next').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.comedy-movie').length;
    const maxPage = Math.ceil((SortMovieGenres[5].length) / itemsPerPage);
    
    if (comedyPage < maxPage) {
        comedyPage++;
        DisplayPage(SortMovieGenres[5], comedyPage, '.comedy-movie', '.comedy-title');
        document.getElementById('comedy-page-info').textContent = `${comedyPage}/${maxPage}`;
    }
});

document.getElementById('comedy-prev').addEventListener('click', () => {
    const itemsPerPage = document.querySelectorAll('.comedy-movie').length;
    const maxPage = Math.ceil((SortMovieGenres[5].length) / itemsPerPage);
    if (comedyPage > 1) {
        comedyPage--;
        DisplayPage(SortMovieGenres[5], comedyPage, '.comedy-movie', '.comedy-title');
        document.getElementById('comedy-page-info').textContent = `${comedyPage}/${maxPage}`;
    }
});

document.getElementById('all-next').addEventListener('click', () => {
    if (currentCategoryIndex !== -1) {
        const itemsPerPage = document.querySelectorAll('.all-category-movie').length;
        const maxPage = Math.ceil((SortMovieGenres[currentCategoryIndex].length) / itemsPerPage);
        
        if (allCategoryPage < maxPage) {
            allCategoryPage++;
            DisplayPage(SortMovieGenres[currentCategoryIndex], allCategoryPage, '.all-category-movie', '.all-category-title');
            document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
        }
    }
});

document.getElementById('all-prev').addEventListener('click', () => {
    if (allCategoryPage > 1 && currentCategoryIndex !== -1) {
        const itemsPerPage = document.querySelectorAll('.all-category-movie').length;
        const maxPage = Math.ceil((SortMovieGenres[currentCategoryIndex].length) / itemsPerPage);

        if (allCategoryPage > 1) {
            allCategoryPage--;
            DisplayPage(SortMovieGenres[currentCategoryIndex], allCategoryPage, '.all-category-movie', '.all-category-title');
            document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
        }
    }
});

