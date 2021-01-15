let answersView = new AnswersView();

let consoleView = new ConsoleView();

let questionsView = new QuestionsView();

let sideMenuView = new SideMenuView();

let freeStyleView = new FreeStyleView();

let view = (function () {

    let toggleContainerDisplayWithId = id => {
        let displayStyle = document.querySelector(`#${id}`);
        if (displayStyle.style.display === 'none') {
            displayStyle.style.display = 'block';
        } else {
            displayStyle.style.display = 'none';
        }
    }

    let unblurElementWithId = (toUnnblurId) => {
        document.querySelector(`#${toUnnblurId}`).style.filter = 'none';
    }

    let makeElementWithIdDissapear = (id) => {
        document.querySelector(`#${id}`).style.display = 'none';
    }

    let makeElementWithIdApear = (id) => {
        document.querySelector(`#${id}`).style.display = 'block';
    }

    let toggleBlurForBodyElement = () => {
        let blurry = document.querySelector('body').style.filter;
        if (blurry === 'none') {
            document.querySelector('body').style.filter = 'blur(20px)';
        } else {
            document.querySelector('body').style.filter = 'none';
        }
    }

    let toggleBlurForElementWithId = (id) => {
        let blurry = document.querySelector(`#${id}`).style.filter;
        if (blurry === 'none') {
            document.querySelector(`#${id}`).style.filter = 'blur(20px)';
        } else {
            document.querySelector(`#${id}`).style.filter = 'none';
        }
    }

    let initialiseNextQuestionButtonListener = (callbackFn) => {
        document.querySelector("#next_question_button").addEventListener('click', e => {
            callbackFn();
        });
    }


    let initialiseSubmitAnswerButtonListener = (isInputCommandCorrect, getNextQuestion) => {
        document.querySelector("#user_input").addEventListener('submit', async e => {
            e.preventDefault();
            let userInputtedCommand = document.querySelector("#console_input").value;
            let isCorrect = await isInputCommandCorrect(userInputtedCommand);
            if (isCorrect) {
                view.toggleCorrectAnswerResponse();
                await getNextQuestion();
            } else {
                view.toggleIncorrectAnswerResponse();
            }
            setTimeout(() => {
                isCorrect ? view.toggleCorrectAnswerResponse() : view.toggleIncorrectAnswerResponse();
            }, 1000)
            processTerminalInput('console_input', 'history_of_inputs');
        });
    }

    let processTerminalInput = (inputId, listId) => {
        let userInputtedCommand = document.querySelector(`#${inputId}`).value;
        let newElement = document.createElement('div');
        newElement.innerHTML = '$ ' + userInputtedCommand;
        document.querySelector(`#${inputId}`).value = '';
        document.querySelector(`#${listId}`).appendChild(newElement);
    }

    let initialiseGetHintButtonListener = (getCurrentQuestion) => {
        document.querySelector("#question_hint_button").addEventListener('click', e => {
            getCurrentQuestion().then(e => {
                view.toggleCurrentQuestionHint(e);
            });
        });
    }

    let initialiseHintModalWindowCross = (getCurrentQuestion) => {
        document.querySelector('#close_modal_window').addEventListener('click', e => {
            view.toggleCurrentQuestionHint(getCurrentQuestion());
        });
    }

    let setFilterStyleToNoneOfContainerWithid = (toClickId, toUnnblurId, clickableElementId) => {
        document.querySelector(`#${toClickId}`).addEventListener('click', e => {
            unblurElementWithId(toUnnblurId);
            makeElementWithIdDissapear(clickableElementId);
        });
    };

    let initialiseUnblurClickableContainers = () => {
        setFilterStyleToNoneOfContainerWithid('unblur_answer_container', 'answer_hint_container', 'unblur_answer_container');
        setFilterStyleToNoneOfContainerWithid('unblur_description_container', 'description_hint_container', 'unblur_description_container');
    }

    let initialiseWelcomeWindow = () => {
        makeElementWithIdApear('welcome_container');

        function extracted() {
            makeElementWithIdDissapear('welcome_container');
            toggleBlurForBodyElement();
            document.querySelector('#console_input').focus();
            // animateLeftPaddingOfElementWithId('sidebar_menu_button',  window.innerWidth, 50, -50, 'block');
            scaleElement(0, 1, 0.05, 'question_data', 'flex');
            scaleElement(0, 1, 0.02, 'user_input_container', 'block');
            animateLeftPaddingOfElementWithId('sidebar_menu_button',  window.innerWidth, 10, -25, 'block')
                .then(e=>console.log(e));
            makeElementWithIdApear('all_questions_toggler');
            makeElementWithIdApear('add_question_toggler');
        }

        document.querySelector('#close_welcome_window').addEventListener('click', e => {
            extracted();
        });
        document.querySelector('#welcome_continue_button').addEventListener('click', e => {
            extracted();
        })
        welcomePageTyper();

    }


    let initialiseSideMenuButton = () => {
        document.querySelector('#sidebar_menu_button').addEventListener('click', e => {
            toggleContainerDisplayWithId('side_bar_menu');
            changeOpacity(0, 1, 0.1, 'side_bar_menu');
        });
        document.querySelector('#close_side_bar').addEventListener('click', e => {
            toggleContainerDisplayWithId('side_bar_menu');
            changeOpacity(1, 0, -0.1, 'side_bar_menu');
        });
    }

    let initialiseSideSideMenuFreestyleRouterbutton = () => {
        view.addOnClickListenerToSideMenuFreeStyleRouter(() => {
            document.querySelector('#main_git_trainer_container').style.display = 'none';
            document.querySelector('#git_freestyle_container').style.display = 'block';
        });
    }

    let initialiseSideSideMenuTrainerRouterbutton = () => {
        view.addOnClickListenerToTrainerRouter(() => {
            document.querySelector('#main_git_trainer_container').style.display = 'block';
            document.querySelector('#git_freestyle_container').style.display = 'none';
        });
    }

    let initialiseListAllQuestionsButton = (startFetchingCallback) => {
        document.querySelector('#all_questions_icon').addEventListener('click', e=>{
            toggleContainerDisplayWithId('all_questions_modal');
            startFetchingCallback();
        });
    }

    let addQuestionIntoAllQuestionsModal=(question) =>{
        let parent = document.querySelector('#all_questions_modal');
        let htmlDivElement = document.createElement('div');
        htmlDivElement.innerText=question.question;
        htmlDivElement.classList.add('question_list_entry')
        htmlDivElement.addEventListener('click', e=>{


        });
        parent.appendChild(htmlDivElement);
    }

    let makeQuestionSubmitModalWindowListener = () => {
        document.querySelector('#add_question_button').addEventListener('click',e=>{
            document.querySelector('#add_question_modal').style.display='block';
        });
    };



    let submitNewQuestionButtonInit = () => {
        document.querySelector('#submit_new_question_button').addEventListener('click',async e=>{
            let tempQuestion = document.querySelector('#question_input').value;
            let tempAnswer = document.querySelector('#answer_input').value;
            let tempDescription = document.querySelector('#description_input').value;
            let a = {question: tempQuestion, answer: tempAnswer, description: tempDescription};
            console.log(a)
            let fetchResult = await fetch('http://localhost:5000/api/questions', {
                method:'POST',
                mode:'no-cors',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(a)
            });
            return fetchResult.json();
        });
    };

    //Api
    return {
        updateQuestion: questionsView.updateQuestion,
        toggleCorrectAnswerResponse: answersView.toggleCorrectAnswerResponse,
        toggleIncorrectAnswerResponse: answersView.toggleIncorrectAnswerResponse,
        toggleCurrentQuestionHint: questionsView.toggleCurrentQuestionHint,
        resetAnswerAndDescriptionToBlur: answersView.resetAnswerAndDescriptionToBlur,
        unblurElementWithId: unblurElementWithId,
        makeElementWithIdApear: makeElementWithIdApear,
        makeElementWithIdDissapear: makeElementWithIdDissapear,
        toggleBlurForBodyElement: toggleBlurForBodyElement,
        toggleBlurForElementWithId: toggleBlurForElementWithId,
        toggleContainerDisplayWithId: toggleContainerDisplayWithId,
        welcomePageTyperAnimation: welcomePageTyper,
        goToNextLineOnConsole: consoleView.goToNextLineOnConsole,
        addOnClickListenerToSideMenuFreeStyleRouter: sideMenuView.addOnClickListenerToFreeStyleRouter,
        addOnClickListenerToTrainerRouter: sideMenuView.addOnClickListenerToTrainerRouter,
        initialiseNextQuestionButtonListener: initialiseNextQuestionButtonListener,
        initialiseSubmitAnswerButtonListener: initialiseSubmitAnswerButtonListener,
        initialiseGetHintButtonListener: initialiseGetHintButtonListener,
        initialiseHintModalWindowCross: initialiseHintModalWindowCross,
        initialiseUnblurClickableContainers: initialiseUnblurClickableContainers,
        initialiseWelcomeWindow: initialiseWelcomeWindow,
        initialiseSideMenuButton: initialiseSideMenuButton,
        initialiseSideSideMenuFreestyleRouterbutton: initialiseSideSideMenuFreestyleRouterbutton,
        initialiseSideSideMenuTrainerRouterbutton: initialiseSideSideMenuTrainerRouterbutton,
        updateFreeStyleBranchesView: freeStyleView.updateFreeStyleBranchesView,
        updateFreestyleFilesView: freeStyleView.updateFreestyleFilesView,
        initialiseFreeStyleConsoleInput: freeStyleView.initialiseFreeStyleConsoleInput,
        viewFileContent: freeStyleView.viewFileContent,
        initaliseFileContentEditorSaveButton: freeStyleView.initaliseFileContentEditorSaveButton,
        initialiseFreeStyleInputNavigation: freeStyleView.initialiseFreeStyleInputNavigation,
        listAllFilesInTerminal : (branch) => freeStyleView.listAllFilesInTerminal(branch),
        initialiseListAllQuestionsButton: initialiseListAllQuestionsButton,
        addQuestionIntoAllQuestionsModal:addQuestionIntoAllQuestionsModal,
        makeQuestionSubmitModalWindowListener:makeQuestionSubmitModalWindowListener,
        submitNewQuestionButtonInit:submitNewQuestionButtonInit
    };
})();