import React, { useState, useEffect, useRef, Dispatch } from 'react';
import { FaTrash, FaPen } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { bitloops } from './bitloops';
import './App.css';

type Item = {
  text: string;
  editable: boolean;
  id: string;
};
const handleSubscribeUpdate = (data: any, getItems: any, setItems: Dispatch<React.SetStateAction<Item[]>>) => {
  console.log('workflow.Update received', data);
  // console.log('state length', items.length, itemsRef.current?.length);
  console.log('state length', getItems().length);
  // const findIndex = itemsRef.current?.findIndex((el) => el.id === data.updatedData.id);
  const findIndex = getItems().findIndex((el: any) => el.id === data.updatedData.id);
  if (findIndex !== undefined && findIndex !== -1) mutateItem(findIndex, { ...data.updatedData }, setItems);
};

const mutateItem = (index: number, newProps: Record<string, any>, setItems: any) => {
  console.log(`mutating data with ${index} new Props`, newProps);
  setItems((prevItems: any[]) => {
    const shallowCopiedItems = [...prevItems];
    const item = { ...prevItems[index], ...newProps };
    shallowCopiedItems[index] = item;
    return shallowCopiedItems;
  });
};

function App() {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const itemsRef = useRef<Item[]>();
  itemsRef.current = items;

  const todoWorkflow = async (payload: Record<string, unknown>) => {
    try {
      const response = await bitloops.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        '9eac4f54-d4db-4fe9-b5a4-f1c6d527c446',
        payload
      );
      return [response, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  };

  const fetchToDos = async () => {
    const [response, error] = await todoWorkflow({ command: 'getAll' });
    if (error) return;
    console.log('fetched All response', response);
    setItems(response.data.map(({ text, id }: any) => ({ text, editable: false, id })));
  };

  const handleSubscribeDelete = (data: any) => {
    console.log('workflow.delete received', data);
    const findIndex = itemsRef.current?.findIndex((el) => el.id === data.id);
    console.log('received data.id', data.id, 'my items', items);
    console.log('about to remove from subscription index', findIndex);
    if (findIndex !== undefined && findIndex !== -1) removeLocalItem(findIndex);
  };

  const handleSubscribeCreate = (data: any) => {
    console.log('workflow.create received', data.newData);
    const findIndex = itemsRef.current?.findIndex((el) => el.id === data.newData.id);
    if (findIndex !== -1) return;
    setItems((prevData: any) => {
      return [...prevData, { ...data.newData, editable: false }];
    });
  };

  const getItems = () => {
    return items;
  };

  const setUpSubscriptions = async () => {
    await bitloops.subscribe('workflowEvents.ToDos.update', (data) => handleSubscribeUpdate(data, getItems, setItems));
    await bitloops.subscribe('workflowEvents.ToDos.delete', handleSubscribeDelete);
    await bitloops.subscribe('workflowEvents.ToDos.create', handleSubscribeCreate);
  };

  useEffect(() => {
    fetchToDos();
    setUpSubscriptions();
  }, []);

  const addItem = async () => {
    const newItem = { text: input, id: uuid() };
    setItems((prevData: any) => {
      return [...prevData, { ...newItem, editable: false }];
    });
    setInput('');
    await todoWorkflow({ command: 'create', key: newItem.id, data: newItem });
  };

  const removeLocalItem = (index: number) => {
    setItems((prevItems: any) => {
      const shallowCopiedItems = [...prevItems];
      shallowCopiedItems.splice(index, 1);
      return shallowCopiedItems;
    });
  };

  const removeItem = async (index: number) => {
    const id = items[index].id;
    removeLocalItem(index);
    await todoWorkflow({ command: 'delete', key: id });
  };

  const handleEdit = (event: any, index: number) => {
    const { value } = event.target;
    mutateItem(index, { text: value }, setItems);
  };

  const handleUpdate = async (event: any, index: number) => {
    console.log('enter pressed!');
    mutateItem(index, { editable: false }, setItems);
    const { text } = items[index];
    await todoWorkflow({ command: 'update', key: items[index].id, data: { text } });
  };

  return (
    <div className="todolist">
      <div className="heading">
        <h1 className="title">To-Do List</h1>
      </div>
      <input
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <button onClick={addItem}>Add</button>

      <div className="items">
        <ul>
          {items.map(({ text, editable }, index: any) => (
            <li key={index}>
              {editable ? (
                <input
                  type="text"
                  value={text}
                  onChange={(event) => handleEdit(event, index)}
                  onKeyPress={(event) => event.key === 'Enter' && handleUpdate(event, index)}
                  onBlur={(event) => handleUpdate(event, index)}
                />
              ) : (
                <p>{text}</p>
              )}
              <div className="actions">
                <FaPen
                  onClick={() => {
                    setItems((prevItems: any[]) => {
                      const shallowCopiedItems = [...prevItems];
                      const item = { ...shallowCopiedItems[index], editable: true };
                      shallowCopiedItems[index] = item;
                      return shallowCopiedItems;
                    });
                  }}
                />
                <FaTrash
                  onClick={() => {
                    removeItem(index);
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
