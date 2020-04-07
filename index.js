const express = require('express');

const server = express();

server.use(express.json());

let users = [
    {
        id: 1,
        name: "Koaly",
        bio: "A koala from Australia"
    },
    {
        id: 2,
        name: "Otto",
        bio: "A sea otter"
    }
]

/*** ENDPOINTS ***/
// POST request - creates user
server.post('/api/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body }
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ errorMessage: "Please provide both a name and bio for the user." })
    } else if (newUser) {
        users.push(newUser);
        res.status(200).json(users);
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
})

// GET request - returns array of users
server.get('/api/users', (req, res) => {
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(500).json({ errorMessage: "The users' information could not be retrieved." });
    }
})

// GET request - returns user w/ specified id
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);

    if (user) {
        res.status(201).json(user);
    } else if (!user) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
    } else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
})

// DELETE request - removes user with specified id
server.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const removeIndex = users.findIndex(user => user.id === id);

    if (removeIndex !== -1) {
        users.splice(removeIndex, 1);
        res.status(204).send('Deleted');
    } else if (removeIndex === -1) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
    } else {
        res.status(500).json({ errorMessage: "The user could not be removed." })
    }
})


// PUT request - modifies specific user
server.put('/api/users/:id', (req, res) => {
    // const updatedUser = { id: Date.now(), ...req.body }
    const id = Number(req.params.id);
    const updatedInfo = { id: id, ...req.body }
    const updateIndex = users.findIndex(user => user.id === id);
    

    /*
    1. find user in users array
        ==> if can't find user, error 404 (not found)
    2. updatedInfo.name & updatedInfo.bio must exist
        ==> if don't exist, error 400 (bad request)
    3. update user info with updatedInfo (status 200 (ok))
    4. if something else goes wrong when updating, error 500
     */

     if (updateIndex === -1) {
         res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
     } else if (!updatedInfo.name || !updatedInfo.bio) {
         res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
     } else if (updateIndex !== -1 && updatedInfo.name && updatedInfo.bio) {
         console.log(updateIndex)
         users.splice(updateIndex, 1, updatedInfo);
         res.status(200).json(users);
     } else {
         res.status(500).json({ errorMessage: "The user information could not be modified." })
     }
})

const port = 5000;
server.listen(port, () => {
    console.log(`\n ~~~ Server listening on port ${port} ~~~ \n`)
})