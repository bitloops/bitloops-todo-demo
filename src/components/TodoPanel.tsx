import React from 'react';
import { FaTrash } from 'react-icons/fa';

import logo from '../assets/bitloops_175x40_transparent.png';
import { Todo } from '../services/todos';

const enum EToDoStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

interface TodoProps {
  editable: undefined | string;
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  setEditable: React.Dispatch<React.SetStateAction<undefined | string>>;
  data: Todo[] | [];
  addItem: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  updateTodoValue: (d: any) => void;
  editItem: (e: any) => void;
  removeItem: (id: string) => void;
  handleCheckbox: (d: any) => void;
}

function TodoPanel(props: TodoProps): JSX.Element {
  const {
    newValue,
    setNewValue,
    addItem,
    updateTodoValue,
    editItem,
    removeItem,
    editable,
    setEditable,
    handleCheckbox,
    data,
  } = props;

  return (
    <div className="todo-list">
      <div className="heading">
        <h1 className="title">
          <img src={logo} alt="Bitloops" width={175} height={40} />
          <br />
          To Do
        </h1>
      </div>
      <input
        type="text"
        value={newValue}
        className="todo-list-input"
        onChange={(e) => {
          setNewValue(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') addItem(e);
        }}
      />
      <button onClick={addItem} type="button">
        Add
      </button>

      <div className="items">
        <ul>
          {data &&
            data.map(({ title: text, id, status }) => (
              <li key={id}>
                <input
                  className="checkbox"
                  id={id}
                  type="checkbox"
                  checked={status === EToDoStatus.COMPLETED}
                  onChange={handleCheckbox}
                />
                {editable === id ? (
                  <input
                    type="text"
                    value={text}
                    id={id}
                    className="todo-list-input"
                    onChange={updateTodoValue}
                    onKeyPress={(event) => event.key === 'Enter' && editItem(event)}
                    onBlur={editItem}
                  />
                ) : (
                  <p
                    id={id}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      const target = e.target as HTMLParagraphElement;
                      setEditable(target.id);
                    }}
                  >
                    {text}
                  </p>
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

export default TodoPanel;
