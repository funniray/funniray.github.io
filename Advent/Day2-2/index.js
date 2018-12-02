function solve(input) {
	for (let i=0; i<input.length; i++) {
		let currString = input[i]
		for (let n=0; n<input.length; n++) {
			if (n===i)
				continue;
			let testString = input[n];
			let differentLetters = [];
			for (let j=0; j<currString.length; j++){
				if (currString[j] != testString[j]) {
					differentLetters[differentLetters.length] = j;
				}
			}
			if (differentLetters.length == 1) {
				return "Solution: "+currString.slice(0,differentLetters[0])+currString.slice(differentLetters[0]+1);
			}
		}
	}
}