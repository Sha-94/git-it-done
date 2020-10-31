var divEl = document.querySelector('#issues-container');
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

getRepoName();

function getRepoName() {
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];
  if(repoName) {
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
  }else {
    document.location.replace("./index.html");
  }
}

function getRepoIssues(repoName) {
  const queryParam = repoName.split('/');
  const owner = queryParam[0];
  const repo =  queryParam[1];

  let apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?direction=asc`;
  fetch(apiUrl).then(response => {
    if (response.ok) {
      response.json().then(data => {
        displayIssues(data);
        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(owner, repo);
        }
      });
    } else {
      document.location.replace("./index.html");
    }
  })
}

function displayIssues(issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl)
    issueContainerEl.appendChild(issueEl);
  }
}

function displayWarning(owner, repo) {
  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", `https://github.com/${owner}/${repo}/issues`);
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
}