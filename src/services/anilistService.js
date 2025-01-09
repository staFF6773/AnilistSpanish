const fetch = require('node-fetch');

const ANILIST_API = 'https://graphql.anilist.co';

async function fetchFromAnilist(query, variables) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  return response.json();
}

module.exports = {
  fetchFromAnilist
}; 
