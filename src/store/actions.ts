const actions = {
  auth: {
    SIGNED_OUT: 'auth/signedOut',
    SIGNED_IN: 'auth/signedIn',
  },
  applications: {
    FETCH_ALL: 'applications/fetchAll',
    CREATE: 'applications/create',
  },
  todos: {
    FETCH_ALL: 'todos/fetchAll',
    CREATE: 'todos/create',
  },
};

export default actions;
