// global variables
let canvas = document.getElementById("canvas");
let parent = document.getElementById("automatonPanel");
let context = canvas.getContext("2d");
canvas.width  = parent.offsetWidth;
canvas.height = parent.offsetHeight;

/**
* Draws the string matching automaton for a given sequence 
* @param seq: the pattern/sequence of interest 
* @param height: the height of the canvas 
* @param width: the width of the canvas
*/
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
	// initial height (y-axis radius of the ellipse) to draw backwards transitions 
	let yRadius = 40;
	// sizes of fonts inside automaton relative to the size of the radius
	let stateFontSize = radius/1.25;
	let transFontSize = radius/3;
	
	// for each state
	for (let i=0; i<k; i++) {			
		// draw the circle
		context.beginPath();
		context.arc(x,y,radius,0,Math.PI*2,false);
		context.stroke();
		context.closePath();
		// draw state inside circle
		context.font = stateFontSize + "px Times New Roman";
		context.fillText(i, x-(stateFontSize/6), y+(stateFontSize/4));
		
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
				// even numbered state, add backwards transition above the states
				if (i % 2 == 0) {
					// loop using a full ellipse
					if (i-backwardsState == 0) {
						context.beginPath();
						context.ellipse(x,y-(radius*1.5),8,radius/2,0,0,2*Math.PI,true);
						context.stroke();
						// character on backwards transition
						context.font = transFontSize + "px Times New Roman";
						context.fillText(alphabet[j],x-2,y-(radius*2)-3);
					}
					// backwards transition to another state using a half-ellipse
					else {
						context.beginPath();
						context.ellipse(getMiddleXCoord(x,i,backwardsState,radius),y-radius, getTotalDistance(i,backwardsState,radius)/2,yRadius,0,0,Math.PI,true);
						context.stroke();
						// character on backwards transition
						context.font = transFontSize + "px Times New Roman";
						context.fillText(alphabet[j],getMiddleXCoord(x,i,backwardsState,radius),y-radius-yRadius-3);
					}
				}
				
				// odd numbered state, add backwards transition below the states
				else {
					// loop using a full ellipse
					if (i-backwardsState == 0) {
						context.beginPath();
						context.ellipse(x,y+(radius*1.5),8,radius/2,0,0,2*Math.PI,false);
						context.stroke();
						// character on backwards transition
						context.font = transFontSize + "px Times New Roman";
						context.fillText(alphabet[j],x-2,y+(radius*2)+12);
					}
					// backwards transition to another state using a half-ellipse
					else {
						context.beginPath();
						context.ellipse(getMiddleXCoord(x,i,backwardsState,radius),y+radius, getTotalDistance(i,backwardsState,radius)/2,yRadius,0,0,Math.PI,false);
						context.stroke();
						// character on backwards transition
						context.font = transFontSize + "px Times New Roman";
						context.fillText(alphabet[j],getMiddleXCoord(x,i,backwardsState,radius),y+radius+yRadius+10);
					}
				}
				// increase the y-axis radius to prevent all transitions overlapping
				yRadius += 10;
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
			context.font = transFontSize + "px Times New Roman";
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

/**
* Given two states, find the X coordinate that is halfway between the centers of the two states
* @param x: the x-coordinate corresponding to the center of the "greater" state, i
* @param i: the first state, should be greater or equal to the second state
* @param backwardsState: the second state, should be less or equal to the first state (hence, backwards state)
* @ param radius: the radius for the current automaton
*/
function getMiddleXCoord(x, i, backwardsState, radius) {
	// entire distance between the radius' of the two states 
	let totalDistance = 3*(i-backwardsState)*radius;
	return x-(totalDistance/2);
}

/** 
* Given two states, find the total distance between the centers of the two states
* @param i: the first state, should be greater or equal to the second state
* @param backwardsState: the second state, should be less or equal to the first state (hence, backwards state)
* @param radius: the radius for the current automaton
*/
function getTotalDistance(i, backwardsState, radius) {
	return 3*(i-backwardsState)*radius;
}

/**
* Given 2 strings, find the maximal overlap between a prefix of the first string with a suffix of the 
* second string 
* @param seq: the first string, overlap contains a prefix of this string
* @param curString: the second string, overlap contains a suffix of this string
*/
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
});
        
