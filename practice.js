const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getItemOnIndex, users } = require("./utils");
const express = require("express");
const session = require("express-session");
const app = express();

const port = 4002;

app.use(
  session({
    secret: "backendSecret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: "none",
      httpOnly: true,
    },
    saveUninitialized: true,
    resave: false,
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => {
    if (user.id === id) return true;
  });

  done(null, user);
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    try {
      const user = users.find((user) => {
        if (user.username === username && user.password === password)
          return true;
      });

      if (!user) throw new Error("User not found, incorrect credentials provided");

      if (user) {
        done(null, user);
      }
    } catch (err) {
      done(err, null);
    }
  })
);

let peopleData = [
  { id: 1, name: "Lerato", surname: "Mokoena" },
  { id: 2, name: "Thabo", surname: "Nkosi" },
  { id: 3, name: "Ayanda", surname: "Dlamini" },
];

//log in code without passport js using only session

// app.post("/auth/login", (req, res) => {
//   const { username, password } = req.body;

//   if (username && password) {
//     const user = users.find((user) => {
//       if (user.username === username && user.password === password) return true;
//     });

//     if (!user)
//       return res
//         .status(401)
//         .send({ msg: "User credentials are missing or invalid" });

//     req.session.authenticated = true;
//     req.session.user = user;

//     res.status(200).send(req.session);
//   } else {
//     res.status(401).send({ msg: "User credentials are missing or invalid" });
//   }
// });

app.post("/auth/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Login successfull");
});

app.get("/auth/status", (req, res) => {
  if (req.user) {
    return res.status(200).send(req.user);
  }

  res.status(200).send({ msg: "User not auth authorised" });
});

const checkAuthentication = (req, res, next) => {
  console.log("Session in middleware:", req.session);
  if (req.user) {
    return next();
  }

  res.status(404).send({ msg: "User not auth authorised" });
};

app.get("/people", checkAuthentication, (req, res) => {
  res.status(200).send(peopleData);
});

app.get("/people/:id", checkAuthentication, (req, res) => {
  const id = Number(req.params.id);
  const item = getItemOnIndex(peopleData, id);
  res.status(200).send(item);
});

app.post("/people/:name/:surname", checkAuthentication, (req, res) => {
  const name = req.params.name;
  const surname = req.params.surname;

  if (!name || !surname) {
    res.status(400).send({ error: "Name and surname are required." });
    return;
  }

  const data = {
    id: peopleData.length + 1,
    name: name,
    surname: surname,
  };

  peopleData.push(data);

  res.status(200).send(peopleData);
});

app.put("/people/:id/:name/:surname", checkAuthentication, (req, res) => {
  const { id, name, surname } = req.params;

  if (name && surname && id) {
    peopleData.forEach((item) => {
      if (item.id === Number(id)) {
        item.name = name;
        item.surname = surname;
      }
    });

    res.status(200).send(peopleData);
  } else {
    res.status(400).send("Name and surname are required.");
  }
});

app.delete("/people/:id", checkAuthentication, (req, res) => {
  const { id } = req.params;

  if (id < 1 || id > peopleData.length) {
    res.status(400).send("Item does not exist");
  }

  peopleData = peopleData.filter((item) => {
    if (item.id !== Number(id)) return item;
  });

  res.status(200).send(peopleData);
});

app.post("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return res.status(500).send({ msg: "Login failed." });

    res.status(200).send({ msg: "Logged out successfully." });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
