import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css'
import Counter from './components/counterComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <Counter/>
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// // Defining Function
// function sayHello(){
//   for(let i=0; i < 5; i++){
//     console.log(i)
//   }
//   // console.log(i)
// }
// sayHello();

// // Defining an object
// const Person = {
//   name: "Shiva",
//   walk(){
//     console.log("walking....")
//   },
//   talks(){
//     console.log(this)
//     console.log("Talking....")
//   },
// }

// Person.talks()
// console.log(Person['name'])
// Person.walk()


// // const square = function(number) {
// //   return number * number 
// // }

// const square = (number, div) =>  number / div

// console.log(square(5,2))

// const jobs = [
//   { id: 1, isActive: true},
//   { id: 2, isActive: true},
//   { id: 3, isActive: false},
// ]

// console.log(jobs.filter(function(jobs) { return jobs.isActive}))
// console.log(jobs.filter(jobs => ! jobs.isActive))

// // Map keyword

// const colors = ['red','yellow','blue']

// const items =colors.map(color => `<li>${color}</li>`)

// console.log(items)

// // Destructuring 

// const address = {
//   street: 'dd',
//   city: 'ff',
//   country: 'gg',
// }

// const {street,city,country} = address

// console.log(street)
// console.log(city)
// console.log(country)

// // Spread Operator

// const first = [1,2,3,4]
// const sec = [5,6,7,8]

// const combined = [...first,'a',...sec]
// console.log(combined)

// const fobj = {
//   name: "Shiva"
// }

// const sobj = {
//   job: "SMS"
// }

// const combinedobj = {...fobj,...sobj,cty: 'hyd'}

// console.log(combinedobj)


// // Classes

// class CoolPerson {
//   constructor(name) {
//     this.name = name
//   }
//   walk() {
//     console.log(`${this.name} is walking...`)
//   }
// }

// class Teacher extends CoolPerson {
//   teach() {
//     console.log('teach')
//   }
// }
// const cp = new CoolPerson("Shiva")
// const cp1 = new CoolPerson("Manu")
// console.log(cp.walk())
// console.log(cp1.walk())
// const teacher = new Teacher("Ammu")
// console.log(teacher.walk())
// console.log(teacher.teach())

