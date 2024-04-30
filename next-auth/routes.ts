// does not require authentication
export const publicRoutes = [ "/","/auth/new-verification"];
//for authentication, will redirect logged in users to /settings
export const authRoutes = [ "/auth/login","/auth/register","/auth/error"];
// prefix for api authentication routes 
export const apiAuthPrefix = "/api/auth"
// the default path after logging in
export const DEFAULT_LOGIN_REDIRECT = "/settings"