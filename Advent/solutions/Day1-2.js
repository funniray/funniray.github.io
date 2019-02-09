function solve(input) {
	var sum = 0;
	var seen = new Set([]);
	loops = 0;
	
	var inputInts = [];

	for (var i=0; i<input.length; i++) {
		inputInts[i] = parseInt(input[i]);
	}

	while (true) {
		for (var i=0; i<input.length; i++) {
			sum += inputInts[i];
			if (seen.has(sum)) {
				return `found solution ${sum} after looping ${loops} times`;
			}
			seen.add(sum);
		}
		loops++;
	}
}