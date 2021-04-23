//JS (JavaScript);
/*
    Thanks to everyone in khan academy about this.
    This is really nice also I like coding.
    Also thanks to "Coding for kids" book.
    These thing's told me a lot about JavaScript & HTML and much more!
*/

var version = "version 12.5!";
var name = window.prompt("Let's play a game before you enter my website and ©&™ = Ram 2012, 2020-... and welcome... please enter your name below! " + version);
name = String(name);
var age = window.prompt("Hello " + name + ".,... how old are you?");
age = Number(age);
if (age > 18) {
    window.alert("Sorry... adult's are  not allowed to play this game but you can still visit my website:)");
    window.alert("Just joking... I was lying so you can still play:)");
    var $charcterNameAdult = window.prompt("Hi " + name + " you are " + age + " years old now type a name down below! Ex: Central_Back");
    $charcterNameAdult = String($charcterNameAdult);
    window.alert("Welcome to the game " + $charcterNameAdult + ". Press the button down below!");
} else {
    var $charcterNameKidTeenager = window.prompt("Hi " + name + " you are " + age + " years old now type a name down below! Ex: Central_Back");
    $charcterNameKidTeenager = String($charcterNameKidTeenager);
    window.alert("Welcome to the game " + $charcterNameKidTeenager + ". Press the button down below!");
}
{
    var x = 5;
    var y = 3;
    var z = x%y;
    var aa = (x + y)-(x - y);

    window.alert("So this game is all about math..., let's start by doing a simple math problem: (5 + 3) - (5 - 2)");
    var problemOne = window.prompt("Put the answer in: (5 + 3) - (5 - 2)"); 
    problemOne = Number(problemOne);

    if (problemOne < 5) {
        window.prompt("Too.. Small! Try again: (5 + 3) - (5 - 3)");
        problemOne = Number(problemOne);
        if (problemOne < 5) {
            window.prompt("Too.. Small! Try again: (5 + 3) - (5 - 3)");
            problemOne = Number(problemOne);
            window.alert("That's enough! The answer is: " + aa + ". Let's try a new question (Note: this one is very hard!)");
        } else if (problemOne = 5) {
            window.alert("Great! You got the correct answer. Let's try a new question (Note: this one is very hard!)")
        } else {
            window.prompt("Too.. Big! Try again: (5 + 3) - (5 - 3)");
            problemOne = Number(problemOne);
            window.alert("That's enough! The answer is: " + aa + ". Let's try a new question (Note: this one is very hard!)");
        }
    } else if (problemOne = 5) {
        window.alert("Great! You got the correct answer. Let's try a new question (Note: this one is very hard!)")
    } else {
        window.prompt("Too.. Big! Try again: (5 + 3) - (5 - 3)");
        problemOne = Number(problemOne);
        if (problemOne < 5) {
            window.prompt("Too.. Small! Try again: (5 + 3) - (5 - 3)");
            problemOne = Number(problemOne);
            window.alert("That's enough! The answer is: " + aa + ". Let's try a new question (Note: this one is very hard!)");
        } else if (problemOne = 5) {
            window.alert("Great! You got the correct answer. Let's try a new question (Note: this one is very hard!)")
        } else {
            window.prompt("Too.. Big! Try again: (5 + 3) - (5 - 3)");
            problemOne = Number(problemOne);
            window.alert("That's enough! The answer is: " + aa + ". Let's try a new question (Note: this one is very hard!)");
        }
}

    var $problemTwo = window.prompt("Well... now what? ... Oh yes. Another math problem! What is 5%3 (5/3 %_) % = reminder. ");
    $problemTwo = Number($problemTwo);
    
    if ($problemTwo < 2) {
        window.alert("Way too small! The correct answer is: " + z + ".");
    } else if ($problemTwo = 2) {
        var $pi = ": π = 3.14. Hint: 3 = month, 14 = day!";
        window.alert("Good job!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } else {
        window.alert("Way too big! The correct answer is: " + z + ".");
    }
}
//Math.floor(Math.random() * 11);     // returns a random integer from 0 to 10
var $id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var $secertNumber = window.prompt("Before you play their is a number that you have to remember! So type in a number from 1 - 10!");
$secertNumber = Number($secertNumber);
if ($secertNumber = 1) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[1]);
} else if ($secertNumber = 2) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[0]);
} else if ($secertNumber = 3) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[3]);
} else if ($secertNumber = 4) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[2]);
} else if ($secertNumber = 5) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[5]);
} else if ($secertNumber = 6) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[4]);
} else if ($secertNumber = 7) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[7]);
} else if ($secertNumber = 8) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[6]);
} else if ($secertNumber = 9) {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[9]);
} else {
    window.alert("Remember this number. Also when you visit my website again then you will get a differenet number. " + 
    $id[8]);
}
window.alert("Now we are going to play another game! It's called ID");
window.alert("So your name is " + name + "... and you are " + age + " years old.");
window.alert("We are going to generate a number between 0 and 100 as an ID.");
var generate = Math.floor(Math.random() * 100) + 1;
var generateSecretNumber = Math.floor(Math.random() * 10) + 1;
window.alert("Before I tell you what is your id you are also going to have a Secret ID...");
window.alert("Here is your ID: " + generate + "... and here is your Secret ID: " +  generateSecretNumber + ".");

