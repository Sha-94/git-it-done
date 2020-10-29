var baseUrl = 'https://api.github.com/users/';

getUserRepos('sha-94');

function getUserRepos(user){
  const repoApi = `${baseUrl}${user}/repos`;
  let repos; 

  fetch(repoApi).then(response => {
    response.json().then(data => {
      repos = data.map(item => item.name);
      console.log(repos);
    });

  });
}