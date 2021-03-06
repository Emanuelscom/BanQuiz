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
const timeContainer       = document.getElementById('timeContainer')
const progressContainer   = document.getElementById('progressContainer')
const time_line           = document.getElementById('.time_line')
const timeText            = document.querySelector('.timer .time_left_txt')
const timeCount           = document.querySelector('.timer .timer_sec')

let counterLine;
let currentQuestionIndex
let mixQuestions
const MAX_QUESTIONS = 10

let classicActive = false

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

//iniciar el contador
function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time
        time--
        if(time < 9){ 
            let addZero = timeCount.textContent
            timeCount.textContent = "0" + addZero
        }
        if(time < 0){
            timeText.textContent = "Time Off";
            clearInterval(counter)
            finalize.classList.remove('hide')
            answerButton.classList.add('disabled')
        }
    }
}

//modo clasico a instrucciones
function selectModeOne() {
    playerSelection.classList.add('hide')
    modeSelection1.classList.remove('hide')
    localStorage.setItem('playerCount', parseInt(localStorage.getItem('playerCount'))+ 1)
}

//modo contrarreloj a instrucciones
function selectModeTwo() {
    playerSelection.classList.add('hide')
    modeSelection2.classList.remove('hide')
}

//instrucciones clasico
function selectClassic() {
    modeSelection1.classList.add('hide')
    generalContainer.classList.remove('hide')
    mixQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 1
    classicActive = true
    questionContainer.classList.remove('hide')
    progressContainer.classList.remove('hide')
    setNextQuestion()
}

