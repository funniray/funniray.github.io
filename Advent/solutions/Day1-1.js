function solve(input) {
	var output = 0;
	for (var i=0; i<input.length; i++) {
		output += parseInt(input[i]);
	}
	return output;
}