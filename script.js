console.log("Hello, Worlddddd!");
console.log("piste");
// const title = document.getElementById("title");
// title.textContent = "Hi!";

// const items = document.getElementsByClassName("item");
// items[0].style.color = "red";
// items[1].style.color = "blue";

// const listItems = document.getElementsByTagName("p");
// listItems[1].textContent = "Orange";

const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("Button clicked");
  });
});

// box.classList.toggle("hidden");
// button.addEventListener("click", () => {
//   box.classList.toggle("hidden");
//   console.log(
//     box.classList.contains("hidden") ? "Box is hidden" : "Box is visible",
//   );
// });

const box = document.querySelector("#box");
const saveBtn = document.getElementById("box");
box.classList.add("active");
// box.classList.add("rounded");
function toggleClass() {
  box.classList.toggle("rounded");
}

saveBtn.addEventListener("click", toggleClass);

// ==================================================================
const students = [
  { name: "Ana", score: 90 },
  { name: "Mark", score: 70 },
  { name: "John", score: 85 },
];
// let total = 0;
function calculateAverage(students) {
  const totalScore = students.reduce((total, student) => {
    return total + student.score;
  }, 0);

  const average = totalScore / students.length;

  return {
    average: average,
    highest: Math.max(...students.map((student) => student.score)),
    lowest: Math.min(...students.map((student) => student.score)),
    total: students.length,
  };
}

const aveBtn = document.querySelector(".aveBtn");
// const aveBtn = document.getElementsByClassName

aveBtn.addEventListener("click", () => {
  const result = calculateAverage(students);
  // console.log("Average Score:", result.average);
  // console.log("Highest Score:", result.highest);
  // console.log("Lowest Score:", result.lowest);
  // console.log("Total Students:", result.total);
  console.log("Result", result);
});
