console.log('Before');
getUser(1, (user) => {
    console.log('User:', user);
    getRepositories(user.gitHubUsername, (repos) => {
        console.log('Repositories:', repos);
    });
})

console.log('After');

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