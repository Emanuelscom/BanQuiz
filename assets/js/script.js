const playerSelection     = document.getElementById('playerSelection')
const classicMode         = document.getElementById('classicMode')
const timeTrialMode       = document.getElementById('timeTrialMode')
const highscores          = document.getElementById('highscores')
const highscoresContainer = document.getElementById('highscoresContainer')
const homeBtn             = document.getElementById('homeBtn')
const modeSelection1      = document.getElementById('modeContainer1')
const modeSelection2      = document.getElementById('modeContainer2')
const classic             = document.getElementById('classic')
const timeTrial           = document.getElementById('timeTrial')
const questionContainer   = document.getElementById('questionContainer')
const generalContainer    = document.getElementById('generalContainer')
const questionTitle       = document.getElementById('question')
const answerButton        = document.getElementById('answer-buttons');
const nextButton          = document.getElementById('next-btn')
const finalize             = document.getElementById('end-btn')
const progressBarFull     = document.getElementById('progressBarFull')
const progressText        = document.getElementById('progressText')
const score               = document.getElementById('score')
const backBtn1            = document.getElementById('back1')
const backBtn2            = document.getElementById('back2')
const body                = document.getElementById('body')
const endContainer        = document.getElementById('end-container')
const username            = document.getElementById('username')
const saveScoreBtn        = document.getElementById('saveScoreBtn')
const finalScore          = document.getElementById('finalScore')
const backBtnEnd          = document.getElementById('backBtnEnd')
const mostRecentScore     = localStorage.getItem('mostRecentScore')
const logo                = document.getElementById('logo')
const highscoresList      = document.getElementById('highscoresList')

let currentQuestionIndex
let mixQuestions
const MAX_QUESTIONS = 10

const highScores = JSON.parse(localStorage.getItem('highScores')) || []
finalScore.innerText = mostRecentScore

localStorage.setItem('playerCount', 0)
let playerScoreIni = [];
playerScoreIni[0] = 0;
localStorage.setItem("playerScore", JSON.stringify(playerScoreIni));

//eventos
classicMode.addEventListener('click',selectModeOne)
timeTrialMode.addEventListener('click',selectModeTwo)
classic.addEventListener('click',selectClassic)
timeTrial.addEventListener('click',selectTrimeTrial)
backBtn1.addEventListener('click', backMenu1)
backBtn2.addEventListener('click', backMenu2)
highscores.addEventListener('click',selectHighscores)
homeBtn.addEventListener('click',goHome)
backBtnEnd.addEventListener('click',backMenuEnd)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
finalize.addEventListener('click', () => {
    resetState()
    endBtn()
})
logo.addEventListener('click', () => {
    let timerInterval
Swal.fire({
    title: 'Encontraste el pop-up secreto!',
    html: 'ganaste perder <b></b> milisegundos de tu tiempo.',
    timer: 5000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
        }, 100)
    },
    willClose: () => {
        clearInterval(timerInterval)
    }
}).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
    }
})
})

//un jugador
function selectModeOne() {
    playerSelection.classList.add('hide')
    modeSelection1.classList.remove('hide')
    localStorage.setItem('playerCount', parseInt(localStorage.getItem('playerCount'))+ 1)
}

//dos jugadores
function selectModeTwo() {
    playerSelection.classList.add('hide')
    modeSelection2.classList.remove('hide')
}

//modo de juego clasico 10 preguntas
function selectClassic() {
    modeSelection1.classList.add('hide')
    generalContainer.classList.remove('hide')
    mixQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 1
    questionContainer.classList.remove('hide')
    setNextQuestion()
}

//modo de juego por tiempo
function selectTrimeTrial() {
    modeSelection2.classList.add('hide')
    generalContainer.classList.remove('hide')
    mixQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 1
    questionContainer.classList.remove('hide')
    setNextQuestion()
}

//proxima pregunta
function setNextQuestion() {
    resetState()
    showQuestion(mixQuestions[currentQuestionIndex])
    progressText.innerText = `Pregunta ${currentQuestionIndex} de ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(currentQuestionIndex/MAX_QUESTIONS) * 100}%`
}

//mostrar preguntas
function showQuestion (question) {
    questionTitle.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        button.classList.add('color1')
        button.classList.add('btn-width-quest')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
            button.addEventListener('click', selectAnswer)
            answerButton.appendChild(button)
        })
}

//despues de responder limpia colores y aparece boton next
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild)
    }
}

//seleccionar respuestas 
//HACER UN IF FUERA DEL IF HECHO QUE DIGA QUE MODO DE JUEGO ES (if clasico 10 preguntas, else sin limite de preguntas/tiempo?)
function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct, 1)
    Array.from(answerButton.children).forEach(button => {
        setStatusClass(button, button.dataset.correct, 0)
    })
    if (mixQuestions.length > currentQuestionIndex + 1 && currentQuestionIndex + 1 < 11) {
        nextButton.classList.remove('hide')
    }else {
        finalize.classList.remove('hide')
}
}

