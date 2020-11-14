//Namespace
const app = {};

//Variable for later :)
app.twoCardsSelectedByPlayer = [];
app.card ;
app.cardBack ;
app.score = 0;

// 1. Create an array of cards for each mode (scary and friendly)
//moved arrays to bottom of code because they are very long :sweat-smile:

//Variable to hold the array that we will use once the user chooses their mode
app.CardsArray ;

// Stretch Goal #2 - Have a light mode where the cards are friendly monsters, because monsters are scary.
//2. Create a Function to determine with of the two arrays will be used (scary or friendly)
app.userChoosesBetweenScaryOrFriendly = () => {
  if ($('body').hasClass('lightMode')) {
    app.cardsArray = app.cardsArrayFriendly;
    app.cardBack = './assets/friendly/cardBack.png';
  } else {
    app.cardsArray = app.cardsArrayScary;
    app.cardBack = './assets/scary/cardBack.png'
  };
} 

//Event listener to switch between light(friendly/dark(scary)
$('.modeSwitch').on('click', function(){
  //switch to light mode
  $('body')
    .toggleClass('lightMode')
    .toggleClass('friendly');

  $('.letter').toggleClass('animate__bounceIn');
  $('.letter').toggleClass('animate__tada');
  //Call the function that choses the array based on the mode
  app.userChoosesBetweenScaryOrFriendly();
  //Clear the moves counter and redisplay it on the page (zero)
  app.score = 0;
  $('.currentScore').text(app.score);
  //Show the score counter
  $('.score').show();
  //empty the board
  $('.board').empty();
  //hide play again message, since we're refreshign the board
  $('.playAgain').hide();
  //Call the create board function inside here, because we want to create the board with the mixed array
  app.mixCards();
})

//Stretch goal #1 - Randomize array. I'm using the Fisher-Yates method here:
app.mixCards = () => {
  //Call the function to get the default array
  app.userChoosesBetweenScaryOrFriendly();
  //Shuffling:
  let random = 0;
  let temp = 0;
  for (let i = 1; i < app.cardsArray.length; i++) {
      random = Math.floor(Math.random() * i);
      temp = app.cardsArray[i];
      app.cardsArray[i] = app.cardsArray[random];
      app.cardsArray[random] = temp;
  }
  //empty the board so that the cards don't continuously append
  $('.board').empty()
  //Call the create board function inside here, because we want to create the board with the mixed array
  app.createBoard();
};

//3. Creat a function to create and append the cards to the html board. 
//For each object in the array:
app.createBoard = function() {
    //create a card img element 
    for (let i = 0; i < app.cardsArray.length; i++) {
        //set the img src to the card back path
        app.card = $("<img>").attr('src', app.cardBack); 
        
        app.card
            //add the name from the array
            .attr('data-name', app.cardsArray[i].name)
            //add the index from the array
            .attr('data-id', i)
            //**Note to the reviewer - I added the tab index in hope to make the card game accessible by keyboard. I was unsuccessful with a few different attempts (keyDown, onclick="handleBtnClick()" onKeyDown="handleBtnKeyDown() and more.) Any accessible feedback and tips around this type of app/games is welcome! Thank you!
            //add a tab index
            .attr('tabindex', 0)
            //set alt text for images as the card name
            .attr('alt', app.cardsArray[i].name)
            //add a class of unmatched (which will be removed as the player makes pairs to check if match is won)
            .addClass('unmatched')
            //5. add an event listener that will call the flip card function
            .on('click', function() {
                //push the cards into the twoCardsSelectedByPlayer array so that we can compare them
                app.twoCardsSelectedByPlayer.push($(this));
                //4. call the flipCard function
                app.flipCard($(this));
            })
        //append the cards to the board!
        $('.board').append(app.card);
        //show the board!
        $('.gameBoard').css('visibility', 'visible');
    };
};

//4. Create a flip card function that will:
app.flipCard = function(card) {
    //store the card's data-id as a variable
    cardIndex = card.data('id');
      //change the img to the imgSrc in the cardsArray based on the above index
      card.attr('src', app.cardsArray[cardIndex].imgSrc)
        //if there are 2 cards in the twoCardsSelectedByPlayer array, run the checkIfPlayerHasMatch function on that array
        if (app.twoCardsSelectedByPlayer.length == 2) {
            app.checkIfPlayerHasMatch(app.twoCardsSelectedByPlayer);
    };
};

