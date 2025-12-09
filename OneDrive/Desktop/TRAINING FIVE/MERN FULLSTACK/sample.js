let a=25;
const age=25;
var country="India";
var c=5+9;
console.log(c)
console.log(5===5)
function add(num1,num2){
    result1=num1+num2
    console.log("sum"+result1)
}
add(9,10);
function isAge(age){
    if(age>=18){
        console.log("Major")
    }
    else{
        console.log("Minor")
    }
}
isAge(20);
function eligible(age1){
    return age1>=18?"eligible":"not eligible"; 
}
console.log(eligible(17));
//spread operator
const number =[1,2,3];
const moreNum=[4,5,6];
const allNum=[...number,...moreNum];
console.log(allNum);

const person={
    name:"Amit",
    age:30
};
const updatedPerson={...person,city:"Delhi"};
console.log(updatedPerson);

//destructuring
const num=[10,20,30];
const [x,y,z]=num;
console.log(x);
console.log(y);
console.log(z);

const[first,third]=num;
console.log(first);
console.log(third);

const [d,e,...rest]=num;
console.log(d);
console.log(e);
console.log(rest);