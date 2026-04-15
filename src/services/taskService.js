import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const getTasksCollectionRef = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to access tasks.");
  }

  return collection(db, "users", userId, "tasks");
};

export const getUserTasks = async (userId) => {
  try {
    const tasksRef = getTasksCollectionRef(userId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDoc) => {
      const data = taskDoc.data();

      return {
        id: taskDoc.id,
        title: data.title ?? "",
        completed: data.completed ?? false,
        priority: data.priority ?? "medium",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch user tasks: ${error.message || "unknown error"}.`
    );
  }
};

export const addTask = async (userId, task) => {
  try {
    const tasksRef = getTasksCollectionRef(userId);
    const taskData = {
      title: task?.title ?? "",
      completed: false,
      priority: task?.priority ?? "medium",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(tasksRef, taskData);
    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to add task: ${error.message || "unknown error"}.`
    );
  }
};

export const updateTask = async (userId, taskId, updates) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to update a task.");
    }

    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error(
      `Failed to update task: ${error.message || "unknown error"}.`
    );
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to delete a task.");
    }

    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(
      `Failed to delete task: ${error.message || "unknown error"}.`
    );
  }
};

export const subscribeToTasks = (userId, callback) => {
  try {
    if (typeof callback !== "function") {
      throw new Error("A valid callback function is required.");
    }

    const tasksRef = getTasksCollectionRef(userId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((taskDoc) => {
          const data = taskDoc.data();

          return {
            id: taskDoc.id,
            title: data.title ?? "",
            completed: data.completed ?? false,
            priority: data.priority ?? "medium",
            createdAt: data.createdAt ?? null,
          };
        });

        callback(tasks);
      },
      (error) => {
        console.error(
          `Real-time task subscription failed: ${
            error.message || "unknown error"
          }.`
        );
      }
    );
  } catch (error) {
    throw new Error(
      `Failed to subscribe to tasks: ${error.message || "unknown error"}.`
    );
  }
};
