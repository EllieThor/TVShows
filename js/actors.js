let actors = [];
let contentStr = "";
let theSearch = "";

let backValue = localStorage.getItem("thePersonName");

isThereABack();

function isThereABack() {
  if (!backValue) {
    return searchPlease("Emily");
  } else {
    searchPlease(backValue);
    localStorage.removeItem("thePersonName");
  }
}

function searchPlease(searchInput) {
  let url = "https://api.tvmaze.com/search/people?q=" + searchInput;

  $.ajax({
    type: "GET",
    datatype: "json",
    url: url,
    success: function (data) {
      console.log("Data : ", actors);
      actors = data;
      printActors();
    },
    error: function (error) {
      console.log("error : ", error);
    },
  });
}

function searchFields() {
  theSearch = document.getElementById("searchFields").value;
  searchPlease(theSearch);
}

function printActors() {
  contentStr = "";
  for (let i = 0; i < actors.length; i++) {
    printSingleActor(actors[i]);
  }
  rowDV.innerHTML = contentStr;
}

function printSingleActor(singleActor) {
  let img = "";
  img = singleActor.person.image ? singleActor.person.image.medium : "images/SorryActor.png";
  let countryName = "";
  countryName = singleActor.person.country ? singleActor.person.country.name : `Sorry, we don't have a country for ${singleActor.person.name}.`;

  let gender = "";
  gender = singleActor.person.gender != null ? singleActor.person.gender : `Sorry, we don't have a gender for ${singleActor.person.name}.`;
  let birthday = "";
  birthday = singleActor.person.birthday != null ? singleActor.person.birthday : `Sorry, we don't have a birthday for ${singleActor.person.name}.`;
  let deathday = "";
  deathday = singleActor.person.deathday != null ? singleActor.person.deathday : `${singleActor.person.name} is probably still alive.`;
  contentStr += `
  <div class="container actor-card p-2 m-3 rounded">
        <div class="row">
          <div class="col">
            <h1>${singleActor.person.name}</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <img src="${img}" class="actorImg" alt="${singleActor.person.name} image" />
          </div>
          <div class="col-lg-6 person-info">
            <div class="p-1 mt-4 text-left"><b>Gender: </b>${gender}</div>
            <div class="p-1 text-left"><b>Birthday: </b>${birthday}</div>
            <div class="p-1 text-left"><b>Deathday: </b>${deathday}</div>
            <div class="p-1 text-left"><b>Country: </b>${countryName}</div>
          </div>
        </div>
      </div> `;
}
