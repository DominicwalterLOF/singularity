async function getData(query){
       const response= await fetch("https://images-api.nasa.gov/search?q=" + query + "&media_type=image")
       const data= await response.json();
       console.log(data);
       render(data);
     }


function search() {
    getData(d("searchTerm").value);
  }


  function render(data){
    for(i in data["collection"]["items"]){
        console.log(data["collection"]["items"][i]["href"])
        d("results").innerHTML += generateCard(data["collection"]["items"][i]["href"], "")
    }
  }

  function generateCard(image, title){
    return `<div class = 'card' style = 'background-image: url(" ` + image + `")'></div>`
  }