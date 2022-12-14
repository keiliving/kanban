import {
  createSlice,
  createEntityAdapter,
  nanoid,
  createSelector,
  EntityId,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { todayValue } from "./util";

export type Task = {
  id: EntityId;
  status: "TODO" | "PROGRESS" | "DONE";
  requirement: string;
  deadline: string; // YYYY-MM-DD
};

export type TasksState = {
  tasks: Task[];
};

const tasksAdapter = createEntityAdapter<Task>({
  selectId: (post) => post.id,
});
// const id = nanoid();
const tasksInitialEntityState = tasksAdapter.getInitialState();

const { addOne, updateOne, removeOne } = tasksAdapter;

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: tasksInitialEntityState,
  reducers: {
    created: (state, action: PayloadAction<{ requirement: string }>) => {
      const today = todayValue();
      addOne(state, {
        id: nanoid(),
        status: "TODO",
        requirement: action.payload.requirement,
        deadline: today,
      });
    },
    statusUpdated: (
      state,
      action: PayloadAction<Pick<Task, "status" | "id">>
    ) => {
      updateOne(state, {
        id: action.payload.id,
        changes: {
          status: action.payload.status,
        },
      });
    },
    requirementUpdated: (
      state,
      action: PayloadAction<Pick<Task, "requirement" | "id">>
    ) => {
      updateOne(state, {
        id: action.payload.id,
        changes: {
          requirement: action.payload.requirement,
        },
      });
    },
    deadlineUpdated: (
      state,
      action: PayloadAction<Pick<Task, "deadline" | "id">>
    ) => {
      updateOne(state, {
        id: action.payload.id,
        changes: {
          deadline: action.payload.deadline,
        },
      });
    },
    taskRemoved: (state, action: PayloadAction<Pick<Task, "id">>) => {
      removeOne(state, action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  created,
  statusUpdated,
  requirementUpdated,
  taskRemoved,
  deadlineUpdated,
} = tasksSlice.actions;

const { selectById, selectAll } = tasksAdapter.getSelectors(
  (state: RootState) => state.tasks
);
export const selectTodoTask = createSelector(selectAll, (tasks) =>
  tasks.filter((task) => task.status === "TODO")
);
export const selectProgressTask = createSelector(selectAll, (tasks) =>
  tasks.filter((task) => task.status === "PROGRESS")
);
export const selectDoneTask = createSelector(selectAll, (tasks) =>
  tasks.filter((task) => task.status === "DONE")
);

export const selectTaskDeadline = createSelector(
  selectById,
  (task) => task?.deadline
);

export default tasksSlice.reducer;
