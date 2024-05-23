function verifySession(req, res, next) {
  if (!req?.session?.user?.id) {
    res.redirect(process.env.BASE_URL + "auth/admin/login");
  } else {
    next();
  }
}
//
export default verifySession;
