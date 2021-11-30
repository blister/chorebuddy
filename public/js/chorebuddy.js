function getWeeklyChores() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/api/week');
	xhr.onload = function() {
		let response = JSON.parse(this.responseText);
		console.log(response);

		for ( let i = 0; i < response.length; i++ ) {
			document.getElementById('available-chores').innerHTML += `
				<div id="chore_${response[i].id}">
					<h3>${response[i].name}</h3>
					<p>${response[i].description}</p>
				</div>`;
		}
	};
	xhr.send();
}

const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

function setupWeek() {
	let date = new Date();
	let dayOfWeek = date.getDay();
	let sunday = new Date( date.setDate( date.getDate() - date.getDay() ) );
	console.log(dayOfWeek);
	console.log(sunday);

	let curDate = new Date().getDay();
	let d = sunday;
	for ( let i = 0; i < days.length; i++ ) {
		let monthDate = d.getDate();
		let month = d.getMonth();
		if ( d.getDay() == curDate ) {
			document.getElementById( days[i] ).classList.add('current');
		}
		document.getElementById( days[i] ).innerHTML = `<h4>${days[ i ]}, ${months[ month ]} ${monthDate}</h4><div id="${ days[i] }_chores"></div>`;
		d = new Date( d.setDate( d.getDate() + 1 ) );

	}


}

// setup week
setupWeek();