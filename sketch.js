let canvas;
let video;
let videoX;
let videoY;

// let addCommentButtonX;
// let addCommentButtonY;
// let resetButtonX;
// let resetButtonY;

let smileQuestionSpanX;
let smileQuestionSpanY;
let smileQuestionSpeechInputX;
let smileQuestionSpeechInputY;

let smileQuestionAnswersFieldHeaderX;
let smileQuestionAnswersFieldHeaderY;
let smileQuestionAnswersFieldX;
let smileQuestionAnswersFieldY;

let lastQuestionAnswerFieldHeaderX;
let lastQuestionAnswerFieldHeaderY;
let lastQuestionAnswerFieldX;
let lastQuestionAnswerFieldY;

let smileQuestionAnswersFieldCounter = 0;
let vibeState = false; // "false" means we start with bad vibes

let fadeSmileQuestionAnswersFieldInAndOutInterval;

// "Continuous recognition" (as opposed to one time only)
let continuous = true;
// If you want to try partial recognition (faster, less accurate)
let interimResults = false;

let speechRec;

let initialQuestions = [
    {'question' : "What made you smile today?",
    'localStorageKey' : 'smileQuestionAnswers'},
    {'question' : "What did you think of when you woke up today?",
    'localStorageKey' : 'wakeUpQuestionAnswers'},
    {'question' : "What were you doing one year ago from this moment?",
    'localStorageKey' : 'yearAgoQuestionAnswers'},
    {'question' : "What are you looking forward to this week?",
    'localStorageKey' : 'forwardQuestionAnswers'},
    {'question' : "If you were in a room with your past and future self, what would you say? What would you say and what would they say?",
    'localStorageKey' : 'pastFutureQuestionAnswers'},
    {'question' : "Who did you look up to five years ago? Do you still look up to them now?",
    'localStorageKey' : 'roleModelQuestionAnswers'},
    {'question' : "What's the most difficult decision that you've had to make?",
    'localStorageKey' : 'decisionQuestionAnswers'},
    {'question' : "What's the most meaningful thing to you right now?",
    'localStorageKey' : 'meaningQuestionAnswers'},
    {'question' : "If you had three wishes, what would they be?",
    'localStorageKey' : 'wishesQuestionAnswers'},
    {'question' : "What does your own personal happy place look like?",
    'localStorageKey' : 'happyPlaceQuestionAnswers'},
    {'question' : "What would you do if you had no fear?",
    'localStorageKey' : 'fearQuestionAnswers'},
    {'question' : "If you could see your life from a third-person perspective, what would surprise you the most?",
    'localStorageKey' : 'thirdPersonQuestionAnswers'},
    {'question' : "If you could ask your future self one question, what would it be, and why?",
    'localStorageKey' : 'futureQuestionAnswers'},
    {'question' : "What's the silliest thing you've ever done to impress someone you liked, and did it work?",
    'localStorageKey' : 'impressQuestionAnswers'},
    {'question' : "If you could communicate with any species on Earth other than humans, which would you choose and why?",
    'localStorageKey' : 'speciesQuestionAnswers'}
]

let smileQuestionAnswers = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];
let currentQuestionIndex = 0; // Keeps track of the current question index

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    // // div parent to position in front of bg image
    // canvas.parent('sketch-holder');

    setupVideo();
    // setupCommentButton();
    // setupResetButton();
    setupSmileQuestionSpan();
    setupSmileQuestionSpeechInput();
    setupSmileQuestionAnswersFieldHeader();
    setupSmileQuestionAnswersField();
    setupLastQuestionAnswerFieldHeader();
    setupLastQuestionAnswerField();

    // https://editor.p5js.org/dano/sketches/T-XASCOsa
    // Create a Speech Recognition object with callback
    speechRec = new p5.SpeechRec('en-US', gotSpeech);

    // This must come after setting the properties
    speechRec.start(continuous, interimResults);
}

//function draw() {
//    // localStorage.clear();
//    if (vibeState == true) {
//        goodVibes();
//    } else {
//        badVibes();
//
//    }
//
//    
//}

// function addAbsoluteText() {

//     var absoluteText = document.createElement('div');
    
