const fs = require('fs');

// Read the JSON file
const enJsonData = fs.readFileSync('en.json');
const en = JSON.parse(enJsonData);

const esJsonData = fs.readFileSync('es.json');
const es = JSON.parse(esJsonData);

const caJsonData = fs.readFileSync('ca.json');
const ca = JSON.parse(caJsonData);

function sort(data) {
	// Convert object to array of key-value pairs
	const dataArray = Object.entries(data);

	// Sort the array based on the key
	dataArray.sort((a, b) => {
		const keyA = a[0].toUpperCase();
		const keyB = b[0].toUpperCase();

		if (keyA < keyB) {
			return -1;
		}
		if (keyA > keyB) {
			return 1;
		}
		return 0;
	});

	// Convert the sorted array back to an object
	return Object.fromEntries(dataArray);
}

function addMissingKeys(obj) {
	const newObj = { ...obj }; // Create a new object to avoid modifying obj directly

	for (let key in en) {
		if (en.hasOwnProperty(key) && !obj.hasOwnProperty(key)) {
			newObj[key] = en[key];
		}
	}

	return newObj;
}

function fillEmptyValues(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] === '') {
			obj[key] = en[key];
		}
	}

	return obj;
}

function save(obj, name) {
	// Write the sorted data back to the JSON file
	fs.writeFileSync(name, JSON.stringify(obj, null, 2));

	console.log('Saving completed!');
}

function removeExtraKeys(obj) {
	const newObj = {}; // Create a new object to avoid modifying obj directly
	for (let key in obj) {
		if (obj.hasOwnProperty(key) && en[key]) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
}

const filteredEs = removeExtraKeys(es);
const filteredCa = removeExtraKeys(ca);

const updatedEs = addMissingKeys(filteredEs);
const updatedCa = addMissingKeys(filteredCa);

const sortedEn = sort(en);
const sortedEs = sort(updatedEs);
const sortedCa = sort(updatedCa);

const filledEs = fillEmptyValues(sortedEs);
const filledCa = fillEmptyValues(sortedCa);

save(sortedEn, 'en.json');
save(filledEs, 'es.json');
save(filledCa, 'ca.json');
