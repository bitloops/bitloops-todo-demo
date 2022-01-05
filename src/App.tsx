import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { TodoAppClient } from './bitloops';
import './App.css';
import { Todo } from './bitloops/proto/todoApp';
import bitloopsConfig from './bitloopsConfig';

const todoApp = new TodoAppClient(bitloopsConfig);

type BitloopsEventType = {
  event: string;
  bitloopsData: any;
}

const ViewStates = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
}

const getBitloopsEventInitialState = (): BitloopsEventType | undefined => undefined;
const getDataInit = (): [] | Todo[] => [];

function App() {
  const [editable, setEditable] = useState('');
  const [data, setData] = useState(getDataInit());
  const [newValue, setNewValue] = useState('');
  const [bitloopsEvent, setBitloopsEvent] = useState(getBitloopsEventInitialState());

  const fetchToDos = async () => {
    const [response, error] = await todoApp.getAll();
    if (error) return;
    if (response?.data) setData(response.data);
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
    async function subscribe() {
      await todoApp.subscribe(todoApp.Events.CREATED, (d) => setBitloopsEvent({ event: todoApp.Events.CREATED, bitloopsData: d }));
      await todoApp.subscribe(todoApp.Events.DELETED, (d) => setBitloopsEvent({ event: todoApp.Events.DELETED, bitloopsData: d }));
      await todoApp.subscribe(todoApp.Events.UPDATED, (d) => setBitloopsEvent({ event: todoApp.Events.UPDATED, bitloopsData: d }));
    }
    subscribe();
    fetchToDos();
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
    <div className="todo-list">
      <div className="heading">
        <h1 className="title">Bitloops<br/>To-Do Demo</h1>
      </div>
      <input
        type="text"
        value={newValue}
        className='todo-list-input'
        onChange={(e) => { setNewValue(e.target.value)}}
      />
      <button onClick={addItem}>Add</button>

      <div className="items">
        <ul>
          {data && data.map(({ text, id, status }) => (
            <li key={id}>
              <input className='checkbox' id={id} type="checkbox" checked={status === ViewStates.COMPLETED} onChange={handleCheckbox} />
              {editable === id ? (
                <input
                  type="text"
                  value={text}
                  id={id}
                  className='todo-list-input'
                  onChange={updateLocalItem}
                  onKeyPress={(event) => event.key === 'Enter' && editItem(event)}
                  onBlur={editItem}
                />
              ) : (
                <p id={id} onClick={(e: React.MouseEvent<HTMLElement>) => { 
                  const target = e.target as HTMLParagraphElement;
                  setEditable(target.id); 
                }}>{text}</p>
              )}
              <div className="actions">
                <FaTrash
                  onClick={() => {
                    removeItem(id);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
