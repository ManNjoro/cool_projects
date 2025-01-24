console.log('Before');
// getUser(1, getRepositories)

console.log('After');

getUser(1)
.then(user=>getRepositories(user.gitHubUsername))
.then(repos => getCommits(repos[0]))
.then(commits => console.log('Commits', commits))
.catch(err => console.log('Error', err.message))

function getRepositories(user) {
    getRepositories(user.gitHubUsername, getCommits);
}

function displayCommits(commits){
    console.log(commits);
    
}

function getCommits(repos){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting commits for repo...', repos);
            resolve(['commit1', 'commit2', 'commit3'])
        }, 2000);
    })
}

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            console.log('Reading a user from database...'); 
            resolve({id: id, gitHubUsername: 'Eli'})
        }, 2000)

    })
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            console.log('Fetching repositories for:', username);
            resolve(['repo1', 'repo2', 'repo3'])
        }, 2000)
    })
}