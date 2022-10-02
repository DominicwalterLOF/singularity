async function getData(query){
       const response= await fetch("https://images-api.nasa.gov/search?q=" + query + "&media_type=image")
       const data= await response.json();
       render(data);
     }


    async function getActualImage(collection){
        const response = await fetch(collection)
        const data= await response.json();
        for(var i in data){
            d("results").innerHTML += generateCard(data[i], ""); 
            break
        }
     }


function search() {
    getData(d("searchTerm").value);
  }


  function render(data){
    for(i in data["collection"]["items"]){
        d("results").innerHTML = "";
        getActualImage(data["collection"]["items"][i]["href"])
    }
  }

  function generateCard(image, title){
    return `<div class = 'card' style = 'background-image: url(" ` + image + `")'></div>`
  }