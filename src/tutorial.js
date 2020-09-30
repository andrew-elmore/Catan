export function showInstructions(pageNum, player){
    document.getElementById("instructions-anchor").style.display = "block";
    let hideInstructionsButton = document.getElementById('hide-instruction-button')
    hideInstructionsButton.addEventListener('click', () => instructionsButton())
    
    let pages = [
        () => insPage0(),
        () => insPage1(),
        () => insPage2(),
        () => insPage3()
    ]

    if (player === undefined){
        pages[pageNum]()
    } else {
        victoryPage(player)
    }
}

function instructionsButton(){
    document.getElementById("instructions-anchor").style.display = "none";
    let pageEles= [
        document.getElementById('page0'),
        document.getElementById('page1'),
        document.getElementById('page2'),
        document.getElementById('page3'),
        document.getElementById('victory')
    ]

    pageEles.forEach((parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    })
}

function navBar(pageNum, div){
    let navDiv = document.createElement('div')
    navDiv.id = 'navbar'
    div.appendChild(navDiv)

    let leftCarat = document.createElement('div')
    leftCarat.innerHTML = '<'
    leftCarat.id = "leftCarat"
    navDiv.appendChild(leftCarat)
    leftCarat.addEventListener('click', () => changePage((pageNum + 3) % 4))

    let rightCarat = document.createElement('div')
    rightCarat.innerHTML = '>'
    rightCarat.id = "rightCarat"
    navDiv.appendChild(rightCarat)
    rightCarat.addEventListener('click', () => changePage( (pageNum + 1) % 4 ))    
}

function changePage(pageNum){
    instructionsButton()
    showInstructions(pageNum)
}

function insPage0(){
    let div = document.getElementById('page0')
    
    let h1 = document.createElement('h1')
    h1.innerHTML = "The Basics"
    div.appendChild(h1)

    let p1 = document.createElement('p')
    p1.innerHTML = 'The objective of the game is to create settlements and buy development cards and be the first to reach 10 victory points. Settlements are connected to other settlements by roads. To build a Settlement click on the intersection between three tiles. To build a road click on the line between two tiles.'
    div.appendChild(p1)

    let p2 = document.createElement('p')
    p2.innerHTML = 'Each settlement is worth one victory point and each development card has a 50% chance of yeilding a victory point.'
    div.appendChild(p2)

    let img1 = document.createElement('img')
    img1.src = 'src/images/RoadAndSettPlacement.png'
    div.appendChild(img1)
    

    navBar(0, div)
}

function reload (){
    window.location.reload()
}

function insPage1(){
    let pgNum = 1
    let div = document.getElementById('page1')

    let h1 = document.createElement('h1')
    h1.innerHTML = "Resources & Map"
    div.appendChild(h1)

    
    let p1 = document.createElement('p')
    p1.innerHTML = 'Each tile has a number and a color, the color denotes what type of resource is harvested from the tile by settlements with access to it. The number denotes when that resource will be harvested. At the start of each turn a dice is rolled, the number coresponding to that dice roll indicates which tiles will yeild resources.'
    div.appendChild(p1)
    
    
    let ul = document.createElement('ul')
    div.appendChild(ul)

    
    let li1 = document.createElement('li')
    li1.innerHTML = 'Desert: Produces Nothing'
    ul.appendChild(li1)
    let sample1 = document.createElement('div')
    li1.id = 'desert'
    li1.appendChild(sample1)

    
    let li2 = document.createElement('li')
    li2.innerHTML = 'Forest: Produces Lumber'
    ul.appendChild(li2)
    let sample2 = document.createElement('div')
    li2.id = 'lumber'
    li2.appendChild(sample2)
    
    let li3 = document.createElement('li')
    li3.innerHTML = 'Hills: Produces Brick'
    ul.appendChild(li3)
    let sample3 = document.createElement('div')
    li3.id = 'brick'
    li3.appendChild(sample3)
    
    let li4 = document.createElement('li')
    li4.innerHTML = 'Mountians: Produces Ore'
    ul.appendChild(li4)
    let sample4 = document.createElement('div')
    li4.id = 'ore'
    li4.appendChild(sample4)
    
    let li5 = document.createElement('li')
    li5.innerHTML = 'Feilds: Produces Wheat'
    ul.appendChild(li5)
    let sample5 = document.createElement('div')
    li5.id = 'wheat'
    li5.appendChild(sample5)
    
    let li6 = document.createElement('li')
    li6.innerHTML = 'Pasture: Produces Wool'
    ul.appendChild(li6)
    let sample6 = document.createElement('div')
    li6.id = 'wool'
    li6.appendChild(sample6)
    
    navBar(1, div)
}

function insPage2(){
    let pgNum = 2
    let div = document.getElementById('page2')

    let h1 = document.createElement('h1')
    h1.innerHTML = "Turn & Trading"
    div.appendChild(h1)

    
    let h2a = document.createElement('h2')
    h2a.innerHTML = 'First Turn'
    div.appendChild(h2a)
    
    
    let p1 = document.createElement('p')
    p1.innerHTML = 'For the first turn place two settlements and two roads, settlements must be two roads appart, and must be placed before their coresponding road can be placed. Once you are done placing the roads and settlements press next turn to move on pass the turn to the computer player. Once you press next turn you will recive a resource for each tile that has a settlement adjacent to it.'
    div.appendChild(p1)

    
    let h2b = document.createElement('h2')
    h2b.innerHTML = 'Typical Turn'
    div.appendChild(h2b)

    
    let p2 = document.createElement('p2')
    p2.innerHTML = 'During your turn you can build settlements, roads, cities, buy development cards and trade. The only limit to how many actions you can take is your resources. At the start of your turn the dice will be rolled and all players will recive the amount of resources they are owed due to that roll. Once you complete your turn, press the end turn button to pass the turn on to the next player.'
    div.appendChild(p2)
    
    
    let h2c = document.createElement('h2')
    h2c.innerHTML = 'Trading'
    div.appendChild(h2c)
    
    
    let p3 = document.createElement('p')
    p3.innerHTML = 'During your turn you can give up 3 of any type of the same resource in exchange for 1 of any resource.'
    div.appendChild(p3)
    

    navBar(2, div)
}



function insPage3(){
    let pgNum = 3
    let div = document.getElementById('page3')

    
    let h1 = document.createElement('h1')
    h1.innerHTML = `About Me`
    div.appendChild(h1)
    
    navBar(3, div)
}

function victoryPage(player){
    let div = document.getElementById('victory')
    
    
    let h1 = document.createElement('h1')
    h1.innerHTML = `PLAYER ${player.color.toUpperCase()} HAS WON!`
    div.appendChild(h1)

    let button = document.createElement('button')
    button.innerHTML = 'Press Here To Play Again'
    div.appendChild(button)
    button.addEventListener('click', () => reload())
}


	// &#9822;