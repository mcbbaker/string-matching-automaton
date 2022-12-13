// global variables
let canvas = document.getElementById("canvas");
let parent = document.getElementById("automatonPanel");
let context = canvas.getContext("2d");
canvas.width  = parent.offsetWidth;
canvas.height = parent.offsetHeight;

// draws the automaton
function drawAutomaton(seq,height,width) {
	const alphabet = [];
	// get alphabet characters from sequence
	for (let i=0; i<seq.length; i++) {
		if (alphabet.includes(seq[i]) == false) {
			alphabet.push(seq[i]);
		}
	}
	// number of states in automaton
	const k = seq.length + 1; 
	// radius size and total space calculations
	const numRadius = (k*2)+(k-1);
	const radius = (width-width/8)/numRadius;
	const totalSpace = numRadius*radius;
	// get x and y position to start drawing
	const y = height/2;
	let x = ((width-totalSpace)/2)+radius;
	// initial height to draw backwards transitions
	let lineHeight = 80;
	
	// for each state
	for (let i=0; i<k; i++) {			
		// draw the circle
		context.beginPath();
		context.arc(x,y,radius,0,Math.PI*2,false);
		context.stroke();
		context.closePath();
		// draw state inside circle
		context.font = "5vh Times New Roman";
		context.fillText(i, x-3, y+5);
		
		// add backwards transitions, iterate through all letters of alphabet
		let forwardChar = seq[i];
		for (let j=0; j<alphabet.length; j++) {
			// character already added as a forwards transition - do nothing
			if (alphabet[j] == forwardChar) {
			}
			// character needs to be added as a backwards transition
			else {
				let curString = seq.slice(0,i) + alphabet[j];
				let backwardsState = getOverlaps(seq, curString);
				
				// add backwards transition above the states
				if (i % 2 == 0) {
					if (i-backwardsState == 0) {
						context.beginPath();
						context.moveTo(x, y-radius);
						context.bezierCurveTo(x-30,y-lineHeight,x+30,y-lineHeight,x-(radius*3*(i-backwardsState)), y-radius);
						context.stroke();
					}
					else {
						context.beginPath();
						context.moveTo(x, y-radius);
						context.bezierCurveTo(x,y-lineHeight,x-(radius*3*(i-backwardsState)),y-lineHeight,x-(radius*3*(i-backwardsState)), y-radius);
						context.stroke();
					}
				}
				
				// add backwards transition below the states
				else {
					if (i-backwardsState == 0) {
						context.beginPath();
						context.moveTo(x, y+radius);
						context.bezierCurveTo(x-30,y+lineHeight,x+30,y+lineHeight,x-(radius*3*(i-backwardsState)), y+radius);
						context.stroke();
					}
					else {
						context.beginPath();
						context.moveTo(x, y+radius);
						context.bezierCurveTo(x,y+lineHeight,x-(radius*3*(i-backwardsState)),y+lineHeight,x-(radius*3*(i-backwardsState)), y+radius);
						context.stroke();
					}
				}
				// increase the line height to prevent all transitions overlapping
				lineHeight += 15;
			}
		}
		
		
		// add forward transitions, only if not the final state
		if (i != k-1) {
			// line for forward transition
			context.beginPath();
			context.moveTo(x+radius,y);
			context.lineTo(x+(radius*2),y);
			context.stroke();
			context.closePath();
			// character for forward transition 
			context.font = "2vh Times New Roman";
			context.fillText(seq.charAt(i),x+radius+(radius/2),y-3);
			// increase x for next circle to be drawn
			x += (radius*3);
		}
	}
	
	// after processing each state, add extra circle around final state
	context.beginPath();
	context.arc(x,y,radius+5,0,Math.PI*2,false);
	context.stroke();
	context.closePath();
}

// calculates the maximal overlap (backwards transition) between a suffix of the current string
// with a prefix of the sequence
function getOverlaps(seq, curString) {
	let maximum = 0;
	let seqPos = 0;
	let fail = false;
	// for each character in the current string, test if the string starting at that character overlaps entirely with the sequence
	for (let k=0; k<curString.length; k++) {
		// always set the sequence position to 0 as it is the prefix
		seqPos = 0;
		fail = false;
		// check the current character and all remaining characters of the current string against the sequence
		for (let l=k; l<curString.length; l++) {
			// if current string is longer than sequence (occurs with final state, error prevention to avoid undefined)
			if (seqPos > seq.length-1) {
				fail = true;
			}
			else if (curString[l] != seq[seqPos]) {
				fail = true;
			}
			// increment sequence position for next iteration
			seqPos += 1;
		}
		// if all characters matched for the starting position of the current string and the overlap is larger than the maximum so far,
		// update maximum overlap
		if (fail == false && curString.length-k > maximum) {
			maximum = curString.length-k;
		}
	}
	return maximum;
}

// event listener to draw automaton on submit
let sequenceForm = document.getElementById("sequenceForm");
sequenceForm.addEventListener("submit", function(event) {
    context.clearRect(0,0, canvas.width, canvas.height);
	event.preventDefault();
	const sequence = document.getElementById("sequence").value;
	if (sequence.length > 0) {
		drawAutomaton(sequence,canvas.height,canvas.width);
	}
})
        