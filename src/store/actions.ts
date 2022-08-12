const actions = {
  auth: {
    SIGNED_OUT: 'auth/signedOut',
    SIGNED_IN: 'auth/signedIn',
  },
  todos: {
    FETCH_ALL: 'todos/fetchAll',
    FETCH_ONE: 'todos/fetchOne',
    CREATE: 'todos/create',
    DELETE: 'todos/delete',
    UPDATE: 'todos/update',
    CHECK: 'todos/check',
  },
};

export default actions;
