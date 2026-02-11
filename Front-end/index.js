// Set image with fallback to default logo if loading fails
function SetBaseImage(imgElement, url) {
    imgElement.src = url;
    imgElement.onerror = function() {
        this.src = 'img/Standard_cinema_logo.png';
        this.onerror = null;
    };
}

// Global variables for movies data
let movies = [];
let topRatedMovies = []

// Fetch top 56 rated movies from API
fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=56')
    .then(response => response.json())
    .then(data => {
        movies = data.results;
                
        // Fetch detailed information for each movie
        let fetch_count = 0;
        for (let i = 0; i < movies.length; i++) {
            fetch(`http://localhost:8000/api/v1/titles/${movies[i].id}`)
                .then(response => response.json())
                .then(movieDetails => {
                    movies[i] = movieDetails;
                    fetch_count++;
                            
                    // When all movies are loaded, display them
                    if (fetch_count === movies.length) {
                        DisplayMovies();
                    }
                });
        }
    })
    .catch(error => console.error('Erreur:', error));

// Display best movie and top rated movies on the page
function DisplayMovies() {
    const bestMovie = movies[0];

    // Display best movie section
    SetBaseImage(document.getElementById('movie-image'), bestMovie.image_url);
    
    document.getElementById('movie-title').textContent = bestMovie.title;
    document.getElementById('movie-description').textContent = bestMovie.description;
    document.getElementById('movie-score').textContent = bestMovie.imdb_score;
        
    document.getElementById('btn-details').addEventListener('click', () => openModal(bestMovie));
    document.getElementById('movie-image').addEventListener('click', () => openModal(bestMovie));
           
    // Display top rated movies (excluding the best one)
    topRatedMovies = movies.slice(1);
    const top_movies = document.querySelectorAll('.top-movie');
    
    for (let i = 0; i < top_movies.length; i++) {
        const movie = topRatedMovies[i];
        const top_movie = top_movies[i];

        const img = top_movie.querySelector('img');
        SetBaseImage(img, movie.image_url);
            
        const title = top_movie.querySelector('.movie-title');
        title.textContent = movie.title;
            
        top_movie.addEventListener('click', () => openModal(movie));
    }
}

// Open modal with movie details
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
    document.getElementById('modal-description').textContent = movie.long_description;
       
    // Hide box office if data not available
    const boxofficeContainer = document.getElementById('modal-boxoffice').parentElement;
    if (movie.worldwide_gross_income && movie.worldwide_gross_income !== 'null') {
        boxofficeContainer.classList.remove('hidden');
        document.getElementById('modal-boxoffice').textContent = `${movie.worldwide_gross_income} $`;
    } else {
        boxofficeContainer.classList.add('hidden');
    }

    document.getElementById('modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Event listeners for closing modal
document.getElementById('close-modal').addEventListener('click', closeModal);

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Global variables for genres data
let SortMovieGenres = [];
let GenresList = [];

// Fetch all genres and their movies
fetch('http://localhost:8000/api/v1/genres/?page_size=50')
    .then(response => response.json())
    .then(data => {
        const category = data.results;
        
        // Build genres list
        for (let i = 0; i < category.length; i++) {
            GenresList.push(category[i].name);
        }
        let count = 0;
                
        // Fetch top 56 movies for each genre
        for (let i = 0; i < category.length; i++) {
            fetch(`http://localhost:8000/api/v1/titles/?genre=${category[i].name}&sort_by=-imdb_score&page_size=56`)
                .then(response => response.json())
                .then(movieByGenres => {
                    SortMovieGenres[i] = movieByGenres.results;
                    count++;
                            
                    if (count === category.length) {
    
                        // Fetch detailed information for all movies
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
                                                
                                        // When all movies are loaded, display them
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

// Display movies for Action and Comedy sections
function DisplayMovieByGenres(SortMovieGenres) {
    
    // Display Action movies (genre index 0)
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
            
    // Display Comedy movies (genre index 5)
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
            
    // Fill category dropdown menu
    FillCategorySelect(GenresList);
}

// Populate category dropdown with all genres
function FillCategorySelect(categories) {
    const select = document.getElementById('category-select');
            
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = categories[i];
        select.appendChild(option);
    }
}

// Display movies for selected category
function DisplaySelectedCategory(categoryIndex) {
    if (!SortMovieGenres[categoryIndex]) return;

    // Display movie and buttons, hide placeholder
    document.getElementById('category-placeholder').classList.add('hidden');
    document.getElementById('top-all-movie').classList.remove('hidden');
    document.getElementById('nav-button').classList.remove('hidden');

    allCategoryPage = 1;

    const cardsSelector = '.all-category-movie';
    const titleSelector = '.all-category-title';
    const allCards = document.querySelectorAll(cardsSelector);

    // Count only visible cards for responsive pagination
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });

    const itemsPerPage = visibleCards.length;
    const maxPage = Math.ceil(SortMovieGenres[categoryIndex].length / itemsPerPage);

    DisplayPage(SortMovieGenres[categoryIndex], allCategoryPage, cardsSelector, titleSelector);

    document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
}

let currentCategoryIndex = -1;

// Event listener for category selection
document.getElementById('category-select').addEventListener('change', function() {
    const selectedIndex = this.value;
    
    if (selectedIndex !== "") {
        currentCategoryIndex = parseInt(selectedIndex);
        allCategoryPage = 1;
        DisplaySelectedCategory(parseInt(selectedIndex));
    }
});

// Global variables for pagination
let topPage = 1;
let actionPage = 1;
let comedyPage = 1;
let allCategoryPage = 1;

// Display movies for a specific page
function DisplayPage(movieSelector, pageNumber, cardsSelector, titleSelector) {
    const allCards = document.querySelectorAll(cardsSelector);

    // Count only visible cards for responsive pagination
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });

    const itemsPerPage = visibleCards.length;
    const startIndex = (pageNumber - 1) * itemsPerPage;

    // Fill each card with movie data
    for (let i = 0; i < itemsPerPage; i++) {
        const movieIndex = startIndex + i;
        const card = visibleCards[i];

        if (movieIndex < movieSelector.length) {
            const movie = movieSelector[movieIndex];

            const title = card.querySelector(titleSelector);
            title.textContent = movie.title;

            // Clone card to remove old event listeners
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            const img = newCard.querySelector('img');
            SetBaseImage(img, movie.image_url);

            newCard.addEventListener('click', () => openModal(movie));
        } else {
            // Clear card if no movie data available
            const img = card.querySelector('img');
            img.src = '';
            const title = card.querySelector(titleSelector);
            title.textContent = '';
            
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        }
    }
}

// Pagination: Top Rated - Next button
document.getElementById('top-next').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.top-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });

    const itemsPerPage = visibleCards.length;
    const maxPage = Math.ceil(topRatedMovies.length / itemsPerPage);
    
    if (topPage < maxPage) {
        topPage++;
        DisplayPage(topRatedMovies, topPage, '.top-movie', '.movie-title');
        document.getElementById('top-page-info').textContent = `${topPage}/${maxPage}`;
    }
});

