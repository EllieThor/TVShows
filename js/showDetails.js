let id = localStorage.getItem("selected-Show-id");
let searchShowURL = `https://api.tvmaze.com/shows/${id}`;
let searchCastURL = `https://api.tvmaze.com/shows/${id}/cast`;
let searchPreviousEpisodeURL = `https://api.tvmaze.com/shows/${id}/episodes`;
let searchNextEpisodeURL;

let contentStr = "";
let castStr = "";
let preStr = "";
let noPre = "";
let nextStr = "";
let noNext = "";
let nameToLocal = "";

let previousEpisodes = [];
let nextEpisodes = [];
let cast = [];

searchShowApi();

function checkValidate(value) {
  let ans = value != "" ? true : false;
  return ans;
}
// show details

function searchShowApi() {
  let validate = checkValidate(id);

  if (validate) {
    $.ajax({
      type: "GET",
      datatype: "json",
      url: searchShowURL,
      success: function (show) {
        printShow(show);
        searchCastApi();
      },
      error: function (error) {
        console.log("error : ", error);
      },
    });
  } else {
    alert("ID doesn't exist");
  }
}

function printShow(singleShow) {
  let img = "";
  img = singleShow.image ? singleShow.image.medium : "images/mika.JPEG";

  let summary = "";
  summary = singleShow.summary ? singleShow.summary : `We don't have a summary for <i>${singleShow.name}</i>`;

  let network = "";
  network = singleShow.network ? singleShow.network.name : `We don't have the network name for <i>${singleShow.name}</i>`;

  let language = "";
  language = singleShow.language ? singleShow.language : `We don't have the language for <i>${singleShow.name}</i>`;

  let status = "";
  status = singleShow.status ? singleShow.status : `We don't have the status for <i>${singleShow.name}</i>`;

  let genres = "";
  genres = singleShow.genres ? singleShow.genres : `We don't have the genres for <i>${singleShow.name}</i>`;

  let officialSite = "";
  officialSite = singleShow.officialSite ? singleShow.officialSite : `We don't have the official-Site for <i>${singleShow.name}</i>`;

  contentStr += `
     
        <div class="row">
          <div class="col mt-3 mb-4">
            <h1 class="text-center">${singleShow.name}</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 text-center">
            <img class="mb-4 showImg" src="${img}" alt="${singleShow.name} poster" />  
          </div>
          <div class="col-lg-5">
            <div class="summary">${summary}</div>
          </div>
          <div class="col-lg-4 show-info">
            <h2>Show Info</h2>
            <div class="p-1"><b>Network: </b>${network}</div>
            <div class="p-1"><b>Language: </b>${language}</div>
            <div class="p-1"><b>Status: </b>${status}</div>
            <div class="p-1"><b>Genres: </b>${genres}</div>
            <div class="p-1"><b>Official site: </b><a target="_blank" href="${officialSite}">${singleShow.name}</a></div>
          </div>
        </div>`;
  containerDV.innerHTML = contentStr;

  let link = singleShow._links.nextepisode.href.replace("http", "https");
  console.log(link);
  searchNextEpisodeURL = singleShow._links.nextepisode ? link : `We don't have the next-episode for <b>${singleShow.name}</b>`;
}

// ****************************************************
// cast details

function searchCastApi() {
  let validateCast = checkValidate(id);

  if (validateCast) {
    $.ajax({
      type: "GET",
      datatype: "json",
      url: searchCastURL,
      success: function (data) {
        cast = data;
        printCast(cast);
        searchPreviousEpisodeApi();
      },
      error: function (error) {
        console.log("error : ", error);
      },
    });
  } else {
    alert("ID doesn't exist");
  }
}

function printCast() {
  castStr = "";

  for (let i = 0; i < cast.length; i++) {
    printSingleActor(cast[i]);
  }
  castDV.innerHTML = castStr;
}

function printSingleActor(cast) {
  let img = "";
  if (cast.character.image) {
    img = cast.character.image.medium;
  } else if (cast.person.image) {
    img = cast.person.image.medium;
  } else {
    img = "images/alex.png";
  }

  castStr += `
           <div class="col-lg-6 col-sm-12">
            <div class="container eachActor">
              <div class="row mb-2">
                <div class="col-3">
                  <img class="character-img" src="${img}" />
                </div>
                <div class="col-7 pl-4 ml-3">
                 
                   <a class="actor-name" onclick="savePersonName('${cast.person.name}')" href="#"> ${cast.person.name}</a>
                   <span>as<a target="_blank" class="character-name" href="${cast.character.url}"> ${cast.character.name}</a>
                </div>
              </div>
            </div>
          </div>
    `;
  // console.log(typeof cast.person.name);
  h1cast.innerHTML = "cast";
}

function savePersonName(nameToLocal) {
  localStorage.setItem("thePersonName", nameToLocal);
  window.location.href = "actors.html";
}

// ***************************************************
// Previous Episodes

function searchPreviousEpisodeApi() {
  let validatePreviousEpisodes = checkValidate(id);

  if (validatePreviousEpisodes) {
    $.ajax({
      type: "GET",
      datatype: "json",
      url: searchPreviousEpisodeURL,
      success: function (data) {
        previousEpisodes = data;
        printPreviousEpisode(previousEpisodes);
        searchNextEpisodeApi();
      },
      error: function (error) {
        console.log("error : ", error);
        noPre = "We don't have the previous-episodes for this Show";
        noTablePre.innerHTML = noPre;
        preTable.remove();
      },
    });
  } else {
    alert("ID doesn't exist");
  }
}

function printPreviousEpisode() {
  preStr = "";
  for (let i = previousEpisodes.length - 1; i >= previousEpisodes.length - 4; i--) {
    printSinglePrevious(previousEpisodes[i]);
  }
  tBody.innerHTML = preStr;
}

function printSinglePrevious(previous) {
  preStr += `
      <tr>
        <th scope="row">${previous.season}</th>
        <td>${previous.number}</td>
        <td>${previous.name}</td>
        <td>${previous.airdate}</td>
      </tr>
  `;
}

// *************************************************************
// Next Episode

function searchNextEpisodeApi() {
  let validateNextEpisodes = checkValidate(id);

  if (validateNextEpisodes) {
    $.ajax({
      type: "GET",
      datatype: "json",
      url: searchNextEpisodeURL,
      success: function (data) {
        nextEpisodes = data;
        printNextEpisodes(nextEpisodes);
      },
      error: function (error) {
        console.log("error : ", error);
        noNext = "We don't have the next-episode for this Show";
        noTableNext.innerHTML = noNext;
        nextTable.remove();
      },
    });
  } else {
    alert("ID doesn't exist");
  }
}

function printNextEpisodes(next) {
  if ((searchNextEpisodeURL = "")) {
    nextEpeID = `
    <td>We don't have the next-episode for <b>${singleShow.name}</b></td>
    `;
  } else {
    nextStr += `
      <tr>
        <th scope="row">${next.season}</th>
        <td>${next.number}</td>
        <td>${next.name}</td>
        <td>${next.airdate}</td>
        <td>${next.airtime}</td>
      </tr>
  `;
  }
  tNextBody.innerHTML = nextStr;
}
