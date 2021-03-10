const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

//page that does not need you to be logged in
//localhost:8081
router.get("/", (req, res) => {
  res.send("welcome");
});

//page that needs you to be logged in (uses ensureAuthenticated)
//localhost:8081/dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { 
    user: req.user, 
  });
});

router.get("/admin", isAdmin, (req, res) => {
  res.render("admin", {
    user: req.user,
    sessions: req.sessionStore.sessions,
  });
});

router.get('/admin/revoke/:sessionID', (req, res) => {
  const sessionID = req.params.sessionID;
  req.sessionStore.destroy(sessionID);
  res.redirect('/admin');
});


module.exports = router;
