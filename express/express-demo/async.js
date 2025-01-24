console.log('Before');
getUser(1, getRepositories)

console.log('After');

function getRepositories(user) {
    getRepositories(user.gitHubUsername, getCommits);
}

function displayCommits(commits){
    console.log(commits);
    
}

function getCommits(repos){
    getCommits(repos, displayCommits)
}

function getUser(id, callback) {
    setTimeout(()=>{
        console.log('Reading a user from database...'); 
        callback({id: id, gitHubUsername: 'Eli'})
    }, 2000)
    return 1
}

function getRepositories(username, callback) {
    setTimeout(()=>{
        console.log('Fetching repositories for:', username);
        callback(['repo1', 'repo2', 'repo3'])
    }, 2000)
}