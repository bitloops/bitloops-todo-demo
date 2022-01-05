import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import bitloops from './bitloops';
import './App.css';

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
const getDataInit = (): [] | { text: string, id: string, status: string }[] => [];

function App() {
  const [editable, setEditable] = useState('');
  const [data, setData] = useState(getDataInit());
  const [newValue, setNewValue] = useState('');
  const [bitloopsEvent, setBitloopsEvent] = useState(getBitloopsEventInitialState());

  const fetchToDos = async () => {
    const [response, error] = await bitloops.todo({ command: bitloops.TodoCommands.GET_ALL });
    if (error) return;
    if (response?.data) setData(response.data);
  };

  const addItem = async (e: any) => {
    e.preventDefault();
    const newItem = {
      status: 'Active',
      text: newValue,
      id: uuid(),
    };
    await bitloops.todo({ command: bitloops.TodoCommands.CREATE, key: newItem.id, data: newItem });
    setNewValue('');
  };

  const removeItem = async (id: string) => {
    await bitloops.todo({ command: bitloops.TodoCommands.DELETE, key: id });
  };

  const editItem = async (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].text = value;
        await bitloops.todo({ command: bitloops.TodoCommands.UPDATE, key: id, data: newData[i] });
        break;
      }
    }
    setEditable('');
  }

  const updateLocalItem = (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData = JSON.parse(JSON.stringify(data));
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
    const newData = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].status = checked ? ViewStates.COMPLETED : ViewStates.ACTIVE;
        await bitloops.todo({ command: bitloops.TodoCommands.UPDATE, key: id, data: newData[i] });
      }
    }
  }

  useEffect(() => {
    async function subscribe() {
      await bitloops.app.subscribe(bitloops.TodoEvents.CREATE, (d) => setBitloopsEvent({ event: bitloops.TodoCommands.CREATE, bitloopsData: d }));
      await bitloops.app.subscribe(bitloops.TodoEvents.DELETE, (d) => setBitloopsEvent({ event: bitloops.TodoCommands.DELETE, bitloopsData: d }));
      await bitloops.app.subscribe(bitloops.TodoEvents.UPDATE, (d) => setBitloopsEvent({ event: bitloops.TodoCommands.UPDATE, bitloopsData: d }));
    }
    subscribe();
    fetchToDos();
  }, []);

  useEffect(() => {
    if (bitloopsEvent) {
      const { bitloopsData, event } = bitloopsEvent;
      const updatedArray = JSON.parse(JSON.stringify(data));

      switch (event) {
        case bitloops.TodoCommands.CREATE: 
          updatedArray.push(bitloopsData.newData);
          setData(updatedArray);
          break;
        case bitloops.TodoCommands.DELETE:
          for (let i = 0; i < updatedArray.length; i += 1) {
            if (updatedArray[i].id === bitloopsData.id) {
              updatedArray.splice(i, 1);
              break;
            }
          }
          setData(updatedArray);
          break;
        case bitloops.TodoCommands.UPDATE:
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