// 6. Create a check match function that will:
app.checkIfPlayerHasMatch = function (arrayOfTwoClickedCards){
    //Stretch Goal #3 -  Have a move counter to count how many clicks it takes the player to complete
    //add to score
    app.score = app.score+=1;
    $('.currentScore').text(app.score);
    //Set timeout so that the player has a moment to see the cards they picked
    setTimeout(function() { 
    //a) compare the two cards that are in the cardsMatch array and check that they are not the same card (data-id)
    if ( (arrayOfTwoClickedCards[0]).data('id') === (arrayOfTwoClickedCards[1]).data('id') ) {
      //Call the playerClickedSameCard function
      app.playerClickedSameCard();
    // b) Check if the player has clicked on two different cards that have the same monster name
    } else if ( (arrayOfTwoClickedCards[0]).data('name') === (arrayOfTwoClickedCards[1]).data('name') ) {
      //Call the playerGetsMatch function
      app.playerGetsMatch();
    // c) if they are not the same 
    } else {
      //Call the playerDoesNotGetMatch function
      app.playerDoesNotGetMatch();
    };
    // d) Check if there are no more cards with the class unmatched- if so, the game is finished as the player has selected all possible matches. Alert the player "congrats! you won!"
    if ($('.unmatched').length === 0) {
      //hide the move counter
      $('.score').hide();
      // 7. Alert the player that they won by displaying the play again div
      $('.playAgain').show()
    }
  }, 800);
};

//6.a - continued (from above)
//Create a function that will let the player know that they must select different cards, remove class selected, flip the card back and empty the twoCardsSelectedByPlayer array
app.playerClickedSameCard = () => {
  //Let the player know that they clicked the same card twice
  $('.matchMessage').text('You clicked on the same card twice! You must click two different cards!');
  $('.matchMessage').show();
  setTimeout(function(){
    $('.matchMessage').hide();
  }, 1500);
  //Loop through twoCardsSelectedByPlayer array and:
  //Flip the cards back, continue game play
  app.twoCardsSelectedByPlayer.forEach((card) => {
    card.attr('src', app.cardBack);
  })
  //Empty the twoCardsSelectedByPlayer array
  app.twoCardsSelectedByPlayer = [];
};

//6.b - continued (from above)
//Create a function that will let the player know that they got a match, remove classe unmatch, remove the card from the board and empty the twoCardsSelectedByPlayer array
app.playerGetsMatch = () => {
  //Let the player know that they got a match! - But only if there is more than two cards left. When the final match happens, we only want to show the You Win message.
  if ($('.unmatched').length > 2) {
    $('.matchMessage').text('You got a match! Keep playing to mash all the monsters!');
    $('.matchMessage').show();
    setTimeout(function(){
      $('.matchMessage').hide();
    }, 1500);
  }
  //Loop through twoCardsSelectedByPlayer array and:
  app.twoCardsSelectedByPlayer.forEach((card) => {
      //Remove unmatched class
    card.removeClass('unmatched')
     //Remove card from game board
      .css('opacity', '0');
  })
 //Empty the twoCardsSelectedByPlayer array
  app.twoCardsSelectedByPlayer = [];
};

//6.c - continued (from above)
//Create a function that will let the player know that they did not get a match, flip the card back and empty the twoCardsSelectedByPlayer array
app.playerDoesNotGetMatch = () => {
  //alert the player to try again
  $('.matchMessage').text('Keep playing to get a match!');
  $('.matchMessage').show();
  setTimeout(function(){
    $('.matchMessage').hide();
  }, 1500);
  //Loop through twoCardsSelectedByPlayer array and:
  app.twoCardsSelectedByPlayer.forEach((card) => {
    card
      //flip them back and continue play.
      .attr('src', app.cardBack);
  })
  //Empty the twoCardsSelectedByPlayer array
  app.twoCardsSelectedByPlayer = [];
};

//7. Creat an event listener on the play again button so that it runs the createBoard function
$('.playAgain').on('click', function(){
  app.mixCards();
  //hide button again
  $('.playAgain').hide();
  //Show the score counter
  $('.score').show();
   //Clear the moves counter and redisplay it on the page (zero)
  app.score = 0;
  $('.currentScore').text(app.score);
});

//initialize app!
app.init = function() {
  //8. Event listener to start the game :)
  $('.start').on('click', function(){
    //call the mix card function!
    app.mixCards();
    //play the Monster Mash!
    $('audio').get(0).play();
    $('audio').get(0).volume = 0.1;
  })
}

//Document Ready!
$(function(){
    app.init(); 
});

