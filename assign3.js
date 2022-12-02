const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()


const jsonPath1 = path.join(__dirname, 'data', 'artists.json')
console.log(jsonPath1)

let paintings;

fs.readFile(jsonPath1, (err,data, resp) => {
                   //could not get the data
                   if (err){

                    //let the user know that data is not available                 
                    resp.json({message: 'Did not work'})
                  
                 
                  } else{

                     paintings = JSON.parse(data);
                  }
                  console.log(paintings)
             });



  app.get('/:id', (req, resp) => { 
  const results = paintings.filter (p => p.painting.ID == req.params.id)

  if (results.length > 0){  //filter sends back empty array if not found so check length
  resp.json(results)

  }else {
   resp.json({message : 'No painting with that id can be found'}) //send back error message
  }
 
            
  })
 

