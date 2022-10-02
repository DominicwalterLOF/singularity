async function getData(query){
    const response= await fetch("https://images-api.nasa.gov/search?q=" + query + "&media_type=audio")
    const data= await response.json();
    render(data);
  }


 async function getActualImage(collection, title){
     const response = await fetch(collection)
     const data= await response.json();
     for(var i in data){
         d("results").innerHTML += generateCard(data[i], title); 
         break
     }
     
  }


function search() {
 getData(d("searchTerm").value);
}


function render(data){
    for(i in data["collection"]["items"]){
        d("results").innerHTML = "";
        getActualImage(data["collection"]["items"][i]["href"], data["collection"]["items"][i]["data"][0]["title"]);
    }
}

function generateCard(audio, title){
 return `<div class = 'card center'><p>`+ title +`</p><br><br><audio controls><source src="`+ audio +`" type="audio/mpeg"></audio></div>`
}