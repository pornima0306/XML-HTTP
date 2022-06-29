/* const { isGeneratorFunction } = require("util/types"); */

let cl = console.log;
const info = document.getElementById("info");
const strudentForm = document.getElementById("strudentForm");
const information = document.getElementById("information");
const title = document.getElementById("title");
const submit = document.getElementById("submit");
const update = document.getElementById("update");
let apiurl = "https://jsonplaceholder.typicode.com/posts";

/* 
DELETE >> Used to remove entity from database
POST >> to adding new data into database 
PATCH >> to edit/update partial data from data
PUT >> to edit/update all data from database
GET >> used to get data from the database
*/

let postArray = [];
function fetchData(methodName, baseUrl, tempFun, data) {
  // 1. create a object by using XMLHTTPRequest
  let xhr = new XMLHttpRequest();

  //2. call Open method
  xhr.open(methodName, baseUrl);

  //3. onload method
  xhr.onload = function () {
    cl(xhr.status);
    // cl(xhr.response);
    if ((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4) {
      /* postArray = JSON.parse(xhr.response); */
      /* cl(data) */
      if(methodName === 'GET'){
          postArray = JSON.parse(xhr.response);
          tempFun(postArray)
      }
    }
    if (xhr.status === 404) {
      alert("page not found");
    }
  };
  //4. send
  xhr.send(data);
}

const  onEditHandler = (ele) =>{
  cl(ele.closest('.card').dataset.id);
  let getId = Number( ele.closest('.card').dataset.id);
 // let getId = +( ele.closest('.card').dataset.id)
 localStorage.setItem('setId', getId);
  let getObj = postArray.find(o=> getId === o.id);
    cl(getObj)
    title.value =getObj.title;
    information.value = getObj.body;
    update.classList.remove('d-none');
    submit.classList.add('d-none');
}

const onDeleteHandler=(e)=>{
  let getId =+(e.closest('.card').dataset.id);
  let deleteUrl =`${apiurl}/${getId}`
  fetchData('DELETE',deleteUrl);
  postArray = postArray.filter(ele =>{
   return ele.id !== getId;
  })
  templating(postArray)

}

fetchData("GET", apiurl, templating);

function templating(arr) {
  let result = "";
  arr.forEach((ele) => {
    //line 53 >> data-id="${ele.id}" is a custom attribute
    //line 58 >> onclick="onEditHandler(this)" is an on the fly element
    result += `<div class="card mb-3" data-id="${ele.id}">  
        <div class="card-body">
            <h3>${ele.title}</h3>
            <p>${ele.body}</p>
            <p class="text-right">
                <button class="btn btn-success" onclick="onEditHandler(this)">Edit</button>  
                <button class="btn btn-danger" onclick="onDeleteHandler(this)">Delete</button>
            </p>
        </div>
    </div>`;
  });
  info.innerHTML = result;
}

const onStudentSubmit = (e) => {
  e.preventDefault();
  let obj = {
    title: title.value,
    body: information.value,
  };
  postArray.unshift(obj);
  strudentForm.reset();
  templating(postArray);
  fetchData("POST", apiurl, JSON.stringify(obj));
};

const onStudentUpdate=(eve)=>{
  let getId = localStorage.getItem('setId')
/* if we have to delete or update base url or dommy url we have to add /object_id at the end of the url */
  let updateUrl= `${apiurl}/${getId}`;
  cl(updateUrl);
  let obj = {
    title: title.value,
    body: information.value
  }
  postArray.forEach(o=>{
    if(o.id==getId){
      o.title = title.value;
      o.body = information.value;
    }
  })
  templating(postArray);
  strudentForm.reset();
  update.classList.add('d-none');
  submit.classList.remove('d-none');
  fetchData('PATCH',updateUrl,JSON.stringify(obj))

}


strudentForm.addEventListener("submit", onStudentSubmit);
update.addEventListener("click", onStudentUpdate);
/* xhr.status
200 >> data GET Successfully
201 >> data POST successfully
404 >> Page not found /url not found
403 >> forbidden means some api are banned we cant handle that or private 
 4xx error >> client side error / front end side error
 5xx error >> server side error / back end side error

 */

/* xhr.readyState
 0 >> request is not initilize
 1 >> server connection is established
 2 >> request received by server
 3 >> processing request
 4 >> response is ready */