//     absoluteText.textContent = 'Instructional Text Here';
    
//     absoluteText.style.position = 'absolute';
//     // positioning
//     absoluteText.style.top = 'windowWidth/2';
//     absoluteText.style.left = 'windowHeight/2';
    
//     document.body.appendChild(absoluteText);
// }

function draw() {
  if (vibeState == true) {
      goodVibes();
  } else {
      badVibes();
      
      
    

  }


  
}





// After answering what made one smile
function goodVibes() {

    background(255);
    canvas.class(''); // remove greyscale class

    // Remove canvas
    canvas.style.display = 'none';


    // Add video background
    document.getElementById('sketch-holder').style.background = 'transparent'; // Make the sketch-holder background transparent
    document.getElementById('background-video').style.display = 'block'; // Display the video element
    
    // // custom bg image
    // document.getElementById('sketch-holder').style.backgroundImage ="url(assets/bg-test-1.png)";
    // document.getElementById('sketch-holder').style.backgroundSize = "cover";

    document.getElementById('smileQuestionAnswersField').style.display = 'block';
    document.getElementById('smileQuestionAnswersFieldHeader').style.display = 'block';
    // document.getElementById('resetButton').style.display = 'block';
    document.getElementById('lastQuestionAnswerFieldHeader').style.display = 'block';
    document.getElementById('lastQuestionAnswerField').style.display = 'block';

    // document.getElementById('addCommentButton').style.display = 'none';
    document.getElementById('smileQuestionSpan').style.display = 'none';
    document.getElementById('smileQuestionSpeechInput').style.display = 'none';

    image(video, videoX, videoY);
}

// Before answering what made one smile - greyscale
function badVibes() {
    // initial bg grey color
    background(50);
    canvas.class('greyscale');


    // document.getElementById('addCommentButton').style.display = 'block';
    document.getElementById('smileQuestionSpan').style.display = 'block';
    document.getElementById('smileQuestionSpeechInput').style.display = 'block';

    document.getElementById('smileQuestionAnswersField').style.display = 'none';
    document.getElementById('smileQuestionAnswersFieldHeader').style.display = 'none';
    document.getElementById('lastQuestionAnswerField').style.display = 'none';
    // document.getElementById('resetButton').style.display = 'none';
    document.getElementById('lastQuestionAnswerFieldHeader').style.display = 'none';

    image(video, videoX, videoY);
}

//webcam

function setupVideo() {
    video = createCapture(VIDEO);
    video.size(windowWidth/2.5, windowHeight/2.5);
    // video.size(1000, 562);
    video.hide();

    videoX = (windowWidth - video.width) / 2
    videoY = (windowHeight - video.height) / 2

}

// function setupCommentButton() {
//     // Add comment button centered below video
//     addCommentButton = createButton("Submit");
//     addCommentButtonX = videoX * 1.5;
//     addCommentButtonY = videoY + video.height + 100;
//     addCommentButton.position(addCommentButtonX, addCommentButtonY);
//     addCommentButton.mouseClicked(addCommentHandler);
//     addCommentButton.id("addCommentButton");
// }

// function setupResetButton() {
//     // Reset button centered below video
//     resetButton = createButton("Reset");
//     resetButtonX = addCommentButtonX;
//     resetButtonY = addCommentButtonY;
//     resetButton.position(resetButtonX, resetButtonY);
//     resetButton.mouseClicked(resetHandler);
//     resetButton.id("resetButton");
// }

function setupSmileQuestionSpan() {
    // Question above add comment button - cycles through array
    smileQuestionSpan = createSpan(initialQuestions[currentQuestionIndex].question);
    smileQuestionSpanX = videoX/2;
    smileQuestionSpanY = windowHeight - videoY + 150;
    smileQuestionSpan.position(smileQuestionSpanX, smileQuestionSpanY);
    smileQuestionSpan.id("smileQuestionSpan");
  }

  function updateSmileQuestionSpan() {
    smileQuestionSpan = document.getElementById('smileQuestionSpan');
    smileQuestionSpan.innerHTML = initialQuestions[currentQuestionIndex].question;
  }