//es correcta o incorrecta?
function setStatusClass(element, correct, number) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct', 'disabled')
        body.classList.remove('disabled')
        let locStor = JSON.parse(localStorage.getItem('playerScore'))
        let playerId = parseInt(localStorage.getItem('playerCount'))
        if (number == 1) {
            locStor[playerId] == undefined ? locStor[playerId] = 100 : locStor[playerId] = locStor[playerId] + 100 
            localStorage.setItem('playerScore',JSON.stringify(locStor))
        }
        locStor[playerId] == undefined ? locStor[playerId] = 0 : locStor[playerId]
        score.innerHTML = locStor[playerId]
    } else {
        element.classList.add('incorrect', 'disabled')
        body.classList.remove('disabled')
    }
}

//limpia colores
function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('incorrect')
    element.classList.remove('disabled')
}

//highscores
function selectHighscores() {
    playerSelection.classList.add('hide')
    highscoresContainer.classList.remove('hide')
}

//volver desde highscores
function goHome() {
    highscoresContainer.classList.add('hide')
    playerSelection.classList.remove('hide')
}

//Boton de finalizar al terminar preguntas
function endBtn() {
    generalContainer.classList.add('hide')
    endContainer.classList.remove('hide')
}

//volver desde modo de juego
function backMenu1() {
    modeSelection1.classList.add('hide')
    playerSelection.classList.remove('hide')
}

function backMenu2() {
    modeSelection2.classList.add('hide')
    playerSelection.classList.remove('hide')
}

//volver al menu si no guarda el score
function backMenuEnd() {
    endContainer.classList.add('hide')
    playerSelection.classList.remove('hide')
}

//si no se escribe el username no se puede guardar el score
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value
})

//guarda highscores
saveHighScore = e => {
    e.preventDefault()
    let locStor = JSON.parse(localStorage.getItem('playerScore'))
    let scoreValue = locStor[locStor.length-1]
    const score = {
        score: scoreValue,
        name: username.value
    }

    highScores.push(score)

    highScores.sort((a, b) => b.score - a.score)

    highScores.splice(5)

    console.log(highscores);
    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.assign('/')
}

//manda el score a highscores
highscoresList.innerHTML = highScores
.map(score => {
    return `<li class='high-score'>${score.name} - ${score.score}</li>`;
})
.join('');

//fetch
const usdAmount = document.getElementById('usd-amount')

fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(response => response.json())
    .then(data => displayData(data))

const displayData = data => {
    const usd = data.bpi.USD.rate_float
    usdAmount.textContent = `El valor del BitCoin es de $${usd} USD`
}




