async function fetchCurrencyRates(baseCurrency = 'USD') {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    return response.json();
}

async function fetchAvailableCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return Object.keys(data.rates);
}

async function populateCurrencyDropdown() {
    const currencies = await fetchAvailableCurrencies();
    const currencySelect = document.getElementById('currency');
    
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
    });
}

document.getElementById('calculate').onclick = async function() {
    const amountSpent = parseFloat(document.getElementById('amountSpent').value);
    const marketPrice = parseFloat(document.getElementById('marketPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const selectedCurrency = document.getElementById('currency').value;

    // Validate inputs
    if (isNaN(amountSpent) || isNaN(marketPrice) || isNaN(sellingPrice) || 
        amountSpent <= 0 || marketPrice <= 0 || sellingPrice <= 0) {
        document.getElementById('result').innerText = "Please enter valid amounts.";
        return;
    }

    // Fetch currency rates
    const rates = await fetchCurrencyRates();
    const conversionRateToUSD = rates.rates[selectedCurrency];

    if (!conversionRateToUSD) {
        document.getElementById('result').innerText = "Currency conversion failed.";
        return;
    }

    // Convert amount spent to USD
    const amountSpentInUSD = amountSpent / conversionRateToUSD;

    // Calculate the amount of crypto purchased
    const amountPurchased = amountSpentInUSD / marketPrice;

    // Calculate total selling price in USD
    const totalSellingPrice = amountPurchased * sellingPrice;

    // Calculate profit in USD
    const profitUSD = totalSellingPrice - amountSpentInUSD;

    // Convert profit to selected currency
    const conversionRateFromUSD = rates.rates[selectedCurrency];
    const profitInSelectedCurrency = profitUSD * conversionRateFromUSD;

    // Display the result
    document.getElementById('result').innerText = `Your profit: ${profitInSelectedCurrency.toFixed(2)} ${selectedCurrency}`;
};

// Populate the currency dropdown on page load
populateCurrencyDropdown();