function setupSmileQuestionSpeechInput() {
    // Answer input field next to question
    smileQuestionSpeechInput = createSpan("");
    smileQuestionSpeechInputX = smileQuestionSpanX + 40;
    smileQuestionSpeechInputY = smileQuestionSpanY + 40;
    smileQuestionSpeechInput.position(smileQuestionSpeechInputX, smileQuestionSpeechInputY);
    smileQuestionSpeechInput.id('smileQuestionSpeechInput');
    textAlign(CENTER);

}

function setupSmileQuestionAnswersFieldHeader() {
    smileQuestionAnswersFieldHeader = createSpan("Today's answers:")
    smileQuestionAnswersFieldHeaderX = smileQuestionSpanX - 70;
    smileQuestionAnswersFieldHeaderY = smileQuestionSpanY - 60;
    smileQuestionAnswersFieldHeader.position(smileQuestionAnswersFieldHeaderX, smileQuestionAnswersFieldHeaderY);
    smileQuestionAnswersFieldHeader.id('smileQuestionAnswersFieldHeader');
}

function setupSmileQuestionAnswersField() {
    // local storage - where the answers are stored
    // smileQuestionAnswers = JSON.parse(localStorage.getItem('smileQuestionAnswers')) || [];
    smileQuestionAnswersField = createSpan("");
    smileQuestionAnswersFieldX = smileQuestionAnswersFieldHeaderX + 1;
    smileQuestionAnswersFieldY = smileQuestionAnswersFieldHeaderY + 30;
    smileQuestionAnswersField.position(smileQuestionAnswersFieldX, smileQuestionAnswersFieldY);
    smileQuestionAnswersField.id('smileQuestionAnswersField');
}

//show answer depending on the question displayed 
function showSmileQuestionAnswersCorresponding() {

}

function setupLastQuestionAnswerFieldHeader() {
    lastQuestionAnswerFieldHeader = createSpan("Your answer:")
    lastQuestionAnswerFieldHeaderX = smileQuestionAnswersFieldX;
    lastQuestionAnswerFieldHeaderY = smileQuestionAnswersFieldY + 50;
    lastQuestionAnswerFieldHeader.position(lastQuestionAnswerFieldHeaderX, lastQuestionAnswerFieldHeaderY);
    lastQuestionAnswerFieldHeader.id('lastQuestionAnswerFieldHeader');
}

function setupLastQuestionAnswerField() {
    lastQuestionAnswerField = createSpan("");
    lastQuestionAnswerFieldX = lastQuestionAnswerFieldHeaderX + 1;
    lastQuestionAnswerFieldY = lastQuestionAnswerFieldHeaderY + 30;
    lastQuestionAnswerField.position(lastQuestionAnswerFieldX, lastQuestionAnswerFieldY);
    lastQuestionAnswerField.id('lastQuestionAnswerField');
}

//test 

function addCommentHandler() {
    if (fadeSmileQuestionAnswersFieldInAndOutInterval) {
        clearInterval(fadeSmileQuestionAnswersFieldInAndOutInterval);
    }

    let smileQuestionAnswer = document.getElementById('smileQuestionSpeechInput').innerHTML.trim();
    if (smileQuestionAnswer === '') {
        alert('Please enter a comment');
        return;
    }

    document.getElementById('lastQuestionAnswerField').innerHTML = smileQuestionAnswer;

    toggleVibeState();

    document.getElementById('smileQuestionSpeechInput').innerHTML = "";

    // Add the new comment to the array
    // smileQuestionAnswers.push({ question: initialQuestions[currentQuestionIndex], answer: smileQuestionAnswer });
    // smileQuestionAnswers.push(smileQuestionAnswer);

    // console.log(smileQuestionAnswers[0]);
    // console.log(smileQuestionAnswers[0]);

    // console.log(smileQuestionAnswers[initialQuestions[currentQuestionIndex].localStorageKey]);

    // Save the updated comments back to local storage
    // localStorage.setItem('smileQuestionAnswers', JSON.stringify(smileQuestionAnswers));
    smileQuestionAnswers[currentQuestionIndex] = JSON.parse(localStorage.getItem(initialQuestions[currentQuestionIndex].localStorageKey)) || [];
    smileQuestionAnswers[currentQuestionIndex].push(smileQuestionAnswer);
    smileQuestionAnswers[currentQuestionIndex] = shuffle(smileQuestionAnswers[currentQuestionIndex]);
    localStorage.setItem(initialQuestions[currentQuestionIndex].localStorageKey, JSON.stringify(smileQuestionAnswers[currentQuestionIndex]));
    // localStorage.setItem(initialQuestions[currentQuestionIndex].localStorageKey, JSON.stringify(smileQuestionAnswers));

    if (smileQuestionAnswers[currentQuestionIndex].length >= 2) {
        fadeSmileQuestionAnswersFieldInAndOut();
        fadeSmileQuestionAnswersFieldInAndOutInterval = setInterval(fadeSmileQuestionAnswersFieldInAndOut, 5000);
    } else {
        showSingleAnswerInSmileQuestionAnswersField();
    }
}