//1. Create arrays - continued
// 	a) Each card must be in the array twice.
// 	b) Each card will have a name and img src path
app.cardsArrayScary = [
  {
    name: 'Dracula',
    imgSrc: './assets/scary/Monster1.jpg'
  },
  {
    name: 'Dracula',
    imgSrc: './assets/scary/Monster1.jpg'
  },
  {
    name: 'Dracula Daughter',
    imgSrc: './assets/scary/Monster2.jpg'
  },
  {
    name: 'Dracula Daughter',
    imgSrc: './assets/scary/Monster2.jpg'
  },
    {
    name: 'Frankenstein',
    imgSrc: './assets/scary/Monster3.jpg'
    },
    {
    name: 'Frankenstein',
    imgSrc: './assets/scary/Monster3.jpg'
    },
    {
    name: 'Invisible Woman',
    imgSrc: './assets/scary/Monster4.jpg'
    },
    {
    name: 'Invisible Woman',
    imgSrc: './assets/scary/Monster4.jpg'
    },
    {
    name: 'Mummy',
    imgSrc: './assets/scary/Monster5.jpg'
    },
    {
    name: 'Mummy',
    imgSrc: './assets/scary/Monster5.jpg'
    },
    {
    name: 'Wolfman',
    imgSrc: './assets/scary/Monster6.jpg'
    },
    {
    name: 'Wolfman',
    imgSrc: './assets/scary/Monster6.jpg'
    },
    {
    name: 'Invisible Man',
    imgSrc: './assets/scary/Monster7.jpg'
    },
    {
    name: 'Invisible Man',
    imgSrc: './assets/scary/Monster7.jpg'
    },
    {
    name: 'Creature from the black Laggoon',
    imgSrc: './assets/scary/Monster8.jpg'
    },
    {
    name: 'Creature from the black Laggoon',
    imgSrc: './assets/scary/Monster8.jpg'
    },
    {
    name: 'Bride of Frankenstein',
    imgSrc: './assets/scary/Monster9.jpg'
    },
    {
    name: 'Bride of Frankenstein',
    imgSrc: './assets/scary/Monster9.jpg'
    },
]

//Array for friendly
app.cardsArrayFriendly = [
  {
    name: 'Rex Toy Story',
    imgSrc: './assets/friendly/Monster1.jpg'
  },
  {
    name: 'Rex Toy Story',
    imgSrc: './assets/friendly/Monster1.jpg'
  },
  {
    name: 'Yeti',
    imgSrc: './assets/friendly/Monster2.jpg'
  },
  {
    name: 'Yeti',
    imgSrc: './assets/friendly/Monster2.jpg'
  },
  {
    name: 'Toothless The Dragon',
    imgSrc: './assets/friendly/Monster3.jpg'
  },
  {
    name: 'Toothless The Dragon',
    imgSrc: './assets/friendly/Monster3.jpg'
  },
  {
    name: 'Casper the Ghost',
    imgSrc: './assets/friendly/Monster4.jpg'
  },
  {
    name: 'Casper the Ghost',
    imgSrc: './assets/friendly/Monster4.jpg'
  },
  {
    name: 'Shrek',
    imgSrc: './assets/friendly/Monster5.jpg'
  },
  {
    name: 'Shrek',
    imgSrc: './assets/friendly/Monster5.jpg'
  },
  {
    name: 'Sullivan Monsters inc',
    imgSrc: './assets/friendly/Monster6.jpg'
  },
  {
    name: 'Sullivan Monsters inc',
    imgSrc: './assets/friendly/Monster6.jpg'
  },
  {
    name: 'Little Green Men',
    imgSrc: './assets/friendly/Monster7.jpg'
  },
  {
    name: 'Little Green Men',
    imgSrc: './assets/friendly/Monster7.jpg'
  },
  {
    name: 'Mike Monsters Inc',
    imgSrc: './assets/friendly/Monster8.jpg'
  },
  {
    name: 'Mike Monsters Inc',
    imgSrc: './assets/friendly/Monster8.jpg'
  },
  {
    name: 'Pink Dragon',
    imgSrc: './assets/friendly/Monster9.jpg'
  },
  {
    name: 'Pink Dragon',
    imgSrc: './assets/friendly/Monster9.jpg'
  },
]

//Stretch Goal #4 - Different modes: easy, normal and hard
// app.difficultyLevelChosen = () => {
//   app.cardsArray = app.cardsArray.slice();
// }

//Stretch Goal #5 - Make cards keyboard accessible