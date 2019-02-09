function solve(input) {
	let time2 = 0;
	let time3 = 0;
	
	for (let i=0; i<input.length; i++) {
		const curr = input[i];
		let times = [];
		let counted2 = false;
		let counted3 = false;
		for (let n=0; n<curr.length; n++) {
			const code = curr.charCodeAt(n);
			if (times[code] == undefined) {
				times[code] = 0;
			}
			times[code]++;
		}
		times.forEach((n)=>{
			if (n === 2 && !counted2) {
				time2++;
				counted2 = true;
			} else if (n === 3 && !counted3) {
				time3++;
				counted3 = true;
			}
		});
	}

	return `Had ${time2} letters twice and ${time3} letters three times. Checksum is ${time2*time3}`;
}