var coder = {
    firstName: Ram,
    lastName: Sabavat,
    fullName: function() {
        return this.firstName + " " + this.lastName;
    },
    age: 8,
    nextYearAge: 9,
    id: coder,
    secretid: hateVideoGames
};

var messageTextONE = "What is your name?";
var meassgeTextTWO = "How old are you?"
var askNameFormStranger = window.alert("'Knock Knock Who's there?' Oh no there is a stranger outside... respond to him! 1st meassge: " + messageTextONE);
askNameFormStranger = String(askNameFormStranger);
if (askNameFormStranger != name) {
    window.alert("Make sure you type your 'real' name. Hint: remember when you typed your name at the beginning of this website not when you typed a name: " + $charcterNameKidTeenager);
    var askAgeFromStrangerONE = window.prompt("2nd message: " + messageTextTWO);
    askAgeFromStrangerONE = Number(askAgeFromStrangerONE);
    if (askAgeFromStrangerONE != age) {
        window.alert("Type your real age, not a pretend age. Here is your actual age: " + age);
    } else {
        window.alert("Good job typing your real age not a pretend one!");
    }
} else {
    var askAgeFromStrangerTWO = window.prompt("Good job typing your 'real' name! 2nd message: " + messageTextTWO);
    askAgeFromStrangerTWO = Number(askAgeFromStrangerTWO);
    if (askAgeFromStrangerTWO != age) {
        window.alert("Type your real age, not a pretend age. Here is your actual age: " + age);
    } else {
        window.alert("Good job typing your real age not a pretend one!");
    }
}

function meetCreatorOfWebsite(firstName, lastName, fullName, age); {
    window.alert("Well that's it for these alert's and now that the end of the final game");
    window.alert("Creator's thank you's: Thank's a lot to my dad who helped me and my sister who just started coding!");
    window.alert("Creator info: First Name: " + firstName + ". Last Name: " + lastName + ". Full Name: " + fullName + ". Age: " + age);
}

meetCreatorOfWebsite("Ram", "Sabavat", "Ram Sabavat", 8);

window.alert("Bye! See you later");
window.alert("And remember the id! Remeber this?: 'Remember this number. Also when you visit my website again then you will get a differenet number.'");
var optionS = "We have three option's...";
window.alert(optionS);
optionS = "One: You can type in another number and then we'll give you a number...";
window.alert(optionS);
optionS = "Two: You can type 'six' number's that are between 0 - 100 and you're going to get one of those number's...";
window.alert(optionS);
optionS = "Three: DONT DO ANYTHING!!!!!!!!!!!!!!";
window.alert(optionS);
optionS = "So type 'Yes' if you want to do NOTHING.";
window.alert(optionS);
optionS = "And type '6 Number's' if you want to type 6 NUMBER'S between 1 - 50";
window.alert(optionS);
optionS = "Also type 'Another Number' if you want to-type another number."
window.alert(optionS);

var threeMoreOptions = window.prompt("Type your thing down below!");
threeMoreOptions = String(threeMoreOptions);

if (threeMoreOptions = "") {
    window.alert("Make sure that you fill the 'whole' thing up!");
} else if (threeMoreOptions = "Yes") {
    window.alert("Sice you chose to-do Nothing then we'll move on...");
} else if (threeMoreOptions = "6 Number's") {
    window.alert("Ok let's type six number's, ok?");
    var $one = window.prompt("Type your first number down below!");
    $one = Number($one);
    var $two = window.prompt("Type your second number down below!");
    $two = Number($two);
    var $three = window.prompt("Type your third number down below!");
    $three = Number($three);
    var $four = window.prompt("Type your fourth number down below!");
    $four = Number($four);
    var $five = window.prompt("Type your fifth number down below!");
    $five = Number($five);
    var $six = window.prompt("Type your sixth number down below!");
    $six = Number($six);
    var sixNumbers = Math.max($one, $two, $three, $four, $five, $six);
    window.alert("Here's your number: " + sixNumbers);
} else {
    var _secretNumber = window.prompt("Type a number down below that is between 1 - 4");
    _secretNumber = Number(_secretNumber);
    if (_secretNumber = isNaN) {
        var _id = Math.floor(Math.random() * 6);
        var $noGenerate = [1, 2, 3, 4];
        window.alert("Make sure you actully type a number. Were going to generate a number between 1 - 4!");
        window.alert("Here's your secret number: " + _id);
    } else if ( _secretNumber = "") {
        window.alert("Make sure you fill up the blank");
        window.alert("We'll generate a number between 1 - 4!");
        window.alert("Here's your secret number: " + _id);
    } else if (_secretNumber = 1) {
        window.alert("Here is your number: " + $noGenerate[3]);
    } else if (_secretNumber = 2) {
        window.alert("Here is your number: " + $noGenerate[2]);
    } else if (_secretNumber = 3) {
        
    }
}