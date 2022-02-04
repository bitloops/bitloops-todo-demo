import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { TodoAppClient } from './bitloops';
import './App.css';
import { Todo } from './bitloops/proto/todoApp';
import bitloopsConfig from './bitloopsConfig';
import TodoPanel from './components/TodoPanel';
import GoogleButton from './components/GoogleButton';
import Header from './components/Header';
import { Unsubscribe } from 'bitloops/dist/definitions';

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
const getInitialUser = () : any | null => {
  const bitloopsAuthUserDataString = localStorage.getItem('bitloops.auth.userData');
  return bitloopsAuthUserDataString ? JSON.parse(bitloopsAuthUserDataString) : null;
};

const publicUnSubscriptions: Unsubscribe[] = [];
const privateUnSubscriptions: Unsubscribe[] = [];


function App() {
  const todoApp = new TodoAppClient(bitloopsConfig);
  const [user, setUser] = useState(getInitialUser());
  const [editable, setEditable] = useState('');
  const [data, setData] = useState(getDataInit());
  const [newValue, setNewValue] = useState('');
  const [bitloopsEvent, setBitloopsEvent] = useState(getBitloopsEventInitialState());


  ///TODO subscribe 
  async function subscribePublic() {
    console.log('subscribepublic')
    const createUnSub = await todoApp.subscribe(todoApp.Events.created(), (d) => {
          const eventRes = setBitloopsEvent({ event: todoApp.Events.created(), bitloopsData: d });
    });
    const deleteUnSub = await todoApp.subscribe(todoApp.Events.deleted(), (d) => setBitloopsEvent({ event: todoApp.Events.deleted(), bitloopsData: d }));
    const updateUnSub = await todoApp.subscribe(todoApp.Events.updated(), (d) => setBitloopsEvent({ event: todoApp.Events.updated(), bitloopsData: d }));
    publicUnSubscriptions.push(createUnSub, updateUnSub, deleteUnSub);
    console.log('subscribepublic fetch')
    fetchToDos();
  }

  async function subscribeMine() {
    console.log('subscribeMine user', user)
    const { uid } = user;
    const myCreatedUnSub = await todoApp.subscribe(todoApp.Events.myCreated(uid), (d) => setBitloopsEvent({ event: todoApp.Events.myCreated(uid), bitloopsData: d }));
    const myDeletedUnSub = await todoApp.subscribe(todoApp.Events.myDeleted(uid), (d) => setBitloopsEvent({ event: todoApp.Events.myDeleted(uid), bitloopsData: d }));
    const myUpdatedUnSub = await todoApp.subscribe(todoApp.Events.myUpdated(uid), (d) => setBitloopsEvent({ event: todoApp.Events.myUpdated(uid), bitloopsData: d }));
    privateUnSubscriptions.push(myCreatedUnSub, myDeletedUnSub, myUpdatedUnSub);
    console.log('subscribeprivate fetch')
    fetchToDos();
  }

  async function unsubscribePublic() {
    for (const unsubscribe of publicUnSubscriptions) {
      unsubscribe();
    }
    publicUnSubscriptions.length = 0;
  }
  
  async function unsubscribeMine() {
    for(const unSubscribeMine of privateUnSubscriptions){
      unSubscribeMine();
    }
    privateUnSubscriptions.length = 0; //TODO check pop
  }

  const fetchToDos = async () => {
    console.log('fetch')
    const [response, error] = user ? await todoApp.getMine() : await todoApp.getAll();
    if (error) return;
    if (response?.data) setData(response.data);
  };

  const loginWithGoogle = () => {
    todoApp.bitloopsApp.auth.authenticateWithGoogle();
  };

  const clearAuth = () => {
    todoApp.bitloopsApp.auth.clearAuthentication();
  };

  const addItem = async (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(user){
      console.log('create minne', newValue)
      await todoApp.createMine({
        status: 'Active',
        text: newValue,
        id: uuid(),
      });
    }else {
      console.log('create public')
      await todoApp.create({
        status: 'Active',
        text: newValue,
        id: uuid(),
      });
    }
  
    setNewValue('');
  };

  const removeItem = async (id: string) => {
    if(user){
      await todoApp.deleteMine({id});
    }else{
      await todoApp.delete({id});
    }
  };

  const editItem = async (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData: Todo[] = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].text = value;
        if(user){
          await todoApp.updateMine(newData[i]);
        }else{
          await todoApp.update(newData[i]);
        }
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

  ///TODO add here the user events
  useEffect(() => {
    todoApp.bitloopsApp.auth.onAuthStateChange((user: any) => {
      console.log('auth change')
      setUser(user);
    });
    // console.log('user', user)
    // if (user){
    //   subscribeMine();
    // }else {
    //   subscribePublic();
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('fetch user')
    if(user){
      subscribeMine()
      unsubscribePublic()
    }else{
      subscribePublic()
      unsubscribeMine()
    }

  }, [user])

  useEffect(() => {
    if (bitloopsEvent) {
      const { bitloopsData, event } = bitloopsEvent;
      const updatedArray = JSON.parse(JSON.stringify(data));

      console.log('event', event)
      const uid = user?.uid;
      switch (event) {
        case todoApp.Events.created(): 
        case todoApp.Events.myCreated(uid): 
          updatedArray.push(bitloopsData.newData);
          setData(updatedArray);
          break;
        case todoApp.Events.deleted():
        case todoApp.Events.myDeleted(uid): 
          for (let i = 0; i < updatedArray.length; i += 1) {
            if (updatedArray[i].id === bitloopsData.id) {
              updatedArray.splice(i, 1);
              break;
            }
          }
          setData(updatedArray);
          break;
        case todoApp.Events.updated():
        case todoApp.Events.myUpdated(uid): 
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
      <Header user={user} logout={clearAuth}/>
      {!user && <GoogleButton loginWithGoogle={loginWithGoogle}/>}
    </>
  );
}

export default App;
