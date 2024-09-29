const itemsPerPage = 10;
const pageLimit = 5;
let currentPage = 1;
let data = [];
let filteredData = [];
let debounceTimeout;

// Function to fetch data from the selected URL
function fetchData(url) {
    $('#loading').show();
    $('#content').hide();
    $.getJSON(url, function(response) {
        data = response;
        filteredData = data;
        currentPage = 1;
        renderItems(currentPage);
        renderPagination();
    }).fail(function() {
        console.error('Failed to fetch data from', url);
    }).always(function() {
        $('#loading').hide();
        $('#content').show();
    });
}

// Function to render items for the current page
function renderItems(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredData.slice(startIndex, endIndex);

    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';
    itemsToShow.forEach(item => {
        const posterUrl = item.info.poster.replace(/w600_and_h900_bestv2/, 'w342');
        const itemList = document.createElement('div');
        itemList.className = 'row mb-4';
        itemList.innerHTML = `
            <div class="col-md-3">
                <img src="${posterUrl}" class="thumb-image" alt="${item.name}">
            </div>
            <div class="col-md-9">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="mb-3"><small><i>Added: ${new Date(item.info.added * 1000).toLocaleString()}</i></small></p>
                        <p class="card-text">${item.info.plot}</p>
                        <div class="list-group list-group-flush">
                            ${item.seasons.map(season => `
                                <div>
                                    <h6>Season ${season.season}</h6>
                                    ${season.episodes.map(episode => `
                                        <div class="mb-2">
                                            Episode ${episode.episode}: <a href="${episode.video}" class="btn btn-primary btn-sm" target="_blank">${episode.name}</a>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        contentDiv.appendChild(itemList);
    });
}

// Function to render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginationUl = document.getElementById('pagination');
    paginationUl.innerHTML = '';

    // Previous Button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderItems(currentPage);
            renderPagination();
            smoothScroll();
        }
    });
    paginationUl.appendChild(prevLi);

    // Page Numbers
    let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);
    
    if (endPage - startPage < pageLimit - 1) {
        startPage = Math.max(1, endPage - pageLimit + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            renderItems(currentPage);
            renderPagination();
            smoothScroll();
        });
        paginationUl.appendChild(li);
    }

    // Next Button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderItems(currentPage);
            renderPagination();
            smoothScroll();
        }
    });
    paginationUl.appendChild(nextLi);
}

// Function for smooth scroll animation
function smoothScroll() {
    $('html, body').animate({ scrollTop: 0 }, 500);
}

$(document).ready(function() {
    // Handle select box change event
    $('#jsonSelect').on('change', function() {
        const selectedUrl = $(this).val();
        fetchData(selectedUrl);
        $('.fixed-search').show();
    });

    // Handle search input with debounce
    $('#searchInput').on('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = $(this).val().toLowerCase();
            filteredData = data.filter(item => item.name.toLowerCase().includes(query));
            currentPage = 1;
            renderItems(currentPage);
            renderPagination();
            smoothScroll();
            showSuggestions(query);
        }, 300);
    });

    // Function to show search suggestions
    function showSuggestions(query) {
        const suggestionsDiv = $('#suggestions');
        suggestionsDiv.empty();
        if (query.length > 0) {
            const suggestions = data.filter(item => item.name.toLowerCase().includes(query));
            suggestions.forEach(suggestion => {
                const suggestionItem = $('<div>').addClass('suggestion-item').text(suggestion.name);
                suggestionItem.on('click', function() {
                    $('#searchInput').val(suggestion.name);
                    filteredData = data.filter(item => item.name.toLowerCase().includes(suggestion.name.toLowerCase()));
                    currentPage = 1;
                    renderItems(currentPage);
                    renderPagination();
                    suggestionsDiv.hide();
                });
                suggestionsDiv.append(suggestionItem);
            });
            suggestionsDiv.show();
        } else {
            suggestionsDiv.hide();
        }
    }

    // Hide suggestions when clicking outside of them
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#suggestions, #searchInput').length) {
            $('#suggestions').hide();
        }
    });

    // Show or hide the "Back to Top" button based on scroll position
    window.onscroll = function() {
        const backToTopBtn = document.getElementById("backToTopBtn");
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    // Scroll to the top when the button is clicked
    document.getElementById("backToTopBtn").addEventListener("click", function() {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });
});
