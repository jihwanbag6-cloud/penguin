const generateBtn = document.getElementById('generate-btn');
const toggleModeBtn = document.getElementById('toggle-mode-btn');
const lottoNumbersDiv = document.querySelector('.lotto-numbers');
const numberDivs = document.querySelectorAll('.number');

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNum);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    numberDivs.forEach((div, index) => {
        div.textContent = sortedNumbers[index];
    });
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

generateBtn.addEventListener('click', generateNumbers);
toggleModeBtn.addEventListener('click', toggleMode);

// Set initial mode
document.body.classList.add('light-mode');
