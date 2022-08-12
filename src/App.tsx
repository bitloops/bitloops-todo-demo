import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';
import TodoPanel from './components/TodoPanel';
import GoogleButton from './components/GoogleButton';
import Header from './components/Header';
import GithubButton from './components/GithubButton';
import { useSelector } from 'react-redux';
import { createTodo, deleteTodo, fetchTodo, fetchTodos, selectTodosData, updateTodo } from './store/slices/todos';
import useAppDispatch from './hooks/useAppDispatch';
import { UserData } from './infra/auth';
import DI, { IDI, initialDependencies } from './di';
import { authChanged, selectUserData } from './store/slices/auth';

const ViewStates = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

const getBitloopsEventInitialState = ():
  | {
      event: string;
      bitloopsData: any;
    }
  | undefined => undefined;

// let publicUnsubscriptions: Unsubscribe[] = [];
// let privateUnsubscriptions: Unsubscribe[] = [];

function App() {
  const [dependencies, setDependencies] = React.useState<IDI>(initialDependencies);
  const { auth } = React.useContext(DI)[0];

  const user = useSelector(selectUserData);
  //  const [user, setUser] = useState<any | null>(null);

  const [newTodoValue, setNewTodoValue] = useState('');
  const [editableTodoId, setEditableTodoId] = useState<undefined | string>();
  const [editTodoValue, setEditTodoValue] = useState<undefined | string>();
  const todos = useSelector(selectTodosData);
  const dispatch = useAppDispatch();
  const onAuthStateChangedCallback = (user?: UserData) => {
    console.log('dispatching user', user);
    if (user) {
      // const subdomain = window.location.hostname.split('.')[0];
      // dispatch(fetchBusinessData({subdomain, userUniqueId: user.userUniqueId}));
    }
    dispatch(authChanged(user));
  };
  useEffect(() => {
    auth.onAuthStateChanged(onAuthStateChangedCallback);
    return () => {
      // unsubscribe(); // unsubscribe on unmount
      console.log('app unmounted');
    };
  }, []);

  useEffect(() => {}, [dependencies]);

  useEffect(() => {
    console.log('useEffect editTodoValue', editTodoValue, editableTodoId);
    if (editTodoValue && editableTodoId) {
      dispatch(updateTodo({todoId: editableTodoId, updateData: {title: editTodoValue}}));
      dispatch(fetchTodo({todoId: editableTodoId}));
    }
  }, [editTodoValue]);

  const addItem = async (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    await dispatch(createTodo({ id: uuid(), title: newTodoValue })).unwrap();

    setNewTodoValue('');
    // CQRS Create does not return anything, we need to fetch the new data
    await dispatch(fetchTodos()).unwrap();
  };

  const removeItem = async (id: string) => {
    console.log('delete clicked');
    dispatch(deleteTodo(id));
    // if (user) {
    //   await todoApp.deleteMine({ id });
    // } else {
    //   await todoApp.delete({ id });
    // }
  };

  const editItem = async (e: any) => {
    setEditableTodoId(undefined);
    // const { id } = e.target;
    // const { value } = e.target;
    // console.log('edit clicked', id, value);
    // setEditTodoValue(value);
    // if (editTodoValue) {
    //   dispatch(updateTodo({todoId: id, updateData: {title: editTodoValue}}));
    //   dispatch(fetchTodo({todoId: id}));
    // }
    // const newData: Todo[] = JSON.parse(JSON.stringify(data));
    // for (let i = 0; i < newData.length; i += 1) {
    //   if (newData[i].id === id) {
    //     newData[i].text = value;
    //     if (user) {
    //       await todoApp.updateMine(newData[i]);
    //     } else {
    //       await todoApp.update(newData[i]);
    //     }
    //     break;
    //   }
    // }
    // setEditable('');
  };

  const updateTodoValue = (e: any) => {
    const { id } = e.target;
    const { value } = e.target;
    console.log('updating Todo value', id, value);
    setEditTodoValue(value);

    
    // const { id } = e.target;
    // const { value } = e.target;
    // const newData: Todo[] = JSON.parse(JSON.stringify(data));
    // for (let i = 0; i < newData.length; i += 1) {
    //   if (newData[i].id === id) {
    //     newData[i].text = value;
    //     setData(newData);
    //     break;
    //   }
    // }
  };

  const handleCheckbox = async (e: any) => {
    const { id } = e.target;
    const { checked } = e.target;
    // const newData: Todo[] = JSON.parse(JSON.stringify(data));
    // for (let i = 0; i < newData.length; i += 1) {
    //   if (newData[i].id === id) {
    //     newData[i].status = checked ? ViewStates.COMPLETED : ViewStates.ACTIVE;
    //     if (user) {
    //       await todoApp.updateMine(newData[i]);
    //     } else {
    //       await todoApp.update(newData[i]);
    //     }
    //   }
    // }
  };

  /**
   * Upon initialization set onAuthStateChange in order
   * to keep track of auth state locally
   */
  useEffect(() => {
    dispatch(fetchTodos());
    // eslint-disable-next-line @typescript-eslint/no-shadow
    // todoApp.bitloopsApp.auth.onAuthStateChange((user: any) => {
    //   setUser(user);
    // });
  }, []);


  return (
    <>
      <DI.Provider value={[dependencies, setDependencies]}>
        <TodoPanel
          newValue={newTodoValue}
          setNewValue={setNewTodoValue}
          addItem={addItem}
          updateTodoValue={updateTodoValue}
          editItem={editItem}
          removeItem={removeItem}
          editable={editableTodoId}
          setEditable={setEditableTodoId}
          handleCheckbox={handleCheckbox}
          data={todos}
        />
        <Header user={user} logout={() => auth.clearAuthentication()} />
        {!user && <GoogleButton loginWithGoogle={() => auth.signInWithGoogle()} />}
        {!user && <GithubButton loginWithGithub={() => auth.signInWithGoogle()} />}
      </DI.Provider>
    </>
  );
}

export default App;
