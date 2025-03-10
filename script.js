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
    const borderPromises = borders.map(border => 
        fetch(`https://restcountries.com/v3.1/alpha/${border}`).then(res => res.json())
    );

    Promise.all(borderPromises)
        .then(borderData => {
            const borderingCountries = borderData.map(data => data[0]);
            document.getElementById('bordering-countries').innerHTML = borderingCountries.map(country => `
                <div class="bordering-country">
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                    <p>${country.name.common}</p>
                </div>
            `).join('');
        })
        .catch(error => {
            document.getElementById('bordering-countries').innerHTML = `<p>Error loading bordering countries: ${error.message}</p>`;
        });
}
