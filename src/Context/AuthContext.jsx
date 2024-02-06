import { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type: 'LOGIN', payload: user })
    }
  },[])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, authReducer };
export default AuthContext;
