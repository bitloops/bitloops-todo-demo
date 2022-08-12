import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AsyncThunkConfig, RootState } from '../index';

import { Todo } from '../../services/todos';
import actions from '../actions';

export interface ITodosState {
  data: Todo[];
  status: 'idle' | 'pending' | 'error' | 'success';
  error?: string;
}

const initialState: ITodosState = {
  data: [],
  status: 'idle',
};

export const fetchTodos = createAsyncThunk<Todo[], undefined, AsyncThunkConfig>(
  actions.todos.FETCH_ALL,
  async (_, thunkAPI) => {
    const response = await thunkAPI.extra.services.todos.getAllMyToDos();
    return response;
  },
);

export const fetchTodo = createAsyncThunk<Todo, { todoId: string }, AsyncThunkConfig>(
  actions.todos.FETCH_ONE,
  async (payload, thunkAPI) => {
    const { todoId } = payload;
    const response = await thunkAPI.extra.services.todos.fetchTodo(todoId);
    return response;
  },
);

export const createTodo = createAsyncThunk<void, { id: string; title: string }, AsyncThunkConfig>(
  actions.todos.CREATE,
  async ({ id, title }, thunkAPI) => {
    // thunkAPI.extra.token
    await thunkAPI.extra.services.todos.createTodo(id, title);
  },
);

// export const fetchtodoById = createAsyncThunk<todo, string, AsyncThunkConfig>(
//   'todos/fetchOne',
//   async (id, thunkAPI) => {
//     // thunkAPI.extra.token
//     const todo = await thunkAPI.extra.services.todos.fetchOneById(id);
//     return todo;
//   },
// );

export const deleteTodo = createAsyncThunk<string, string, AsyncThunkConfig>(
  actions.todos.DELETE,
  async (id, thunkAPI) => {
    // thunkAPI.extra.token
    await thunkAPI.extra.services.todos.deleteOneTodoById(id);
    return id;
  },
);

export const updateTodo = createAsyncThunk<void, { todoId: string; updateData: { title: string }}, AsyncThunkConfig>(
  actions.todos.UPDATE,
  async (payload, thunkAPI) => {
    console.log('updating todo', payload);
    try {
      await thunkAPI.extra.services.todos.updateTodo(payload);
    } catch (error) {
      console.error(error);
    }
  },
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = 'success';
    });
    builder.addCase(fetchTodos.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.status = 'error';
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
    builder.addCase(fetchTodo.fulfilled, (state, action) => {
      const todoIndex = state.data.findIndex(todo => todo.id === action.payload.id);
      state.data[todoIndex] = action.payload;
      // state.status = 'success';
    });
    // builder.addCase(fetchTodo.pending, (state) => {
    //   state.status = 'pending';
    // });
    builder.addCase(fetchTodo.rejected, (state, action) => {
      // state.status = 'error';
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(createTodo.fulfilled, (state) => {
      // state.data.push(action.payload);
      state.status = 'success';
    });
    builder.addCase(createTodo.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      state.status = 'error';
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    // builder.addCase(fetchtodoById.fulfilled, (state, action) => {
    //   const findIndex = state.data.findIndex((todo) => todo.id === action.payload.id);
    //   if (findIndex !== -1) {
    //     state.data[findIndex] = action.payload;
    //   } else {
    //     state.data.push(action.payload);
    //   }
    //   state.status = 'success';
    // });
    // builder.addCase(fetchtodoById.pending, (state) => {
    //   state.status = 'pending';
    // });
    // builder.addCase(fetchtodoById.rejected, (state, action) => {
    //   state.status = 'error';
    //   if (action.payload) {
    //     state.error = action.payload.errorMessage;
    //   } else {
    //     state.error = action.error.message;
    //   }
    // });

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.data = state.data.filter((todo) => todo.id !== action.payload);
      state.status = 'success';
    });
    builder.addCase(deleteTodo.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.status = 'error';
      if (action.payload) {
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectTodosData = (state: RootState): Todo[] => state.todos.data;

export default todosSlice.reducer;
