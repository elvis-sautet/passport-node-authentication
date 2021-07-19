module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login to view this resource");
    res.redirect("/users/login");
  },
};
