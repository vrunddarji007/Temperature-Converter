document.addEventListener('DOMContentLoaded', function() {
    const temperatureInput = document.getElementById('temperature');
    const convertBtn = document.getElementById('convert-btn');
    const convertedValue = document.querySelector('.converted-value');
    const convertedUnit = document.querySelector('.converted-unit');
    const errorMsg = document.getElementById('error-msg');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const resultDiv = document.getElementById('result');
    const mercury = document.getElementById('mercury');
    
    // Create floating elements dynamically
    const floatingContainer = document.querySelector('.floating-elements');
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 60 + 20;
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.animationDuration = `${Math.random() * 20 + 15}s`;
        element.style.animationDelay = `${Math.random() * 5}s`;
        floatingContainer.appendChild(element);
    }
    
    // Function to validate input
    function validateInput() {
        const value = temperatureInput.value.trim();
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');
        
        if (value === '') {
            showError('Please enter a temperature value.');
            return false;
        }
        
        if (isNaN(value)) {
            showError('Please enter a valid number.');
            return false;
        }
        
        return true;
    }
    
    // Function to show error with animation
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
    }
    
    // Function to update thermometer
    function updateThermometer(temp, unit) {
        let normalizedTemp;
        
        // Normalize temperature to a 0-100 scale for the thermometer
        switch(unit) {
            case 'celsius':
                normalizedTemp = Math.max(-20, Math.min(50, temp));
                normalizedTemp = ((normalizedTemp + 20) / 70) * 100;
                break;
            case 'fahrenheit':
                normalizedTemp = Math.max(-4, Math.min(122, temp));
                normalizedTemp = ((normalizedTemp + 4) / 126) * 100;
                break;
            case 'kelvin':
                normalizedTemp = Math.max(253, Math.min(323, temp));
                normalizedTemp = ((normalizedTemp - 253) / 70) * 100;
                break;
        }
        
        mercury.style.height = `${Math.max(0, Math.min(100, normalizedTemp))}%`;
    }
    
    // Function to convert temperatures
    function convertTemperature() {
        if (!validateInput()) return;
        
        const inputValue = parseFloat(temperatureInput.value);
        let selectedUnit = '';
        
        // Determine selected unit
        for (const radio of unitRadios) {
            if (radio.checked) {
                selectedUnit = radio.value;
                break;
            }
        }
        
        let celsius, fahrenheit, kelvin;
        
        // Convert from selected unit to all others
        switch(selectedUnit) {
            case 'celsius':
                celsius = inputValue;
                fahrenheit = (celsius * 9/5) + 32;
                kelvin = celsius + 273.15;
                break;
            case 'fahrenheit':
                fahrenheit = inputValue;
                celsius = (fahrenheit - 32) * 5/9;
                kelvin = celsius + 273.15;
                break;
            case 'kelvin':
                kelvin = inputValue;
                celsius = kelvin - 273.15;
                fahrenheit = (celsius * 9/5) + 32;
                break;
        }
        
        // Update thermometer
        updateThermometer(inputValue, selectedUnit);
        
        // Display results with animation
        resultDiv.classList.remove('show');
        setTimeout(() => {
            convertedValue.textContent = `${celsius.toFixed(2)}°C | ${fahrenheit.toFixed(2)}°F | ${kelvin.toFixed(2)}K`;
            convertedUnit.textContent = `Converted from ${selectedUnit.charAt(0).toUpperCase() + selectedUnit.slice(1)}`;
            resultDiv.classList.add('show');
        }, 300);
    }
    
    // Event listeners
    convertBtn.addEventListener('click', convertTemperature);
    
    temperatureInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertTemperature();
        }
    });
    
    // Clear error when user starts typing
    temperatureInput.addEventListener('input', function() {
        errorMsg.classList.remove('show');
    });
    
    // Add animation to radio buttons on change
    unitRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (temperatureInput.value.trim() !== '') {
                convertTemperature();
            }
        });
    });
});