//instrucciones timetrial
function selectTrimeTrial() {
    modeSelection2.classList.add('hide')
    generalContainer.classList.remove('hide')
    mixQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 1
    questionContainer.classList.remove('hide')
    setNextQuestion()
    timeContainer.classList.remove('hide')
    startTimer(120)
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
function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct, 1)
    Array.from(answerButton.children).forEach(button => {
        setStatusClass(button, button.dataset.correct, 0)
    })
    if (classicActive == true){
    if (mixQuestions.length > currentQuestionIndex + 1 && currentQuestionIndex + 1 < 11) {
        nextButton.classList.remove('hide')
    }else {
        finalize.classList.remove('hide')
    }
}else {
    if (mixQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    }else {
        finalize.classList.remove('hide')
    }
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
    window.location.assign('/')
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

//fetch de bitcoin
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
        question: '??Cu??nto es 100 / 2?',
        answers: [
            { text: '50', correct: true },
            { text: '200', correct: false },
            { text: '25', correct: false },
            { text: '2', correct: false }
        ]
    },
    {
        question: '??Qui??n fue el campe??n del Torneo Apertura 2009?',
        answers: [
            { text: 'River', correct: false },
            { text: 'Boca', correct: false },
            { text: 'Banfield', correct: true },
            { text: 'Velez', correct: false }
        ]
    },
    {
        question: '??En qu?? continente se encuentra Espa??a?',
        answers: [
            { text: 'Africa', correct: false },
            { text: 'Europa', correct: true },
            { text: 'Asia', correct: false },
            { text: 'America', correct: false }
        ]
    },
    {
        question: '??En qu?? a??o se fabric?? el primer billete en Argentina',
        answers: [
            { text: '1896', correct: false },
            { text: '1922', correct: false },
            { text: '1810', correct: false },
            { text: '1822', correct: true }
        ]
    },
    {
        question: '??Qui??n fue el creador de Amazon?',
        answers: [
            { text: 'Elon Musk', correct: false },
            { text: 'Mark Zuckerberg', correct: false },
            { text: 'Jeff Bezos', correct: true },
            { text: 'Bill Gates', correct: false }
        ]
    },
    {
        question: '??A cu??ntos MB equivale un TB?',
        answers: [
            { text: '10.000.000', correct: false },
            { text: '1.000.000', correct: true },
            { text: '100.000', correct: false },
            { text: '10.000', correct: false }
        ]
    },
    {
        question: '??Qui??n fue Hip??crates?',
        answers: [
            { text: 'Fil??sofo', correct: false },
            { text: 'M??dico', correct: true },
            { text: 'Historiador', correct: false },
            { text: 'Deportista', correct: false }
        ]
    },
    {
        question: '??C??mo se llama un pol??gono de 6 lados?',
        answers: [
            { text: 'Pent??gono', correct: false },
            { text: 'Hept??gono', correct: false },
            { text: 'Dec??gono', correct: false },
            { text: 'Hex??gono', correct: true }
        ]
    },
    {
        question: '??Cu??l es la capital de Portugal?',
        answers: [
            { text: 'Lisboa', correct: true },
            { text: 'Amsterdam', correct: false },
            { text: 'Bruselas', correct: false },
            { text: 'Ottawa', correct: false }
        ]
    },
    {
        question: '??En qu?? a??o fue la primera guerra mundial?',
        answers: [
            { text: '1924', correct: false },
            { text: '1939', correct: false },
            { text: '1914', correct: true },
            { text: '1919', correct: false }
        ]
    },
    {
        question: '??Cu??l es el r??o m??s largo de Europa?',
        answers: [
            { text: 'Ural', correct: false },
            { text: 'Danubio', correct: false },
            { text: 'Volga', correct: true },
            { text: 'Dni??per', correct: false }
        ]
    },
    {
        question: '??A qui??n se le atribuye la frase "Solo s?? que no s?? nada"?',
        answers: [
            { text: 'Arist??teles', correct: false },
            { text: 'Nietszche', correct: false },
            { text: 'Salom??n', correct: false },
            { text: 'S??crates', correct: true }
        ]
    },
    {
        question: '??Cu??l es la monta??a m??s alta del continente americano?',
        answers: [
            { text: 'Pico Bol??var', correct: false },
            { text: 'Monte Fuji', correct: false },
            { text: 'Aconcagua', correct: true },
            { text: 'Monte Everest', correct: false }
        ]
    },
    {
        question: '??Cu??l de las siguientes es una enfermedad de transmisi??n sexual?',
        answers: [
            { text: 'Tricomoniasis', correct: true },
            { text: 'Malaria', correct: false },
            { text: 'Cistitis', correct: false },
            { text: 'Hepatitis B', correct: false }
        ]
    },
    {
        question: '??Cu??l es el animal terrestre m??s grande en la actualidad?',
        answers: [
            { text: 'Jirafa', correct: false },
            { text: 'Hipopotamo', correct: false },
            { text: 'Elefante africano', correct: true },
            { text: 'Ballena azul', correct: false }
        ]
    },
    {
        question: '??Cu??l de estos es el nombres de uno de los reyes magos?',
        answers: [
            { text: 'Jesus', correct: false },
            { text: 'Judas', correct: false },
            { text: 'Baltazar', correct: true },
            { text: 'Abraham', correct: false }
        ]
    },
    {
        question: '??Qui??n fue el primer hombre en pisar la Luna?',
        answers: [
            { text: 'Yuri Gagarin', correct: false },
            { text: 'Michael Collins', correct: false },
            { text: 'Neil Armstrong', correct: true },
            { text: 'Charles Conrad', correct: false }
        ]
    },
    {
        question: '??Cu??l es la capital de Australia?',
        answers: [
            { text: 'Sydney', correct: false },
            { text: 'Canberra', correct: true },
            { text: 'Melbourne', correct: false },
            { text: 'Perth', correct: false }
        ]
    },
    {
        question: '??Cu??l es el mayor archipi??lago de la Tierra?',
        answers: [
            { text: 'Indonesia', correct: true },
            { text: 'Filipinas', correct: false },
            { text: 'Bahamas', correct: false },
            { text: 'Maldivas', correct: false }
        ]
    },
    {
        question: '??En qu?? oc??ano queda Madagascar?',
        answers: [
            { text: 'Oc??ano Pac??fico', correct: false },
            { text: 'Oc??ano Atl??ntico', correct: false },
            { text: 'Oc??ano ??ndico', correct: true },
            { text: 'Oc??ano Ant??rtico', correct: false }
        ]
    },
    {
        question: '??Cu??l es el metal cuyo s??mbolo qu??mico es Au?',
        answers: [
            { text: 'Aluminio', correct: false },
            { text: 'Ars??nico', correct: false },
            { text: 'Actinio', correct: false },
            { text: 'Oro', correct: true }
        ]
    },
    {
        question: '??Qui??n pint?? la b??veda de la capilla sixtina?',
        answers: [
            { text: 'Miguel Angel', correct: true },
            { text: 'Leonardo da Vinci', correct: false },
            { text: 'Rafael', correct: false },
            { text: 'Boticelli', correct: false }
        ]
    },
    {
        question: '??De qu?? grupo era vocalista Jim Morrison?',
        answers: [
            { text: 'The Police', correct: false },
            { text: 'The Doors', correct: true },
            { text: 'AC/DC', correct: false },
            { text: 'Pink Floyd', correct: false }
        ]
    },
    {
        question: '??Cu??l es el ??nico n??mero primo par?',
        answers: [
            { text: '2', correct: true },
            { text: '3', correct: false },
            { text: '4', correct: false },
            { text: '6', correct: false }
        ]
    }
]