let solveDay = [];
function solve() {
	const day = document.getElementsByName("day")[0].value.split("-");
	const startTime = new Date().getTime();
	const solution = solveDay[(day[0]-1)*2+(day[1]-1)](document.getElementsByName("data")[0].value.split("\n"));
	document.getElementById("solution").innerHTML = solution;
	document.getElementById("time").innerHTML = `It took ${new Date().getTime()-startTime}ms to solve this problem.`
}
function reqJS(day,part) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let script = document.createElement("script");
			script.innerHTML = this.responseText.replace("function solve(input) {",`solveDay[${(day-1)*2+(part-1)}] = function(input){`);
			document.getElementsByTagName("header")[0].appendChild(script);
			document.getElementById("daySelector").innerHTML += `<option value=${day}-${part}>Day ${day}-${part}</option>`;
			if (part === 2) {
				reqJS(day+1,1);
			} else {
				reqJS(day,2);
			}
		}
	};
	xhttp.open("GET", `solutions/Day${day}-${part}.js`, true);
	xhttp.send();
}
reqJS(1,1);