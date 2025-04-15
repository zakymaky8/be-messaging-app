# Messaging App

## Contents

[Description](#description)
[Tech Stack](#tech-stack-used)
[Installation](#installation)
[Contribution](#contribution)
1. [option 1](#option-1)
2. [option 2](#option-2)

[Liscense](#license)
[Deployement](#deployement)


## Description
- Messaging app, which allows two people chat with their choice of ways.

## Tech Stack used;

1. **Authentication** : Here ***Jsonwebtoken*** is used to secure chats and user account access.
2. **Database**: ***Mongodb*** is non-relational, document based and flexible database which is normally instrumental for this kinds of projects. **Mongoose** as ODM on top of mongodb, which made the development  and developer experience a lot seamless.
3. **Backend framework**: **Express**, non-opinionated, flexible, creativity and freedom evoking framework.
4. **Web socket**: Socket io is used to streamline real time communication between the server and client.


## Installation

To install the packages, use the following steps
1. open your terminal in VS code( if you use so):
    `ctrl + backtick `

2. Then do

```bash
npm install
```

3. To Run the app in your dev server

```bash
node --watch app #if you want to limit extra library usage
```

## Contribution

Contributions are welcome. Your suggestions are invaulable to me. If you plan to do so, follow the following steps in two different ways.
#### Option 1

1. Fork the repository, if you want to work on it on your dedicated repository,
2. Optimize per use suitability in your local machine (it is all yours after that, but I would love to see your suggestions)
3. And code around limitlesslly

#### Option 2
1. Clone the repository (have the exact copy of the codebase on your local machine);
2. Create an issue for your intended changes.
3. Create a branch for that issue.
4. Then change to the root directory while your are at it do,
``` bash
    git fetch --all
    git checkout [your_branch_name]
```
5. Make changes on that branch.
6. After you are comfortable with your new feature or suggestions (whatever), you would be benefited from
    ```
    git pull origin [main_branch]
    ```
7. Finally push your changes
    ```
    git push
    ```
8. Create pull request, I am there to approve.

## License
This project is licensed under the [MIT License](https://github.com/Uwancha/memory-card/blob/main/LICENSE). Feel free to play around manipulating it.

## Deployement

**API**: is served on [Render](https://render.com).
**Database**: mongodb database is awesomely served from [Mongodb Atlas](https://cloud.mongodb.com/)