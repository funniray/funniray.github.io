function solve(input) {
	var sum = 0;
	var seen = [];
	loops = 0;
	
	while (true) {
		for (var i=0; i<input.length; i++) {
			seen[seen.length] = sum;
			sum += parseInt(input[i]);
			if (seen.includes(sum)) {
				return `found solution ${sum} after looping ${loops} times`;
			}
		}
		loops++;
	}
}