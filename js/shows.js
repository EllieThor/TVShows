let shows = [];
let contentStr = "";
let theSearch = "";
let backValue = localStorage.getItem("theLastSearch");

isThereABack();

function isThereABack() {
  if (!backValue) {
    return searchPlease("good");
  } else {
    searchPlease(backValue);
    localStorage.removeItem("theLastSearch");
  }
}

function searchPlease(searchInput) {
  let url = "https://api.tvmaze.com/search/shows?q=" + searchInput;

  $.ajax({
    type: "GET",
    datatype: "json",
    url: url,
    success: function (data) {
      shows = data;
      printShows();
    },
    error: function (error) {
      console.log("error : ", error);
    },
  });
}

function searchFields() {
  theSearch = document.getElementById("searchFields").value;
  console.log(typeof theSearch);
  localStorage.setItem("theLastSearch", theSearch);
  searchPlease(theSearch);
}

function printShows() {
  contentStr = "";
  for (let i = 0; i < shows.length; i++) {
    printSingleShow(shows[i]);
  }
  rowDV.innerHTML = contentStr;
}

function printSingleShow(singleShow) {
  let img = "";
  img = singleShow.show.image ? singleShow.show.image.medium : "images/mika.JPEG";
  let summary = "";
  summary = singleShow.show.summary != null ? singleShow.show.summary : `We don't have a summary for <i>${singleShow.show.name}</i>`;
  contentStr += `
    <div id="theShowCol" class="col-lg-3 col-md-4 col-sm-6 col-12 d-flex justify-content-center my-3">
      <div class="card" style="width: 18rem">
        <img src="${img}" class="card-img-top" alt="${singleShow.show.name} poster image" />
        <div class="card-body">
          <h5 class="card-title nameTitle">${singleShow.show.name}</h5>
          <div class="card-text theSummary mb-2">${summary}</div>
          <a href="#" onclick="moreDetails(${singleShow.show.id})" class="btn btn-dark mb-2">More Details</a>
          <button class="btn btn-dark mb-2" onclick="deleteShow()">Delete Me!</button>
        </div>
      </div>
    </div>`;
}

function deleteShow() {
  let colToDelete = document.getElementById("theShowCol");
  colToDelete.remove(this);
}

function moreDetails(id) {
  localStorage.setItem("selected-Show-id", id);
  window.location.href = "showDetails.html";
}