// Pagination: Top Rated - Previous button
document.getElementById('top-prev').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.top-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });
    const itemsPerPage = visibleCards.length;
    
    const maxPage = Math.ceil(topRatedMovies.length / itemsPerPage);
    
    if (topPage > 1) {
        topPage--;
        DisplayPage(topRatedMovies, topPage, '.top-movie', '.movie-title');
        document.getElementById('top-page-info').textContent = `${topPage}/${maxPage}`;
    }
});

// Pagination: Action - Next button
document.getElementById('action-next').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.action-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });
    const itemsPerPage = visibleCards.length;
    
    const maxPage = Math.ceil((SortMovieGenres[0].length) / itemsPerPage);
    
    if (actionPage < maxPage) {
        actionPage++;
        DisplayPage(SortMovieGenres[0], actionPage, '.action-movie', '.action-title');
        document.getElementById('action-page-info').textContent = `${actionPage}/${maxPage}`;
    }
});

// Pagination: Action - Previous button
document.getElementById('action-prev').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.action-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });
    const itemsPerPage = visibleCards.length; 
    
    const maxPage = Math.ceil((SortMovieGenres[0].length) / itemsPerPage);
    
    if (actionPage > 1) {
        actionPage--;
        DisplayPage(SortMovieGenres[0], actionPage, '.action-movie', '.action-title');
        document.getElementById('action-page-info').textContent = `${actionPage}/${maxPage}`;
    }
});

// Pagination: Comedy - Next button
document.getElementById('comedy-next').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.comedy-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });
    const itemsPerPage = visibleCards.length;
    
    const maxPage = Math.ceil((SortMovieGenres[5].length) / itemsPerPage);
    
    if (comedyPage < maxPage) {
        comedyPage++;
        DisplayPage(SortMovieGenres[5], comedyPage, '.comedy-movie', '.comedy-title');
        document.getElementById('comedy-page-info').textContent = `${comedyPage}/${maxPage}`;
    }
});

// Pagination: Comedy - Previous button
document.getElementById('comedy-prev').addEventListener('click', () => {
    const allCards = document.querySelectorAll('.comedy-movie');
    const visibleCards = Array.from(allCards).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
    });
    const itemsPerPage = visibleCards.length;
    
    const maxPage = Math.ceil((SortMovieGenres[5].length) / itemsPerPage);
    
    if (comedyPage > 1) {
        comedyPage--;
        DisplayPage(SortMovieGenres[5], comedyPage, '.comedy-movie', '.comedy-title');
        document.getElementById('comedy-page-info').textContent = `${comedyPage}/${maxPage}`;
    }
});

// Pagination: All Categories - Next button
document.getElementById('all-next').addEventListener('click', () => {
    if (currentCategoryIndex !== -1) {
        const allCards = document.querySelectorAll('.all-category-movie');
        const visibleCards = Array.from(allCards).filter(card => {
            return window.getComputedStyle(card).display !== 'none';
        });
        const itemsPerPage = visibleCards.length;
        
        const maxPage = Math.ceil((SortMovieGenres[currentCategoryIndex].length) / itemsPerPage);
        
        if (allCategoryPage < maxPage) {
            allCategoryPage++;
            DisplayPage(SortMovieGenres[currentCategoryIndex], allCategoryPage, '.all-category-movie', '.all-category-title');
            document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
        }
    }
});

// Pagination: All Categories - Previous button
document.getElementById('all-prev').addEventListener('click', () => {
    if (allCategoryPage > 1 && currentCategoryIndex !== -1) {
        const allCards = document.querySelectorAll('.all-category-movie');
        const visibleCards = Array.from(allCards).filter(card => {
            return window.getComputedStyle(card).display !== 'none';
        });
        const itemsPerPage = visibleCards.length;
        
        const maxPage = Math.ceil((SortMovieGenres[currentCategoryIndex].length) / itemsPerPage);

        if (allCategoryPage > 1) {
            allCategoryPage--;
            DisplayPage(SortMovieGenres[currentCategoryIndex], allCategoryPage, '.all-category-movie', '.all-category-title');
            document.getElementById('all-page-info').textContent = `${allCategoryPage}/${maxPage}`;
        }
    }
});