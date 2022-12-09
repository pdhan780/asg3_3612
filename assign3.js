const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const artistJsonPath = path.join(__dirname, "data", "artists.json");
const galleryJsonPath = path.join(__dirname, "data", "galleries.json");
const paintingsJsonPath = path.join(__dirname, "data", "paintings-nested.json");




let artists;
fs.readFile(artistJsonPath, (err,data,resp) => {
                  if (err){
                     const mssg = "could not get artist json data"
                    //let the user know that data is not available                 
                     resp.json(mssg)

                   //data valid, send requests
                   } else{
                     
                      artists = JSON.parse(data)
                     
                  
                    } //end of else
          });
                     // return JSON for artist
                     app.get('/api/artists', (req, res) => {
                        res.json(artists);
                    })

                     // Returns JSON for all artists from the specified country. This should be case insensitive
                    app.get('/api/artists/:country', (req, res) => {
                    
                        const errMssg = "cannot get country JSON"
                        const artistsByCountry = artists.filter(artist => artist.Nationality.toLowerCase() === req.params.country.toLowerCase());
                         if (artistsByCountry.length > 0){ //filter will send back empty array if no match so check length
                          res.json(artistsByCountry)
                        }
                        else{
                          res.json(errMssg)
                        }
                     
                    });


let galleries;
fs.readFile(galleryJsonPath, (err,data,resp) => {
                  if (err){
                      const mssg = "could not get gallery json data"
                    //let the user know that data is not available                 
                  resp.json(mssg)

                  //data valid, send requests
                 } else{
                     galleries = JSON.parse(data)

                  }//end of else
         })

                    // Returns JSON for all galleries
                    app.get('/api/galleries', (req, res) => {
                          res.json(galleries); //send back json data

                          });

                      // Returns JSON for all galleries from the specified country. This should be case insensitive
                    app.get('/api/galleries/:country', (req, res) => {
                    const errMssg = "could not find gallery from specified country"
                    const galleriesByCountry = galleries.filter(gallery => gallery.GalleryCountry.toLowerCase() === req.params.country.toLowerCase());

                    if (galleriesByCountry.length >0){
                      res.json(galleriesByCountry);
                    }
                    else{
                    res.json(errMssg)
                    }
                });
   
let paintings;
 fs.readFile(paintingsJsonPath, (err,data,resp) => {
                   if (err){
                    const mssg = "could not get paintings json data"
                    //let the user know that data is not available                 
                    resp.json(mssg)
 
                    //data valid, send requests
                  } else{

                     paintings = JSON.parse(data);
                  
                } //end of 'else' 

                 
        });

                     //return request for painting with certain ID
                     app.get('/api/painting/:id', (req, res) => {
                        const idMatch = (paintings.filter (p => p.paintingID == req.params.id));
                        const errMssg = "could not get, invalid ID";
                    
                        if (idMatch.length > 0){ //filter will send back empty array if no match so check length
                          res.json(idMatch)
                        }
                        else{
                          res.json(errMssg)
                        }
                        
                  })

                   // Returns JSON for all paintings
                    app.get('/api/paintings', (req, res) => {
                         res.json(paintings);
                  });

                  // Returns JSON for the paintings whose gallery id matches the provided gallery id.
                    app.get('/api/painting/gallery/:id', (req, res) => {
   
                     const errMssg = "could not find painting with supplied gallery ID"
                     const paintingsByGalleryID = paintings.filter(p => p.gallery.galleryID == req.params.id);
                       if (paintingsByGalleryID.length >0){

                             res.json(paintingsByGalleryID);

                             }
                        else{
                                res.json(errMssg)
                            }
                     });

                                       
                     // Returns JSON for the paintings whose artist id matches the provided artist id.
                    app.get('/api/painting/artist/:id', (req, res) => {

                     const errMssg = "could not find painting with supplied artist ID"
                     const paintingsByArtistID = paintings.filter(p => p.artist.artistID == req.params.id);

                       if (paintingsByArtistID.length >0){
                           res.json(paintingsByArtistID);
                        }
                       else{
                            res.json(errMssg)
                        }
  
                        });

                  // Returns all paintings whose yearOfWork field is between the two supplied values.
                  app.get('/api/painting/year/:min/:max', (req, res) => {
                    const errMssg = "could not find year of work between supplied values" 
                    const yearOfWorkJson = paintings.filter(p => p.yearOfWork >= req.params.min && p.yearOfWork <= req.params.max);

                        if (yearOfWorkJson.length >0){
                              res.json(yearOfWorkJson);
                            }
                        else{
                            res.json(errMssg)
                           }
                        });

                        // Returns JSON for the paintings whose title contains the provided text. This search should be case insensitive.
                 app.get('/api/painting/title/:text', (req, res) => {
                    const errMssg = "could not find painting with supplied search text" 
                    const titleTextJson = paintings.filter(p => p.title.toLowerCase().includes(req.params.text.toLowerCase()));

                      if (titleTextJson.length >0){
                          res.json(titleTextJson);
                        }
                      else{
                           res.json(errMssg)
                        } 
                    });

                //return the painting color request
                app.get('/api/painting/color/:name', (req, res) => {          
                 const errMssg = "could not find painting with supplied color" 
                 //access the dominantColor array then look for some value that matches passed name
                 const paintingColorJson = paintings.filter(p => p.details.annotation.dominantColors.some(color => color.name.toLowerCase() == req.params.name.toLowerCase()))

                 if (paintingColorJson.length > 0){
                      res.json(paintingColorJson);
                    }
                  else{
                       res.json(errMssg)
                    }
                   });         


            




//test module on local host port 3000, host from glitch when testing done
app.listen(3000, () => console.log('listening on port 3000'));
