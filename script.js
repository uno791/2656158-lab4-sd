document.getElementById('search-button').addEventListener('click', () => {
    const countryName = document.getElementById('country-input').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error('Country not found');
            return response.json();
        })
        .then(data => {
            const country = data[0];
            displayCountryInfo(country);
            if (country.borders) {
                fetchBorders(country.borders);
            } else {
                document.getElementById('bordering-countries').innerHTML = '<p>No bordering countries found.</p>';
            }
        })
        .catch(error => {
            document.getElementById('country-info').innerHTML = `<p>Error: ${error.message}</p>`;
            document.getElementById('bordering-countries').innerHTML = '';
        });
});

function displayCountryInfo(country) {
    document.getElementById('country-info').innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
    `;
}

function fetchBorders(borders) {
    let borderingCountriesHTML = '';
    let completedRequests = 0;

    borders.forEach(border => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then(response => response.json())
            .then(data => {
                const country = data[0];
                borderingCountriesHTML += `
                    <figure>
                        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                        <figcaption>${country.name.common}</figcaption>
                    </figure>
                `;
                completedRequests++;
                if (completedRequests === borders.length) {
                    document.getElementById('bordering-countries').innerHTML = borderingCountriesHTML;
                }
            })
            .catch(error => {
                document.getElementById('bordering-countries').innerHTML = `<p>Couldn't load bordering countries: ${error.message}</p>`;
            });
    });
}

