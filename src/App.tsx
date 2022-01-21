import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { TodoAppClient } from './bitloops';
import './App.css';
import { Todo } from './bitloops/proto/todoApp';
import bitloopsConfig from './bitloopsConfig';
import TodoPanel from './components/TodoPanel';

const ViewStates = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
}

const getBitloopsEventInitialState = (): {
  event: string;
  bitloopsData: any;
} | undefined => undefined;
const getDataInit = (): [] | Todo[] => [];
const getInitialUser = () : any => null;

function App() {
  const todoApp = new TodoAppClient(bitloopsConfig);
  const [user, setUser] = useState(getInitialUser());
  const [editable, setEditable] = useState('');
  const [data, setData] = useState(getDataInit());
  const [newValue, setNewValue] = useState('');
  const [bitloopsEvent, setBitloopsEvent] = useState(getBitloopsEventInitialState());

  const fetchToDos = async () => {
    const [response, error] = await todoApp.getAll();
    if (error) return;
    if (response?.data) setData(response.data);
  };

  const loginWithGoogle = () => {
    todoApp.bitloopsApp.auth.authenticateWithGoogle();
  };

  const addItem = async (e: any) => {
    e.preventDefault();
    await todoApp.create({
      status: 'Active',
      text: newValue,
      id: uuid(),
    });
    setNewValue('');
  };

  const removeItem = async (id: string) => {
    await todoApp.delete({id});
  };

  const editItem = async (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData: Todo[] = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].text = value;
        await todoApp.update(newData[i]);
        break;
      }
    }
    setEditable('');
  }

  const updateLocalItem = (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData: Todo[] = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].text = value;
        setData(newData);
        break;
      }
    }
  }

  const handleCheckbox = async (e: any) => {
    const id = e.target.id;
    const checked = e.target.checked;
    const newData: Todo[] = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].status = checked ? ViewStates.COMPLETED : ViewStates.ACTIVE;
        await todoApp.update(newData[i]);
      }
    }
  }

  useEffect(() => {
    console.log('Setting up onAuthStateChange');
    todoApp.bitloopsApp.auth.onAuthStateChange((user: any) => {
      console.log('received on auth change event');
      if (user) {
        console.log('user', user);
        setUser(user);
      } else {
        console.log('user is null', user);
      }
    });
    async function subscribe() {
      await todoApp.subscribe(todoApp.Events.DELETED, (d) => setBitloopsEvent({ event: todoApp.Events.DELETED, bitloopsData: d }));
      await todoApp.subscribe(todoApp.Events.CREATED, (d) => setBitloopsEvent({ event: todoApp.Events.CREATED, bitloopsData: d }));
      await todoApp.subscribe(todoApp.Events.UPDATED, (d) => setBitloopsEvent({ event: todoApp.Events.UPDATED, bitloopsData: d }));
      fetchToDos();
    }
    subscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bitloopsEvent) {
      const { bitloopsData, event } = bitloopsEvent;
      const updatedArray = JSON.parse(JSON.stringify(data));

      switch (event) {
        case todoApp.Events.CREATED: 
          updatedArray.push(bitloopsData.newData);
          setData(updatedArray);
          break;
        case todoApp.Events.DELETED:
          for (let i = 0; i < updatedArray.length; i += 1) {
            if (updatedArray[i].id === bitloopsData.id) {
              updatedArray.splice(i, 1);
              break;
            }
          }
          setData(updatedArray);
          break;
        case todoApp.Events.UPDATED:
          for (let i = 0; i < updatedArray.length; i += 1) {
            if (updatedArray[i].id === bitloopsData.updatedData.id) {
              updatedArray[i] = bitloopsData.updatedData;
              break;
            }
          }
          setData(updatedArray);
          break;
        default:
          break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitloopsEvent]);

  return (
    <>
      <TodoPanel 
        newValue={newValue}
        setNewValue={setNewValue}
        addItem={addItem}
        updateLocalItem={updateLocalItem}
        editItem={editItem}
        removeItem={removeItem}
        editable={editable}
        setEditable={setEditable}
        handleCheckbox={handleCheckbox}
        data={data}
      />
      {user ? <div>{JSON.stringify(user)}</div> : <button onClick={loginWithGoogle}>Login with Google</button>}
    </>
  );
}

export default App;