function resetHandler() {
    toggleVibeState();
    // navigate to next question
    // window.location.href = 'q2.html';
    currentQuestionIndex = (currentQuestionIndex + 1) % initialQuestions.length;
    let currentQuestion = initialQuestions[currentQuestionIndex];
    smileQuestionSpan.html(currentQuestion);
    showCorrespondingAnswer(currentQuestion);
}

function showCorrespondingAnswer(question) {
    let answer = smileQuestionAnswers.find(item => item.question === question);
    if (answer) {
        document.getElementById('lastQuestionAnswerField').innerHTML = answer.answer;
    } else {
        document.getElementById('lastQuestionAnswerField').innerHTML = "";
    }
}


//test

function toggleVibeState() {
    vibeState = (!vibeState);
}

// Call this function with "setInterval", e.g., "setInterval(fadeSmileQuestionAnswersFieldInAndOut, 5000);"
// after "setupSmileQuestionAnswersField()" has been called
function fadeSmileQuestionAnswersFieldInAndOut() {
    // Display each comment in the comments section
    let smileQuestionAnswersField = document.getElementById('smileQuestionAnswersField');
    smileQuestionAnswersField.setAttribute("class", "text-fade");
    answersToCurrentQuestion = JSON.parse(localStorage.getItem(initialQuestions[currentQuestionIndex].localStorageKey));
    if (answersToCurrentQuestion && answersToCurrentQuestion.length > 0) {
        setTimeout(() => {
            smileQuestionAnswersField.innerHTML = answersToCurrentQuestion[smileQuestionAnswersFieldCounter];
            smileQuestionAnswersField.setAttribute("class", "text-show");
        }, 1000)
    }

    smileQuestionAnswersFieldCounter++;

    if (smileQuestionAnswersFieldCounter >= smileQuestionAnswers[currentQuestionIndex].length) {
        smileQuestionAnswersFieldCounter = 0;
    }
}

function showSingleAnswerInSmileQuestionAnswersField() {
    let smileQuestionAnswersField = document.getElementById('smileQuestionAnswersField');
    smileQuestionAnswersField.innerHTML = smileQuestionAnswers[currentQuestionIndex][0];
}

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

// Speech recognized event3
function gotSpeech() {
    // Something is there
    // Get it as a string, you can also get JSON with more info
    if (speechRec.resultValue) {
      let said = speechRec.resultString;

    if (said == 'reset') {
        resetSmileQuestionSpeechInput();
    } else if (said == 'submit') {
        addCommentHandler();
    } else if (said == 'next') {
        handleNextCommand();
    } else {
        updateSmileQuestionSpeechInput(said);
    }
    }
}

function updateSmileQuestionSpeechInput(said) {
    current_input = document.getElementById('smileQuestionSpeechInput').innerHTML;
    if (!current_input && said) {
        document.getElementById('smileQuestionSpeechInput').innerHTML = said;
    }
}

function resetSmileQuestionSpeechInput() {
    document.getElementById('smileQuestionSpeechInput').innerHTML = "";
}

function handleNextCommand() {
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= initialQuestions.length) {
        currentQuestionIndex = 0;
    }
    updateSmileQuestionSpan();
    resetSmileQuestionSpeechInput();
    toggleVibeState();
}

