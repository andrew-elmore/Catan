export function showInstructions(){
    document.getElementById("instructions-anchor").style.display = "block";
    let hideInstructionsButton = document.getElementById('hide-instruction-button')
    hideInstructionsButton.addEventListener('click', () => instructionsButton())
}

function instructionsButton(){
    document.getElementById("instructions-anchor").style.display = "none";
}

export function insPage1(){
    //basic layout
}

export function insPage2(){
    //resource
}

export function insPage3(){
    //resource
}
