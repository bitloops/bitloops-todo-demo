import React, { useState, useEffect, MouseEventHandler } from 'react';
import { FaTrash, FaPen } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { bitloops, todoWorkflow } from './bitloops';
import './App.css';

type Item = {
  text: string;
  status: boolean;
  id: string;
};

type BitloopsEventType = {
  event: string;
  bitloopsData: any;
}

const ViewStates = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
}

const Events = {
  UPDATE: 'update',
  DELETE: 'delete',
  CREATE: 'create',
};

const getBitloopsEventInitialState = (): BitloopsEventType | undefined => undefined;

function App() {
  const [editable, setEditable] = useState('');
  const [data, setData] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [bitloopsEvent, setBitloopsEvent] = useState(getBitloopsEventInitialState());
  // const [view, setView] = useState(ViewStates.ALL);

  const fetchToDos = async () => {
    const [response, error] = await todoWorkflow({ command: 'getAll' });
    if (error) return;
    console.log('fetched All response', response);
    setData(response.data);
  };

  const handleSubscribe = (payload: any, event: string) => {
    console.log('received event', event, payload)
    const bitloopsEvent = {
      event,
      bitloopsData: payload,
    }
    setBitloopsEvent(bitloopsEvent);
  };

  const addItem = async (e: any) => {
    e.preventDefault();
    const newItem = {
      status: 'Active',
      text: newValue,
      id: uuid(),
    };
    await todoWorkflow({ command: Events.CREATE, key: newItem.id, data: newItem });
    setNewValue('');
  };

  const removeItem = async (id: string) => {
    await todoWorkflow({ command: Events.DELETE, key: id });
  };

  const editItem = async (e: any) => {
    const id = e.target.id;
    const value = e.target.value;
    const newData = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].text = value;
        await todoWorkflow({ command: Events.UPDATE, key: id, data: newData[i] });
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
        await todoWorkflow({ command: Events.UPDATE, key: id, data: newData[i] });
      }
    }
  }

  useEffect(() => {
    async function subscribe() {
      await bitloops.subscribe(`workflowEvents.ToDos.${Events.CREATE}`, (d) => handleSubscribe(d, Events.CREATE));
      await bitloops.subscribe(`workflowEvents.ToDos.${Events.DELETE}`, (d) => handleSubscribe(d, Events.DELETE));
      await bitloops.subscribe(`workflowEvents.ToDos.${Events.UPDATE}`, (d) => handleSubscribe(d, Events.UPDATE));
    }
    subscribe();
    fetchToDos();
  }, []);

  useEffect(() => {
    if (bitloopsEvent) {
      console.log('event', bitloopsEvent);
      const { bitloopsData, event } = bitloopsEvent;
      const updatedArray = JSON.parse(JSON.stringify(data));

      switch (event) {
        case Events.CREATE: 
          updatedArray.push(bitloopsData.newData);
          setData(updatedArray);
          break;
        case Events.DELETE:
          for (let i = 0; i < updatedArray.length; i += 1) {
            if (updatedArray[i].id === bitloopsData.id) {
              updatedArray.splice(i, 1);
              break;
            }
          }
          setData(updatedArray);
          break;
        case Events.UPDATE:
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
    <div className="todolist">
      <div className="heading">
        <h1 className="title">Bitloops To-Do Demo</h1>
      </div>
      <input
        type="text"
        value={newValue}
        className='todolistinput'
        onChange={(e) => { setNewValue(e.target.value)}}
      />
      <button onClick={addItem}>Add</button>

      <div className="items">
        <ul>
          {data.map(({ text, id, status }) => (
            <li key={id}>
              <input className='checkbox' id={id} type="checkbox" defaultChecked={status === ViewStates.COMPLETED} onClick={handleCheckbox} />
              {editable === id ? (
                <input
                  type="text"
                  value={text}
                  id={id}
                  className='todolistinput'
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
                {/* <FaPen
                  onClick={() => {
                    // setItems((prevItems: any[]) => {
                    //   const shallowCopiedItems = [...prevItems];
                    //   const item = { ...shallowCopiedItems[index], editable: true };
                    //   shallowCopiedItems[index] = item;
                    //   return shallowCopiedItems;
                    // });
                  }}
                /> */}
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
