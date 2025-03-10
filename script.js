document.getElementById('search-button').addEventListener('click', function() {
    const countryName = document.getElementById('country-input').value;
    if (!countryName) return alert('Please enter a country name.');

    fetch('https://restcountries.com/v3.1/name/' + countryName)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            const country = data[0];
            document.getElementById('country-info').innerHTML = `
                <h2>${country.name.common}</h2>
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p>Population: ${country.population}</p>
                <p>Region: ${country.region}</p>
                <img src="${country.flags.png}" alt="${country.name.common}">
            `;

            if (country.borders) {
                fetchBorders(country.borders);
            } else {
                document.getElementById('bordering-countries').innerHTML = 'No bordering countries.';
            }
        })
        .catch(function() {
            document.getElementById('country-info').innerHTML = 'Country not found.';
            document.getElementById('bordering-countries').innerHTML = '';
        });
});

function fetchBorders(borders) {
    let html = '';

    borders.forEach(function(border) {
        fetch('https://restcountries.com/v3.1/alpha/' + border)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                const country = data[0];
                html += `
                    <img src="${country.flags.png}" alt="${country.name.common}">
                    <p>${country.name.common}</p>
                `;
                document.getElementById('bordering-countries').innerHTML = html;
            })
            .catch(function() {
                document.getElementById('bordering-countries').innerHTML = 'Error loading borders.';
            });
    });
}