//preguntas
const questions = [
    {
        question: '¿Cuánto es 100 / 2?',
        answers: [
            { text: '50', correct: true },
            { text: '200', correct: false },
            { text: '25', correct: false },
            { text: '2', correct: false }
        ]
    },
    {
        question: '¿Quién fue el campeón del Torneo Apertura 2009?',
        answers: [
            { text: 'River', correct: false },
            { text: 'Boca', correct: false },
            { text: 'Banfield', correct: true },
            { text: 'Velez', correct: false }
        ]
    },
    {
        question: '¿En qué continente se encuentra España?',
        answers: [
            { text: 'Africa', correct: false },
            { text: 'Europa', correct: true },
            { text: 'Asia', correct: false },
            { text: 'America', correct: false }
        ]
    },
    {
        question: '¿En qué año se fabricó el primer billete en Argentina',
        answers: [
            { text: '1896', correct: false },
            { text: '1922', correct: false },
            { text: '1810', correct: false },
            { text: '1822', correct: true }
        ]
    },
    {
        question: '¿Quién fue el creador de Amazon?',
        answers: [
            { text: 'Elon Musk', correct: false },
            { text: 'Mark Zuckerberg', correct: false },
            { text: 'Jeff Bezos', correct: true },
            { text: 'Bill Gates', correct: false }
        ]
    },
    {
        question: '¿A cuántos MB equivale un TB?',
        answers: [
            { text: '10.000.000', correct: false },
            { text: '1.000.000', correct: true },
            { text: '100.000', correct: false },
            { text: '10.000', correct: false }
        ]
    },
    {
        question: '¿Quién fue Hipócrates?',
        answers: [
            { text: 'Filósofo', correct: false },
            { text: 'Médico', correct: true },
            { text: 'Historiador', correct: false },
            { text: 'Deportista', correct: false }
        ]
    },
    {
        question: '¿Cómo se llama un polígono de 6 lados?',
        answers: [
            { text: 'Pentágono', correct: false },
            { text: 'Heptágono', correct: false },
            { text: 'Decágono', correct: false },
            { text: 'Hexágono', correct: true }
        ]
    },
    {
        question: '¿Cuál es la capital de Portugal?',
        answers: [
            { text: 'Lisboa', correct: true },
            { text: 'Amsterdam', correct: false },
            { text: 'Bruselas', correct: false },
            { text: 'Ottawa', correct: false }
        ]
    },
    {
        question: '¿En qué año fue la primera guerra mundial?',
        answers: [
            { text: '1924', correct: false },
            { text: '1939', correct: false },
            { text: '1914', correct: true },
            { text: '1919', correct: false }
        ]
    },
    {
        question: '¿Cuál es el río más largo de Europa?',
        answers: [
            { text: 'Ural', correct: false },
            { text: 'Danubio', correct: false },
            { text: 'Volga', correct: true },
            { text: 'Dniéper', correct: false }
        ]
    },
    {
        question: '¿A quién se le atribuye la frase "Solo sé que no sé nada"?',
        answers: [
            { text: 'Aristóteles', correct: false },
            { text: 'Nietszche', correct: false },
            { text: 'Salomón', correct: false },
            { text: 'Sócrates', correct: true }
        ]
    },
    {
        question: '¿Cuál es la montaña más alta del continente americano?',
        answers: [
            { text: 'Pico Bolívar', correct: false },
            { text: 'Monte Fuji', correct: false },
            { text: 'Aconcagua', correct: true },
            { text: 'Monte Everest', correct: false }
        ]
    },
    {
        question: '¿Cuál de las siguientes es una enfermedad de transmisión sexual?',
        answers: [
            { text: 'Tricomoniasis', correct: true },
            { text: 'Malaria', correct: false },
            { text: 'Cistitis', correct: false },
            { text: 'Hepatitis B', correct: false }
        ]
    },
    {
        question: '¿Cuál es el animal terrestre más grande en la actualidad?',
        answers: [
            { text: 'Jirafa', correct: false },
            { text: 'Hipopotamo', correct: false },
            { text: 'Elefante africano', correct: true },
            { text: 'Ballena azul', correct: false }
        ]
    },
    {
        question: '¿Cuál de estos es el nombres de uno de los reyes magos?',
        answers: [
            { text: 'Jesus', correct: false },
            { text: 'Judas', correct: false },
            { text: 'Baltazar', correct: true },
            { text: 'Abraham', correct: false }
        ]
    },
    {
        question: '¿Quién fue el primer hombre en pisar la Luna?',
        answers: [
            { text: 'Yuri Gagarin', correct: false },
            { text: 'Michael Collins', correct: false },
            { text: 'Neil Armstrong', correct: true },
            { text: 'Charles Conrad', correct: false }
        ]
    },
    {
        question: '¿Cuál es la capital de Australia?',
        answers: [
            { text: 'Sydney', correct: false },
            { text: 'Canberra', correct: true },
            { text: 'Melbourne', correct: false },
            { text: 'Perth', correct: false }
        ]
    },
    {
        question: '¿Cuál es el mayor archipiélago de la Tierra?',
        answers: [
            { text: 'Indonesia', correct: true },
            { text: 'Filipinas', correct: false },
            { text: 'Bahamas', correct: false },
            { text: 'Maldivas', correct: false }
        ]
    },
    {
        question: '¿En qué océano queda Madagascar?',
        answers: [
            { text: 'Océano Pacífico', correct: false },
            { text: 'Océano Atlántico', correct: false },
            { text: 'Océano Índico', correct: true },
            { text: 'Océano Antártico', correct: false }
        ]
    },
    {
        question: '¿Cuál es el metal cuyo símbolo químico es Au?',
        answers: [
            { text: 'Aluminio', correct: false },
            { text: 'Arsénico', correct: false },
            { text: 'Actinio', correct: false },
            { text: 'Oro', correct: true }
        ]
    },
    {
        question: '¿Quién pintó la bóveda de la capilla sixtina?',
        answers: [
            { text: 'Miguel Angel', correct: true },
            { text: 'Leonardo da Vinci', correct: false },
            { text: 'Rafael', correct: false },
            { text: 'Boticelli', correct: false }
        ]
    },
    {
        question: '¿De qué grupo era vocalista Jim Morrison?',
        answers: [
            { text: 'The Police', correct: false },
            { text: 'The Doors', correct: true },
            { text: 'AC/DC', correct: false },
            { text: 'Pink Floyd', correct: false }
        ]
    },
    {
        question: '¿Cuál es el único número primo par?',
        answers: [
            { text: '2', correct: true },
            { text: '3', correct: false },
            { text: '4', correct: false },
            { text: '6', correct: false }
        ]
    }
]


/*
//info jugador
class Player {
    constructor(id, playerName, score, lives){
        this.id = id;
        this.playerName = playerName;
        this.score = score;
        this.lives = lives;
    }
}
*/
/* 
let playerNamePrompt = prompt('Ingrese el nombre del jugador 1');

const playerOne = new Player(1,playerNamePrompt,0,3);
console.log(playerOne);

let nameDisplay = document.getElementById('playerName').innerHTML = 'Jugador 1: ' + playerNamePrompt;
*/