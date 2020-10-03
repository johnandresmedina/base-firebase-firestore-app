const cafes = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

const renderCafe = (cafe) => {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let deleteIcon = document.createElement("div");

  const cafeData = cafe.data();

  li.setAttribute("data-id", cafe.id);
  name.textContent = cafeData.name;
  city.textContent = cafeData.city;
  deleteIcon.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(deleteIcon);

  cafes.appendChild(li);

  //deleting data
  deleteIcon.addEventListener("click", (event) => {
    event.stopPropagation();

    let id = event.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
};

//getting and displaying data
/*db.collection("cafes")
  //.where("city", "==", "London")
  .orderBy("city")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((cafe) => {
      renderCafe(cafe);
    });
  });
*/

//creating data
form.addEventListener("submit", (event) => {
  event.preventDefault();

  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value,
  });

  form.name.value = "";
  form.city.value = "";
});

db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type === "added") {
        renderCafe(change.doc);
      } else if (change.type === "removed") {
        let li = cafes.querySelector("[data-id='" + change.doc.id + "']");
        cafes.removeChild(li);
      }
    });
  });
