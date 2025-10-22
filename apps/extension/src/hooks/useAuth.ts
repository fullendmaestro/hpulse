export function useAuth() {
  return {
    locked: false,
    signin: () => {},
    signout: () => {},
    authenticating: false,
  }
}
