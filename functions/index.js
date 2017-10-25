process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

// Actions
const TASK_INTENT = 'do.action';
const COFFEE_INTENT = 'do.coffee';
const MEDICINE_INTENT = 'do.medicine';

// Parameters
const TASK_CATEGORY = 'task';
const COFFEE_ROAST = 'roast';
const KNOW_MEDICINE = 'know_medicine';
const YES_KNOW_MEDICINE = 'KnowMedicine.KnowMedicine-yes';
const NO_KNOW_MEDICINE = 'KnowMedicine.KnowMedicine-no';

exports.alice = functions.https.onRequest((request, response) => {
	const app = new App({request, response});
	console.log('Request headers ' + JSON.stringify(request.headers));
	console.log('Response headers ' + JSON.stringify(response.headers));

	console.log('Raw input: ' + app.getRawInput());
	console.log('Current Intent: ' + app.getIntent());
	console.log('Current Context: ' + app.getContext());


	function chooseTask(app) {
		let task = app.getArgument(TASK_CATEGORY);
		var final_ask = "Alright! Let's get started on " + task;
		

		if (task == 'coffee') {
			final_ask += "! Would you like dark roast or light roast?";
		}
		else {
			final_ask += "! Do you know which medicine you want to take now?";
		}

		app.ask(final_ask);
	}

	function chooseCoffeeRoast(app) {
		let coffee = app.getArgument(COFFEE_ROAST);
		app.tell("Let us make you some " + coffee + " roast.");
	}

	function knowMedicine(app) {
		let know = app.getRawInput();

		if (know.toLowerCase() == 'yes') {
			app.ask("What is it?");
		}
		else {
			app.ask("Hmm, what time is it right now?");
		}
	}

	function yesKnowMedicine(app) {
		app.ask("This is the follow-up. What is it?");
	}

	function noKnowMedicine(app) {
		app.ask("This is the follow-up. What time is it");
	}

	let actionMap = new Map();
	actionMap.set(TASK_INTENT, chooseTask);
	actionMap.set(COFFEE_INTENT, chooseCoffeeRoast);
	actionMap.set(MEDICINE_INTENT, knowMedicine);
	actionMap.set(YES_KNOW_MEDICINE, yesKnowMedicine);
	actionMap.set(NO_KNOW_MEDICINE, noKnowMedicine);

app.handleRequest(actionMap);
});