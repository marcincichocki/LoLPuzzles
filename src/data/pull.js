
/**
 * Node.js script that pulls latest champion's splash arts
 * data from Riot servers. Api key and server can be specified
 * in cli params:
 *
 * npm run pull --api_key=00000000-0000-0000-0000-000000000000 --server=na
 */
(function() {
  "use strict";

  const fs = require('fs');
  const https = require('https');

  const OUTPUT = './src/data/images.json';
  const DEMO_INPUT = './src/data/demo.json';

  const API_KEY = process.env.npm_config_api_key;
  const SERVER = process.env.npm_config_server || 'eune';
  const URL = `https://global.api.pvp.net/api/lol/static-data/${SERVER}/v1.2/champion?champData=skins&api_key=${API_KEY}`;


  if (typeof API_KEY === 'undefined') {
    console.log('No user\'s API key secified! Using demo instead.');

    fs.readFile(DEMO_INPUT, (err, data) => {
      if (err) throw err;

      fs.writeFile(OUTPUT, data, 'utf-8', function(err) {
        if (err) throw err;

        console.log('Data successfully written to file: %s', OUTPUT);
      });
    });

    return;
  }


  /**
   * Promise wrapper on https request.
   */
  const getSplashArtData = new Promise((resolve, reject) => {
    https.get(URL, (res) => {

      let body = '';

      res.on('data', (data) => {
        body += data;
      });

      res.on('end', () => {
        console.log('Loaded data from url: %s', URL);

        resolve(body);
      });

    }).on('error', (error) => {
      console.error('Error occurred! This might be problem with your internet connection or API key.');

      reject(error);
    });
  });



  getSplashArtData.then((body) => {
    const splashArtData = JSON.parse(body).data;

    console.log('Starting data downsize...');


    console.time('dataDownsize');

    const result = downsize();

    console.timeEnd('dataDownsize');



    fs.writeFile(OUTPUT, result, 'utf-8', function(err) {
      if (err) throw err;

      console.log('Data successfully written to file: %s', OUTPUT);
    });


    function downsize() {
      return JSON.stringify(Object.keys(splashArtData).map((championKey) => {

        const champion = splashArtData[championKey];
        const skins = champion.skins.map((skin) => skin.name);

        return {
          key: championKey,
          name: champion.name,
          title: champion.title,
          skins
        };
      }));
    };

  }).catch(error => console.error(error));
})();
